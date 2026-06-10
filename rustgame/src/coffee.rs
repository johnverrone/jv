use bevy::light::NotShadowCaster;
use bevy::prelude::*;
use bevy::text::Font;
use serde::Deserialize;

use crate::baked_label::FONT_BYTES;
use crate::camera::CoffeeBagView;
use crate::input::PlayerInput;
use crate::interaction::{AppMode, INTERACTION_RANGE, NearestStation};
use crate::world::{Station, StationKind};

const COFFEES_JSON: &str = include_str!("../data/coffees.json");

#[allow(dead_code)]
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

impl Coffees {}

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

// ─── counter constants ───────────────────────────────────────────────────────

/// Height of the counter body (matches the Coffee Cuboid in `world.rs`).
const COUNTER_HEIGHT: f32 = 0.7;
/// Marble countertop slab sitting on top of the cabinet body.
const SLAB_H: f32 = 0.04;

/// Bag box dimensions — upright tall rectangle reads as a coffee bag.
const BAG_SIZE: Vec3 = Vec3::new(0.15, 0.25, 0.10);

/// How far (in world X) a bag travels during a swipe before it's off-screen
/// relative to the close-up camera.
const SWIPE_OFFSET: f32 = 0.6;

/// Animation speed: swipe_t advances this many units per second (reaches 1.0
/// in ~0.14 s at 7.0 — snappy without feeling instant).
const SWIPE_SPEED: f32 = 7.0;

const BAG_PALETTE: &[Color] = &[
    Color::srgb(0.95, 0.60, 0.35), // peach
    Color::srgb(0.92, 0.45, 0.78), // magenta
    Color::srgb(0.35, 0.82, 0.95), // cyan
    Color::srgb(0.78, 0.95, 0.55), // mint
    Color::srgb(0.98, 0.85, 0.40), // yellow
];

// ─── resources ───────────────────────────────────────────────────────────────

/// Which coffee the carousel is currently showing (index into `Coffees::all`).
#[derive(Resource, Default)]
pub struct BagIndex {
    pub current: usize,
}

/// Drives HUD alpha. `target` is set to 1.0 on enter Reading, 0.0 on exit;
/// `current` chases it via exponential easing each frame.
#[derive(Resource, Default)]
struct HudFade {
    current: f32,
    target: f32,
}

const FADE_SPEED: f32 = 8.0;

/// Drives the two-slot bag swipe animation.
///
/// At rest `animating = false`: slot `active_slot` sits at `center`, the other
/// is hidden. On scroll: swap `active_slot`, kick `animating = true` and
/// advance `swipe_t` from 0 → 1. The incoming slot slides in from
/// `dir * SWIPE_OFFSET`, the outgoing slides out to `-dir * SWIPE_OFFSET`.
#[derive(Resource, Default)]
struct BagCarousel {
    center: Vec3,
    active_slot: u8,
    swipe_t: f32,
    /// +1 = next (bag enters from right), -1 = prev (enters from left).
    swipe_dir: i32,
    animating: bool,
    slot_materials: [Handle<StandardMaterial>; 2],
}

// ─── components ──────────────────────────────────────────────────────────────

#[derive(Component)]
struct BagSlot(u8);

/// Marker on the root HUD node so visibility systems can find it quickly.
#[derive(Component)]
struct BagHud;

/// Marker on the card node (drives `BackgroundColor` alpha during fade).
#[derive(Component)]
struct BagHudCard;

/// Marker on the text node inside the HUD card.
#[derive(Component)]
struct BagHudText;

#[derive(Component)]
struct CoffeeLight;

// ─── plugin ──────────────────────────────────────────────────────────────────

pub struct CoffeePlugin;

impl Plugin for CoffeePlugin {
    fn build(&self, app: &mut App) {
        app.insert_resource(load_coffees())
            .init_resource::<BagIndex>()
            .init_resource::<BagCarousel>()
            .init_resource::<HudFade>()
            .add_systems(Startup, spawn_bag_hud)
            .add_systems(
                PostStartup,
                (spawn_bag_carousel, spawn_floor, spawn_coffee_counter_props),
            )
            .add_systems(OnEnter(AppMode::Reading), show_bag_hud)
            .add_systems(OnExit(AppMode::Reading), (hide_bag_hud, reset_bag_on_exit))
            .add_systems(
                Update,
                (
                    (
                        handle_bag_scroll,
                        animate_bags,
                        update_bag_hud,
                        animate_hud_fade,
                    )
                        .chain(),
                    update_coffee_light,
                ),
            );
    }
}

