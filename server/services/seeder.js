let client;

const getClient = async () => {
  if (!client) {
    const { default: WebTorrent } = await import('webtorrent');
    client = new WebTorrent();
  }
  return client;
};

const seedFile = async (filePath) => {
  const client = await getClient();
  return new Promise((resolve, reject) => {
    client.seed(filePath, (torrent) => {
      console.log('Seeding:', torrent.infoHash);
      resolve(torrent);
    });
  });
};

const reseedAll = async (torrents) => {
  console.log('Reseeding all torrents...');
  const path = require('path');
  for (const torrent of torrents) {
    if (torrent.storedFilename) {
      const filePath = path.join(__dirname, '../uploads', torrent.storedFilename);
      try {
        await seedFile(filePath);
        console.log(`Reseeded: ${torrent.title}`);
      } catch (err) {
        console.error(`Failed to reseed ${torrent.title}:`, err.message);
      }
    }
  }
};

module.exports = {
  seedFile,
  getClient,
  reseedAll
};
