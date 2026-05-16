//! In-world text labels rendered as billboarded textured quads.
//!
//! Each string is rasterized exactly once at spawn time via `ab_glyph` into an
//! RGBA `Image`, then displayed on a flat mesh that rotates to face the camera
//! each frame. Compared to Bevy's UI `Text` projected to a 3D anchor:
//!
//! - No per-frame glyph rasterization or text layout — scaling a label means
//!   scaling its `Transform`, which is a GPU sampling op.
//! - Crisp because the texture is generated once at a known pixel size; no
//!   sub-pixel jitter from snapping a UI node to integer pixels.
//! - Depth-tested: labels feel part of the world (occluded by foreground
//!   geometry) rather than overlaid on top.
//!
//! Trade-off: changing the string requires re-baking the texture. That's fine
//! for the kind of labels in this scene (station names, prompts, page text);
//! pages turn at most a few times a second, not 60.

use ab_glyph::{Font, FontRef, PxScale, ScaleFont, point};
use bevy::asset::RenderAssetUsages;
use bevy::image::Image;
use bevy::light::NotShadowCaster;
use bevy::prelude::*;
use bevy::render::render_resource::{Extent3d, TextureDimension, TextureFormat};

/// Single font reused for every baked label. Inter Bold reads well at small
/// sizes and covers the punctuation we need (em-dash, etc.) that Bevy's
/// default font lacks.
static FONT_BYTES: &[u8] = include_bytes!("../data/fonts/label.ttf");

/// Default rasterization size for a single-line label (station signs,
/// interaction prompt). Higher = crisper at close range, larger texture.
pub const DEFAULT_BAKE_PX: f32 = 48.0;

/// Common config shared between single-line and multi-line bakes. Per-line
/// font size lives on `LineSpec` for the multi-line path; for the simple
/// `bake_text_image` path `px_size` is the only size in play.
pub struct BakeConfig {
    pub px_size: f32,
    pub color: [u8; 3],
    pub background: Option<[u8; 3]>,
    /// Pixels of background margin around the glyph block. Larger values read
    /// more "sign-like" (visible card around the text); smaller values feel
    /// like text painted directly on a surface (good for the book pages,
    /// where the cream margin should blend into the book cover).
    pub padding: u32,
    /// Optional fixed output dimensions. When set, the image is always
    /// exactly this size — text shorter than the canvas is padded out,
    /// text longer is clipped. Used by the book pages so every coffee
    /// produces an identically-sized texture; without this, a long coffee
    /// name yields a wider texture, which the decal mesh then squashes
    /// vertically, making the apparent text size shrink for longer names.
    pub canvas_size: Option<(u32, u32)>,
}

impl Default for BakeConfig {
    fn default() -> Self {
        Self {
            px_size: DEFAULT_BAKE_PX,
            // Dark walnut — matches the counter and book palette.
            color: [50, 30, 18],
            background: None,
            padding: 14,
            canvas_size: None,
        }
    }
}

/// One line of text in a multi-line bake. Each line can have its own pixel
/// size so a label can express hierarchy (title vs. body vs. footnote).
pub struct LineSpec<'a> {
    pub text: &'a str,
    pub px_size: f32,
}

/// Rasterize a single line of text to an RGBA8 `Image`. Thin wrapper
/// over `bake_lines_image` for the common one-line case.
pub fn bake_text_image(text: &str, cfg: &BakeConfig) -> Image {
    bake_lines_image(
        &[LineSpec {
            text,
            px_size: cfg.px_size,
        }],
        cfg,
    )
}

