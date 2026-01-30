const express = require('express');
const router = express.Router();
const Torrent = require('../models/Torrent');
// const multer = require('multer'); // No longer needed for file uploads
// const path = require('path'); // No longer needed for file paths
const { /* seedFile, DOWNLOAD_PATH */ } = require('../services/torrentSeeder'); // Destructure what's needed, if anything, after seeder changes

module.exports = function(io) {
  // Multer configuration for file upload is removed as server will not store physical files
  // const storage = multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null, DOWNLOAD_PATH);
  //   },
  //   filename: (req, file, cb) => {
  //     cb(null, file.originalname);
  //   }
  // });
  // const upload = multer({ storage: storage });

  // Upload Route (Metadata only - client creates torrent and provides magnetURI)
  router.post('/upload', async (req, res) => { // Removed upload.single('file')
    try {
      const { title, description, category, magnetURI, infoHash, fileName, fileSize } = req.body;

      if (!magnetURI || !infoHash || !title || !fileName || !fileSize) { // fileName and fileSize are now required metadata
        return res.status(400).json({ error: 'Missing required metadata fields' });
      }

      // Check if torrent already exists
      let torrent = await Torrent.findOne({ infoHash });

      if (torrent) {
        // Update existing torrent metadata (if necessary, though for zero-knowledge, re-uploading metadata might imply a new intent)
        torrent.title = title;
        torrent.description = description;
        torrent.category = category || 'other';
        torrent.magnetURI = magnetURI;
        torrent.fileName = fileName; // Update if changed
        torrent.fileSize = fileSize; // Update if changed
        torrent.uploadedBy = 'anonymous'; // Keep anonymous for now

        await torrent.save();

        io.emit('torrent:update', torrent); // Notify clients of update

        return res.status(200).json({
          message: 'Torrent metadata updated',
          torrent: torrent,
        });
      }

      // Create New Torrent Record with metadata provided by client
      const newTorrent = new Torrent({
        title,
        description,
        category: category || 'other',
        magnetURI,
        infoHash,
        fileName: fileName,
        fileSize: fileSize,
        seeders: 0, // Server is not a seeder
        leechers: 0,
        uploadedBy: 'anonymous',
      });

      await newTorrent.save();

      io.emit('torrent:new', newTorrent); // Notify clients of new torrent

      res.status(201).json({
        message: 'Torrent metadata saved',
        torrent: newTorrent,
      });
    } catch (err) {
      console.error('Error saving torrent metadata:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });


  // Get All Torrents
  router.get('/', async (req, res) => {
    try {
      const torrents = await Torrent.find().sort({ createdAt: -1 });
      res.json(torrents);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch torrents' });
    }
  });

  // Get Single Torrent
  router.get('/:id', async (req, res) => {
    try {
      const torrent = await Torrent.findById(req.params.id);
      if (!torrent) {
        return res.status(404).json({ error: 'Torrent not found' });
      }
      res.json(torrent);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch torrent' });
    }
  });

  return router;
};
