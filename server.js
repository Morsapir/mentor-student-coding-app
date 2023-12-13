// server.js
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);



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
    console.log('user disconnected');  });
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

server.listen(8080, () => {
  console.log('listening on *:8080');

});
