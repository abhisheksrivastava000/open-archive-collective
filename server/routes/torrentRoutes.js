const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const createTorrent = require('create-torrent');
const parseTorrent = require('parse-torrent');
const Torrent = require('../models/Torrent');
const { seedFile } = require('../services/seeder');

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    fs.ensureDirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Keep original filename but prepend timestamp to avoid collisions
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Upload Route
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const { title, description, category } = req.body;

    // 1. Create Torrent File Buffer
    const opts = {
      urlList: [`http://localhost:5001/uploads/${path.basename(filePath)}`]
    };

    createTorrent(filePath, opts, async (err, torrentBuffer) => {
      if (err) {
        console.error('Error creating torrent:', err);
        return res.status(500).json({ error: 'Failed to create torrent' });
      }

      // 2. Parse torrent to get metadata
      const parsedTorrent = await parseTorrent(torrentBuffer);
      // Reconstruct magnet URI to include web seed (urlList) if parseTorrent doesn't include it automatically in magnet
      // But standard magnet links don't always carry urlList (ws=). We can append it.
      let magnetURI = `magnet:?xt=urn:btih:${parsedTorrent.infoHash}&dn=${encodeURIComponent(parsedTorrent.name)}&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com`;
      
      if (opts.urlList && opts.urlList.length > 0) {
        magnetURI += `&ws=${encodeURIComponent(opts.urlList[0])}`;
      }

      // 3. Seed the file (Server becomes a peer)
      // We seed the file path directly
      seedFile(filePath).then((torrent) => {
          console.log(`Server is seeding: ${torrent.infoHash}`);
      }).catch(err => {
          console.error("Seeding error:", err);
      });

      // 4. Save Metadata to DB
      const newTorrent = new Torrent({
        title: title || req.file.originalname,
        description: description || '',
        infoHash: parsedTorrent.infoHash,
        magnetURI: magnetURI,
        fileName: req.file.originalname,
        storedFilename: req.file.filename,
        fileSize: req.file.size,
        category: category || 'other',
      });

      await newTorrent.save();

      // 5. Return response
      res.status(201).json({
        message: 'File uploaded and torrent created successfully',
        torrent: newTorrent,
      });
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Server error during upload' });
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
