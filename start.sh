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
echo "[1/3] Checking prerequisites..."
node doctor.mjs 2>/dev/null | grep -E "✓|✗"
echo ""

# 2. Start local dashboard in background
echo "[2/3] Starting local dashboard..."

# Kill any existing dashboard on port 3000
EXISTING_PID=$(lsof -ti :3000 2>/dev/null)
if [ -n "$EXISTING_PID" ]; then
  echo "      Stopping previous dashboard (PID: $EXISTING_PID)..."
  kill $EXISTING_PID 2>/dev/null
  sleep 1
fi

cd web-dashboard
npm run dev &>/dev/null &
DASHBOARD_PID=$!
cd ..

# Wait for dashboard to actually be ready (up to 15s)
echo -n "      Waiting for dashboard"
for i in $(seq 1 15); do
  if curl -s -o /dev/null http://localhost:3000 2>/dev/null; then
    echo " ✓"
    break
  fi
  echo -n "."
  sleep 1
done

open "http://localhost:3000" 2>/dev/null || true
echo "      Dashboard: http://localhost:3000 (PID: $DASHBOARD_PID)"

# Cleanup dashboard on exit
trap "kill $DASHBOARD_PID 2>/dev/null; echo ''; echo 'Dashboard stopped.'" EXIT

# 3. Show pipeline status
echo ""
echo "[3/3] Pipeline status:"
if [ -f "data/applications.md" ]; then
  TOTAL=$(grep -c "^|" data/applications.md 2>/dev/null || echo 0)
  TOTAL=$((TOTAL - 2))
  [ "$TOTAL" -lt 0 ] && TOTAL=0
  echo "      Applications: $TOTAL"
  echo "      Reports:      $(ls reports/*.md 2>/dev/null | wc -l | tr -d ' ')"
  echo "      PDFs:         $(ls output/*.pdf 2>/dev/null | wc -l | tr -d ' ')"
else
  echo "      No applications yet. Paste a job URL to start!"
fi

echo ""
echo "--------------------------------------"
echo "  Paste a job URL     → evaluate it"
echo "  /career-ops scan    → search portals"
echo "  /career-ops pdf     → generate CV"
echo "  /career-ops tracker → view pipeline"
echo "--------------------------------------"
echo "  Dashboard auto-refreshes at localhost:3000"
echo "--------------------------------------"
echo ""

if command -v claude &>/dev/null; then
  claude
else
  echo "⚠ 'claude' not found in PATH. Open a terminal and run: claude"
  echo "  Press any key to exit..."
  read -n 1
fi
