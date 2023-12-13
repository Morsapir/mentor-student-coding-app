// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);



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
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  if (mentors.length === 0) {
    createRoom(socket, 'lobby');
  } else if (students.length === 0) {
    const mentor = mentors[0];
    createRoom(socket, mentor.roomName);
    mentor.socket.emit('studentConnected');
  } else {
    socket.emit('role', 'spectator');
  }
 
});

 socket.on('codeChange', (code) => {
  if (role === 'mentor') {
    highlightCode(code);
  }
});

$('.code-editor').on('input', function () {
  const code = $(this).text(); // Use text() to get plain text
  socket.emit('codeChange', code);
  if (role === 'student') {
    highlightCode(code);
  }
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