// ─── spawn systems ────────────────────────────────────────────────────────────

fn spawn_bag_carousel(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
    coffees: Res<Coffees>,
    mut bag_index: ResMut<BagIndex>,
    mut carousel: ResMut<BagCarousel>,
    stations: Query<(Entity, &Transform, &Station)>,
) {
    let Some((station_entity, counter_tf, _)) = stations
        .iter()
        .find(|(_, _, s)| s.kind == StationKind::Coffee)
    else {
        return;
    };
    let world_pos = counter_tf.translation;

    // surface_y in world space (for CoffeeBagView camera target).
    let surface_y_world = world_pos.y + COUNTER_HEIGHT * 0.5 + SLAB_H;
    // Center in local space: (0,0,0) = station entity center = mid-cabinet.
    let surface_y_local = COUNTER_HEIGHT * 0.5 + SLAB_H;
    let center_local = Vec3::new(0.30, surface_y_local + BAG_SIZE.y * 0.5, 0.05);
    carousel.center = center_local;
    carousel.active_slot = 0;

    let initial = coffees
        .all
        .iter()
        .position(|c| c.currently_brewing)
        .unwrap_or(0);
    bag_index.current = initial;

    let bag_mesh = meshes.add(Cuboid::from_size(BAG_SIZE));
    for slot in 0u8..2 {
        let color = BAG_PALETTE[(initial + slot as usize) % BAG_PALETTE.len()];
        let mat = materials.add(StandardMaterial {
            base_color: color,
            perceptual_roughness: 1.0,
            reflectance: 0.0,
            ..default()
        });
        carousel.slot_materials[slot as usize] = mat.clone();

        // Slot 0 visible at center, slot 1 hidden until first scroll.
        let local_pos = if slot == 0 {
            center_local
        } else {
            center_local + Vec3::X * 999.0
        };
        let initial_vis = if slot == 0 {
            Visibility::Inherited
        } else {
            Visibility::Hidden
        };

        let bag_entity = commands
            .spawn((
                Mesh3d(bag_mesh.clone()),
                MeshMaterial3d(mat),
                Transform::from_translation(local_pos),
                initial_vis,
                BagSlot(slot),
                Name::new(format!("Coffee Bag {slot}")),
            ))
            .id();
        commands.entity(station_entity).add_child(bag_entity);
    }

    // CoffeeBagView uses world-space positions for the camera system.
    let center_world = Vec3::new(
        world_pos.x + 0.30,
        surface_y_world + BAG_SIZE.y * 0.5,
        world_pos.z + 0.05,
    );
    let cam_pos = Vec3::new(
        center_world.x,
        surface_y_world + 0.45,
        center_world.z + 1.75,
    );
    let cam_look = Vec3::new(center_world.x, surface_y_world + 0.05, center_world.z);
    commands.spawn((
        CoffeeBagView {
            pos: cam_pos,
            look: cam_look,
        },
        Name::new("Bag View Target"),
    ));
}

fn spawn_floor(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
    stations: Query<(&Transform, &Station)>,
) {
    let Some((counter_tf, _)) = stations.iter().find(|(_, s)| s.kind == StationKind::Coffee) else {
        return;
    };

    // World-space XZ center of the counter; y just above the grass.
    let center = counter_tf.translation.with_y(0.002);

    commands.spawn((
        Mesh3d(
            meshes.add(
                Circle {
                    radius: INTERACTION_RANGE - 0.5,
                }
                .mesh()
                .resolution(64),
            ),
        ),
        MeshMaterial3d(materials.add(StandardMaterial {
            base_color: Color::srgb(0.88, 0.84, 0.78),
            alpha_mode: AlphaMode::Mask(0.01),
            perceptual_roughness: 0.95,
            reflectance: 0.0,
            ..default()
        })),
        Transform::from_translation(center)
            .with_rotation(Quat::from_rotation_x((-90.0_f32).to_radians())),
        Name::new("Coffee Floor"),
    ));
}

