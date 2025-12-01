const mongoose = require('mongoose');

const torrentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  infoHash: {
    type: String,
    required: true,
    unique: true,
  },
  magnetURI: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  storedFilename: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    default: 'other',
  },
  uploadedBy: {
    type: String, // Could be user ID or 'anonymous'
    default: 'anonymous',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Torrent', torrentSchema);
