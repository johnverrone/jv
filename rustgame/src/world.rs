use avian3d::prelude::*;
use bevy::asset::RenderAssetUsages;
use bevy::prelude::*;
use bevy::render::render_resource::{Extent3d, TextureDimension, TextureFormat};
// use bevy::image::{ImageAddressMode, ImageLoaderSettings, ImageSampler, ImageSamplerDescriptor};

use crate::baked_label::{BakeConfig, spawn_baked_label};
use crate::interaction::AppMode;

pub struct WorldPlugin;

impl Plugin for WorldPlugin {
    fn build(&self, app: &mut App) {
        app.add_systems(Startup, setup_world)
            .add_systems(Update, update_station_name_visibility);
    }
}

#[derive(Component)]
pub struct Station {
    pub kind: StationKind,
    pub label_anchor: Vec3,
    pub view_pos: Vec3,
    pub view_look: Vec3,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash)]
pub enum StationKind {
    Coffee,
    Notes,
    Dev,
    YouTube,
    Photos,
}

/// Marker on the scene's directional light so the biosphere system can query
/// and smoothly blend its color, direction, and intensity as the player moves
/// between zones without knowing the entity ID.
#[derive(Component)]
pub struct Sun;

#[derive(Component)]
struct StationNameLabel;

// fn img_repeat(s: &mut ImageLoaderSettings) {
//     s.sampler = ImageSampler::Descriptor(ImageSamplerDescriptor {
//         address_mode_u: ImageAddressMode::Repeat,
//         address_mode_v: ImageAddressMode::Repeat,
//         anisotropy_clamp: 8,
//         ..ImageSamplerDescriptor::linear()
//     });
// }

/// Generate a 256×256 RGBA image that is white+opaque in the center and fades
/// to transparent at the rim. `inner_frac` and `outer_frac` are fractions of
/// the UV radius (0.0 = center, 1.0 = edge of UV disk) where the fade begins
/// and ends.  Apply as `base_color_texture` with `AlphaMode::Blend` so the
/// mesh color fades smoothly without needing a custom shader.
fn radial_fade_image(images: &mut Assets<Image>, inner_frac: f32, outer_frac: f32) -> Handle<Image> {
    const SIZE: u32 = 256;
    let inner = inner_frac * 0.5;
    let outer = outer_frac * 0.5;
    let mut data = vec![0u8; (SIZE * SIZE * 4) as usize];
    for y in 0..SIZE {
        for x in 0..SIZE {
            let u = (x as f32 + 0.5) / SIZE as f32;
            let v = (y as f32 + 0.5) / SIZE as f32;
            let dist = ((u - 0.5) * (u - 0.5) + (v - 0.5) * (v - 0.5)).sqrt();
            let t = ((dist - inner) / (outer - inner)).clamp(0.0, 1.0);
            let alpha = 1.0 - t * t * (3.0 - 2.0 * t); // smoothstep
            let i = ((y * SIZE + x) * 4) as usize;
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
            data[i + 3] = (alpha * 255.0) as u8;
        }
    }
    images.add(Image::new(
        Extent3d { width: SIZE, height: SIZE, depth_or_array_layers: 1 },
        TextureDimension::D2,
        data,
        TextureFormat::Rgba8UnormSrgb,
        RenderAssetUsages::default(),
    ))
}

