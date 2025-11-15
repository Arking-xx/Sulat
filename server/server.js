const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const { frontendUrl } = require('./config.js');

const server = http.createServer(app);

const PORT = 3000;

const io = new Server(server, {
  cors: {
    origin: frontendUrl,
  },
});

io.on('connection', (socket) => {
  socket.on('send_message', (data) => {
    socket.broadcast.emit('receive_message', {
      message: data.message,
      userId: data.userId,
      userName: data.userName,
      userImage: data.userImage,
      timestamp: new Date().toISOString(),
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`socket server running on ${PORT}`);
});
