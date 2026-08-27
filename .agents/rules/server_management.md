# Server Execution & Process Management Rules

## STRICT NO-AUTO-START POLICY

1. **NO AUTOMATIC PROCESS STARTUP**:
   - Never automatically start or launch ANY process or service related to this project.
   - Specifically, do NOT start:
     - Vite / `npm run dev` / React development server
     - Python backend / FastAPI / Uvicorn / Flask
     - WebSocket server / background workers / dev watchers
     - Browser preview / browser instances / localhost services
     - Any `.bat`, `.vbs`, `.sh`, or shell script that spawns servers

2. **FORBIDDEN AUTOMATIC TRIGGERS**:
   - The services/processes MUST NEVER be started automatically when:
     - Opening the project or workspace
     - Opening or restarting Antigravity / IDE
     - Modifying, editing, or saving files
     - Running an AI prompt, code generation, or task
     - Switching pages, building, or running linters/tests
     - Completing any task or assistant turn

3. **EXPLICIT USER INVOCATION ONLY**:
   - Servers and processes must ONLY run when the user explicitly and manually starts them (e.g., user runs `npm run dev`, `python -m uvicorn app.main:app`, or clicks/runs a script).
   - If a task involves testing or debugging, do NOT start background servers unless the user explicitly requested to launch the server in that exact instruction.
