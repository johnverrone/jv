use bevy::asset::RenderAssetUsages;
use bevy::image::{CompressedImageFormats, Image, ImageSampler, ImageType};
use bevy::prelude::*;
use include_dir::{Dir, include_dir};
use serde::Deserialize;

use crate::baked_label::{BakeConfig, LineSpec, bake_lines_image, spawn_baked_decal};
use crate::camera::BookView;
use crate::input::PlayerInput;
use crate::interaction::AppMode;
use crate::world::{Station, StationKind};

/// Compile-time snapshot of all coffee bag photos, baked into the binary.
/// Re-snapshot with:
///   for f in data/coffees.json image_urls...; ./scripts/refresh-coffee-images.sh
/// (See top of file for the JSON re-snapshot command.)
static COFFEE_IMAGES: Dir<'_> = include_dir!("$CARGO_MANIFEST_DIR/data/coffee_images");

/// Snapshot of the coffee API, baked at build time. Re-snapshot with:
///   curl -sf https://hobbies.johnverrone.workers.dev/coffee/beans -o data/coffees.json
const COFFEES_JSON: &str = include_str!("../data/coffees.json");

/// One coffee entry from the API. Mirrors the JSON shape; nullable / empty
/// string fields are normalized to `Option::None` so downstream code doesn't
/// need to special-case them.
#[allow(dead_code)] // several fields are consumed in later build stages.
#[derive(Debug, Clone, Deserialize)]
pub struct Coffee {
    pub name: String,
    pub slug: String,
    pub roaster: String,
    pub rating: Option<u8>,
    #[serde(default)]
    pub origins: Vec<String>,
    #[serde(default)]
    pub flavors: Vec<String>,
    #[serde(default, deserialize_with = "empty_string_as_none")]
    pub process: Option<String>,
    #[serde(default)]
    pub single_origin: bool,
    #[serde(default)]
    pub currently_brewing: bool,
    pub price_12oz: Option<f32>,
    #[serde(default, deserialize_with = "empty_string_as_none")]
    pub notes: Option<String>,
    #[serde(default, deserialize_with = "empty_string_as_none")]
    pub image_url: Option<String>,
    /// ISO date the coffee was added to the collection (the API's only recency signal).
    pub created: String,
}

/// All coffees loaded from the snapshot, sorted by `created` descending so
/// `coffees.all[0]` is the most-recently-added one.
#[derive(Resource, Default)]
pub struct Coffees {
    pub all: Vec<Coffee>,
}

impl Coffees {
    /// The single coffee flagged `currently_brewing: true`, if any.
    pub fn brewing(&self) -> Option<&Coffee> {
        self.all.iter().find(|c| c.currently_brewing)
    }

    /// The `n` most-recently-added coffees.
    pub fn recents(&self, n: usize) -> &[Coffee] {
        &self.all[..self.all.len().min(n)]
    }
}

fn load_coffees() -> Coffees {
    let mut all: Vec<Coffee> = serde_json::from_str(COFFEES_JSON)
        .expect("data/coffees.json failed to parse — re-snapshot from the API");
    all.sort_by(|a, b| b.created.cmp(&a.created));
    Coffees { all }
}

fn empty_string_as_none<'de, D>(deserializer: D) -> Result<Option<String>, D::Error>
where
    D: serde::Deserializer<'de>,
{
    let opt = Option::<String>::deserialize(deserializer)?;
    Ok(opt.filter(|s| !s.is_empty()))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn snapshot_parses() {
        let c = load_coffees();
        assert!(
            c.all.len() >= 80,
            "expected ~83 coffees, got {}",
            c.all.len()
        );
        // Sorted by `created` desc.
        for w in c.all.windows(2) {
            assert!(w[0].created >= w[1].created);
        }
        // Exactly one brewing at any given snapshot — sanity check we can find it.
        assert!(c.brewing().is_some(), "no coffee flagged currently_brewing");
    }
}

/// Height of the counter body (matches the Coffee Cuboid in `world.rs`).
const COUNTER_HEIGHT: f32 = 0.7;
/// Marble countertop slab sitting on top of the cabinet body.
const SLAB_H: f32 = 0.04;

/// How many of the most-recently-added coffees to display on the shelf.
const RECENTS_COUNT: usize = 5;