fn spawn_bag_hud(mut commands: Commands, mut fonts: ResMut<Assets<Font>>) {
    let font =
        fonts.add(Font::try_from_bytes(FONT_BYTES.to_vec()).expect("embedded font is valid"));

    commands
        .spawn((
            Node {
                width: Val::Percent(100.0),
                height: Val::Percent(100.0),
                position_type: PositionType::Absolute,
                flex_direction: FlexDirection::Column,
                justify_content: JustifyContent::FlexEnd,
                align_items: AlignItems::Center,
                ..default()
            },
            Visibility::Hidden,
            BagHud,
            Name::new("Bag HUD"),
        ))
        .with_children(|root| {
            root.spawn((
                Node {
                    padding: UiRect::all(Val::Px(24.0)),
                    margin: UiRect::bottom(Val::Px(48.0)),
                    flex_direction: FlexDirection::Column,
                    align_items: AlignItems::Center,
                    ..default()
                },
                BackgroundColor(Color::srgba(0.04, 0.04, 0.08, 0.0)),
                Name::new("Bag HUD Card"),
            ))
            .insert(BagHudCard)
            .with_children(|card| {
                card.spawn((
                    Text::new(""),
                    TextFont {
                        font: font.clone(),
                        font_size: 18.0,
                        ..default()
                    },
                    TextColor(Color::srgba(0.95, 0.93, 0.88, 0.0)),
                    BagHudText,
                    Name::new("Bag HUD Text"),
                ));
            });
        });
}

// ─── visibility / fade systems ────────────────────────────────────────────────

fn show_bag_hud(mut hud_q: Query<&mut Visibility, With<BagHud>>, mut fade: ResMut<HudFade>) {
    if let Ok(mut vis) = hud_q.single_mut() {
        *vis = Visibility::Inherited;
    }
    fade.target = 1.0;
}

fn hide_bag_hud(mut fade: ResMut<HudFade>) {
    fade.target = 0.0;
}

fn animate_hud_fade(
    time: Res<Time>,
    mut fade: ResMut<HudFade>,
    mut hud_q: Query<&mut Visibility, With<BagHud>>,
    mut card_q: Query<&mut BackgroundColor, With<BagHudCard>>,
    mut text_q: Query<&mut TextColor, With<BagHudText>>,
) {
    let t = 1.0 - (-FADE_SPEED * time.delta_secs()).exp();
    fade.current += (fade.target - fade.current) * t;

    // Snap to target when close enough to avoid floating near-zero jitter.
    if (fade.current - fade.target).abs() < 0.005 {
        fade.current = fade.target;
    }

    let a = fade.current;

    if let Ok(mut bg) = card_q.single_mut() {
        *bg = BackgroundColor(Color::srgba(0.04, 0.04, 0.08, 0.82 * a));
    }
    if let Ok(mut tc) = text_q.single_mut() {
        *tc = TextColor(Color::srgba(0.95, 0.93, 0.88, a));
    }

    // Hide the root node when fully faded out so it doesn't intercept input.
    if let Ok(mut vis) = hud_q.single_mut() {
        if fade.current <= 0.0 && fade.target <= 0.0 {
            *vis = Visibility::Hidden;
        }
    }
}

// ─── update systems ───────────────────────────────────────────────────────────

fn handle_bag_scroll(
    input: Res<PlayerInput>,
    app_mode: Res<State<AppMode>>,
    coffees: Res<Coffees>,
    mut bag_index: ResMut<BagIndex>,
    mut carousel: ResMut<BagCarousel>,
    mut materials: ResMut<Assets<StandardMaterial>>,
) {
    if *app_mode.get() != AppMode::Reading || carousel.animating {
        return;
    }
    let direction: i32 = match (input.page_prev, input.page_next) {
        (true, false) => -1,
        (false, true) => 1,
        _ => return,
    };
    let total = coffees.all.len();
    if total == 0 {
        return;
    }
    let new_idx = (bag_index.current as i32 + direction).rem_euclid(total as i32) as usize;
    bag_index.current = new_idx;

    // Pre-paint the incoming slot with the new coffee's palette color before
    // the animation begins so it's ready when it slides into frame.
    let incoming = 1 - carousel.active_slot;
    if let Some(mat) = materials.get_mut(&carousel.slot_materials[incoming as usize]) {
        mat.base_color = BAG_PALETTE[new_idx % BAG_PALETTE.len()];
    }

    carousel.active_slot = incoming;
    carousel.swipe_t = 0.0;
    carousel.swipe_dir = direction;
    carousel.animating = true;
}

