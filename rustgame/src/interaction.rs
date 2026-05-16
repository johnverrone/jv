use avian3d::prelude::*;
use bevy::prelude::*;

use crate::baked_label::{BakeConfig, BakedLabel, spawn_baked_label};
use crate::input::PlayerInput;
use crate::player::Player;
use crate::world::{Station, StationKind};

const PROMPT_TEXT: &str = "[E] interact";

/// Top-level interaction mode. Drives camera targeting and which input
/// systems are active.
///
/// - `Walking`: free roam, follow camera.
/// - `Interacting`: zoomed onto a station's view target (generic catch-all).
/// - `Reading`: zoomed onto the Coffee station's catalog book. Page-turning
///   input only — player can't move.
#[derive(States, Hash, Eq, PartialEq, Debug, Clone, Default)]
pub enum AppMode {
    #[default]
    Walking,
    Interacting,
    Reading,
}

/// The station the player is currently interacting with, if any.
#[derive(Resource, Default)]
pub struct CurrentStation(pub Option<Entity>);

/// The closest station within interaction range, recomputed each frame.
/// `None` whenever no station is in range or we're already interacting.
#[derive(Resource, Default)]
pub struct NearestStation(pub Option<Entity>);

/// Marker on the UI text node that shows "[E] interact".
#[derive(Component)]
struct InteractionPromptUi;

/// Player must be within this distance of a station's body to interact.
pub const INTERACTION_RANGE: f32 = 5.0;

pub struct InteractionPlugin;

impl Plugin for InteractionPlugin {
    fn build(&self, app: &mut App) {
        app.init_state::<AppMode>()
            .init_resource::<CurrentStation>()
            .init_resource::<NearestStation>()
            .add_systems(Startup, spawn_prompt_ui)
            .add_systems(OnEnter(AppMode::Interacting), hide_player)
            .add_systems(OnEnter(AppMode::Reading), hide_player)
            .add_systems(OnEnter(AppMode::Walking), show_player)
            .add_systems(
                Update,
                (
                    find_nearest_station,
                    update_prompt_ui,
                    handle_interaction_input,
                ),
            );
    }
}

fn hide_player(mut player_q: Query<&mut Visibility, With<Player>>) {
    if let Ok(mut vis) = player_q.single_mut() {
        *vis = Visibility::Hidden;
    }
}

fn show_player(mut player_q: Query<&mut Visibility, With<Player>>) {
    if let Ok(mut vis) = player_q.single_mut() {
        *vis = Visibility::Inherited;
    }
}

fn spawn_prompt_ui(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
    mut images: ResMut<Assets<Image>>,
) {
    // Baked once at startup; only the anchor moves at runtime as the prompt
    // hops between stations.
    let prompt = spawn_baked_label(
        &mut commands,
        &mut meshes,
        &mut materials,
        &mut images,
        PROMPT_TEXT,
        &BakeConfig::default(),
        // Anchor gets rewritten each frame by `update_prompt_ui`.
        Vec3::ZERO,
        // Smaller than the station name card (0.6) so the prompt reads as
        // secondary signage below the main label.
        0.35,
        false,
    );
    commands.entity(prompt).insert((
        Visibility::Hidden,
        InteractionPromptUi,
        Name::new("Interaction Prompt"),
    ));
}

fn find_nearest_station(
    app_mode: Res<State<AppMode>>,
    player_q: Query<&Transform, With<Player>>,
    stations: Query<(Entity, &Transform), With<Station>>,
    mut nearest: ResMut<NearestStation>,
) {
    // Only surface a "nearest" while we're free-walking. During an
    // interaction the prompt would be noise.
    if *app_mode.get() != AppMode::Walking {
        nearest.0 = None;
        return;
    }
    let Ok(player_tf) = player_q.single() else {
        nearest.0 = None;
        return;
    };

    let range_sq = INTERACTION_RANGE * INTERACTION_RANGE;
    let mut best: Option<(Entity, f32)> = None;
    for (entity, tf) in &stations {
        let d2 = tf.translation.distance_squared(player_tf.translation);
        if d2 > range_sq {
            continue;
        }
        match best {
            Some((_, best_d2)) if d2 >= best_d2 => {}
            _ => best = Some((entity, d2)),
        }
    }
    nearest.0 = best.map(|(e, _)| e);
}

fn update_prompt_ui(
    nearest: Res<NearestStation>,
    station_q: Query<&Station>,
    mut prompt_q: Query<(&mut BakedLabel, &mut Visibility), With<InteractionPromptUi>>,
) {
    let Ok((mut label, mut visibility)) = prompt_q.single_mut() else {
        return;
    };

    match nearest.0.and_then(|e| station_q.get(e).ok()) {
        Some(station) => {
            // Park the prompt below the station name card. Both cards billboard
            // toward the camera, so a world-Y offset reads as "below" on screen.
            label.anchor = station.label_anchor - Vec3::Y * 0.55;
            *visibility = Visibility::Inherited;
        }
        None => {
            *visibility = Visibility::Hidden;
        }
    }
}

fn handle_interaction_input(
    input: Res<PlayerInput>,
    app_mode: Res<State<AppMode>>,
    mut next_mode: ResMut<NextState<AppMode>>,
    nearest: Res<NearestStation>,
    mut current: ResMut<CurrentStation>,
    stations: Query<&Station>,
    mut player_velocity: Query<&mut LinearVelocity, With<Player>>,
) {
    match app_mode.get() {
        AppMode::Walking => {
            if input.interact
                && let Some(entity) = nearest.0
                && let Ok(station) = stations.get(entity)
            {
                current.0 = Some(entity);
                // The Coffee station opens its catalog book; every other
                // station uses the generic zoomed station view.
                let target = match station.kind {
                    StationKind::Coffee => AppMode::Reading,
                    _ => AppMode::Interacting,
                };
                next_mode.set(target);
                // Halt the player so they don't drift while the camera moves.
                if let Ok(mut vel) = player_velocity.single_mut() {
                    vel.0 = Vec3::ZERO;
                }
            }
        }
        AppMode::Interacting | AppMode::Reading => {
            if input.cancel {
                current.0 = None;
                next_mode.set(AppMode::Walking);
            }
        }
    }
}
