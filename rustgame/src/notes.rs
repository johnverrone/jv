use bevy::light::NotShadowCaster;
use bevy::prelude::*;

use crate::baked_label::{BakeConfig, bake_text_image};
use crate::interaction::{CurrentStation, NearestStation};
use crate::world::{Station, StationKind};

// ─── mock data ────────────────────────────────────────────────────────────────

const MOCK_NOTES: &[&str] = &[
    "Rust async patterns",
    "WASM performance",
    "Engine architecture",
    "Coffee brewing log",
    "Reading list 2026",
    "Bevy ECS deep dive",
    "Site roadmap",
    "Project ideas",
    "Weekly template",
];

// ─── constants ────────────────────────────────────────────────────────────────

const NOTE_W: f32 = 0.80;
const NOTE_H: f32 = 0.50;
const NOTE_COLS: usize = 3;
const NOTE_GAP: f32 = 0.08;
// Board front face is at local z = -0.04 (half of 0.08 thickness); notes sit just proud of it.
const BOARD_FACE_Z: f32 = -0.05;

const NOTE_COLORS: &[[u8; 3]] = &[
    [255, 248, 140], // yellow
    [162, 228, 152], // green
    [163, 214, 245], // blue
    [255, 182, 193], // pink
    [216, 181, 255], // lavender
];

// ─── components ──────────────────────────────────────────────────────────────

#[derive(Component)]
struct NotesLight;

/// Marker on each sticky note for future click-to-open behaviour.
#[derive(Component)]
pub struct NoteCard {
    pub index: usize,
}

// ─── plugin ──────────────────────────────────────────────────────────────────

pub struct NotesPlugin;

impl Plugin for NotesPlugin {
    fn build(&self, app: &mut App) {
        app.add_systems(PostStartup, (spawn_notes_board, spawn_notes_light))
            .add_systems(Update, update_notes_light);
    }
}

// ─── spawn systems ────────────────────────────────────────────────────────────

fn spawn_notes_board(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
    mut images: ResMut<Assets<Image>>,
    stations: Query<(Entity, &Station)>,
) {
    let Some((station_entity, _)) = stations.iter().find(|(_, s)| s.kind == StationKind::Notes)
    else {
        return;
    };

    // Center the grid on the board face. Board is 1.2 wide × 2.4 tall;
    // local (0,0,0) = board center, front face at z = -0.2.
    let total_w = NOTE_COLS as f32 * NOTE_W + (NOTE_COLS - 1) as f32 * NOTE_GAP;
    let start_x = -total_w / 2.0 + NOTE_W / 2.0;
    let start_y = 0.60; // top of grid; board local y range is -0.9..+0.9

    let note_mesh = meshes.add(Rectangle::new(NOTE_W, NOTE_H));
    let mut children: Vec<Entity> = Vec::new();

    for (i, &title) in MOCK_NOTES.iter().enumerate() {
        let col = i % NOTE_COLS;
        let row = i / NOTE_COLS;

        let x = start_x + col as f32 * (NOTE_W + NOTE_GAP);
        let y = start_y - row as f32 * (NOTE_H + NOTE_GAP);

        let image = bake_text_image(
            title,
            &BakeConfig {
                px_size: 32.0,
                color: [20, 15, 10],
                background: Some(NOTE_COLORS[i % NOTE_COLORS.len()]),
                padding: 14,
                canvas_size: Some((400, 250)),
            },
        );

        let mat = materials.add(StandardMaterial {
            base_color_texture: Some(images.add(image)),
            alpha_mode: AlphaMode::Opaque,
            double_sided: true,
            cull_mode: None,
            perceptual_roughness: 0.9,
            reflectance: 0.05,
            ..default()
        });

        let note = commands
            .spawn((
                Mesh3d(note_mesh.clone()),
                MeshMaterial3d(mat),
                Transform::from_xyz(x, y, BOARD_FACE_Z)
                    .with_rotation(Quat::from_rotation_y(std::f32::consts::PI)),
                NoteCard { index: i },
                Name::new(format!("Note: {title}")),
            ))
            .id();

        children.push(note);
    }

    commands.entity(station_entity).add_children(&children);
}

fn spawn_notes_light(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
    stations: Query<(Entity, &Station)>,
) {
    let Some((station_entity, _)) = stations.iter().find(|(_, s)| s.kind == StationKind::Notes)
    else {
        return;
    };

    // Horizontal fluorescent tube above the board.
    // Board is 3.0 wide, top at local y=0.9; tube spans full width and
    // projects 0.25m forward so it reads as a real fixture, not a decal.
    let tube_y = 1.05;
    let tube_z = -0.25;

    let tube = commands
        .spawn((
            Mesh3d(meshes.add(Cylinder::new(0.022, 3.0))),
            MeshMaterial3d(materials.add(StandardMaterial {
                base_color: Color::srgb(0.95, 0.98, 1.0),
                emissive: LinearRgba::new(0.85, 0.92, 1.0, 1.0),
                perceptual_roughness: 1.0,
                ..default()
            })),
            Transform::from_xyz(0.0, tube_y, tube_z)
                .with_rotation(Quat::from_rotation_z(std::f32::consts::FRAC_PI_2)),
            NotShadowCaster,
            Name::new("Fluorescent Tube"),
        ))
        .id();

    let light = commands
        .spawn((
            PointLight {
                color: Color::srgb(0.90, 0.95, 1.0),
                intensity: 0.0,
                range: 8.0,
                radius: 0.4,
                shadows_enabled: false,
                ..default()
            },
            NotesLight,
            Transform::from_xyz(0.0, tube_y - 0.04, tube_z),
            Name::new("Fluorescent Light"),
        ))
        .id();

    commands.entity(station_entity).add_children(&[tube, light]);
}

// ─── update systems ───────────────────────────────────────────────────────────

fn update_notes_light(
    nearest: Res<NearestStation>,
    current: Res<CurrentStation>,
    station_q: Query<&Station>,
    mut light_q: Query<&mut PointLight, With<NotesLight>>,
) {
    let Ok(mut light) = light_q.single_mut() else {
        return;
    };

    // Light is on when the player is near OR actively viewing the Notes board.
    // CurrentStation (not AppMode) is used because Interacting is shared across
    // all stations — CurrentStation tells us which one specifically.
    let near_notes = nearest
        .0
        .and_then(|e| station_q.get(e).ok())
        .is_some_and(|s| s.kind == StationKind::Notes);
    let viewing_notes = current
        .0
        .and_then(|e| station_q.get(e).ok())
        .is_some_and(|s| s.kind == StationKind::Notes);

    let target = if near_notes || viewing_notes {
        300_000.0
    } else {
        0.0
    };
    if (light.intensity - target).abs() > 0.1 {
        light.intensity = target;
    }
}
