import { FileText, Download, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import QuoteBlock from "@/components/QuoteBlock";

const Library = () => {
  // Placeholder data - in production this would come from a database
  const resources = [
    {
      id: 1,
      title: "Freedom Manifesto",
      type: "PDF",
      size: "2.4 MB",
      description: "The complete manifesto on liberating knowledge",
    },
  ];

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
            />
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {resources.map((resource) => (
            <Card key={resource.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-accent/10 rounded">
                  <FileText className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-lg mb-2">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {resource.type} • {resource.size}
                    </span>
                    <button className="text-accent hover:text-accent/80 transition-colors">
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Coming Soon Message */}
        <div className="text-center py-16 bg-muted/30 rounded-lg">
          <h3 className="text-2xl font-display font-bold mb-4">Growing Collection</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our library is continuously expanding with contributions from freedom fighters worldwide. 
            Check back regularly or contribute your own resources to help liberate knowledge.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Library;
