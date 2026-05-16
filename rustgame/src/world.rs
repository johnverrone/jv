use avian3d::prelude::*;
use bevy::prelude::*;

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

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum StationKind {
    Coffee,
    Notes,
    Dev,
    YouTube,
    Photos,
}

#[derive(Component)]
struct StationNameLabel;

fn setup_world(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
    mut images: ResMut<Assets<Image>>,
) {
    // -- GROUND --

    let ground_radius = 24.0;
    let ground_height = 0.2;
    let ground_mesh = meshes.add(Cylinder::new(ground_radius, ground_height));
    let ground_mat = materials.add(StandardMaterial {
        base_color: Color::srgb(0.27, 0.55, 0.19),
        perceptual_roughness: 1.0,
        reflectance: 0.0,
        ..default()
    });
    commands.spawn((
        Mesh3d(ground_mesh),
        MeshMaterial3d(ground_mat),
        Transform::from_xyz(0.0, -ground_height * 0.5, 0.0),
        RigidBody::Static,
        Collider::cylinder(ground_radius, ground_height),
        Name::new("Ground"),
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

    commands.spawn((
        DirectionalLight {
            color: Color::srgb(1.0, 0.96, 0.88),
            illuminance: 10_000.0,
            shadows_enabled: true,
            ..default()
        },
        // Aim from a low-ish western angle for longer, more visible shadows.
        Transform::from_xyz(6.0, 8.0, 4.0).looking_at(Vec3::ZERO, Vec3::Y),
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
            // Tilt the screen up slightly so it reads as a display, not a wall.
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

    // Camera framing while interacting: stand 3 units toward the spawn from
    // the station, ~eye height, looking at a point 0.6 units past the station
    // body (where each station's "back wall" content can live — Coffee's menu
    // board, Notes' shelves, a Dev screen, etc.).
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

    // World-space baked label. Pure perspective scaling — the quad has a
    // fixed size in world units, so it shrinks naturally with distance.
    // 0.6m tall reads comfortably from anywhere on the disc and large at the
    // station itself.
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

/// Hides every station's floating name label during interaction so the
/// zoomed-in station view isn't covered in labels for the other stations.
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
