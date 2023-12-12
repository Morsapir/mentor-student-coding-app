// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

const codeBlocks = [
  { title: 'Array', code: 'const array = [];' },
  { title: 'Matrix', code: 'const matrix = [[]];' },
  { title: 'Turn', code: 'function turn() {}' },
];

let mentorConnected = false;

io.on('connection', (socket) => {
  // Handle mentor and student connections
  if (!mentorConnected) {
    socket.emit('mentor-connected', codeBlocks);
    mentorConnected = true;
  } else {
    socket.emit('student-connected');
  }

  // Handle code changes
  socket.on('code-changed', (newCode) => {
    io.emit('update-code', newCode);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
