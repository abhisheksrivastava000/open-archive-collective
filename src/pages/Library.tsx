import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { FileText, Download, Search, Loader2, Magnet, Play, ArrowUp, ArrowDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import QuoteBlock from "@/components/QuoteBlock";
import { useToast } from "@/hooks/use-toast";
import TorrentPlayer from "@/components/TorrentPlayer";
import { getApiUrl } from "@/lib/utils";
import { useWebTorrent } from "@/hooks/useWebTorrent";
import type { Torrent as WebTorrentTorrent } from 'webtorrent';

interface Torrent {
  _id: string;
  title: string;
  description: string;
  fileName: string;
  fileSize: number;
  magnetURI: string;
  createdAt: string;
  seeders: number;
  leechers: number;
}

const Library = () => {
  const [torrents, setTorrents] = useState<Torrent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const client = useWebTorrent();
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());

  const handleDownload = (torrent: Torrent) => {
    if (!client) {
      toast({
        title: "Client not ready",
        description: "Please wait for WebTorrent to initialize.",
        variant: "destructive",
      });
      return;
    }

    if (downloadingIds.has(torrent._id)) {
      toast({
        title: "Already downloading",
        description: `"${torrent.title}" is already being downloaded.`,
      });
      return;
    }

    setDownloadingIds(prev => new Set(prev).add(torrent._id));
    toast({
      title: "Download Started",
      description: `Starting download for "${torrent.title}". Please keep this tab open.`,
    });

    const onTorrentReady = (t: WebTorrentTorrent) => {
      // Prioritize the largest file (likely the content)
      const file = t.files.reduce((a, b) => a.length > b.length ? a : b);
      
      file.getBlob((err, blob) => {
        setDownloadingIds(prev => {
          const next = new Set(prev);
          next.delete(torrent._id);
          return next;
        });

        if (err || !blob) {
          console.error("Download error:", err);
          toast({
            title: "Download Failed",
            description: `Could not retrieve file for "${torrent.title}".`,
            variant: "destructive",
          });
          return;
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = torrent.fileName || file.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
          title: "Download Complete",
          description: `"${torrent.fileName}" has been saved to your device.`,
        });
      });
    };

    const existing = client.get(torrent.magnetURI);
    if (existing) {
      onTorrentReady(existing);
    } else {
      client.add(torrent.magnetURI, onTorrentReady);
    }
  };

  useEffect(() => {
    fetchTorrents();

    const socket = io(getApiUrl(), {
      reconnectionAttempts: 5,
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to socket server with ID:", socket.id);
    });

    socket.on("torrent:update", (updatedTorrent: Torrent) => {
      setTorrents(prev => prev.map(t =>
        t._id === updatedTorrent._id ? updatedTorrent : t
      ));
    });

    socket.on("torrent:new", (newTorrent: Torrent) => {
      setTorrents(prev => [newTorrent, ...prev]);
      toast({
        title: "New Contribution",
        description: `"${newTorrent.title}" has been added to the library.`,
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [toast]);

  const fetchTorrents = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/api/torrents`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setTorrents(data);
    } catch (error) {
      console.error("Error fetching torrents:", error);
      toast({
        title: "Error",
        description: "Failed to load library content.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const filteredTorrents = torrents.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Knowledge Library
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Free access to books, research, software, and educational resources. 
            No paywalls. No restrictions. Just knowledge.
          </p>
        </div>

        <QuoteBlock 
          quote="If you have access to books, make copies and release them onto the internet."
          className="mb-16"
        />

        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for books, papers, software..."
              className="pl-12 py-6 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Resources Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-accent" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredTorrents.map((torrent) => (
              <Card key={torrent._id} className="p-6 hover:shadow-lg transition-shadow flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-accent/10 rounded">
                    <FileText className="w-6 h-6 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-lg mb-2 truncate" title={torrent.title}>
                      {torrent.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {torrent.description || "No description provided."}
                    </p>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-border flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                    <span>{formatSize(torrent.fileSize)}</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center text-green-600" title="Seeders">
                        <ArrowUp className="w-3 h-3 mr-1" />
                        {torrent.seeders || 0}
                      </span>
                      <span className="flex items-center text-orange-600" title="Leechers">
                        <ArrowDown className="w-3 h-3 mr-1" />
                        {torrent.leechers || 0}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 justify-end">
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={() => handleDownload(torrent)}
                      disabled={downloadingIds.has(torrent._id)}
                    >
                      {downloadingIds.has(torrent._id) ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </>
                      )}
                    </Button>
                    <Button variant="ghost" size="sm" asChild title="Download Magnet Link">
                      <a href={torrent.magnetURI} target="_blank" rel="noopener noreferrer">
                        <Magnet className="w-4 h-4 mr-2" />
                        Magnet
                      </a>
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Play className="w-4 h-4 mr-2" />
                          Stream
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>{torrent.title}</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                          <TorrentPlayer magnetURI={torrent.magnetURI} title={torrent.title} />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredTorrents.length === 0 && (
          <div className="text-center py-16 bg-muted/30 rounded-lg">
            <h3 className="text-2xl font-display font-bold mb-4">No results found</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Try adjusting your search or contribute this resource yourself.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
