use bevy::prelude::*;

use crate::player::Player;
use crate::world::{Station, StationKind, Sun};

const ZONE_INNER: f32 = 4.5;
const ZONE_OUTER: f32 = 9.0;
const BLEND_SPEED: f32 = 2.0;

pub struct BiospherePlugin;

impl Plugin for BiospherePlugin {
    fn build(&self, app: &mut App) {
        app.init_resource::<TargetEnv>()
            .add_systems(Update, (detect_zone, apply_env).chain());
    }
}

#[derive(Clone)]
struct Env {
    sky: Vec3,
    ambient_color: Vec3,
    ambient_brightness: f32,
    sun_color: Vec3,
    sun_illuminance: f32,
    sun_from: Vec3,
    fog_start: f32,
    fog_end: f32,
}

impl Env {
    fn lerp(&self, other: &Env, t: f32) -> Env {
        Env {
            sky: self.sky.lerp(other.sky, t),
            ambient_color: self.ambient_color.lerp(other.ambient_color, t),
            ambient_brightness: self.ambient_brightness.lerp(other.ambient_brightness, t),
            sun_color: self.sun_color.lerp(other.sun_color, t),
            sun_illuminance: self.sun_illuminance.lerp(other.sun_illuminance, t),
            sun_from: self.sun_from.lerp(other.sun_from, t),
            fog_start: self.fog_start.lerp(other.fog_start, t),
            fog_end: self.fog_end.lerp(other.fog_end, t),
        }
    }

    fn scale(&self, t: f32) -> Env {
        Env {
            sky: self.sky * t,
            ambient_color: self.ambient_color * t,
            ambient_brightness: self.ambient_brightness * t,
            sun_color: self.sun_color * t,
            sun_illuminance: self.sun_illuminance * t,
            sun_from: self.sun_from * t,
            fog_start: self.fog_start * t,
            fog_end: self.fog_end * t,
        }
    }

    fn add(&self, other: &Env) -> Env {
        Env {
            sky: self.sky + other.sky,
            ambient_color: self.ambient_color + other.ambient_color,
            ambient_brightness: self.ambient_brightness + other.ambient_brightness,
            sun_color: self.sun_color + other.sun_color,
            sun_illuminance: self.sun_illuminance + other.sun_illuminance,
            sun_from: self.sun_from + other.sun_from,
            fog_start: self.fog_start + other.fog_start,
            fog_end: self.fog_end + other.fog_end,
        }
    }
}

fn hub_env() -> Env {
    Env {
        sky: Vec3::new(0.52, 0.78, 0.94),
        ambient_color: Vec3::new(0.82, 0.90, 1.0),
        ambient_brightness: 200.0,
        sun_color: Vec3::new(1.0, 0.93, 0.76),
        sun_illuminance: 12_000.0,
        sun_from: Vec3::new(-5.0, 5.0, 8.0),
        fog_start: 20.0,
        fog_end: 35.0,
    }
}

fn station_env(kind: StationKind) -> Env {
    match kind {
        StationKind::Coffee => Env {
            // Cozy golden sunrise — warm sky, lifted shadows, low sun
            sky: Vec3::new(0.99, 0.80, 0.52),
            ambient_color: Vec3::new(1.0, 0.6, 0.48),
            ambient_brightness: 600.0,
            sun_color: Vec3::new(1.0, 0.58, 0.28),
            sun_illuminance: 3_000.0,
            sun_from: Vec3::new(10.0, 1.5, 2.0),
            fog_start: 20.0,
            fog_end: 70.0,
        },
        StationKind::Notes => Env {
            // Warm amber autumn afternoon
            sky: Vec3::new(0.75, 0.62, 0.45),
            ambient_color: Vec3::new(1.0, 0.88, 0.65),
            ambient_brightness: 45.0,
            sun_color: Vec3::new(1.0, 0.82, 0.50),
            sun_illuminance: 10_000.0,
            sun_from: Vec3::new(-3.0, 4.0, 6.0),
            fog_start: 18.0,
            fog_end: 30.0,
        },
        StationKind::Dev => Env {
            // Crisp clear blue — focused daylight
            sky: Vec3::new(0.30, 0.58, 0.92),
            ambient_color: Vec3::new(0.84, 0.92, 1.0),
            ambient_brightness: 65.0,
            sun_color: Vec3::new(0.96, 0.98, 1.0),
            sun_illuminance: 16_000.0,
            sun_from: Vec3::new(-2.0, 8.0, 5.0),
            fog_start: 25.0,
            fog_end: 42.0,
        },
        StationKind::YouTube => Env {
            // Vivid vibrant afternoon
            sky: Vec3::new(0.42, 0.70, 0.98),
            ambient_color: Vec3::new(0.88, 0.92, 0.98),
            ambient_brightness: 60.0,
            sun_color: Vec3::new(1.0, 0.95, 0.80),
            sun_illuminance: 14_000.0,
            sun_from: Vec3::new(4.0, 6.0, -5.0),
            fog_start: 22.0,
            fog_end: 38.0,
        },
        StationKind::Photos => Env {
            // Golden hour in the mountains
            sky: Vec3::new(0.95, 0.62, 0.28),
            ambient_color: Vec3::new(1.0, 0.82, 0.55),
            ambient_brightness: 38.0,
            sun_color: Vec3::new(1.0, 0.65, 0.25),
            sun_illuminance: 8_500.0,
            sun_from: Vec3::new(-8.0, 1.8, 3.0),
            fog_start: 16.0,
            fog_end: 30.0,
        },
    }
}

