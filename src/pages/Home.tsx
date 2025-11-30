import { Link } from "react-router-dom";
import { BookOpen, Archive, Target, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuoteBlock from "@/components/QuoteBlock";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30" />
        <div className="relative max-w-5xl mx-auto text-center animate-fade-in">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 tracking-tighter">
            Knowledge Should Be{" "}
            <span className="text-accent">Free</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
            A movement to liberate information, education, and knowledge for every single soul
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg">
              <Link to="/manifesto">Read the Manifesto</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg">
              <Link to="/contribute">Contribute Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <QuoteBlock
            quote="An educated, knowledgeable person is a free person."
            className="border-l-accent"
          />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-16">
            Join the Liberation
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link
              to="/manifesto"
              className="group p-8 bg-card hover:bg-muted transition-all duration-300 border border-border"
            >
              <BookOpen className="w-12 h-12 mb-4 text-accent" />
              <h3 className="text-2xl font-display font-bold mb-3">Manifesto</h3>
              <p className="text-muted-foreground">
                Read our vision for a world where knowledge flows freely
              </p>
            </Link>

            <Link
              to="/library"
              className="group p-8 bg-card hover:bg-muted transition-all duration-300 border border-border"
            >
              <Archive className="w-12 h-12 mb-4 text-accent" />
              <h3 className="text-2xl font-display font-bold mb-3">Library</h3>
              <p className="text-muted-foreground">
                Access our growing archive of free knowledge and resources
              </p>
            </Link>

            <Link
              to="/mission"
              className="group p-8 bg-card hover:bg-muted transition-all duration-300 border border-border"
            >
              <Target className="w-12 h-12 mb-4 text-accent" />
              <h3 className="text-2xl font-display font-bold mb-3">Mission</h3>
              <p className="text-muted-foreground">
                Learn about our commitment to information freedom
              </p>
            </Link>

            <Link
              to="/contribute"
              className="group p-8 bg-card hover:bg-muted transition-all duration-300 border border-border"
            >
              <Upload className="w-12 h-12 mb-4 text-accent" />
              <h3 className="text-2xl font-display font-bold mb-3">Contribute</h3>
              <p className="text-muted-foreground">
                Share knowledge and help liberate information
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Be the Warrior of Liberation
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Help us free knowledge from the chains of restriction
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg">
            <Link to="/contribute">Start Contributing</Link>
          </Button>
        </div>
      </section>

      {/* Final Quote */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <QuoteBlock
            quote="Feed one person and one person is no longer hungry. Educate one mind and entire generations will never go hungry again."
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