fn setup_world(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
    mut images: ResMut<Assets<Image>>,
) {
    // -- GROUND --

    // Texture example (gravelly sand PBR) — kept for reference, see img_repeat above.
    // let asset_server = ...; // add Res<AssetServer> to system params to re-enable
    // let ground_diff = asset_server.load_with_settings("textures/gravelly_sand/gravelly_sand_diff_1k.jpg", img_repeat);
    // let ground_ao   = asset_server.load_with_settings("textures/gravelly_sand/gravelly_sand_ao_1k.jpg",   img_repeat);
    // let ground_norm = asset_server.load_with_settings("textures/gravelly_sand/gravelly_sand_nor_gl_1k.jpg", img_repeat);
    // let ground_rough= asset_server.load_with_settings("textures/gravelly_sand/gravelly_sand_rough_1k.jpg", img_repeat);
    // material fields: base_color_texture, occlusion_texture, normal_map_texture, metallic_roughness_texture
    // also: generate_tangents() on the mesh, uv_transform: Affine2::from_scale(Vec2::splat(8.0))

    let ground_radius = 24.0;
    let ground_height = 0.2;

    // Physics collider only — the grass plane below provides the visual.
    commands.spawn((
        RigidBody::Static,
        Collider::cylinder(ground_radius, ground_height),
        Transform::from_xyz(0.0, -ground_height * 0.5, 0.0),
        Name::new("Ground"),
    ));

    // Grass plane: fades from opaque green at center to transparent at the island rim.
    // Plane half_size=24 → UV center=(0.5,0.5)=origin, UV radius 0.5 = physical 24 units.
    // inner_frac=0.75 → fade starts at radius 18; outer_frac=1.0 → gone at radius 24.
    let grass_fade = radial_fade_image(&mut images, 0.75, 1.0);
    commands.spawn((
        Mesh3d(meshes.add(Plane3d { normal: Dir3::Y, half_size: Vec2::splat(24.0) })),
        MeshMaterial3d(materials.add(StandardMaterial {
            base_color: Color::srgb(0.47, 0.72, 0.33),
            base_color_texture: Some(grass_fade),
            alpha_mode: AlphaMode::Blend,
            perceptual_roughness: 1.0,
            reflectance: 0.0,
            ..default()
        })),
        Transform::from_xyz(0.0, 0.001, 0.0),
        Name::new("Grass"),
    ));

    // Beach plane: fades in behind the grass edge, out into the ocean.
    // Plane half_size=30 → UV radius 0.5 = physical 30 units.
    // inner_frac=0.80 → fade starts at radius 24; outer_frac=1.0 → gone at radius 30.
    let beach_fade = radial_fade_image(&mut images, 0.80, 1.0);
    commands.spawn((
        Mesh3d(meshes.add(Plane3d { normal: Dir3::Y, half_size: Vec2::splat(30.0) })),
        MeshMaterial3d(materials.add(StandardMaterial {
            base_color: Color::srgb(0.82, 0.73, 0.56),
            base_color_texture: Some(beach_fade),
            alpha_mode: AlphaMode::Blend,
            perceptual_roughness: 0.95,
            reflectance: 0.0,
            ..default()
        })),
        Transform::from_xyz(0.0, -0.002, 0.0),
        Name::new("Beach"),
    ));

    // Ocean: large opaque slab; fog fades the horizon into the sky color.
    commands.spawn((
        Mesh3d(meshes.add(Cuboid::new(600.0, 1.0, 600.0))),
        MeshMaterial3d(materials.add(StandardMaterial {
            base_color: Color::srgb(0.12, 0.38, 0.65),
            perceptual_roughness: 0.1,
            reflectance: 0.5,
            ..default()
        })),
        Transform::from_xyz(0.0, -0.65, 0.0),
        Name::new("Ocean"),
    ));

    // -- STATIONS --

    spawn_station(
        &mut commands,
        &mut meshes,
        &mut materials,
        &mut images,
        "Coffee",
        StationKind::Coffee,
        Vec3::new(0.0, 0.0, -9.0),
        Color::srgb(0.55, 0.35, 0.22),
    );
    spawn_station(
        &mut commands,
        &mut meshes,
        &mut materials,
        &mut images,
        "Notes",
        StationKind::Notes,
        Vec3::new(8.5, 0.0, -2.5),
        Color::srgb(0.92, 0.45, 0.78),
    );
    spawn_station(
        &mut commands,
        &mut meshes,
        &mut materials,
        &mut images,
        "Dev",
        StationKind::Dev,
        Vec3::new(5.0, 0.0, 7.0),
        Color::srgb(0.35, 0.82, 0.95),
    );
    spawn_station(
        &mut commands,
        &mut meshes,
        &mut materials,
        &mut images,
        "YouTube",
        StationKind::YouTube,
        Vec3::new(-5.0, 0.0, 7.0),
        Color::srgb(0.98, 0.40, 0.45),
    );
    spawn_station(
        &mut commands,
        &mut meshes,
        &mut materials,
        &mut images,
        "Photos",
        StationKind::Photos,
        Vec3::new(-8.5, 0.0, -2.5),
        Color::srgb(0.78, 0.95, 0.55),
    );

    // -- SUN --
    // Low south-west angle (~28°) for a perpetual golden-hour feel.

    commands.spawn((
        DirectionalLight {
            color: Color::srgb(1.0, 0.93, 0.76),
            illuminance: 12_000.0,
            shadows_enabled: true,
            ..default()
        },
        Transform::from_xyz(-5.0, 5.0, 8.0).looking_at(Vec3::ZERO, Vec3::Y),
        Sun,
        Name::new("Sun"),
    ));
}