#[derive(Resource)]
struct TargetEnv(Env);

impl Default for TargetEnv {
    fn default() -> Self {
        Self(hub_env())
    }
}

fn detect_zone(
    player_q: Query<&Transform, With<Player>>,
    station_q: Query<(&Transform, &Station)>,
    mut target: ResMut<TargetEnv>,
) {
    let Ok(player_tf) = player_q.single() else {
        return;
    };
    let player_xz = Vec2::new(player_tf.translation.x, player_tf.translation.z);

    let mut weighted_envs: Vec<(Env, f32)> = Vec::new();
    let mut total_station_weight = 0.0f32;

    for (station_tf, station) in &station_q {
        let station_xz = Vec2::new(station_tf.translation.x, station_tf.translation.z);
        let dist = player_xz.distance(station_xz);
        let w = if dist <= ZONE_INNER {
            1.0
        } else if dist >= ZONE_OUTER {
            0.0
        } else {
            let t = (dist - ZONE_INNER) / (ZONE_OUTER - ZONE_INNER);
            1.0 - t * t * (3.0 - 2.0 * t)
        };
        if w > 0.0 {
            weighted_envs.push((station_env(station.kind), w));
            total_station_weight += w;
        }
    }

    let hub_weight = (1.0 - total_station_weight.min(1.0)).max(0.0);
    let total_weight = total_station_weight + hub_weight;

    let mut blended = hub_env().scale(hub_weight / total_weight);
    for (env, w) in &weighted_envs {
        blended = blended.add(&env.scale(w / total_weight));
    }

    target.0 = blended;
}

fn apply_env(
    time: Res<Time>,
    target: Res<TargetEnv>,
    mut clear_color: ResMut<ClearColor>,
    mut ambient: ResMut<GlobalAmbientLight>,
    mut sun_q: Query<(&mut DirectionalLight, &mut Transform), With<Sun>>,
    mut fog_q: Query<&mut DistanceFog>,
    mut current: Local<Option<Env>>,
) {
    let cur = current.get_or_insert_with(hub_env);
    let t = 1.0 - (-BLEND_SPEED * time.delta_secs()).exp();
    *cur = cur.lerp(&target.0, t);

    let sky = cur.sky;
    clear_color.0 = Color::srgb(sky.x, sky.y, sky.z);

    let ac = cur.ambient_color;
    ambient.color = Color::srgb(ac.x, ac.y, ac.z);
    ambient.brightness = cur.ambient_brightness;

    if let Ok((mut light, mut sun_tf)) = sun_q.single_mut() {
        let sc = cur.sun_color;
        light.color = Color::srgb(sc.x, sc.y, sc.z);
        light.illuminance = cur.sun_illuminance;
        *sun_tf = Transform::from_translation(cur.sun_from).looking_at(Vec3::ZERO, Vec3::Y);
    }

    for mut fog in &mut fog_q {
        fog.color = Color::srgb(sky.x, sky.y, sky.z);
        fog.falloff = FogFalloff::Linear {
            start: cur.fog_start,
            end: cur.fog_end,
        };
    }
}
