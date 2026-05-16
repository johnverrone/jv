use bevy::prelude::*;

/// Device-agnostic snapshot of the player's intent for the current frame.
/// Gameplay systems read from this; only the gathering systems in this
/// module ever read raw device input.
#[derive(Resource, Default)]
pub struct PlayerInput {
    /// x = strafe (+right), y = forward (+forward). Unnormalized — callers
    /// decide whether to normalize (e.g. to cap diagonal speed).
    pub move_axis: Vec2,
    /// Held while the player wants to run.
    pub run: bool,
    /// Edge — true only on the frame the action was triggered.
    pub jump: bool,
    pub interact: bool,
    pub cancel: bool,
    /// Edge — previous page in a paginated view (e.g., the catalog book).
    pub page_prev: bool,
    /// Edge — next page in a paginated view.
    pub page_next: bool,
}

pub struct InputPlugin;

impl Plugin for InputPlugin {
    fn build(&self, app: &mut App) {
        app.init_resource::<PlayerInput>()
            .add_systems(PreUpdate, gather_keyboard);
    }
}

fn gather_keyboard(keys: Res<ButtonInput<KeyCode>>, mut input: ResMut<PlayerInput>) {
    let mut axis = Vec2::ZERO;
    if keys.pressed(KeyCode::KeyW) {
        axis.y += 1.0;
    }
    if keys.pressed(KeyCode::KeyS) {
        axis.y -= 1.0;
    }
    if keys.pressed(KeyCode::KeyD) {
        axis.x += 1.0;
    }
    if keys.pressed(KeyCode::KeyA) {
        axis.x -= 1.0;
    }

    *input = PlayerInput {
        move_axis: axis,
        run: keys.pressed(KeyCode::ShiftLeft) || keys.pressed(KeyCode::ShiftRight),
        jump: keys.just_pressed(KeyCode::Space),
        interact: keys.just_pressed(KeyCode::KeyE),
        cancel: keys.just_pressed(KeyCode::Escape),
        page_prev: keys.just_pressed(KeyCode::ArrowLeft),
        page_next: keys.just_pressed(KeyCode::ArrowRight),
    };
}
