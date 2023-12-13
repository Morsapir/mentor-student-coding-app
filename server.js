// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let mentorSocket = null;
let studentSocket = null;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
  if (!mentorSocket) {
    mentorSocket = socket;
    socket.emit('role', 'mentor');
  } else if (!studentSocket) {
    studentSocket = socket;
    socket.emit('role', 'student');
    mentorSocket.emit('studentConnected');
  } else {
    socket.emit('role', 'spectator');
  }

  socket.on('codeChange', (code) => {
    if (socket === studentSocket) {
      mentorSocket.emit('codeChange', code);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