/// Saturated pastels for the recents shelf bags. Cycled by index — gives the
/// shelf a clear, toy-prototype read against the dark void.
const BAG_PALETTE: &[Color] = &[
    Color::srgb(0.95, 0.60, 0.35), // peach
    Color::srgb(0.92, 0.45, 0.78), // magenta
    Color::srgb(0.35, 0.82, 0.95), // cyan
    Color::srgb(0.78, 0.95, 0.55), // mint
    Color::srgb(0.98, 0.85, 0.40), // yellow
];

/// Marker on the featured mug holding the `currently_brewing` coffee.
#[derive(Component)]
struct BrewMug;

/// The catalog book sitting on the counter. Tracks which coffee is currently
/// displayed on the open spread — Left/Right cycle through `Coffees::all` and
/// the page content is despawned + respawned on change.
#[derive(Component)]
struct CatalogBook {
    current_page: usize,
}

/// Marker on every entity belonging to the currently-displayed book spread
/// (photo quad + per-line text labels). Step 4c despawns these when changing
/// page and re-spawns with the new coffee's content.
#[derive(Component)]
struct BookPage;

/// Marker on a bag in the recents shelf. The `usize` is the index into
/// `Coffees::recents()` (0 = newest), so later systems can map a bag entity
/// back to its `Coffee` record without storing the data twice.
#[allow(dead_code)] // consumed by selection logic in a later step
#[derive(Component)]
struct RecentsBag(usize);

pub struct CoffeePlugin;

impl Plugin for CoffeePlugin {
    fn build(&self, app: &mut App) {
        app.insert_resource(load_coffees())
            .add_systems(
                PostStartup,
                (
                    spawn_brew_diorama,
                    spawn_recents_shelf,
                    spawn_catalog_book,
                    spawn_coffee_counter_props,
                ),
            )
            .add_systems(Update, handle_page_input);
    }
}

fn spawn_brew_diorama(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
    coffees: Res<Coffees>,
    stations: Query<(&Transform, &Station)>,
) {
    let Some(_brew) = coffees.brewing() else {
        return;
    };
    let Some((counter_tf, _)) = stations.iter().find(|(_, s)| s.kind == StationKind::Coffee) else {
        return;
    };

    let counter_top = counter_tf.translation.y + COUNTER_HEIGHT * 0.5;
    let surface_y = counter_top + SLAB_H; // actual sitting surface (top of marble slab)
    let mug_radius = 0.08;
    let mug_height = 0.15;
    let mug_pos = Vec3::new(
        counter_tf.translation.x + 0.65,
        surface_y + mug_height * 0.5,
        counter_tf.translation.z - 0.2,
    );

    let mug_mat = materials.add(StandardMaterial {
        base_color: Color::srgb(0.95, 0.95, 0.88),
        perceptual_roughness: 1.0,
        reflectance: 0.0,
        ..default()
    });
    commands.spawn((
        Mesh3d(meshes.add(Cylinder::new(mug_radius, mug_height))),
        MeshMaterial3d(mug_mat),
        Transform::from_translation(mug_pos),
        BrewMug,
        Name::new("Brew Mug"),
    ));

    // Thin dark disc just proud of the mug rim — reads as the coffee surface,
    // not a chocolate puck. Tiny upward offset avoids z-fighting with the mug
    // top face.
    let liquid_height = 0.002;
    let liquid_mat = materials.add(StandardMaterial {
        base_color: Color::srgb(0.22, 0.11, 0.06),
        perceptual_roughness: 1.0,
        reflectance: 0.0,
        ..default()
    });
    commands.spawn((
        Mesh3d(meshes.add(Cylinder::new(mug_radius - 0.015, liquid_height))),
        MeshMaterial3d(liquid_mat),
        Transform::from_xyz(
            mug_pos.x,
            mug_pos.y + mug_height * 0.5 + liquid_height * 0.5 + 0.001,
            mug_pos.z,
        ),
        Name::new("Brew Liquid"),
    ));
}

/// Total book width / 2. The book mesh is 0.45 wide, so each page is 0.225.
const BOOK_HALF_WIDTH: f32 = 0.225;
/// Height of the book proxy mesh. Used to compute the top-face Y where page
/// content sits.
const BOOK_HEIGHT: f32 = 0.01;
/// Total book depth. Used to space text lines along the page.
const BOOK_DEPTH: f32 = 0.30;

