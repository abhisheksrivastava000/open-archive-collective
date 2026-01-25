const path = require('path');
const fs = require('fs-extra');

const DOWNLOAD_PATH = path.join(__dirname, '../downloads');
fs.ensureDirSync(DOWNLOAD_PATH);

let client;

async function getClient() {
  if (client) return client;
  
  try {
    const module = await import('webtorrent');
    const WebTorrent = module.default || module;
    client = new WebTorrent();
    
    client.on('error', (err) => {
      console.error('WebTorrent Client Error:', err);
    });
    
    return client;
  } catch (err) {
    console.error("Failed to load WebTorrent:", err);
    throw err;
  }
}

/**
 * Seeds a file that is already present on the server filesystem.
 * @param {string} filePath - Absolute path to the file
 * @param {Object} metadata - Optional metadata
 */
const seedFile = async (filePath, metadata = {}) => {
  try {
    const c = await getClient();

    return new Promise((resolve, reject) => {
      // Check if the file exists
      if (!fs.existsSync(filePath)) {
        console.warn(`File not found for seeding: ${filePath}`);
        return resolve(null);
      }

      // Check if already being seeded
      const existing = c.torrents.find(t => t.files && t.files.some(f => f.path === filePath));
      if (existing) {
          console.log(`Already seeding: ${existing.infoHash}`);
          return resolve(existing);
      }

      console.log(`Starting seeding for file: ${filePath}`);

      c.seed(filePath, {
        path: DOWNLOAD_PATH,
        announce: [
          "wss://tracker.openwebtorrent.com",
          "wss://tracker.btorrent.xyz",
          "wss://tracker.webtorrent.io",
          "udp://tracker.opentrackr.org:1337/announce",
          "udp://tracker.openbittorrent.com:80/announce",
          "http://tracker.opentrackr.org:1337/announce"
        ]
      }, (torrent) => {
        console.log('Server is seeding:', torrent.infoHash);
        resolve(torrent);
      });
    });
  } catch (error) {
    console.error("Error in seedFile:", error);
    return null;
  }
};

/**
 * Restore seeding for all files found in the database.
 * This assumes files are stored in DOWNLOAD_PATH with their original filenames.
 */
const restoreTorrents = async (TorrentModel) => {
  try {
    await getClient();
    const torrents = await TorrentModel.find({});
    console.log(`Checking ${torrents.length} torrents for restoration...`);
    
    let restoredCount = 0;
    for (const t of torrents) {
      if (t.fileName) {
        const filePath = path.join(DOWNLOAD_PATH, t.fileName);
        if (fs.existsSync(filePath)) {
            await seedFile(filePath, t);
            restoredCount++;
        }
      }
    }
    console.log(`Restored seeding for ${restoredCount} torrents.`);
  } catch (err) {
    console.error('Error restoring torrents:', err);
  }
};

module.exports = {
  client,
  seedFile,
  restoreTorrents,
  DOWNLOAD_PATH
};
