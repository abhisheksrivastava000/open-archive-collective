import { useEffect, useState, useRef } from 'react';
import WebTorrent from 'webtorrent';

// Singleton client instance
let client: WebTorrent.Instance | null = null;

export const useWebTorrent = () => {
  const [torrentClient, setTorrentClient] = useState<WebTorrent.Instance | null>(null);

  useEffect(() => {
    const initClient = async () => {
      if (!client) {
        // Dynamically import WebTorrent dist to avoid SSR/Vite issues
        const WebTorrentModule = await import('webtorrent/dist/webtorrent.min.js');
        const WT = WebTorrentModule.default || (WebTorrentModule as any);
        client = new WT({
          tracker: {
            rtcConfig: {
              iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:global.stun.twilio.com:3478' }
              ]
            }
          }
        });
      }
      setTorrentClient(client);
    };

    initClient();

    // Cleanup is tricky with a singleton. 
    // We generally want the client to persist across page navigations 
    // to keep seeding/downloading.
    return () => {
      // Do not destroy client here if we want persistence
    };
  }, []);

  return torrentClient;
};