fn spawn_catalog_book(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
    mut images: ResMut<Assets<Image>>,
    coffees: Res<Coffees>,
    stations: Query<(&Transform, &Station)>,
) {
    let Some((counter_tf, _)) = stations.iter().find(|(_, s)| s.kind == StationKind::Coffee) else {
        return;
    };

    let counter_pos = counter_tf.translation;
    let counter_top = counter_pos.y + COUNTER_HEIGHT * 0.5;
    let surface_y = counter_top + SLAB_H;
    let book_size = Vec3::new(BOOK_HALF_WIDTH * 2.0, BOOK_HEIGHT, BOOK_DEPTH);
    let book_pos = Vec3::new(
        counter_pos.x + 0.2,
        surface_y + book_size.y * 0.5,
        counter_pos.z + 0.2,
    );

    // Unlit so the cream cover matches the unlit baked page-content decals
    // sitting on top — otherwise scene lighting would darken the book but
    // leave the labels at full brightness, breaking the "ink on paper" feel.
    let book_mat = materials.add(StandardMaterial {
        base_color: Color::srgb(0.95, 0.92, 0.85),
        unlit: true,
        ..default()
    });

    // Default open page: the currently-brewing coffee, or page 0 (newest).
    let initial_page = coffees
        .all
        .iter()
        .position(|c| c.currently_brewing)
        .unwrap_or(0);

    commands.spawn((
        Mesh3d(meshes.add(Cuboid::from_size(book_size))),
        MeshMaterial3d(book_mat),
        Transform::from_translation(book_pos),
        // Camera framing for Reading mode: above and slightly forward of the
        // book so the top face (the open spread) fills the frame at a
        // readable angle. The camera system reads this via the BookView.
        BookView {
            pos: Vec3::new(book_pos.x, book_pos.y + 0.7, book_pos.z + 0.55),
            look: book_pos,
        },
        CatalogBook {
            current_page: initial_page,
        },
        Name::new("Catalog Book"),
    ));

    if let Some(coffee) = coffees.all.get(initial_page) {
        spawn_book_page_content(
            &mut commands,
            &mut meshes,
            &mut materials,
            &mut images,
            book_pos,
            coffee,
            initial_page,
            coffees.all.len(),
        );
    }
}

