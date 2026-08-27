#!/usr/bin/env bash
echo "==================================================="
echo "  Starting DHARA AI Backend & Frontend Servers"
echo "==================================================="

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# 1. Start Backend Server
cd "$SCRIPT_DIR/backend"
if [ -d "venv" ]; then
    source venv/bin/activate
fi
python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload &
BACKEND_PID=$!

# 2. Start Frontend Server
cd "$SCRIPT_DIR/frontend"
npm run dev -- --port 5173 &
FRONTEND_PID=$!

echo ""
echo "🚀 DHARA AI is running!"
echo "► Backend API:  http://127.0.0.1:8000"
echo "► Frontend UI:   http://localhost:5173"
echo "► API Specs:     http://127.0.0.1:8000/docs"
echo "Press Ctrl+C to stop all servers."

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM
wait
