import { Network } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 glass border-b border-primary/30 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-2 flex items-center justify-center gap-3">
          <Network className="w-10 h-10 text-primary animate-pulse-glow" />
          Das Internet neu erfunden
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Eine technisch fundierte Vision für die digitale Zukunft
        </p>
      </div>
    </header>
  );
};

export default Header;
