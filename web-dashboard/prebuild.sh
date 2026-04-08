#!/bin/bash
# Copies data files into web-dashboard for Vercel deployment
# On Vercel, the parent directory structure doesn't exist
# Locally, lib/data.ts reads from ../; on Vercel it reads from data-snapshot/

set -e

DIR="$(dirname "$0")"
SNAP="$DIR/data-snapshot"

mkdir -p "$SNAP/data" "$SNAP/reports" "$SNAP/config" "$SNAP/modes"

# Core files
cp -f "$DIR/../ganesh-wiki.md" "$SNAP/" 2>/dev/null || true
cp -f "$DIR/../cv.md" "$SNAP/" 2>/dev/null || true
cp -f "$DIR/../article-digest.md" "$SNAP/" 2>/dev/null || true

# Data
cp -f "$DIR/../data/applications.md" "$SNAP/data/" 2>/dev/null || true

# Reports
cp -f "$DIR/../reports/"*.md "$SNAP/reports/" 2>/dev/null || true

# Config
cp -f "$DIR/../config/profile.yml" "$SNAP/config/" 2>/dev/null || true

# Modes (for scoring context)
cp -f "$DIR/../modes/_shared.md" "$SNAP/modes/" 2>/dev/null || true
cp -f "$DIR/../modes/_profile.md" "$SNAP/modes/" 2>/dev/null || true

echo "Data snapshot created at $SNAP"