/// Spawn the photo quad + text lines for one coffee, anchored to the open
/// book at `book_pos`. Despawn all entities tagged `BookPage` before calling
/// this if you're swapping pages.
fn spawn_book_page_content(
    commands: &mut Commands,
    meshes: &mut Assets<Mesh>,
    materials: &mut Assets<StandardMaterial>,
    images: &mut Assets<Image>,
    book_pos: Vec3,
    coffee: &Coffee,
    page_idx: usize,
    total_pages: usize,
) {
    // Sit content just above the book's top face to avoid z-fighting.
    let page_y = book_pos.y + BOOK_HEIGHT * 0.5 + 0.0005;
    // Center x of each page (half-page midpoint).
    let left_x = book_pos.x - BOOK_HALF_WIDTH * 0.5;
    let right_x = book_pos.x + BOOK_HALF_WIDTH * 0.5;

    // Photo quad on the left page (only if the slug has a baked image).
    if let Some(file) = COFFEE_IMAGES.get_file(format!("{}.jpg", coffee.slug)) {
        if let Ok(img) = Image::from_buffer(
            file.contents(),
            ImageType::Format(bevy::image::ImageFormat::Jpeg),
            CompressedImageFormats::NONE,
            true,
            ImageSampler::default(),
            RenderAssetUsages::default(),
        ) {
            // Fit-inside-box while preserving aspect — taller images stay
            // taller, wider images stay wider, no distortion.
            let aspect = img.width() as f32 / img.height() as f32;
            let max_w = 0.18;
            let max_h = 0.24;
            let (qw, qh) = if aspect > max_w / max_h {
                (max_w, max_w / aspect)
            } else {
                (max_h * aspect, max_h)
            };
            let texture = images.add(img);
            commands.spawn((
                Mesh3d(meshes.add(Plane3d::default().mesh().size(qw, qh))),
                MeshMaterial3d(materials.add(StandardMaterial {
                    base_color_texture: Some(texture),
                    // Photo reads as a printed photo, not a shaded surface.
                    unlit: true,
                    ..default()
                })),
                Transform::from_xyz(left_x, page_y, book_pos.z),
                BookPage,
                Name::new("Book Page Photo"),
            ));
        }
    }

    // Right-page text content. Bake everything (title, body, page counter)
    // into a single multi-line image and lay it flat on the right page as
    // one decal. This reads as "ink on the page" rather than a stack of
    // tiny cards floating above the book.
    let roaster = coffee.roaster.replace('-', " ");
    let origins = coffee.origins.join(", ");
    let rating = match coffee.rating {
        Some(n) => format!("Rating: {n}/5"),
        None => "(unrated)".to_string(),
    };
    let counter_text = format!("{} / {}   [<-] [->]", page_idx + 1, total_pages);

    // Build the line list. Title gets a larger px_size for hierarchy; body
    // lines share a smaller size; counter is smallest and visually quieter.
    let title_px = 26.0;
    let body_px = 18.0;
    let counter_px = 14.0;

    let mut owned_lines: Vec<(String, f32)> = Vec::new();
    owned_lines.push((coffee.name.clone(), title_px));
    if !roaster.is_empty() {
        owned_lines.push((roaster, body_px));
    }
    if !origins.is_empty() {
        owned_lines.push((origins, body_px));
    }
    for flavor in &coffee.flavors {
        owned_lines.push((flavor.clone(), body_px));
    }
    owned_lines.push((rating, body_px));
    owned_lines.push((String::new(), body_px * 0.5)); // spacer before counter
    owned_lines.push((counter_text, counter_px));

    let line_specs: Vec<LineSpec> = owned_lines
        .iter()
        .map(|(t, px)| LineSpec {
            text: t.as_str(),
            px_size: *px,
        })
        .collect();

    // Lock the bake to a fixed canvas so every coffee page produces the
    // same texture dimensions — otherwise a long name widens the texture,
    // the decal mesh squashes it vertically, and the text appears smaller
    // on pages with longer names. Sized to comfortably fit the longest
    // expected title + body + counter at the px_sizes above.
    let cfg = BakeConfig {
        padding: 6,
        canvas_size: Some((260, 520)),
        ..Default::default()
    };
    let image = bake_lines_image(&line_specs, &cfg);

    // Lay the decal flat on the right page. World width is the right page
    // width (BOOK_HALF_WIDTH) so the text fills its half of the spread;
    let decal_anchor = Vec3::new(right_x, page_y, book_pos.z + BOOK_DEPTH / 2.0);
    let decal_entity = spawn_baked_decal(
        commands,
        meshes,
        materials,
        images,
        image,
        decal_anchor,
        BOOK_HALF_WIDTH,
    );
    commands
        .entity(decal_entity)
        .insert((BookPage, Name::new("Book Page Text")));
}

