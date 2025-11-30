import { Shield, Heart, Globe, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import QuoteBlock from "@/components/QuoteBlock";

const Mission = () => {
  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Our Mission
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            To liberate knowledge, information, and education for every single soul
          </p>
        </div>

        <QuoteBlock 
          quote="Let knowledge never be enslaved. Let information never be censored or locked away."
          className="mb-16"
        />

        {/* Core Values */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="p-8">
            <Globe className="w-12 h-12 mb-4 text-accent" />
            <h3 className="text-2xl font-display font-bold mb-4">Universal Access</h3>
            <p className="text-muted-foreground">
              We believe knowledge should be accessible to everyone, regardless of location, 
              income, or background. No paywalls, no restrictions, no barriers.
            </p>
          </Card>

          <Card className="p-8">
            <Heart className="w-12 h-12 mb-4 text-accent" />
            <h3 className="text-2xl font-display font-bold mb-4">Freedom First</h3>
            <p className="text-muted-foreground">
              Knowledge is not a commodity to be sold. It's a fundamental right that empowers 
              people to transform their lives and contribute to humanity.
            </p>
          </Card>

          <Card className="p-8">
            <Users className="w-12 h-12 mb-4 text-accent" />
            <h3 className="text-2xl font-display font-bold mb-4">Community Driven</h3>
            <p className="text-muted-foreground">
              Our platform thrives on contributions from warriors of liberation worldwide who 
              share our vision of free and open knowledge.
            </p>
          </Card>

          <Card className="p-8">
            <Shield className="w-12 h-12 mb-4 text-accent" />
            <h3 className="text-2xl font-display font-bold mb-4">Privacy Respected</h3>
            <p className="text-muted-foreground">
              We respect your privacy and freedom. No tracking, no data selling, no surveillance. 
              Access knowledge freely and anonymously.
            </p>
          </Card>
        </div>

        {/* Vision Statement */}
        <div className="bg-primary text-primary-foreground p-12 rounded-lg mb-16">
          <h2 className="text-3xl font-display font-bold mb-6">Our Vision</h2>
          <p className="text-lg mb-4 leading-relaxed">
            We envision a world where every person has unrestricted access to the knowledge they need 
            to learn, grow, and thrive. Where life-saving research isn't locked behind paywalls. 
            Where students don't have to choose between textbooks and food. Where innovation isn't 
            stifled by proprietary restrictions.
          </p>
          <p className="text-lg leading-relaxed">
            A world where education truly equals opportunity, and knowledge becomes the great equalizer 
            it was always meant to be.
          </p>
        </div>

        {/* Privacy & Terms */}
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-display font-bold mb-4">Privacy Policy</h2>
            <div className="text-muted-foreground space-y-4">
              <p>
                We are committed to protecting your privacy. We do not collect personal information 
                unless absolutely necessary for service provision.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>No tracking cookies or analytics that identify individual users</li>
                <li>No selling or sharing of user data with third parties</li>
                <li>Minimal data collection - only what's needed for uploads and contributions</li>
                <li>Anonymous access to all publicly available resources</li>
                <li>Right to deletion of your contributed content upon request</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-display font-bold mb-4">Content Policy</h2>
            <div className="text-muted-foreground space-y-4">
              <p>
                While we champion freedom of information, we maintain certain standards:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Content must be educational, informative, or contribute to knowledge sharing</li>
                <li>We respect that much content may challenge existing copyright - we stand for information freedom</li>
                <li>No harmful content (malware, exploitative material, etc.)</li>
                <li>Contributors are responsible for the content they share</li>
                <li>We operate in the spirit of civil disobedience against unjust information restrictions</li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-display font-bold mb-4">Legal Disclaimer</h2>
            <p className="text-muted-foreground">
              This platform operates as a protest against the commodification of knowledge. We believe 
              information wants to be free and that artificial scarcity of knowledge is ethically wrong. 
              Users access and contribute content at their own discretion and responsibility. We are a 
              platform for information liberation and education freedom.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mission;
