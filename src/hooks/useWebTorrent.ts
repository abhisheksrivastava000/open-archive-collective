import { useEffect, useState, useRef } from 'react';
import WebTorrent from 'webtorrent';

// Singleton client instance
let client: WebTorrent.Instance | null = null;

export const useWebTorrent = () => {
  const [torrentClient, setTorrentClient] = useState<WebTorrent.Instance | null>(null);

  useEffect(() => {
    const initClient = async () => {
      if (!client) {
        // Dynamically import WebTorrent to avoid SSR issues if any, 
        // though this is a SPA. It also helps with code splitting.
        const { default: WebTorrent } = await import('webtorrent');
        client = new WebTorrent();
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
