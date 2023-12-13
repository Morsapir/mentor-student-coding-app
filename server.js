// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const mentors = [];
const students = [];

app.use(express.static('public'));

// Add this function to handle room creation
function createRoom(socket, roomName) {
  socket.join(roomName);
  socket.emit('role', 'mentor');
  mentors.push({ socket, roomName });
}

app.get('/code-block/:blockType', (req, res) => {
  const blockType = req.params.blockType;
  res.sendFile(__dirname + `/public/code-block/${blockType}.html`);
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
  if (mentors.length === 0) {
    createRoom(socket, 'lobby');
  } else if (students.length === 0) {
    const mentor = mentors[0];
    createRoom(socket, mentor.roomName);
    mentor.socket.emit('studentConnected');
  } else {
    socket.emit('role', 'spectator');
  }

  socket.on('codeChange', (code) => {
    // Broadcast code changes to all clients in the same room
    io.to(socket.roomName).emit('codeChange', code);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
