const express=require('express');
const http=require('http');
const { Server } = require('socket.io');
const {ServerConfig, Queue}=require('./config');
const apiRoutes=require('./routes');
const scheduleCrons = require('./utils/common/cron-jobs');
const { SocketEmitter } = require('./utils/common');

const app=express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Initialize SocketEmitter singleton
SocketEmitter.setIo(io);

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api',apiRoutes);

io.on('connection', (socket) => {
  console.log(`Socket client connected: ${socket.id}`);
  
  socket.on('joinFlight', (flightId) => {
    socket.join(flightId.toString());
    console.log(`Socket ${socket.id} joined flight room: ${flightId}`);
  });
  
  socket.on('leaveFlight', (flightId) => {
    socket.leave(flightId.toString());
    console.log(`Socket ${socket.id} left flight room: ${flightId}`);
  });

  socket.on('disconnect', () => {
    console.log(`Socket client disconnected: ${socket.id}`);
  });
});

server.listen(ServerConfig.PORT, async () => {
    console.log(`Server is running on port: ${ServerConfig.PORT}`);
    scheduleCrons();
    await Queue.connectQueue();
});