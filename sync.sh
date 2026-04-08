#!/bin/bash
# Sync local data to GitHub (triggers Vercel rebuild)
# Usage: ./sync.sh or run from Claude: ! ./sync.sh

set -e
cd "$(dirname "$0")"

echo "Syncing Job Search data to GitHub..."
echo ""

# Show what changed
echo "Changes:"
git status --short data/ reports/ config/ cv.md web-dashboard/ 2>/dev/null
echo ""

# Stage data files
git add \
  data/applications.md \
  data/pipeline.md \
  reports/*.md \
  config/profile.yml \
  modes/_profile.md \
  portals.yml \
  cv.md \
  web-dashboard/ \
  batch/tracker-additions/ \
  2>/dev/null || true

# Count changes
CHANGES=$(git diff --cached --numstat | wc -l | tr -d ' ')

if [ "$CHANGES" -eq 0 ]; then
  echo "No changes to sync."
  exit 0
fi

# Get summary for commit message
APPS=$(grep -c "^|" data/applications.md 2>/dev/null || echo 0)
APPS=$((APPS - 2))
[ "$APPS" -lt 0 ] && APPS=0
REPORTS=$(ls reports/*.md 2>/dev/null | wc -l | tr -d ' ')
PDFS=$(ls output/*.pdf 2>/dev/null | wc -l | tr -d ' ')

# Auto-commit
DATE=$(date +%Y-%m-%d)
git commit -m "Sync: ${APPS} applications, ${REPORTS} reports, ${PDFS} PDFs (${DATE})"

# Push
git push origin main

echo ""
echo "Synced! Vercel will auto-rebuild the dashboard."
echo "  Applications: $APPS"
echo "  Reports: $REPORTS"
echo "  PDFs: $PDFS"
