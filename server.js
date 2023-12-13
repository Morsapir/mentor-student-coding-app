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

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket) => {
  if (mentors.length === 0) {
    mentors.push(socket);
    socket.emit('role', 'mentor');
  } else if (students.length === 0) {
    students.push(socket);
    socket.emit('role', 'student');
    mentors[0].emit('studentConnected');
  } else {
    socket.emit('role', 'spectator');
  }

  socket.on('codeChange', (code) => {
    if (students.includes(socket)) {
      mentors[0].emit('codeChange', code);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
