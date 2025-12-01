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

module.exports = {
  seedFile,
  getClient,
};
