use bevy::prelude::*;

/// Device-agnostic snapshot of the player's intent for the current frame.
/// Gameplay systems read from this; only the gathering systems in this
/// module ever read raw device input.
#[derive(Resource)]
pub struct PlayerInput {
    /// x = strafe (+right), y = forward (+forward). Direction only — speed is
    /// encoded separately in `speed_scale` so touch can drive analog speed.
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
    /// Fraction of maximum (run) speed: 0.0 = stopped, 1.0 = full run speed.
    /// Keyboard always writes 1.0; touch/mouse scales this by drag distance.
    pub speed_scale: f32,
}

impl Default for PlayerInput {
    fn default() -> Self {
        Self {
            move_axis: Vec2::ZERO,
            run: false,
            jump: false,
            interact: false,
            cancel: false,
            page_prev: false,
            page_next: false,
            speed_scale: 1.0,
        }
    }
}

/// Persists the drag anchor and latest pointer position across frames.
/// Velocity stays constant while the finger/cursor is held still because the
/// drag vector doesn't change — no new events needed.
///
/// `from_touch` prevents double-processing when Chrome DevTools device
/// emulation sends both touch and mouse events for the same gesture.
#[derive(Resource, Default)]
struct DragState {
    anchor: Option<Vec2>,
    current: Option<Vec2>,
    from_touch: bool,
    /// True once a page_prev/next has fired for the current gesture so it
    /// doesn't repeat every frame while the drag is held.
    page_fired: bool,
}

pub struct InputPlugin;

impl Plugin for InputPlugin {
    fn build(&self, app: &mut App) {
        app.init_resource::<PlayerInput>()
            .init_resource::<DragState>()
            .add_systems(PreUpdate, (gather_keyboard, gather_pointer).chain());
    }
}

fn gather_keyboard(keys: Res<ButtonInput<KeyCode>>, mut input: ResMut<PlayerInput>) {
    let mut axis = Vec2::ZERO;
    if keys.pressed(KeyCode::KeyW) || keys.pressed(KeyCode::ArrowUp) {
        axis.y += 1.0;
    }
    if keys.pressed(KeyCode::KeyS) || keys.pressed(KeyCode::ArrowDown) {
        axis.y -= 1.0;
    }
    if keys.pressed(KeyCode::KeyD) || keys.pressed(KeyCode::ArrowRight) {
        axis.x += 1.0;
    }
    if keys.pressed(KeyCode::KeyA) || keys.pressed(KeyCode::ArrowLeft) {
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
        speed_scale: 1.0,
    };
}

/// Pixels of drag that maps to full run speed.
const MAX_DRAG_PX: f32 = 120.0;
/// Release with total displacement below this → tap (interact / cancel).
const TAP_MAX_PX: f32 = 20.0;
/// Minimum drag before movement begins.
const DEAD_ZONE_PX: f32 = 4.0;

/// Unified drag handler for both touch (real mobile) and left-mouse-button
/// (Chrome DevTools device emulation, desktop click-to-interact).
///
/// Touch takes priority: once a touch gesture is active, mouse events for the
/// same gesture are ignored. This prevents double-processing in emulators that
/// fire both event types simultaneously.
fn gather_pointer(
    mut drag: ResMut<DragState>,
    touches: Res<Touches>,
    mouse: Res<ButtonInput<MouseButton>>,
    windows: Query<&Window>,
    mut input: ResMut<PlayerInput>,
) {
    // ── touch ──────────────────────────────────────────────────────────────

    for touch in touches.iter_just_pressed() {
        if drag.anchor.is_none() {
            drag.anchor = Some(touch.start_position());
            drag.current = Some(touch.start_position());
            drag.from_touch = true;
        }
    }

    if drag.from_touch {
        // Keep current position in sync with the first active touch.
        for touch in touches.iter() {
            drag.current = Some(touch.position());
            break;
        }

        for touch in touches.iter_just_released() {
            if let Some(anchor) = drag.anchor {
                if (touch.position() - anchor).length() < TAP_MAX_PX {
                    input.interact = true;
                    input.cancel = true;
                }
            }
            drag.anchor = None;
            drag.current = None;
            drag.from_touch = false;
            drag.page_fired = false;
            break;
        }
    }

    // ── mouse (device emulation / desktop click-to-interact) ───────────────

    if !drag.from_touch {
        if let Ok(window) = windows.single() {
            if mouse.just_pressed(MouseButton::Left) {
                if let Some(pos) = window.cursor_position() {
                    drag.anchor = Some(pos);
                    drag.current = Some(pos);
                }
            }

            if mouse.pressed(MouseButton::Left) {
                if let Some(pos) = window.cursor_position() {
                    drag.current = Some(pos);
                }
            }

            if mouse.just_released(MouseButton::Left) {
                if let Some(anchor) = drag.anchor {
                    let pos = drag.current.unwrap_or(anchor);
                    if (pos - anchor).length() < TAP_MAX_PX {
                        input.interact = true;
                        input.cancel = true;
                    }
                }
                drag.anchor = None;
                drag.current = None;
                drag.page_fired = false;
            }
        }
    }

    // ── apply drag to input ────────────────────────────────────────────────

    if let (Some(anchor), Some(current)) = (drag.anchor, drag.current) {
        let diff = current - anchor;
        let mag = diff.length();
        if mag >= DEAD_ZONE_PX {
            let dir = diff / mag;
            // Screen: +x right, +y down → move_axis: +x strafe-right, +y forward.
            input.move_axis = Vec2::new(dir.x, -dir.y);
            input.run = true;
            input.speed_scale = (mag / MAX_DRAG_PX).min(1.0);
            if !drag.page_fired {
                input.page_prev = dir.x > TAP_MAX_PX;
                input.page_next = dir.x < TAP_MAX_PX;
                drag.page_fired = true;
            }
        }
    }
}
