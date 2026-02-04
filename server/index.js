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

// Database Connection
const startServer = async () => {
  try {
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    console.log('Starting in-memory MongoDB for Zero-Knowledge architecture at:', uri);

    await mongoose.connect(uri);
    console.log('Connected to In-Memory MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
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

// Start Server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
