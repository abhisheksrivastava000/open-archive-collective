const express = require('express');
const router = express.Router();
const Torrent = require('../models/Torrent');

module.exports = function (io) {
  // Upload Route (Metadata only - client adds file to IPFS and provides cid)
  router.post('/upload', async (req, res) => {
    try {
      console.log('Received upload request:', req.body);
      const { title, description, category, cid, fileName, fileSize } = req.body;

      // Validate required fields (allow fileSize to be 0)
      if (!title || !fileName || fileSize === undefined || fileSize === null || !cid) {
        console.error('Missing required fields:', { title, fileName, fileSize, cid });
        return res.status(400).json({ error: 'Missing required metadata fields' });
      }

      // Check if file already exists by CID
      let torrent = await Torrent.findOne({ cid: cid });

      if (torrent) {
        // Update existing metadata
        torrent.title = title;
        torrent.description = description;
        torrent.category = category || 'other';
        torrent.fileName = fileName; // Update if changed
        torrent.fileSize = fileSize; // Update if changed
        torrent.uploadedBy = 'anonymous'; // Keep anonymous for now

        await torrent.save();

        io.emit('torrent:update', torrent); // Notify clients of update

        return res.status(200).json({
          message: 'File metadata updated',
          torrent: torrent,
        });
      }

      // Create New Record with metadata provided by client
      const newTorrent = new Torrent({
        title,
        description,
        category: category || 'other',
        cid: cid,
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
