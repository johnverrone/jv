use bevy::prelude::*;

use crate::interaction::{AppMode, CurrentStation};
use crate::player::Player;
use crate::world::Station;

#[derive(Component)]
pub struct FollowCamera {
    pub offset: Vec3,
    pub follow_speed: f32,
}

#[derive(Component)]
pub struct CoffeeBagView {
    pub pos: Vec3,
    pub look: Vec3,
}

pub struct CameraPlugin;

impl Plugin for CameraPlugin {
    fn build(&self, app: &mut App) {
        app.add_systems(Startup, spawn_camera)
            .add_systems(PostUpdate, update_camera);
    }
}

fn spawn_camera(mut commands: Commands) {
    commands.spawn((
        Camera3d::default(),
        Transform::from_xyz(0.0, 5.0, 10.0).looking_at(Vec3::ZERO, Vec3::Y),
        // Matches the clear color so the island edge fades into sky.
        DistanceFog {
            color: Color::srgb(0.52, 0.78, 0.94),
            falloff: FogFalloff::Linear {
                start: 20.0,
                end: 35.0,
            },
            ..default()
        },
        FollowCamera {
            offset: Vec3::new(0.0, 5.0, 10.0),
            follow_speed: 5.0,
        },
        Name::new("Follow Camera"),
    ));
}

fn update_camera(
    time: Res<Time>,
    app_mode: Res<State<AppMode>>,
    current_station: Res<CurrentStation>,
    player_q: Query<&Transform, (With<Player>, Without<FollowCamera>)>,
    station_q: Query<&Station>,
    book_view_q: Query<&CoffeeBagView>,
    mut camera_q: Query<(&mut Transform, &FollowCamera)>,
) {
    let Ok((mut cam_tf, follow)) = camera_q.single_mut() else {
        return;
    };

    // Resolve the target the camera should be approaching this frame.
    let (target_pos, look_at) = match app_mode.get() {
        AppMode::Walking => {
            let Ok(player_tf) = player_q.single() else {
                return;
            };
            (player_tf.translation + follow.offset, player_tf.translation)
        }
        AppMode::Interacting => {
            let Some(entity) = current_station.0 else {
                return;
            };
            let Ok(station) = station_q.get(entity) else {
                return;
            };
            (station.view_pos, station.view_look)
        }
        AppMode::Reading => {
            // Only Coffee enters Reading, and there's exactly one book in the
            // scene, so the first BookView is unambiguous.
            let Ok(book) = book_view_q.single() else {
                return;
            };
            (book.pos, book.look)
        }
    };

    // Frame-rate-independent exponential easing — same pattern used elsewhere.
    let t = 1.0 - (-follow.follow_speed * time.delta_secs()).exp();
    cam_tf.translation = cam_tf.translation.lerp(target_pos, t);

    // Rotation target depends on transition direction:
    //
    // - Dolly *into* a focused view (Interacting / Reading): compute from the
    //   camera's *current* position so it tracks the destination point as it
    //   approaches — the look target stays "the station's content" all the
    //   way in, which reads smoothly.
    // - Return to Walking: compute from the *final* pose. The look target
    //   (player) often starts behind the camera or directly along its path
    //   home, and a per-frame current-pos slerp produces a 180° whip or a
    //   mid-transition freeze. A fixed end-rotation makes the slerp a smooth
    //   arc between two quaternions regardless of the path position takes.
    let rot_anchor = match app_mode.get() {
        AppMode::Walking => target_pos,
        AppMode::Interacting | AppMode::Reading => cam_tf.translation,
    };
    let target_rotation = Transform::from_translation(rot_anchor)
        .looking_at(look_at, Vec3::Y)
        .rotation;
    cam_tf.rotation = cam_tf.rotation.slerp(target_rotation, t);
}
