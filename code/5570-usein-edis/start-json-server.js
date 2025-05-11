const { spawn } = require('child_process');
const path = require('path');

// Resolve path to the locally installed json-server
const jsonServerPath = path.join(__dirname, 'node_modules', '.bin', 'json-server');

const jsonServer = spawn(jsonServerPath, [
  '--watch',
  'db/movie-data.json',
  '--port',
  '3000',
], { shell: true }); // shell:true needed for Windows

jsonServer.stdout.on('data', (data) => {
  process.stdout.write(data);
});

jsonServer.stderr.on('data', (data) => {
  process.stderr.write(data);
});

jsonServer.on('close', (code) => {
  console.log(`json-server exited with code ${code}`);
});
