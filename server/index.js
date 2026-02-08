require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

const { MongoMemoryServer } = require('mongodb-memory-server');

// Database Connection & Server Start
const startServer = async () => {
  try {
    // 1. Start MongoDB
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    console.log('Starting in-memory MongoDB for Zero-Knowledge architecture at:', uri);

    await mongoose.connect(uri);
    console.log('Connected to In-Memory MongoDB');

    // 2. WebRTC Signaling via Socket.IO
    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
        // Notify others in room that a new peer joined
        socket.to(roomId).emit('peer-joined', { peerId: socket.id });
      });

      socket.on('signal', (data) => {
        // data: { target: peerId, signal: signalData }
        io.to(data.target).emit('signal', {
          sender: socket.id,
          signal: data.signal
        });
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
    // 4. Start HTTP Server
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Socket.IO signaling ready`);
    });

  } catch (err) {
    console.error('Server startup error:', err);
  }
};

startServer();

// Routes
const torrentRoutes = require('./routes/torrentRoutes')(io);
app.use('/api/torrents', torrentRoutes);

app.get('/', (req, res) => {
  res.send('Open Archive Collective API is running');
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', (reason) => {
    console.log('Client disconnected:', socket.id, 'Reason:', reason);
  });
});
