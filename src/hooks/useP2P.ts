import { useState, useEffect, useRef, useCallback } from 'react';
import SimplePeer from 'simple-peer';
import { Socket } from 'socket.io-client';

interface P2PState {
  progress: number;
  status: 'idle' | 'connecting' | 'downloading' | 'completed' | 'error';
  error: string | null;
  speed: number;
}

interface FileMeta {
  name: string;
  size: number;
  type: string;
}

export const useP2P = (socket: Socket | null) => {
  const [downloadState, setDownloadState] = useState<P2PState>({
    progress: 0,
    status: 'idle',
    error: null,
    speed: 0
  });
  
  const activePeers = useRef<Map<string, SimplePeer.Instance>>(new Map());
  const chunksRef = useRef<Map<number, Uint8Array>>(new Map());
  const fileMetaRef = useRef<FileMeta | null>(null);
  const seedFileRef = useRef<File | null>(null); // For seeding

  const [seedingId, setSeedingId] = useState<string | null>(null);

  const cleanup = useCallback(() => {
    activePeers.current.forEach(peer => peer.destroy());
    activePeers.current.clear();
    chunksRef.current.clear();
    fileMetaRef.current = null;
    seedFileRef.current = null;
    setSeedingId(null);
    setDownloadState(prev => ({ ...prev, status: 'idle', progress: 0 }));
  }, []);

  // Seeding Effect
  useEffect(() => {
    if (!socket || !seedingId || !seedFileRef.current) return;

    socket.emit('join-room', seedingId);
    console.log(`Joined room ${seedingId} as seeder`);

    const handlePeerJoined = (data: { peerId: string }) => {
        console.log(`New peer wants file: ${data.peerId}`);
        const peer = new SimplePeer({ initiator: true, trickle: false });
        
        // Add to active peers
        activePeers.current.set(data.peerId, peer);

        peer.on('signal', (signalData) => {
            socket.emit('signal', { target: data.peerId, signal: signalData });
        });

        peer.on('connect', () => {
            console.log(`Connected to downloader ${data.peerId}. Sending file...`);
            if (seedFileRef.current) {
                sendFile(peer, seedFileRef.current);
            }
        });
        
        peer.on('error', (err) => console.error('Seeding peer error:', err));
    };

    socket.on('peer-joined', handlePeerJoined);

    return () => {
        socket.off('peer-joined', handlePeerJoined);
        // We generally keep the room join on socket unless we leave explicitly
    };
  }, [socket, seedingId]); // seedingId dependency ensures we setup when seed() is called

  const seed = useCallback((file: File, fileId: string) => {
    seedFileRef.current = file;
    setSeedingId(fileId);
  }, []);

  const sendFile = async (peer: SimplePeer.Instance, file: File) => {
    // 1. Send Meta
    const meta = JSON.stringify({
        type: 'meta',
        name: file.name,
        size: file.size,
        type: file.type
    });
    peer.send(meta);

    // 2. Send Chunks
    const chunkSize = 16 * 1024; // 16KB
    let offset = 0;
    
    const reader = file.stream().getReader();
    
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // value is Uint8Array
        peer.send(value);
        offset += value.length;
        
        // Optional: Throttle or log progress
    }
    
    console.log('File sent complete');
    // peer.destroy(); // Keep open?
  };

  const download = useCallback((fileId: string) => {
    if (!socket) return;

    setDownloadState({ progress: 0, status: 'connecting', error: null, speed: 0 });
    
    // Join the room for this file
    socket.emit('join-room', fileId);

    // Initial listener for when a peer (seeder) is found/joins
    // Ideally, the seeder is already there, or we wait for one.
    // For this simple impl, we assume we are just waiting for an offer if we are downloader,
    // or sending an offer if we are initiator?
    // Usually, strict initiator logic is needed.
    // Let's assume the downloader is the initiator for simplicity of triggering.
    // But standard WebRTC usually has the new joiner initiate? 
    // Let's handle "peer-joined" event -> initiate connection.
    
    // However, if seeders are already there, we need to know.
    // For now, let's assume we wait for "peer-joined" or if socket server sent us a list (not implemented).
    // Or simpler: We announce we want to download, and a seeder initiates.
    
    // Let's implement: Downloader joins -> Emits 'request-file' (we need to add this to server or just use join-room as implicit request).
    // Let's stick to standard P2P mesh logic:
    // When we join, we might receive offers from existing peers?
    // Or we initiate to everyone?
    
    // Refined Flow:
    // 1. We join room.
    // 2. Existing seeders (if any) see 'peer-joined'.
    // 3. Seeder initiates connection to us.
    
    // So here (Downloader) we wait for signals.
  }, [socket]);

  // Handle incoming signals
  useEffect(() => {
    if (!socket) return;

    const handleSignal = (data: { sender: string, signal: any }) => {
      const { sender, signal } = data;
      let peer = activePeers.current.get(sender);

      if (!peer) {
        // New incoming connection (likely from a seeder)
        setDownloadState(prev => ({ ...prev, status: 'connecting' }));
        
        peer = new SimplePeer({ initiator: false, trickle: false });
        activePeers.current.set(sender, peer);

        peer.on('signal', (signalData) => {
          socket.emit('signal', { target: sender, signal: signalData });
        });

        peer.on('connect', () => {
          console.log(`Connected to peer ${sender}`);
          // Request file? Or expect stream?
          // Seeder should just start sending if they know we joined for that file.
          setDownloadState(prev => ({ ...prev, status: 'downloading' }));
        });

        peer.on('data', (data: Uint8Array | string) => {
          handleData(data, sender);
        });

        peer.on('error', (err) => {
          console.error('Peer error:', err);
          setDownloadState(prev => ({ ...prev, error: err.message, status: 'error' }));
        });
      }

      peer.signal(signal);
    };

    socket.on('signal', handleSignal);

    return () => {
      socket.off('signal', handleSignal);
    };
  }, [socket]);

  const handleData = (data: any, peerId: string) => {
    // Determine if meta or chunk
    // Simple protocol: JSON string for meta, Uint8Array for chunk?
    // Or TypedArray with header?
    // Let's attempt to parse as JSON first (inefficient but simple for text meta)
    
    try {
      const text = new TextDecoder().decode(data);
      if (text.startsWith('{"type":"meta"')) {
        const meta = JSON.parse(text);
        fileMetaRef.current = meta;
        console.log('Received metadata:', meta);
        return;
      }
    } catch (e) {
      // Not text/JSON, likely chunk
    }

    // Handle Chunk
    if (fileMetaRef.current) {
        // We need a chunk index system if UDP/unordered, but DataChannels are ordered reliable by default.
        // So we can might just append.
        // But to be robust, let's assume valid sequential data for this simplified demo.
        // Or implement a simple protocol: [4 bytes index][data]
        
        // For 'simple-peer' valid data is Buffer/Uint8Array.
        // Let's assume the seeder sends just raw file bytes in order for this demo?
        // No, that's risky.
        
        // Let's blindly accumulate for now (Memory issue for large files, but ok for demo).
        const chunk = new Uint8Array(data);
        const nextIndex = chunksRef.current.size;
        chunksRef.current.set(nextIndex, chunk);

        // Update progress
        const totalReceived = Array.from(chunksRef.current.values()).reduce((acc, c) => acc + c.byteLength, 0);
        const progress = Math.min(100, (totalReceived / fileMetaRef.current.size) * 100);
        
        setDownloadState(prev => ({ ...prev, progress }));

        if (totalReceived >= fileMetaRef.current.size) {
            // Done
            finishDownload();
        }
    }
  };

  const finishDownload = () => {
     if (!fileMetaRef.current) return;
     
     const blobs = Array.from(chunksRef.current.values()); // Ensure order? Keys are 0,1,2...
     // We used size as index, which is wrong if async/unordered.
     // But with ordered data channel, it updates sequentially.
     
     const blob = new Blob(blobs, { type: fileMetaRef.current.type });
     const url = URL.createObjectURL(blob);
     
     const a = document.createElement('a');
     a.href = url;
     a.download = fileMetaRef.current.name;
     a.click();
     
     setDownloadState(prev => ({ ...prev, status: 'completed', progress: 100 }));
     cleanup();
  };

  return {
    download,
    seed,
    cleanup,
    ...downloadState
  };
};