fn animate_bags(
    time: Res<Time>,
    mut carousel: ResMut<BagCarousel>,
    mut bag_q: Query<(&BagSlot, &mut Transform, &mut Visibility)>,
) {
    if carousel.animating {
        carousel.swipe_t = (carousel.swipe_t + SWIPE_SPEED * time.delta_secs()).min(1.0);
        if carousel.swipe_t >= 1.0 {
            carousel.animating = false;
        }
    }

    let t = carousel.swipe_t;
    let t_s = t * t * (3.0 - 2.0 * t); // smoothstep
    let dir = carousel.swipe_dir as f32;
    let active = carousel.active_slot;
    let center = carousel.center;

    for (slot, mut tf, mut vis) in &mut bag_q {
        if carousel.animating {
            *vis = Visibility::Inherited;
            if slot.0 == active {
                // Incoming: starts at dir*offset, slides to center.
                tf.translation = Vec3::new(
                    center.x + SWIPE_OFFSET * dir * (1.0 - t_s),
                    center.y,
                    center.z,
                );
            } else {
                // Outgoing: starts at center, slides to -dir*offset.
                tf.translation = Vec3::new(center.x - SWIPE_OFFSET * dir * t_s, center.y, center.z);
            }
        } else {
            if slot.0 == active {
                tf.translation = center;
                *vis = Visibility::Inherited;
            } else {
                *vis = Visibility::Hidden;
            }
        }
    }
}

fn update_bag_hud(
    app_mode: Res<State<AppMode>>,
    bag_index: Res<BagIndex>,
    coffees: Res<Coffees>,
    mut text_q: Query<&mut Text, With<BagHudText>>,
) {
    if *app_mode.get() != AppMode::Reading {
        return;
    }
    let Ok(mut text) = text_q.single_mut() else {
        return;
    };
    let total = coffees.all.len();
    if total == 0 {
        return;
    }
    let coffee = &coffees.all[bag_index.current.min(total - 1)];

    let mut lines: Vec<String> = vec![coffee.name.clone(), coffee.roaster.clone()];
    if !coffee.origins.is_empty() {
        lines.push(coffee.origins.join("  ·  "));
    }
    if coffee.currently_brewing {
        lines.push("[ currently brewing ]".to_string());
    }
    if !coffee.flavors.is_empty() {
        lines.push(coffee.flavors.join("  ·  "));
    }
    lines.push(String::new()); // spacer
    lines.push(format!("<   {}  /  {}   >", bag_index.current + 1, total));

    text.0 = lines.join("\n");
}

fn reset_bag_on_exit(
    coffees: Res<Coffees>,
    mut bag_index: ResMut<BagIndex>,
    mut carousel: ResMut<BagCarousel>,
    mut materials: ResMut<Assets<StandardMaterial>>,
) {
    let initial = coffees
        .all
        .iter()
        .position(|c| c.currently_brewing)
        .unwrap_or(0);
    bag_index.current = initial;
    carousel.animating = false;
    carousel.swipe_t = 0.0;
    if let Some(mat) = materials.get_mut(&carousel.slot_materials[carousel.active_slot as usize]) {
        mat.base_color = BAG_PALETTE[initial % BAG_PALETTE.len()];
    }
}

// ─── counter props ────────────────────────────────────────────────

fn update_coffee_light(
    nearest: Res<NearestStation>,
    app_mode: Res<State<AppMode>>,
    station_q: Query<&Station>,
    mut light_q: Query<&mut PointLight, With<CoffeeLight>>,
) {
    let Ok(mut light) = light_q.single_mut() else {
        return;
    };

    // Light is on when the player is near the coffee station OR actively
    // interacting with it (NearestStation clears to None during interactions).
    let near_coffee = nearest
        .0
        .and_then(|e| station_q.get(e).ok())
        .is_some_and(|s| s.kind == StationKind::Coffee);
    let reading = *app_mode.get() == AppMode::Reading;

    let target = if near_coffee || reading { 200_000.0 } else { 0.0 };
    if (light.intensity - target).abs() > 0.1 {
        light.intensity = target;
    }
}

