#!/usr/bin/env bash
# Build the WASM bundle and place output in pkg/.
#
# Usage:
#   ./build-wasm.sh           # debug build (fast compile, large output, no wasm-opt)
#   ./build-wasm.sh --release # release build (slow compile, small output)
#   ./build-wasm.sh --release --opt  # release + wasm-opt size pass

set -euo pipefail

PROFILE="dev"
PROFILE_DIR="debug"
RUN_WASM_OPT=0

for arg in "$@"; do
  case "$arg" in
    --release) PROFILE="release"; PROFILE_DIR="release" ;;
    --opt)     RUN_WASM_OPT=1 ;;
    *) echo "Unknown arg: $arg"; exit 1 ;;
  esac
done

echo "▶ Building (profile: $PROFILE)…"

# Step 1: cargo build for wasm target.
# Important: only the library is built — main.rs is for native.
if [ "$PROFILE" = "release" ]; then
  cargo build --release --target wasm32-unknown-unknown --lib
else
  cargo build --target wasm32-unknown-unknown --lib
fi

# Step 2: wasm-bindgen to generate JS glue.
# --target web   = ES module output (works with <script type="module">)
# --no-typescript = skip .d.ts files (we don't need them)
echo "▶ Running wasm-bindgen…"
mkdir -p pkg
wasm-bindgen \
  --target web \
  --no-typescript \
  --out-dir pkg \
  --out-name rustgame \
  "target/wasm32-unknown-unknown/${PROFILE_DIR}/rustgame.wasm"

# Step 3 (optional): wasm-opt for size.
if [ "$RUN_WASM_OPT" = "1" ]; then
  if command -v wasm-opt &> /dev/null; then
    echo "▶ Running wasm-opt -Oz…"
    wasm-opt -Oz --strip-debug --output pkg/rustgame_bg.wasm.opt pkg/rustgame_bg.wasm
    mv pkg/rustgame_bg.wasm.opt pkg/rustgame_bg.wasm
  else
    echo "⚠ wasm-opt not found; skipping. Install with: cargo install wasm-opt"
  fi
fi

# Report final size.
WASM_SIZE=$(du -h pkg/rustgame_bg.wasm | cut -f1)
echo "✓ Done. WASM bundle: $WASM_SIZE → pkg/rustgame_bg.wasm"