fn spawn_coffee_counter_props(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
    stations: Query<(&Transform, &Station)>,
) {
    let Some((counter_tf, _)) = stations.iter().find(|(_, s)| s.kind == StationKind::Coffee) else {
        return;
    };
    let pos = counter_tf.translation;
    let counter_top = pos.y + COUNTER_HEIGHT * 0.5;
    let surface_y = counter_top + SLAB_H;

    // Marble-white countertop slab — slightly overhangs the cabinet on all sides.
    commands.spawn((
        Mesh3d(meshes.add(Cuboid::new(2.1, SLAB_H, 0.85))),
        MeshMaterial3d(materials.add(StandardMaterial {
            base_color: Color::srgb(0.97, 0.96, 0.94),
            perceptual_roughness: 0.5,
            reflectance: 0.4,
            ..default()
        })),
        Transform::from_xyz(pos.x, counter_top + SLAB_H * 0.5, pos.z),
        Name::new("Countertop"),
    ));

    // Subway-tile backsplash behind the counter.
    commands.spawn((
        Mesh3d(meshes.add(Cuboid::new(2.1, 0.5, 0.04))),
        MeshMaterial3d(materials.add(StandardMaterial {
            base_color: Color::srgb(0.94, 0.92, 0.91),
            perceptual_roughness: 0.5,
            reflectance: 0.3,
            ..default()
        })),
        Transform::from_xyz(pos.x, counter_top + 0.25, pos.z - 0.42),
        Name::new("Backsplash"),
    ));

    // Brass bar handles — three, one per cabinet section.
    let handle_mat = materials.add(StandardMaterial {
        base_color: Color::srgb(0.83, 0.68, 0.24), // polished brass
        perceptual_roughness: 0.08,
        metallic: 1.0,
        ..default()
    });
    for x_off in [-0.52_f32, 0.0, 0.52] {
        commands.spawn((
            Mesh3d(meshes.add(Cuboid::new(0.20, 0.025, 0.03))),
            MeshMaterial3d(handle_mat.clone()),
            Transform::from_xyz(pos.x + x_off, pos.y, pos.z + 0.41),
            Name::new("Cabinet Handle"),
        ));
    }

    // ---- Espresso machine ----
    let black_mat = materials.add(StandardMaterial {
        base_color: Color::srgb(0.09, 0.09, 0.10),
        perceptual_roughness: 0.8,
        reflectance: 0.2,
        ..default()
    });
    let silver_mat = materials.add(StandardMaterial {
        base_color: Color::srgb(0.9, 0.9, 0.9),
        perceptual_roughness: 0.05,
        metallic: 1.0,
        ..default()
    });
    let machine_w = 0.44;
    let machine_h = 0.50;
    let machine_d = 0.32;
    let machine_pos = Vec3::new(pos.x - 0.65, surface_y + machine_h * 0.5, pos.z - 0.10);

    commands.spawn((
        Mesh3d(meshes.add(Cuboid::new(machine_w, machine_h, machine_d))),
        MeshMaterial3d(black_mat.clone()),
        Transform::from_translation(machine_pos),
        Name::new("Espresso Machine"),
    ));
    // Control panel strip on top — slightly lighter charcoal.
    commands.spawn((
        Mesh3d(meshes.add(Cuboid::new(machine_w - 0.04, 0.06, machine_d - 0.04))),
        MeshMaterial3d(materials.add(StandardMaterial {
            base_color: Color::srgb(0.16, 0.15, 0.18),
            perceptual_roughness: 0.5,
            reflectance: 0.4,
            ..default()
        })),
        Transform::from_xyz(
            machine_pos.x,
            machine_pos.y + machine_h * 0.5 + 0.03,
            machine_pos.z,
        ),
        Name::new("Machine Controls"),
    ));
    // Drip tray — thin flat platform sticking out from the front base.
    commands.spawn((
        Mesh3d(meshes.add(Cuboid::new(machine_w - 0.04, 0.02, 0.10))),
        MeshMaterial3d(silver_mat.clone()),
        Transform::from_xyz(
            machine_pos.x,
            surface_y + 0.01,
            machine_pos.z + machine_d * 0.5 + 0.04,
        ),
        Name::new("Drip Tray"),
    ));

    // ---- Grinder (center-right, walnut base + black body + glass hopper) ----
    let grinder_x = machine_pos.x + machine_w + 0.01;
    let grinder_z = pos.z - 0.02;
    let base_r = 0.12;
    let base_h = 0.06;
    let body_r = 0.10;
    let body_h = 0.38;
    let hopper_r = 0.085;
    let hopper_h = 0.12;

    commands.spawn((
        Mesh3d(meshes.add(Cylinder::new(base_r, base_h))),
        MeshMaterial3d(materials.add(StandardMaterial {
            base_color: Color::srgb(0.52, 0.35, 0.18),
            perceptual_roughness: 0.9,
            reflectance: 0.05,
            ..default()
        })),
        Transform::from_xyz(grinder_x, surface_y + base_h * 0.5, grinder_z),
        Name::new("Grinder Base"),
    ));

    let body_center_y = surface_y + base_h + body_h * 0.5;
    commands.spawn((
        Mesh3d(meshes.add(Cylinder::new(body_r, body_h))),
        MeshMaterial3d(black_mat.clone()),
        Transform::from_xyz(grinder_x, body_center_y, grinder_z),
        Name::new("Grinder Body"),
    ));

    commands.spawn((
        Mesh3d(meshes.add(Cylinder::new(hopper_r, hopper_h))),
        MeshMaterial3d(materials.add(StandardMaterial {
            base_color: Color::srgba(0.22, 0.22, 0.26, 0.60),
            alpha_mode: AlphaMode::Blend,
            perceptual_roughness: 0.05,
            reflectance: 0.9,
            ..default()
        })),
        Transform::from_xyz(
            grinder_x,
            body_center_y + body_h * 0.5 + hopper_h * 0.5,
            grinder_z,
        ),
        Name::new("Grinder Hopper"),
    ));
}

