interface QuoteBlockProps {
  quote: string;
  author?: string;
  className?: string;
}

const QuoteBlock = ({ quote, author, className = "" }: QuoteBlockProps) => {
  return (
    <blockquote className={`border-l-4 border-accent pl-6 py-4 my-8 ${className}`}>
      <p className="text-xl md:text-2xl font-medium text-foreground leading-relaxed italic">
        "{quote}"
      </p>
      {author && (
        <footer className="mt-4 text-muted-foreground font-medium">
          — {author}
        </footer>
      )}
    </blockquote>
  );
};

export default QuoteBlock;
