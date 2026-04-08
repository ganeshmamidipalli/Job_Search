#!/bin/bash
# Job Search Pipeline Launcher
# Usage: ./start.sh

set -e
cd "$(dirname "$0")"

echo "======================================"
echo "  Ganesh's Job Search Pipeline"
echo "======================================"
echo ""

# 1. Check setup
echo "[1/4] Checking prerequisites..."
node doctor.mjs 2>/dev/null | grep -E "✓|✗" | head -5
echo ""

# 2. Open dashboard in browser (local dev server or Vercel URL)
VERCEL_URL=""
if [ -f ".vercel-url" ]; then
  VERCEL_URL=$(cat .vercel-url)
fi

if [ -n "$VERCEL_URL" ]; then
  echo "[2/4] Opening dashboard: $VERCEL_URL"
  open "$VERCEL_URL" 2>/dev/null || true
else
  echo "[2/4] Opening local dashboard..."
  cd web-dashboard
  npm run dev &>/dev/null &
  DASHBOARD_PID=$!
  sleep 3
  open "http://localhost:3000" 2>/dev/null || true
  cd ..
  echo "      Dashboard running at http://localhost:3000 (PID: $DASHBOARD_PID)"
fi

# 3. Show current pipeline status
echo ""
echo "[3/4] Pipeline status:"
if [ -f "data/applications.md" ]; then
  TOTAL=$(grep -c "^|" data/applications.md 2>/dev/null || echo 0)
  TOTAL=$((TOTAL - 2))  # subtract header rows
  [ "$TOTAL" -lt 0 ] && TOTAL=0
  echo "      Total applications tracked: $TOTAL"
  echo "      Reports: $(ls reports/*.md 2>/dev/null | wc -l | tr -d ' ')"
  echo "      PDFs: $(ls output/*.pdf 2>/dev/null | wc -l | tr -d ' ')"
else
  echo "      No applications yet. Start by pasting a job URL!"
fi

# 4. Launch Claude Code
echo ""
echo "[4/4] Starting Claude Code..."
echo ""
echo "--------------------------------------"
echo "  COMMANDS:"
echo "  - Paste a job URL to evaluate"
echo "  - /career-ops scan    → search portals"
echo "  - /career-ops pdf     → generate CV"
echo "  - /career-ops tracker → view pipeline"
echo "  - Type 'sync' to push updates to Vercel"
echo "--------------------------------------"
echo ""

claude
