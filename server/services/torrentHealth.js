const Torrent = require('../models/Torrent');

const getTorrentStats = async (infoHash, announce) => {
  const { default: Client } = await import('bittorrent-tracker');
  
  return new Promise((resolve) => {
    const opts = {
      infoHash: infoHash,
      announce: announce,
      peerId: Buffer.from('01234567890123456789'), // Dummy peerId
      port: 6881,
      wrtc: null // Disable WebRTC
    };

    const client = new Client(opts);
    
    let maxSeeders = 0;
    let maxLeechers = 0;
    let responded = false;

    client.on('error', () => {}); // Suppress errors

    client.on('scrape', (data) => {
      if (data.complete > maxSeeders) maxSeeders = data.complete;
      if (data.incomplete > maxLeechers) maxLeechers = data.incomplete;
      responded = true;
    });

    client.scrape();

    // Wait for a few seconds to gather responses from multiple trackers
    setTimeout(() => {
      client.destroy();
      if (responded) {
        resolve({ seeders: maxSeeders, leechers: maxLeechers });
      } else {
        resolve(null);
      }
    }, 5000);
  });
};

const checkTorrents = async (io) => {
  try {
    // Dynamic import for ESM-only package
    const magnetModule = await import('magnet-uri');
    const decode = magnetModule.decode || magnetModule.default;

    const torrents = await Torrent.find({});
    
    for (const torrent of torrents) {
      const parsed = decode(torrent.magnetURI);
      const trackers = parsed.announce || [];
      
      // Filter out websocket trackers to prevent WebRTC polyfill issues
      const httpTrackers = trackers.filter(t => !t.startsWith('ws://') && !t.startsWith('wss://'));

      if (httpTrackers.length === 0) continue;

      const stats = await getTorrentStats(torrent.infoHash, httpTrackers);
      
      if (stats) {
        // Only update if we got a valid response
        // If stats are 0, it might be a failure to scrape, or actually 0.
        // But if responded is true, it means we got a response.
        
        // DO NOT DELETE dead torrents for now, just update stats
        /*
        if (stats.seeders === 0) {
          console.log(`Deleting dead torrent: ${torrent.title} (${torrent._id})`);
          await Torrent.findByIdAndDelete(torrent._id);
          io.emit('torrent-deleted', torrent._id);
        } else {
        */
        if (true) {
          // Update if changed
          if (torrent.seeders !== stats.seeders || torrent.leechers !== stats.leechers) {
            torrent.seeders = stats.seeders;
            torrent.leechers = stats.leechers;
            await torrent.save();
            
            io.emit('torrent-updated', {
              _id: torrent._id,
              seeders: torrent.seeders,
              leechers: torrent.leechers
            });
          }
        }
        // }
      }
    }
  } catch (err) {
    console.error('Error in health check:', err);
  }
};

module.exports = { checkTorrents };
