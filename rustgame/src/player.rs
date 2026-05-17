use avian3d::prelude::*;
use bevy::prelude::*;

use crate::input::PlayerInput;
use crate::interaction::AppMode;

#[derive(Component)]
pub struct Player {
    pub speed: f32,
    pub run_multiplier: f32,
    pub jump_velocity: f32,
    /// How quickly the visual yaws to face the movement direction.
    pub turn_speed: f32,
}

/// Marker on the child entity that owns the player mesh; rotation is driven
/// here so the parent physics body can stay fully rotation-locked.
#[derive(Component)]
struct PlayerVisual;

pub struct PlayerPlugin;

impl Plugin for PlayerPlugin {
    fn build(&self, app: &mut App) {
        app.add_systems(Startup, spawn_player).add_systems(
            Update,
            (move_player, jump_player).run_if(in_state(AppMode::Walking)),
        );
    }
}

fn spawn_player(
    mut commands: Commands,
    mut meshes: ResMut<Assets<Mesh>>,
    mut materials: ResMut<Assets<StandardMaterial>>,
) {
    let capsule_mesh = meshes.add(Capsule3d::new(0.4, 1.0));
    let capsule_material = materials.add(StandardMaterial {
        base_color: Color::srgb(0.9, 0.6, 0.2),
        perceptual_roughness: 0.5,
        metallic: 0.1,
        ..default()
    });

    // Small forward indicator so the capsule's yaw is actually visible.
    let nose_mesh = meshes.add(Cuboid::new(0.2, 0.15, 0.2));
    let nose_material = materials.add(StandardMaterial {
        base_color: Color::srgb(0.15, 0.1, 0.08),
        perceptual_roughness: 0.7,
        ..default()
    });

    commands
        .spawn((
            // Physics body — no mesh; visuals live on a child entity so they
            // can rotate freely without the solver fighting us.
            Transform::from_xyz(0.0, 1.5, 0.0),
            Visibility::default(),
            RigidBody::Dynamic,
            Collider::capsule(0.4, 1.0),
            LockedAxes::new()
                .lock_rotation_x()
                .lock_rotation_y()
                .lock_rotation_z(),
            // Avian's physics runs at 64 Hz; interpolation keeps Transform
            // smooth between ticks on 60/120 Hz displays.
            TransformInterpolation,
            Player {
                speed: 5.0,
                run_multiplier: 1.8,
                jump_velocity: 7.0,
                turn_speed: 14.0,
            },
            Name::new("Player"),
        ))
        .with_children(|parent| {
            parent
                .spawn((
                    Mesh3d(capsule_mesh),
                    MeshMaterial3d(capsule_material),
                    Transform::IDENTITY,
                    PlayerVisual,
                    Name::new("Player Visual"),
                ))
                .with_children(|visual| {
                    visual.spawn((
                        Mesh3d(nose_mesh),
                        MeshMaterial3d(nose_material),
                        // Out the front (-Z) and a touch above center.
                        Transform::from_xyz(0.0, 0.2, -0.5),
                        Name::new("Player Nose"),
                    ));
                });
        });
}

fn jump_player(
    input: Res<PlayerInput>,
    spatial_query: SpatialQuery,
    mut query: Query<(Entity, &Transform, &Player, &mut LinearVelocity)>,
) {
    if !input.jump {
        return;
    }
    let Ok((entity, transform, player, mut velocity)) = query.single_mut() else {
        return;
    };

    let filter = SpatialQueryFilter::from_excluded_entities([entity]);
    let grounded = spatial_query
        .cast_ray(transform.translation, Dir3::NEG_Y, 1.0, true, &filter)
        .is_some();

    if grounded {
        velocity.0.y = player.jump_velocity;
    }
}

fn move_player(
    input: Res<PlayerInput>,
    time: Res<Time>,
    collisions: Collisions,
    mut player_query: Query<(Entity, &Player, &mut LinearVelocity)>,
    mut visual_query: Query<&mut Transform, With<PlayerVisual>>,
) {
    let Ok((entity, player, mut velocity)) = player_query.single_mut() else {
        return;
    };

    // Map input axis to world space: +y forward = -z world, +x right = +x world.
    let direction = Vec3::new(input.move_axis.x, 0.0, -input.move_axis.y);

    let base = if input.run {
        player.speed * player.run_multiplier
    } else {
        player.speed
    };
    let mut horizontal = direction.normalize_or_zero() * base * input.speed_scale;

    // Remove velocity components that push into a surface in contact with the
    // player. Without this, holding "into wall" while airborne keeps writing
    // a velocity into the wall every frame; friction at the contact then
    // opposes the gravity-driven slide and the player effectively sticks.
    // Floor / ceiling normals are vertical, so they project to zero against
    // a horizontal input and don't affect normal grounded movement.
    for pair in collisions.collisions_with(entity) {
        for manifold in &pair.manifolds {
            let normal = if pair.collider1 == entity {
                -manifold.normal
            } else {
                manifold.normal
            };
            let into = horizontal.dot(normal);
            if into < 0.0 {
                horizontal -= into * normal;
            }
        }
    }

    velocity.0.x = horizontal.x;
    velocity.0.z = horizontal.z;

    if direction.length_squared() > 0.0 {
        let Ok(mut visual_tf) = visual_query.single_mut() else {
            return;
        };
        // Orient -Z (model forward) toward the movement direction.
        let target = Transform::default()
            .looking_at(direction.normalize(), Vec3::Y)
            .rotation;
        // Same exp-lerp smoothing pattern used by the follow camera.
        let t = 1.0 - (-player.turn_speed * time.delta_secs()).exp();
        visual_tf.rotation = visual_tf.rotation.slerp(target, t);
    }
}
