#!/bin/bash

# =============================================================================
# CDN Video Manager
# Sync local cdn/videos/ folder to OCI Object Storage
# =============================================================================

BUCKET="zerogravity-static"
CDN_PREFIX="videos"
LOCAL_DIR="cdn/videos"
MANIFEST="${LOCAL_DIR}/manifest.json"
CONTENT_TYPE_JSON="application/json"
CONTENT_TYPE_VIDEO="video/mp4"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# -----------------------------------------------------------------------------
# Helper functions
# -----------------------------------------------------------------------------

print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }
print_info() { echo -e "${YELLOW}→${NC} $1"; }
print_skip() { echo -e "${CYAN}–${NC} $1"; }

check_oci() {
  if ! command -v oci &> /dev/null; then
    print_error "OCI CLI not installed. Run: brew install oci-cli"
    exit 1
  fi
  if ! oci os ns get &> /dev/null; then
    print_error "OCI CLI not configured. Run: oci setup config"
    exit 1
  fi
}

# -----------------------------------------------------------------------------
# Commands
# -----------------------------------------------------------------------------

# Sync local folder to CDN (new videos only + manifest always)
cmd_sync() {
  check_oci

  if [ ! -d "$LOCAL_DIR" ]; then
    print_error "Local folder not found: $LOCAL_DIR"
    exit 1
  fi

  if [ ! -f "$MANIFEST" ]; then
    print_error "manifest.json not found in $LOCAL_DIR"
    exit 1
  fi

  # Get list of existing videos on CDN
  print_info "Checking CDN for existing videos..."
  local cdn_files
  cdn_files=$(oci os object list \
    --bucket-name "$BUCKET" \
    --prefix "${CDN_PREFIX}/" \
    --query "data[].name" \
    --output json 2>/dev/null | node -e "
      const data = JSON.parse(require('fs').readFileSync('/dev/stdin', 'utf8'));
      data.forEach(name => console.log(name.replace('${CDN_PREFIX}/', '')));
    " 2>/dev/null)

  # Upload new video files
  local uploaded=0
  local skipped=0
  for file in "$LOCAL_DIR"/*.mp4; do
    [ -f "$file" ] || continue
    local filename
    filename=$(basename "$file")

    if echo "$cdn_files" | grep -qx "$filename"; then
      print_skip "Already on CDN: ${filename}"
      ((skipped++))
    else
      print_info "Uploading ${filename}..."
      if oci os object put \
        --bucket-name "$BUCKET" \
        --name "${CDN_PREFIX}/${filename}" \
        --file "$file" \
        --content-type "$CONTENT_TYPE_VIDEO" \
        --force > /dev/null 2>&1; then
        print_success "Uploaded ${filename}"
        ((uploaded++))
      else
        print_error "Failed to upload ${filename}"
      fi
    fi
  done

  # Always sync manifest
  print_info "Syncing manifest.json..."
  if oci os object put \
    --bucket-name "$BUCKET" \
    --name "${CDN_PREFIX}/manifest.json" \
    --file "$MANIFEST" \
    --content-type "$CONTENT_TYPE_JSON" \
    --force > /dev/null 2>&1; then
    print_success "Manifest synced"
  else
    print_error "Failed to sync manifest"
    exit 1
  fi

  echo ""
  print_success "Done! Uploaded: ${uploaded}, Skipped: ${skipped}"
}

# List current videos on CDN
cmd_list() {
  check_oci

  print_info "Videos on CDN:"
  oci os object list \
    --bucket-name "$BUCKET" \
    --prefix "${CDN_PREFIX}/" \
    --query "data[?ends_with(name, '.mp4')].{name: name, size: size}" \
    --output table 2>&1
}

# Show current manifest
cmd_show() {
  if [ -f "$MANIFEST" ]; then
    print_info "Local manifest (${MANIFEST}):"
    cat "$MANIFEST"
  else
    print_error "Local manifest not found"
  fi
}

# -----------------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------------

case "${1:-help}" in
  sync)
    cmd_sync
    ;;
  list)
    cmd_list
    ;;
  show)
    cmd_show
    ;;
  *)
    echo "CDN Video Manager"
    echo ""
    echo "Usage:"
    echo "  $0 sync    Sync cdn/videos/ to CDN (new videos + manifest)"
    echo "  $0 list    List videos on CDN"
    echo "  $0 show    Show local manifest"
    echo ""
    echo "Workflow:"
    echo "  1. Put .mp4 files in cdn/videos/"
    echo "  2. Edit cdn/videos/manifest.json"
    echo "  3. Run: pnpm cdn:sync"
    ;;
esac
