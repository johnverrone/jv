use avian3d::prelude::*;
use bevy::prelude::*;

mod baked_label;
mod camera;
mod coffee;
mod input;
mod interaction;
mod player;
mod world;

pub fn run() {
    App::new()
        .add_plugins(DefaultPlugins.set(WindowPlugin {
            primary_window: Some(Window {
                title: "johnverrone.com".into(),
                resolution: (1280, 720).into(),
                canvas: Some("#bevy-canvas".into()),
                // Track the canvas's CSS parent so resizing the browser
                // resizes the render target (and the camera projection).
                fit_canvas_to_parent: true,
                prevent_default_event_handling: false,
                ..default()
            }),
            ..default()
        }))
        .add_plugins(PhysicsPlugins::default())
        // Heavier-than-Earth gravity so jumps feel snappy, not floaty.
        .insert_resource(Gravity(Vec3::new(0.0, -25.0, 0.0)))
        // Deep navy "void" backdrop — the world reads as a lit island floating
        // in dark space. Fog (set on the camera) matches this so the ground
        // edge fades into the void instead of ending abruptly.
        .insert_resource(ClearColor(Color::srgb(0.05, 0.06, 0.10)))
        // Cool, slightly dim ambient so the warm sun does most of the shading
        // and shadows feel crisp against the dark backdrop.
        .insert_resource(GlobalAmbientLight {
            color: Color::srgb(0.78, 0.85, 1.0),
            brightness: 70.0,
            ..default()
        })
        .add_plugins((
            input::InputPlugin,
            baked_label::BakedLabelPlugin,
            world::WorldPlugin,
            player::PlayerPlugin,
            camera::CameraPlugin,
            interaction::InteractionPlugin,
            coffee::CoffeePlugin,
        ))
        .run();
}

/// WASM entry point. `#[wasm_bindgen(start)]` makes this run automatically
/// when the JS module is instantiated.
#[cfg(target_arch = "wasm32")]
#[wasm_bindgen::prelude::wasm_bindgen(start)]
pub fn wasm_main() {
    // Pipe Rust panics to the browser console with full backtraces.
    console_error_panic_hook::set_once();
    run();
}
