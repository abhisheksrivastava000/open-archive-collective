import { useState, useEffect } from "react";
import { Upload, FileText, HardDrive, Loader2, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import QuoteBlock from "@/components/QuoteBlock";
import { useWebTorrent } from "@/hooks/useWebTorrent";
import { getApiUrl, TRACKERS } from "@/lib/utils";

const Contribute = () => {
  const { toast } = useToast();
  const client = useWebTorrent();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [magnetLink, setMagnetLink] = useState("");
  const [activeSeeds, setActiveSeeds] = useState<any[]>([]);

  // Update active seeds list
  useEffect(() => {
    const interval = setInterval(() => {
      if (client) {
        setActiveSeeds(client.torrents);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [client]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      // Auto-fill title if empty
      if (!title) {
        setTitle(e.target.files[0].name);
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    if (!client) {
      toast({
        title: "Client not ready",
        description: "WebTorrent client is initializing. Please try again in a moment.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    // Seed the file client-side
    client.seed(file, { announce: TRACKERS }, async (torrent) => {
      console.log('Client is seeding:', torrent.infoHash);

      const metadata = {
        title: title,
        description: description,
        magnetURI: torrent.magnetURI,
        infoHash: torrent.infoHash,
        fileName: file.name,
        fileSize: file.size,
        category: 'other',
      };

      try {
        const response = await fetch(`${getApiUrl()}/api/torrents/upload`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(metadata),
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = await response.json();
        setUploadSuccess(true);
        setMagnetLink(data.torrent.magnetURI);
        toast({
          title: "Upload Successful",
          description: "You are now seeding this file. Please keep this tab open to share it!",
        });
      } catch (error) {
        console.error("Upload error:", error);
        toast({
          title: "Upload Failed",
          description: "There was an error uploading your file metadata. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    });
  };

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Contribute Knowledge
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Help us liberate information. Share books, research, software, and educational resources
            with the world.
          </p>
        </div>

        <QuoteBlock
          quote="If you believe knowledge belongs to humanity, then become the pirate who fights for freedom."
          className="mb-16"
        />

        {/* Upload Section */}
        <Card className="p-8 md:p-12 mb-16 border-2 border-dashed border-border hover:border-accent transition-colors">
          {!uploadSuccess ? (
            <form onSubmit={handleUpload} className="space-y-6 max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex p-6 bg-accent/10 rounded-full mb-6">
                  <Upload className="w-12 h-12 text-accent" />
                </div>
                <h2 className="text-3xl font-display font-bold mb-2">Upload Files</h2>
                <p className="text-muted-foreground">
                  Select a file to generate a torrent. You are the <strong>First Peer</strong>. You must keep this tab open to seed.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">File</Label>
                <Input id="file" type="file" onChange={handleFileChange} className="cursor-pointer" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a descriptive title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the content..."
                  rows={4}
                />
              </div>

              <Button type="submit" size="lg" className="w-full text-lg" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing & Seeding...
                  </>
                ) : (
                  "Upload & Create Torrent"
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
              <div className="inline-flex p-6 bg-green-100 rounded-full text-green-600 mb-4">
                <CheckCircle className="w-16 h-16" />
              </div>
              <h2 className="text-3xl font-display font-bold">Upload Complete!</h2>
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 text-left">
                <p className="font-bold">⚠️ Important: You are the First Peer</p>
                <p>You must keep this browser tab open to seed the file until at least one other person has downloaded it. If you close this tab, the file will become unavailable.</p>
              </div>
              <p className="text-xl text-muted-foreground">
                Your file is now part of the decentralized network.
              </p>

              <div className="bg-muted p-4 rounded-lg text-left break-all font-mono text-sm">
                <p className="font-bold mb-2 text-xs uppercase tracking-wider text-muted-foreground">Magnet Link:</p>
                {magnetLink}
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={() => {
                  setUploadSuccess(false);
                  setFile(null);
                  setTitle("");
                  setDescription("");
                  setMagnetLink("");
                }} variant="outline">
                  Upload Another
                </Button>
                <Button asChild>
                  <a href="/library">Go to Library</a>
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Active Seeds Section */}
        {activeSeeds.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-display font-bold mb-8 text-center">
              Your Active Seeds ({activeSeeds.length})
            </h2>
            <div className="grid gap-4">
              {activeSeeds.map((torrent, index) => (
                <Card key={torrent.infoHash || index} className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-lg">{torrent.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Peers: {torrent.numPeers} (connected) | Upload Speed: {(torrent.uploadSpeed / 1024 / 1024).toFixed(2)} MB/s
                      </p>
                    </div>
                    <div className="text-green-600 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Seeding
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              "0 Peers" is normal if no one is currently downloading. You are ready to upload!
            </p>
          </div>
        )}

        {/* What You Can Share */}
        <div className="mb-16">
          <h2 className="text-3xl font-display font-bold mb-8 text-center">
            What You Can Share
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <FileText className="w-10 h-10 mb-4 text-accent" />
              <h3 className="font-display font-bold text-xl mb-3">Documents</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Books (PDF, EPUB, MOBI)</li>
                <li>• Research papers</li>
                <li>• Academic articles</li>
                <li>• Educational materials</li>
                <li>• Documentation</li>
              </ul>
            </Card>

            <Card className="p-6">
              <HardDrive className="w-10 h-10 mb-4 text-accent" />
              <h3 className="font-display font-bold text-xl mb-3">Software</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Open source code</li>
                <li>• Development tools</li>
                <li>• Software packages</li>
                <li>• Educational programs</li>
                <li>• ZIP archives</li>
              </ul>
            </Card>

            <Card className="p-6">
              <FileText className="w-10 h-10 mb-4 text-accent" />
              <h3 className="font-display font-bold text-xl mb-3">Media</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Educational videos (MP4)</li>
                <li>• Audio lectures (MP3)</li>
                <li>• Course materials</li>
                <li>• Tutorials</li>
                <li>• Presentations</li>
              </ul>
            </Card>
          </div>
        </div>

        {/* Guidelines */}
        <div className="bg-muted/30 p-8 rounded-lg mb-16">
          <h2 className="text-2xl font-display font-bold mb-6">Contribution Guidelines</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              <strong className="text-foreground">Be a liberation warrior:</strong> Share knowledge
              that has been locked away behind paywalls, proprietary licenses, or institutional barriers.
            </p>
            <p>
              <strong className="text-foreground">Educational value:</strong> Focus on content that
              can educate, inform, or help people learn and grow.
            </p>
            <p>
              <strong className="text-foreground">No size limits:</strong> Share large datasets,
              complete book collections, software packages - we don't limit knowledge by file size.
            </p>
            <p>
              <strong className="text-foreground">Anonymous contribution:</strong> You can contribute
              anonymously if you prefer. We understand the risks freedom fighters take.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-primary text-primary-foreground p-12 rounded-lg">
          <h2 className="text-3xl font-display font-bold mb-4">
            Join the Movement
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Every contribution brings us closer to a world where knowledge is truly free
          </p>
          <Button size="lg" variant="secondary" className="text-lg">
            Start Contributing Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Contribute;