fn spawn_coffee_counter_props(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
    stations: Query<(Entity, &Station)>,
) {
    let Some((station_entity, _)) = stations.iter().find(|(_, s)| s.kind == StationKind::Coffee)
    else {
        return;
    };

    // All positions in station local space: (0,0,0) = center of cabinet body.
    // counter_top_local = top face of the cabinet = +COUNTER_HEIGHT/2.
    let counter_top_local = COUNTER_HEIGHT * 0.5; // 0.35
    let surface_y_local = counter_top_local + SLAB_H; // 0.39

    // Pre-build shared materials.
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
    let handle_mat = materials.add(StandardMaterial {
        base_color: Color::srgb(0.83, 0.68, 0.24),
        perceptual_roughness: 0.08,
        metallic: 1.0,
        ..default()
    });

    // ── Brew mug ──────────────────────────────────────────────────────────────
    let mug_r = 0.08_f32;
    let mug_h = 0.15_f32;
    let mug_local = Vec3::new(0.65, surface_y_local + mug_h * 0.5, -0.2);

    let mug = commands
        .spawn((
            Mesh3d(meshes.add(Cylinder::new(mug_r, mug_h))),
            MeshMaterial3d(materials.add(StandardMaterial {
                base_color: Color::srgb(0.95, 0.95, 0.88),
                perceptual_roughness: 1.0,
                reflectance: 0.0,
                ..default()
            })),
            Transform::from_translation(mug_local),
            Name::new("Brew Mug"),
        ))
        .id();

    let liquid_h = 0.002_f32;
    let liquid = commands
        .spawn((
            Mesh3d(meshes.add(Cylinder::new(mug_r - 0.015, liquid_h))),
            MeshMaterial3d(materials.add(StandardMaterial {
                base_color: Color::srgb(0.22, 0.11, 0.06),
                perceptual_roughness: 1.0,
                reflectance: 0.0,
                ..default()
            })),
            Transform::from_xyz(
                mug_local.x,
                mug_local.y + mug_h * 0.5 + liquid_h * 0.5 + 0.001,
                mug_local.z,
            ),
            Name::new("Brew Liquid"),
        ))
        .id();

    // Espresso machine dimensions.
    let machine_w = 0.44_f32;
    let machine_h = 0.50_f32;
    let machine_d = 0.32_f32;
    // Machine local position: left side of counter, clear of center bag slot.
    let machine_local = Vec3::new(-0.65, surface_y_local + machine_h * 0.5, -0.10);

    // Grinder: immediately right of the machine body.
    let grinder_x = machine_local.x + machine_w + 0.01; // -0.20
    let grinder_z = -0.02_f32;
    let base_r = 0.12_f32;
    let base_h = 0.06_f32;
    let body_r = 0.10_f32;
    let body_h = 0.38_f32;
    let hopper_r = 0.085_f32;
    let hopper_h = 0.12_f32;
    let body_center_y = surface_y_local + base_h + body_h * 0.5;

    // Build all child entities first, then parent them in one call.
    let countertop = commands
        .spawn((
            Mesh3d(meshes.add(Cuboid::new(2.1, SLAB_H, 0.85))),
            MeshMaterial3d(materials.add(StandardMaterial {
                base_color: Color::srgb(0.97, 0.96, 0.94),
                perceptual_roughness: 0.5,
                reflectance: 0.4,
                ..default()
            })),
            Transform::from_xyz(0.0, counter_top_local + SLAB_H * 0.5, 0.0),
            Name::new("Countertop"),
        ))
        .id();

    let backsplash = commands
        .spawn((
            Mesh3d(meshes.add(Cuboid::new(2.1, 0.5, 0.04))),
            MeshMaterial3d(materials.add(StandardMaterial {
                base_color: Color::srgb(0.94, 0.92, 0.91),
                perceptual_roughness: 0.5,
                reflectance: 0.3,
                ..default()
            })),
            Transform::from_xyz(0.0, counter_top_local + 0.25, -0.42),
            Name::new("Backsplash"),
        ))
        .id();

    let handles: Vec<Entity> = [-0.52_f32, 0.0, 0.52]
        .iter()
        .map(|&x_off| {
            commands
                .spawn((
                    Mesh3d(meshes.add(Cuboid::new(0.20, 0.025, 0.03))),
                    MeshMaterial3d(handle_mat.clone()),
                    Transform::from_xyz(x_off, 0.0, 0.41),
                    Name::new("Cabinet Handle"),
                ))
                .id()
        })
        .collect();

    let machine = commands
        .spawn((
            Mesh3d(meshes.add(Cuboid::new(machine_w, machine_h, machine_d))),
            MeshMaterial3d(black_mat.clone()),
            Transform::from_translation(machine_local),
            Name::new("Espresso Machine"),
        ))
        .id();

    let machine_controls = commands
        .spawn((
            Mesh3d(meshes.add(Cuboid::new(machine_w - 0.04, 0.06, machine_d - 0.04))),
            MeshMaterial3d(materials.add(StandardMaterial {
                base_color: Color::srgb(0.16, 0.15, 0.18),
                perceptual_roughness: 0.5,
                reflectance: 0.4,
                ..default()
            })),
            Transform::from_xyz(
                machine_local.x,
                machine_local.y + machine_h * 0.5 + 0.03,
                machine_local.z,
            ),
            Name::new("Machine Controls"),
        ))
        .id();

    let drip_tray = commands
        .spawn((
            Mesh3d(meshes.add(Cuboid::new(machine_w - 0.04, 0.02, 0.10))),
            MeshMaterial3d(silver_mat.clone()),
            Transform::from_xyz(
                machine_local.x,
                surface_y_local + 0.01,
                machine_local.z + machine_d * 0.5 + 0.04,
            ),
            Name::new("Drip Tray"),
        ))
        .id();

    let grinder_base = commands
        .spawn((
            Mesh3d(meshes.add(Cylinder::new(base_r, base_h))),
            MeshMaterial3d(materials.add(StandardMaterial {
                base_color: Color::srgb(0.52, 0.35, 0.18),
                perceptual_roughness: 0.9,
                reflectance: 0.05,
                ..default()
            })),
            Transform::from_xyz(grinder_x, surface_y_local + base_h * 0.5, grinder_z),
            Name::new("Grinder Base"),
        ))
        .id();

    let grinder_body = commands
        .spawn((
            Mesh3d(meshes.add(Cylinder::new(body_r, body_h))),
            MeshMaterial3d(black_mat.clone()),
            Transform::from_xyz(grinder_x, body_center_y, grinder_z),
            Name::new("Grinder Body"),
        ))
        .id();

    let grinder_hopper = commands
        .spawn((
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
        ))
        .id();

    // ── Ceiling pendant ───────────────────────────────────────────────────────
    // Hangs above the center of the counter. Local space: (0,0,0) = cabinet mid.
    let shade_y = surface_y_local + 1.25; // ~1.2 m above counter surface
    let shade_r = 0.13_f32;
    let shade_h = 0.10_f32;
    let cord_h = 0.75_f32;

    let cord = commands
        .spawn((
            Mesh3d(meshes.add(Cylinder::new(0.007, cord_h))),
            MeshMaterial3d(materials.add(StandardMaterial {
                base_color: Color::srgb(0.10, 0.08, 0.06),
                perceptual_roughness: 1.0,
                ..default()
            })),
            Transform::from_xyz(0.0, shade_y + shade_h * 0.5 + cord_h * 0.5, 0.0),
            Name::new("Pendant Cord"),
            NotShadowCaster,
        ))
        .id();

    let shade = commands
        .spawn((
            Mesh3d(meshes.add(Cylinder::new(shade_r, shade_h))),
            MeshMaterial3d(materials.add(StandardMaterial {
                base_color: Color::srgb(0.12, 0.10, 0.09),
                perceptual_roughness: 0.8,
                reflectance: 0.15,
                ..default()
            })),
            Transform::from_xyz(0.0, shade_y, 0.0),
            Name::new("Pendant Shade"),
            NotShadowCaster,
        ))
        .id();

    // Light sits just below the shade opening so it pools warmly onto the counter.
    // Bevy 0.14+ uses physical lumens; 1_000_000 is the default. 600k gives
    // a warm fill without washing out the directional sun at 12,000 lux.
    let pendant_light = commands
        .spawn((
            PointLight {
                color: Color::srgb(1.0, 0.87, 0.60),
                intensity: 0.0,
                range: 8.0,
                radius: 0.06,
                shadows_enabled: true,
                ..default()
            },
            CoffeeLight,
            Transform::from_xyz(0.0, shade_y - shade_h * 0.5 - 0.02, 0.0),
            Name::new("Pendant Light"),
        ))
        .id();

    let mut children = vec![
        mug,
        liquid,
        countertop,
        backsplash,
        machine,
        machine_controls,
        drip_tray,
        grinder_base,
        grinder_body,
        grinder_hopper,
        cord,
        shade,
        pendant_light,
    ];
    children.extend(handles);
    commands.entity(station_entity).add_children(&children);
}