fn spawn_station(
    commands: &mut Commands,
    meshes: &mut Assets<Mesh>,
    materials: &mut Assets<StandardMaterial>,
    images: &mut Assets<Image>,
    name: &'static str,
    kind: StationKind,
    base: Vec3,
    color: Color,
) {
    let material = materials.add(StandardMaterial {
        base_color: color,
        perceptual_roughness: 1.0,
        reflectance: 0.0,
        ..default()
    });

    let face_spawn = |pos: Vec3| {
        Transform::from_translation(pos).looking_at(Vec3::new(0.0, pos.y, 0.0), Vec3::Y)
    };

    let (mesh, collider, transform, top_y) = match kind {
        StationKind::Coffee => {
            let size = Vec3::new(2.0, 0.7, 0.8);
            (
                meshes.add(Cuboid::from_size(size)),
                Collider::cuboid(size.x, size.y, size.z),
                Transform::from_translation(base + Vec3::Y * (size.y * 0.5)),
                1.7,
            )
        }
        StationKind::Notes => (
            meshes.add(Cuboid::new(1.2, 2.4, 0.4)),
            Collider::cuboid(1.2, 2.4, 0.4),
            face_spawn(base + Vec3::Y * 1.2),
            2.4,
        ),
        StationKind::YouTube => (
            meshes.add(Cuboid::new(1.6, 1.0, 0.1)),
            Collider::cuboid(1.6, 1.0, 0.1),
            face_spawn(base + Vec3::Y * 1.0),
            1.5,
        ),
        StationKind::Dev => {
            let mut t = face_spawn(base + Vec3::Y * 1.1);
            t.rotate_local_x(-0.15);
            (
                meshes.add(Cuboid::new(2.2, 1.3, 0.08)),
                Collider::cuboid(2.2, 1.3, 0.08),
                t,
                1.8,
            )
        }
        StationKind::Photos => (
            meshes.add(Cuboid::new(1.8, 1.3, 0.08)),
            Collider::cuboid(1.8, 1.3, 0.08),
            face_spawn(base + Vec3::Y * 1.0),
            1.7,
        ),
    };

    let label_anchor = base + Vec3::Y * (top_y + 0.6);

    let to_origin = (Vec3::ZERO - base).normalize_or_zero();
    let view_pos = base + to_origin * 3.0 + Vec3::Y * 1.7;
    let view_look = base - to_origin * 0.6 + Vec3::Y * 1.45;

    commands.spawn((
        Mesh3d(mesh),
        MeshMaterial3d(material),
        transform,
        RigidBody::Static,
        collider,
        Station {
            kind,
            label_anchor,
            view_pos,
            view_look,
        },
        Name::new(name),
    ));

    let label_entity = spawn_baked_label(
        commands,
        meshes,
        materials,
        images,
        name,
        &BakeConfig::default(),
        label_anchor,
        0.6,
        false,
    );
    commands
        .entity(label_entity)
        .insert((StationNameLabel, Name::new(format!("{name} Label"))));
}

fn update_station_name_visibility(
    app_mode: Res<State<AppMode>>,
    mut labels: Query<&mut Visibility, With<StationNameLabel>>,
) {
    let target = if *app_mode.get() == AppMode::Walking {
        Visibility::Inherited
    } else {
        Visibility::Hidden
    };
    for mut vis in &mut labels {
        *vis = target;
    }
}
