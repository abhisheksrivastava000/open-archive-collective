import { useEffect, useRef, useState } from 'react';
import { Loader2, Play, Pause, Download, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useWebTorrent } from '@/hooks/useWebTorrent';
import type { Torrent, TorrentFile } from 'webtorrent';

interface TorrentPlayerProps {
  magnetURI: string;
  title: string;
}

const TorrentPlayer = ({ magnetURI, title }: TorrentPlayerProps) => {
  const client = useWebTorrent();
  const [torrent, setTorrent] = useState<Torrent | null>(null);
  const [progress, setProgress] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [numPeers, setNumPeers] = useState(0);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [activeFile, setActiveFile] = useState<TorrentFile | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (client) {
      setStatus('loading');
    }
  }, [client]);

  useEffect(() => {
    if (!client || !magnetURI || status !== 'loading') return;

    const existingTorrent = client.get(magnetURI);
    if (existingTorrent) {
      setupTorrentListeners(existingTorrent);
      return;
    }

    try {
      client.add(magnetURI, (t) => {
        setupTorrentListeners(t);
      });
    } catch (err) {
      console.error("Failed to add torrent:", err);
      setError("Failed to load torrent. It might be invalid.");
      setStatus('error');
    }
  }, [client, magnetURI, status]);

  const setupTorrentListeners = (t: Torrent) => {
    setTorrent(t);
    setStatus('ready');

    t.on('download', () => {
      setProgress(t.progress * 100);
      setDownloadSpeed(t.downloadSpeed);
      setNumPeers(t.numPeers);
    });

    t.on('done', () => {
      setProgress(100);
      setStatus('ready');
    });

    const largestFile = t.files.reduce((prev, current) => {
      return prev.length > current.length ? prev : current;
    });
    setActiveFile(largestFile);
  };

  const renderContent = () => {
    if (!activeFile || !containerRef.current) return null;

    containerRef.current.innerHTML = '';

    activeFile.appendTo(containerRef.current, {
      autoplay: true,
      controls: true,
      maxBlobLength: 2 * 1000 * 1000 * 1000 // 2GB
    }, (err, elem) => {
      if (err) {
        console.error("Render error:", err);
        setError("Failed to render file.");
      }
    });
  };

  useEffect(() => {
    if (status === 'ready' && activeFile) {
      renderContent();
    }
  }, [status, activeFile]);

  const formatSpeed = (bytes: number) => {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB/s';
  };

  return (
    <div className="space-y-4 w-full">
      {status === 'loading' && (
        <div className="bg-black/90 aspect-video rounded-lg flex flex-col items-center justify-center text-white space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-accent" />
          <p>Connecting to peers...</p>
        </div>
      )}

      {status === 'error' && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div
        ref={containerRef}
        className={`aspect-video bg-black rounded-lg overflow-hidden ${status !== 'ready' ? 'hidden' : ''}`}
      />

      {status !== 'idle' && status !== 'error' && (
        <div className="space-y-2 bg-card p-4 rounded-lg border border-border">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress: {progress.toFixed(1)}%</span>
            <span>Speed: {formatSpeed(downloadSpeed)}</span>
            <span>Peers: {numPeers}</span>
          </div>
          <Progress value={progress} className="h-2" />
          {activeFile && (
            <p className="text-xs text-muted-foreground truncate">
              Playing: {activeFile.name}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default TorrentPlayer;