fn spawn_recents_shelf(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
    coffees: Res<Coffees>,
    stations: Query<(&Transform, &Station)>,
) {
    let recents = coffees.recents(RECENTS_COUNT);
    if recents.is_empty() {
        return;
    }
    let Some((counter_tf, _)) = stations.iter().find(|(_, s)| s.kind == StationKind::Coffee) else {
        return;
    };

    // Thin walnut board floating just behind the counter — reads as a wall
    // shelf without needing an actual back wall (the dark void sells it).
    let counter_pos = counter_tf.translation;
    let shelf_size = Vec3::new(1.6, 0.04, 0.18);
    let shelf_pos = Vec3::new(
        counter_pos.x,
        // Above the counter top (0.7) by ~0.5.
        1.2,
        // Just behind the counter's back face.
        counter_pos.z - 0.55,
    );
    let shelf_mat = materials.add(StandardMaterial {
        base_color: Color::srgb(0.55, 0.35, 0.22), // walnut, matches counter
        perceptual_roughness: 1.0,
        reflectance: 0.0,
        ..default()
    });
    commands.spawn((
        Mesh3d(meshes.add(Cuboid::from_size(shelf_size))),
        MeshMaterial3d(shelf_mat),
        Transform::from_translation(shelf_pos),
        Name::new("Recents Shelf"),
    ));

    // Bags lined along the shelf, centered on x. Tall-ish rectangles read
    // as upright coffee bags rather than blocks.
    let bag_size = Vec3::new(0.15, 0.25, 0.1);
    let bag_y = shelf_pos.y + shelf_size.y * 0.5 + bag_size.y * 0.5;
    let spacing = bag_size.x + 0.08;
    let total_width = (recents.len() as f32 - 1.0) * spacing;
    let start_x = counter_pos.x - total_width * 0.5;

    for (i, _coffee) in recents.iter().enumerate() {
        let color = BAG_PALETTE[i % BAG_PALETTE.len()];
        let mat = materials.add(StandardMaterial {
            base_color: color,
            perceptual_roughness: 1.0,
            reflectance: 0.0,
            ..default()
        });
        commands.spawn((
            Mesh3d(meshes.add(Cuboid::from_size(bag_size))),
            MeshMaterial3d(mat),
            Transform::from_xyz(start_x + i as f32 * spacing, bag_y, shelf_pos.z),
            RecentsBag(i),
            Name::new(format!("Recents Bag {i}")),
        ));
    }
}

/// Cycles the catalog book's open page in response to Left/Right input while
/// in `Reading` mode. Wraps around at the ends. Despawns the current spread
/// (`BookPage` entities) and respawns content for the new coffee.
fn handle_page_input(
    mut commands: Commands,
    input: Res<PlayerInput>,
    app_mode: Res<State<AppMode>>,
    coffees: Res<Coffees>,
    mut book_q: Query<(&Transform, &mut CatalogBook)>,
    page_entities: Query<Entity, With<BookPage>>,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
    mut images: ResMut<Assets<Image>>,
) {
    if *app_mode.get() != AppMode::Reading {
        return;
    }
    let delta: i32 = match (input.page_prev, input.page_next) {
        (true, false) => -1,
        (false, true) => 1,
        _ => return,
    };
    let Ok((book_tf, mut book)) = book_q.single_mut() else {
        return;
    };
    let total = coffees.all.len();
    if total == 0 {
        return;
    }
    // i32 -> wrap into [0, total). rem_euclid handles the negative case.
    let new_page = (book.current_page as i32 + delta).rem_euclid(total as i32) as usize;
    if new_page == book.current_page {
        return;
    }
    book.current_page = new_page;

    for e in &page_entities {
        commands.entity(e).despawn();
    }

    spawn_book_page_content(
        &mut commands,
        &mut meshes,
        &mut materials,
        &mut images,
        book_tf.translation,
        &coffees.all[new_page],
        new_page,
        total,
    );
}