/// Rasterize multiple lines of text into a single opaque RGBA8 `Image`. Lines
/// stack vertically using each line's own font metrics; total width is set by
/// the widest line, total height by the sum of line heights + padding.
///
/// Every pixel ends up opaque (background pre-fill, then text composited on
/// top via straight alpha), so the GPU's bilinear filter samples cleanly at
/// any display size — no alpha artifacts, no contrast-pairing with whatever
/// sits behind the label in the world.
pub fn bake_lines_image(lines: &[LineSpec], cfg: &BakeConfig) -> Image {
    let font = FontRef::try_from_slice(FONT_BYTES).expect("invalid embedded font");
    let pad = cfg.padding as f32;

    // First pass: lay out each line's glyphs and track the bounds. We can't
    // size the buffer until we know the widest line and the total stacked
    // height, so we accumulate positioned glyphs and finalize after.
    struct LaidOut {
        glyphs: Vec<ab_glyph::Glyph>,
        scale: PxScale,
    }
    let mut laid_out: Vec<LaidOut> = Vec::with_capacity(lines.len());
    let mut max_x: f32 = pad;
    let mut y: f32 = pad;

    for line in lines {
        let scale = PxScale::from(line.px_size);
        let scaled = font.as_scaled(scale);
        let ascent = scaled.ascent();
        let descent = scaled.descent();
        let line_height = (ascent - descent).ceil();

        let baseline_y = y + ascent;
        let mut x = pad;
        let mut glyphs = Vec::with_capacity(line.text.chars().count());
        let mut prev_id: Option<ab_glyph::GlyphId> = None;
        for c in line.text.chars() {
            let id = scaled.glyph_id(c);
            if let Some(p) = prev_id {
                x += scaled.kern(p, id);
            }
            let glyph = id.with_scale_and_position(scale, point(x, baseline_y));
            x += scaled.h_advance(id);
            glyphs.push(glyph);
            prev_id = Some(id);
        }

        max_x = max_x.max(x);
        laid_out.push(LaidOut { glyphs, scale });
        y += line_height;
    }

    let (width, height) = match cfg.canvas_size {
        Some((w, h)) => (w, h),
        None => (
            (max_x.ceil() as u32) + cfg.padding,
            (y.ceil() as u32) + cfg.padding,
        ),
    };

    // Pre-fill: opaque background if one was specified, otherwise fully
    // transparent so the glyph composite below builds up alpha from coverage.
    let mut buffer = vec![0u8; (width * height * 4) as usize];
    if let Some(bg) = cfg.background {
        for chunk in buffer.chunks_exact_mut(4) {
            chunk[0] = bg[0];
            chunk[1] = bg[1];
            chunk[2] = bg[2];
            chunk[3] = 255;
        }
    }

    for line in laid_out {
        let scaled = font.as_scaled(line.scale);
        for glyph in line.glyphs {
            let Some(outlined) = scaled.outline_glyph(glyph) else {
                continue;
            };
            let bounds = outlined.px_bounds();
            outlined.draw(|gx, gy, coverage| {
                let px = bounds.min.x as i32 + gx as i32;
                let py = bounds.min.y as i32 + gy as i32;
                if px < 0 || py < 0 || px >= width as i32 || py >= height as i32 {
                    return;
                }
                let idx = ((py as u32 * width + px as u32) * 4) as usize;
                for c in 0..3 {
                    let dst = buffer[idx + c] as f32;
                    let src = cfg.color[c] as f32;
                    let blended = src * coverage + dst * (1.0 - coverage);
                    buffer[idx + c] = blended.round().clamp(0.0, 255.0) as u8;
                }
                // Accumulate alpha for the transparent-background case so
                // overlapping glyph coverage builds up correctly. With an
                // opaque background dst_a is already 1.0 and this is a no-op.
                let dst_a = buffer[idx + 3] as f32 / 255.0;
                let out_a = coverage + dst_a * (1.0 - coverage);
                buffer[idx + 3] = (out_a * 255.0).round().clamp(0.0, 255.0) as u8;
            });
        }
    }

    Image::new(
        Extent3d {
            width,
            height,
            depth_or_array_layers: 1,
        },
        TextureDimension::D2,
        buffer,
        TextureFormat::Rgba8UnormSrgb,
        RenderAssetUsages::default(),
    )
}

/// In-world label rendered as a billboarded textured quad. The quad is sized
/// once at spawn time from `world_height` and the texture's aspect ratio; the
/// billboard system orients it to face the camera each frame.
///
/// `keep_apparent_size` toggles between two behaviors:
/// - `false`: pure perspective — text shrinks naturally with distance, the
///   "stuck to the world" feel.
/// - `true`: the quad is scaled to keep the same on-screen size regardless of
///   distance, matching the old `WorldLabel` UX. Useful when readability
///   matters more than spatial honesty (e.g., station names from across the
///   map).
#[derive(Component)]
pub struct BakedLabel {
    pub anchor: Vec3,
    // Stored on the component for future systems that need to compute screen
    // bounds (e.g., a hover-to-highlight overlay), even though the spawn
    // function already bakes it into the mesh size.
    #[allow(dead_code)]
    pub world_height: f32,
    pub keep_apparent_size: bool,
    /// Distance at which the label renders at its natural size when
    /// `keep_apparent_size` is `true`. Unused otherwise.
    pub reference_distance: f32,
}

pub struct BakedLabelPlugin;

