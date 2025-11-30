import { Upload, FileText, HardDrive } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QuoteBlock from "@/components/QuoteBlock";

const Contribute = () => {
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
        <Card className="p-12 mb-16 border-2 border-dashed border-border hover:border-accent transition-colors">
          <div className="text-center">
            <div className="inline-flex p-6 bg-accent/10 rounded-full mb-6">
              <Upload className="w-12 h-12 text-accent" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-4">Upload Files</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Share any type of educational content - PDFs, books, research papers, software, 
              videos, audio files, code, and more. No size limits, no restrictions.
            </p>
            <Button size="lg" className="text-lg">
              Select Files to Upload
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              File upload functionality requires backend setup
            </p>
          </div>
        </Card>

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
