const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..');
const backendDir = path.join(rootDir, 'backend');
const frontendDir = path.join(rootDir, 'frontend');

const isWindows = process.platform === 'win32';

// 1. Locate Python executable in backend venv or system
let pythonCmd = isWindows ? 'python' : 'python3';
const winVenvPython = path.join(backendDir, 'venv', 'Scripts', 'python.exe');
const unixVenvPython = path.join(backendDir, 'venv', 'bin', 'python');

if (isWindows && fs.existsSync(winVenvPython)) {
  pythonCmd = winVenvPython;
} else if (!isWindows && fs.existsSync(unixVenvPython)) {
  pythonCmd = unixVenvPython;
}

console.log('===================================================');
console.log('  🌱 Starting DHARA AI Localhost Servers');
console.log('===================================================');
console.log(`Backend Python:  ${pythonCmd}`);
console.log(`Backend Path:    ${backendDir}`);
console.log(`Frontend Path:   ${frontendDir}`);
console.log('---------------------------------------------------');

// 2. Start Backend Server (Uvicorn)
const backend = spawn(pythonCmd, ['-m', 'uvicorn', 'app.main:app', '--host', '127.0.0.1', '--port', '8000', '--reload'], {
  cwd: backendDir,
  stdio: 'pipe',
  shell: isWindows,
  env: { ...process.env, PYTHONUNBUFFERED: '1' }
});

backend.stdout.on('data', (data) => {
  const line = data.toString().trim();
  if (line) console.log(`[Backend]  ${line}`);
});

backend.stderr.on('data', (data) => {
  const line = data.toString().trim();
  if (line) console.error(`[Backend]  ${line}`);
});

// 3. Start Frontend Server (Vite)
const npmCmd = isWindows ? 'npm.cmd' : 'npm';
const frontend = spawn(npmCmd, ['run', 'dev', '--', '--port', '5173'], {
  cwd: frontendDir,
  stdio: 'pipe',
  shell: isWindows
});

frontend.stdout.on('data', (data) => {
  const line = data.toString().trim();
  if (line) console.log(`[Frontend] ${line}`);
});

frontend.stderr.on('data', (data) => {
  const line = data.toString().trim();
  if (line) console.error(`[Frontend] ${line}`);
});

console.log('\n🚀 DHARA AI is initializing...');
console.log('► Backend API:  http://127.0.0.1:8000');
console.log('► Frontend UI:   http://localhost:5173');
console.log('► API Specs:     http://127.0.0.1:8000/docs');
console.log('\nPress Ctrl+C to terminate both servers.\n');

// 4. Graceful shutdown handler
function cleanExit() {
  console.log('\nShutting down DHARA AI servers...');
  if (backend) backend.kill('SIGINT');
  if (frontend) frontend.kill('SIGINT');
  process.exit(0);
}

process.on('SIGINT', cleanExit);
process.on('SIGTERM', cleanExit);
