#!/bin/bash

# Lighthouse All Pages Measurement Script
# Measures all 15 pages × 2 viewports = 30 measurements

BASE_URL="${1:-https://dev.zerogv.com}"
OUTPUT_DIR="docs/metrics/before"
HEADERS_FILE="/tmp/lh-headers.json"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "Lighthouse All Pages Measurement"
echo "Base URL: $BASE_URL"
echo "Output: $OUTPUT_DIR"
echo "=========================================="

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Public pages (no auth needed)
PUBLIC_PAGES=(
  "home:/"
  "login:/login"
  "terms-service:/terms/service"
  "terms-privacy:/terms/privacy"
  "terms-sensitive-data:/terms/sensitive-data"
  "terms-ai-analysis:/terms/ai-analysis"
)

# Protected pages (auth needed)
PROTECTED_PAGES=(
  "consent:/consent"
  "record:/record"
  "record-daily:/record/daily"
  "record-moment:/record/moment"
  "profile-calendar:/profile/calendar"
  "profile-chart:/profile/chart"
  "profile-settings:/profile/settings"
  "spaceout:/spaceout"
  "spaceout-video:/spaceout/video"
)

# Function to run lighthouse
run_lighthouse() {
  local name=$1
  local path=$2
  local viewport=$3
  local use_auth=$4

  local url="${BASE_URL}${path}"
  local output_file="${OUTPUT_DIR}/lighthouse-${name}-${viewport}.json"

  echo -e "${YELLOW}Measuring: ${name} (${viewport})${NC}"

  local cmd="lighthouse \"$url\" --output json --output-path \"$output_file\" --chrome-flags=\"--headless --no-sandbox\" --only-categories=performance,seo,accessibility,best-practices"

  # Add mobile flags
  if [ "$viewport" = "mobile" ]; then
    cmd="$cmd --form-factor=mobile --screenEmulation.mobile"
  fi

  # Add auth headers for protected pages
  if [ "$use_auth" = "true" ] && [ -f "$HEADERS_FILE" ]; then
    cmd="$cmd --extra-headers \"\$(cat $HEADERS_FILE)\""
  fi

  eval $cmd > /dev/null 2>&1

  if [ -f "$output_file" ]; then
    # Extract scores
    local perf=$(node -e "const d=require('./$output_file'); console.log(Math.round(d.categories.performance.score*100))" 2>/dev/null)
    local seo=$(node -e "const d=require('./$output_file'); console.log(Math.round(d.categories.seo.score*100))" 2>/dev/null)
    local a11y=$(node -e "const d=require('./$output_file'); console.log(Math.round(d.categories.accessibility.score*100))" 2>/dev/null)
    local bp=$(node -e "const d=require('./$output_file'); console.log(Math.round(d.categories['best-practices'].score*100))" 2>/dev/null)
    echo -e "${GREEN}✓ ${name} (${viewport}): Perf=${perf} SEO=${seo} A11y=${a11y} BP=${bp}${NC}"
  else
    echo "✗ Failed: ${name} (${viewport})"
  fi
}

# Measure public pages
echo ""
echo "=========================================="
echo "Public Pages (No Auth)"
echo "=========================================="

for page in "${PUBLIC_PAGES[@]}"; do
  IFS=':' read -r name path <<< "$page"
  run_lighthouse "$name" "$path" "desktop" "false"
  run_lighthouse "$name" "$path" "mobile" "false"
done

# Check if auth headers exist
if [ ! -f "$HEADERS_FILE" ]; then
  echo ""
  echo "=========================================="
  echo "WARNING: No auth headers file found at $HEADERS_FILE"
  echo "Skipping protected pages."
  echo "Create headers file with cookie to measure protected pages."
  echo "=========================================="
  exit 0
fi

# Measure protected pages
echo ""
echo "=========================================="
echo "Protected Pages (With Auth)"
echo "=========================================="

for page in "${PROTECTED_PAGES[@]}"; do
  IFS=':' read -r name path <<< "$page"
  run_lighthouse "$name" "$path" "desktop" "true"
  run_lighthouse "$name" "$path" "mobile" "true"
done

echo ""
echo "=========================================="
echo "Measurement Complete!"
echo "=========================================="

# Generate summary
echo ""
echo "Generating summary..."
node -e "
const fs = require('fs');
const path = require('path');
const dir = './$OUTPUT_DIR';

const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

console.log('');
console.log('| Page | Viewport | Perf | SEO | A11y | BP | LCP | CLS |');
console.log('|------|----------|------|-----|------|-----|-----|-----|');

files.sort().forEach(file => {
  try {
    const data = require('./' + path.join(dir, file));
    const name = file.replace('lighthouse-', '').replace('.json', '');
    const perf = Math.round(data.categories.performance.score * 100);
    const seo = Math.round(data.categories.seo.score * 100);
    const a11y = Math.round(data.categories.accessibility.score * 100);
    const bp = Math.round(data.categories['best-practices'].score * 100);
    const lcp = data.audits['largest-contentful-paint']?.displayValue || 'N/A';
    const cls = data.audits['cumulative-layout-shift']?.displayValue || 'N/A';
    console.log('| ' + name + ' | | ' + perf + ' | ' + seo + ' | ' + a11y + ' | ' + bp + ' | ' + lcp + ' | ' + cls + ' |');
  } catch(e) {}
});
"
