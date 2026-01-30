require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
// const { checkTorrents } = require('./services/torrentHealth'); // Removed
// const { restoreTorrents } = require('./services/torrentSeeder'); // Removed
// const Torrent = require('./models/Torrent'); // Removed as no longer used in index.js

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

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Server no longer restores torrents or performs health checks
    // restoreTorrents(Torrent); // Removed
    // setInterval(() => { // Removed
    //   checkTorrents(io); // Removed
    // }, 60000); // Removed
    // checkTorrents(io); // Removed
  })
  .catch((err) => console.error('MongoDB connection error:', err));

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
