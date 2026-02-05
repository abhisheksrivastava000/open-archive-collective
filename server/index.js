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

    // 2. Initialize Tracker (Dynamic Import for ESM support)
    // Import specifically from /server to avoid client-side dependencies and ensure correct export usage
    const { default: TrackerServer } = await import('bittorrent-tracker/server');

    if (!TrackerServer) {
      throw new Error('Could not find Server in bittorrent-tracker/server exports');
    }

    const tracker = new TrackerServer({
      udp: false,
      http: true,
      ws: true,
      stats: true,
    });

    tracker.on('error', (err) => {
      console.error('[Tracker] Error:', err.message);
    });

    tracker.on('warning', (err) => {
      console.warn('[Tracker] Warning:', err.message);
    });

    tracker.on('listening', () => {
      console.log('[Tracker] Listening for peers');
    });

    tracker.on('start', (addr) => {
      console.log('[Tracker] Peer connected:', addr);
    });

    // 3. Attach Tracker to HTTP Server
    server.on('request', (req, res) => {
      if (req.url.startsWith('/announce') || req.url.startsWith('/scrape')) {
        tracker.onHttpRequest(req, res);
      }
    });

    server.on('upgrade', (req, socket, head) => {
      const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;
      if (pathname.startsWith('/socket.io')) return;

      if (pathname === '/' || pathname === '/announce') {
        tracker.onWebSocketConnection(socket);
      }
    });

    // 4. Start HTTP Server
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
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
