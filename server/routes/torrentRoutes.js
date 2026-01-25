const express = require('express');
const router = express.Router();
const Torrent = require('../models/Torrent');
const multer = require('multer');
const path = require('path');
const { seedFile, DOWNLOAD_PATH } = require('../services/torrentSeeder');

// Configure Multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DOWNLOAD_PATH);
  },
  filename: (req, file, cb) => {
    // Keep original filename to match metadata
    cb(null, file.originalname); 
  }
});
const upload = multer({ storage: storage });

// Upload Route (File + Metadata)
router.post('/upload', upload.single('file'), async (req, res) => {
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
      if (fileName) torrent.fileName = fileName;
      if (fileSize) torrent.fileSize = fileSize;
      torrent.uploadedBy = 'anonymous'; 
      
      await torrent.save();

      // Seed if file uploaded
      if (req.file) {
        await seedFile(req.file.path, torrent);
      }
      
      return res.status(200).json({
        message: 'Torrent updated and seeding initiated',
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
      fileName: fileName || (req.file ? req.file.originalname : 'unknown'),
      fileSize: fileSize || (req.file ? req.file.size : 0),
      seeders: 1, 
      leechers: 0,
      uploadedBy: 'anonymous', 
    });

    await newTorrent.save();

    // Seed if file uploaded
    if (req.file) {
      await seedFile(req.file.path, newTorrent);
    }

    res.status(201).json({
      message: 'Torrent uploaded and seeding initiated',
      torrent: newTorrent,
    });
  } catch (err) {
    console.error('Error uploading torrent:', err);
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
