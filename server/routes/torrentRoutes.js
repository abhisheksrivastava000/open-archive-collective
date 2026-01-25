const express = require('express');
const router = express.Router();
const Torrent = require('../models/Torrent');

// Upload Route (Metadata only)
router.post('/upload', async (req, res) => {
  try {
    const { title, description, category, magnetURI, infoHash, fileName, fileSize } = req.body;

    if (!magnetURI || !infoHash || !title) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if torrent already exists
    let torrent = await Torrent.findOne({ infoHash });

    if (torrent) {
      // Update existing torrent metadata
      torrent.title = title;
      torrent.description = description;
      torrent.category = category || 'other';
      torrent.magnetURI = magnetURI;
      torrent.fileName = fileName;
      torrent.fileSize = fileSize;
      torrent.uploadedBy = 'anonymous'; // TODO: Update if auth added
      
      await torrent.save();
      
      return res.status(200).json({
        message: 'Torrent metadata updated successfully',
        torrent: torrent,
      });
    }

    // Create New Torrent Record
    const newTorrent = new Torrent({
      title,
      description,
      category: category || 'other',
      magnetURI,
      infoHash,
      fileName,
      fileSize,
      seeders: 1, // Initial uploader is the first seeder
      leechers: 0,
      uploadedBy: 'anonymous', // TODO: Add user auth
    });

    await newTorrent.save();

    res.status(201).json({
      message: 'Torrent metadata uploaded successfully',
      torrent: newTorrent,
    });
  } catch (err) {
    console.error('Error uploading torrent metadata:', err);
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

module.exports = router;
