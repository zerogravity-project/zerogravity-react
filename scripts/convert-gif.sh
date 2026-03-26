#!/bin/bash

# Convert MP4 files to GIF for README screenshots
#
# Usage:
#   ./scripts/convert-gif.sh                        # Convert all (desktop + mobile)
#   ./scripts/convert-gif.sh desktop                 # Convert all desktop
#   ./scripts/convert-gif.sh mobile                  # Convert all mobile
#   ./scripts/convert-gif.sh desktop home chart      # Convert specific desktop files
#   ./scripts/convert-gif.sh mobile home             # Convert specific mobile files
#
# Desktop MP4 naming: s0_{name}.mp4 -> {name}-desktop.gif
# Mobile MP4 naming:  {name}.mp4    -> {name}-mobile.gif

set -e

FPS=15
MAX_COLORS=128
DESKTOP_WIDTH=800
MOBILE_WIDTH=332

convert_to_gif() {
  local mp4_file="$1"
  local gif_file="$2"
  local width="$3"

  echo "Converting: $(basename "$mp4_file") -> $(basename "$gif_file")"
  ffmpeg -i "$mp4_file" \
    -vf "fps=${FPS},scale=${width}:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=${MAX_COLORS}[p];[s1][p]paletteuse=dither=bayer:bayer_scale=3" \
    -loop 0 "$gif_file" -y -loglevel warning

  local size
  size=$(du -h "$gif_file" | cut -f1)
  echo "  Done: $size"
}

convert_desktop() {
  local mp4_dir=".github/assets/desktop/mp4"
  local gif_dir=".github/assets/desktop/gif"
  mkdir -p "$gif_dir"

  if [ $# -eq 0 ]; then
    for mp4_file in "$mp4_dir"/*.mp4; do
      [ -f "$mp4_file" ] || continue
      local base_name
      base_name=$(basename "$mp4_file" .mp4 | sed 's/^s0_//')
      convert_to_gif "$mp4_file" "${gif_dir}/${base_name}-desktop.gif" "$DESKTOP_WIDTH"
    done
  else
    for name in "$@"; do
      local mp4_file="${mp4_dir}/s0_${name}.mp4"
      if [ -f "$mp4_file" ]; then
        convert_to_gif "$mp4_file" "${gif_dir}/${name}-desktop.gif" "$DESKTOP_WIDTH"
      else
        echo "Not found: $mp4_file"
      fi
    done
  fi
}

convert_mobile() {
  local mp4_dir=".github/assets/mobile/mp4"
  local gif_dir=".github/assets/mobile/gif"
  mkdir -p "$gif_dir"

  if [ $# -eq 0 ]; then
    for mp4_file in "$mp4_dir"/*.mp4; do
      [ -f "$mp4_file" ] || continue
      local base_name
      base_name=$(basename "$mp4_file" .mp4)
      convert_to_gif "$mp4_file" "${gif_dir}/${base_name}-mobile.gif" "$MOBILE_WIDTH"
    done
  else
    for name in "$@"; do
      local mp4_file="${mp4_dir}/${name}.mp4"
      if [ -f "$mp4_file" ]; then
        convert_to_gif "$mp4_file" "${gif_dir}/${name}-mobile.gif" "$MOBILE_WIDTH"
      else
        echo "Not found: $mp4_file"
      fi
    done
  fi
}

case "${1:-all}" in
  desktop)
    shift
    convert_desktop "$@"
    ;;
  mobile)
    shift
    convert_mobile "$@"
    ;;
  all)
    convert_desktop
    convert_mobile
    ;;
  *)
    echo "Usage: $0 [desktop|mobile|all] [name1 name2 ...]"
    exit 1
    ;;
esac

echo "All done!"
