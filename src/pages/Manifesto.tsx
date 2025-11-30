import QuoteBlock from "@/components/QuoteBlock";

const Manifesto = () => {
  return (
    <div className="min-h-screen py-24 px-4">
      <article className="max-w-4xl mx-auto prose prose-lg">
        <h1 className="text-5xl md:text-6xl font-display font-bold mb-8 text-foreground">
          Freedom Manifesto
        </h1>
        
        <div className="space-y-8 text-foreground leading-relaxed">
          <p className="text-xl">
            One of the most important things in this age—and in every age—is knowledge and information. 
            It possesses the power to transform individuals and to change the entire world.
          </p>

          <p className="text-xl font-semibold">
            So tell me: is it right to keep all knowledge in the hands of a selected few? 
            Knowledge and information should be free and accessible to everyone.
          </p>

          <p>
            Right now, people are dying all over the world because life-saving research is locked away 
            as proprietary property. Other researchers who could improve it, perfect it, and save millions 
            are denied access.
          </p>

          <p>
            There are books that could educate, heal, and uplift someone in their darkest hour, 
            yet they remain out of reach because the person in need cannot afford to buy them.
          </p>

          <p>
            There is software that could rescue a job, revive a small business, or feed a family, 
            but it is sealed behind paywalls and licenses.
          </p>

          <QuoteBlock quote="Knowledge should be free." />

          <p>
            Some insist on turning knowledge into a commodity—profiting from it in money, status, or power. 
            My question is simple: is it truly necessary to make a profit from knowledge and information?
          </p>

          <p className="font-medium">
            If you believe knowledge belongs to humanity, then become the pirate who fights for freedom. 
            Rip the books from locked libraries and set them loose on the internet. Open-source your work—your 
            books, your software, your research, everything. Let it flow without restraint.
          </p>

          <p>
            The world already hoards far too many things for the privileged few. Let knowledge not be 
            counted among them.
          </p>

          <div className="my-12 p-8 bg-muted border-l-4 border-accent">
            <p className="text-lg font-medium mb-4">Be the warrior of liberation.</p>
            <p className="text-lg font-medium mb-4">Be the desert well that quenches a stranger's thirst for understanding.</p>
          </div>

          <p>
            Be like Lord Krishna revealing the Gita, like Prophet Muhammad enlightening the world with the Qur'an, 
            like Christ offering wisdom to all who would hear. Be the gentle smile on the face of curiosity that 
            simply wants to know. Be knowledge itself—and spread.
          </p>

          <QuoteBlock quote="Free the knowledge." />

          <p>
            If you have access to books, make copies and release them onto the internet. If you can reach 
            research papers, upload them without hesitation. If you possess software code, open it, share it, 
            set it free. Help people become educated and truly knowledgeable. Help them break the chains of 
            their origins, their family background, their financial status. Knowledge is power—let that power 
            be unleashed so the whole world can witness its glory.
          </p>

          <QuoteBlock quote="An educated, knowledgeable person is a free person." />

          <h2 className="text-3xl font-display font-bold mt-16 mb-6">Free the World</h2>

          <p>
            Give every individual the tools to choose who and what they wish to become. Grant them the power 
            of knowledge to rise from nothing—or from anything—and become something extraordinary. Let knowledge 
            never be enslaved. Let information never be censored or locked away. Let freedom rise. Let knowledge 
            flow freely and be celebrated for the miracles it can perform. Let people have unrestricted access 
            to knowledge, information, and education. Only then will the word "equality" finally mean something real.
          </p>

          <div className="my-12 p-8 bg-card border border-border">
            <p className="font-semibold mb-4">In this manifesto I put forward a bold idea:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>If the world were truly educated and knowledgeable, would crime rates fall?</li>
              <li>Would people be able to choose their paths with genuine freedom?</li>
              <li>Could knowledge dissolve the ignorance that fuels hatred, prejudice, and discrimination?</li>
            </ul>
          </div>

          <p>
            I may be right, or I may be wrong—but knowledge has the power to help people achieve greatness 
            and become great themselves.
          </p>

          <p className="text-xl font-bold">
            So let us liberate knowledge. Let us set it free—once and for all.
          </p>

          <p className="text-lg">
            Everything deserves freedom. Everyone deserves freedom. And true freedom is found in knowing. 
            So be liberated. Be free. Be knowledgeable. Be the one who fights so that others may taste that 
            same freedom. Be the warrior of liberation. Be the undying flame that carries this eternal truth: 
            knowledge, information, and education must be free—free for every single soul.
          </p>

          <QuoteBlock 
            quote="Feed one person and one person is no longer hungry. Educate one mind and entire generations will never go hungry again."
            className="my-16"
          />
        </div>
      </article>
    </div>
  );
};

export default Manifesto;