impl Plugin for BakedLabelPlugin {
    fn build(&self, app: &mut App) {
        // PostUpdate after Bevy's transform / camera systems so we read final
        // camera position this frame, same slot WorldLabel uses.
        app.add_systems(PostUpdate, billboard_baked_labels);
    }
}

/// Spawn a label with sensible defaults. Returns the entity so the caller can
/// attach marker components (e.g. `StationNameLabel`) or visibility overrides.
pub fn spawn_baked_label(
    commands: &mut Commands,
    meshes: &mut Assets<Mesh>,
    materials: &mut Assets<StandardMaterial>,
    images: &mut Assets<Image>,
    text: &str,
    cfg: &BakeConfig,
    anchor: Vec3,
    world_height: f32,
    keep_apparent_size: bool,
) -> Entity {
    let image = bake_text_image(text, cfg);
    let aspect = image.width() as f32 / image.height() as f32;
    let world_width = world_height * aspect;
    let texture = images.add(image);

    let mat = materials.add(StandardMaterial {
        base_color_texture: Some(texture),
        alpha_mode: AlphaMode::Blend,
        double_sided: true,
        cull_mode: None,
        ..default()
    });

    // `Rectangle::new(w, h)` produces a mesh on the XY plane with normal +Z,
    // which is the canonical billboard orientation in Bevy.
    let mesh = meshes.add(Rectangle::new(world_width, world_height));

    commands
        .spawn((
            Mesh3d(mesh),
            MeshMaterial3d(mat),
            Transform::from_translation(anchor),
            BakedLabel {
                anchor,
                world_height,
                keep_apparent_size,
                reference_distance: 8.0,
            },
            NotShadowCaster,
        ))
        .id()
}

/// Spawn a flat label that lies on a horizontal surface (XZ plane) rather
/// than billboarding. Used for "page" content like the catalog book, where
/// the text reads as printed on the surface and shouldn't rotate to face the
/// camera.
///
/// `anchor` is the world position of the decal's center; `world_width` is its
/// X extent. The Z extent (depth on the surface) follows from the texture
/// aspect ratio. The mesh is a Rectangle (XY plane) rotated -90° around X so
/// the texture's top maps to the surface's -Z edge (= "top of page" when
/// viewed from a camera looking down from +Z).
pub fn spawn_baked_decal(
    commands: &mut Commands,
    meshes: &mut Assets<Mesh>,
    materials: &mut Assets<StandardMaterial>,
    images: &mut Assets<Image>,
    image: Image,
    anchor: Vec3,
    world_width: f32,
) -> Entity {
    let aspect = image.width() as f32 / image.height() as f32;
    let world_depth = world_width / aspect;
    let texture = images.add(image);

    let mat = materials.add(StandardMaterial {
        base_color_texture: Some(texture),
        alpha_mode: AlphaMode::Blend,
        ..default()
    });

    let mesh = meshes.add(Rectangle::new(world_width, world_depth));
    let transform = Transform::from_translation(anchor)
        .with_rotation(Quat::from_rotation_x(-std::f32::consts::FRAC_PI_2));

    commands
        .spawn((
            Mesh3d(mesh),
            MeshMaterial3d(mat),
            transform,
            NotShadowCaster,
        ))
        .id()
}

/// Yaw-only billboarding: labels rotate around the world Y axis to face the
/// camera but never tilt, so text stays upright regardless of camera pitch.
/// Optionally scales the quad so its apparent size is distance-independent.
fn billboard_baked_labels(
    camera_q: Query<&GlobalTransform, (With<Camera>, Without<BakedLabel>)>,
    mut labels: Query<(&mut Transform, &BakedLabel)>,
) {
    let Ok(cam_tf) = camera_q.single() else {
        return;
    };
    let cam_pos = cam_tf.translation();

    for (mut tf, label) in &mut labels {
        tf.translation = label.anchor;

        let mut to_camera = cam_pos - label.anchor;
        to_camera.y = 0.0;
        let flat = to_camera.normalize_or_zero();
        if flat.length_squared() > 0.0 {
            // Quad's +Z should point at the camera, i.e. -Z (Bevy "forward")
            // points away. `look_to` aligns forward with the given direction.
            tf.look_to(-flat, Vec3::Y);
        }

        if label.keep_apparent_size {
            let distance = cam_pos.distance(label.anchor).max(0.001);
            let s = distance / label.reference_distance;
            tf.scale = Vec3::splat(s);
        } else {
            tf.scale = Vec3::ONE;
        }
    }
}
