import { Network } from "lucide-react";
import Timeline from "./Timeline";

const DecentralizedSection = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="glass rounded-3xl p-8 md:p-12 border-secondary/30 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-1/2 w-full h-full bg-gradient-to-br from-secondary/30 to-transparent animate-pulse" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 flex items-center gap-4 text-gradient">
              <Network className="w-10 h-10" />
              Dezentrale Netzwerke
            </h2>
            
            <h3 className="text-3xl font-bold mb-6 text-secondary border-l-4 border-secondary pl-4">
              Ende der Plattform-Monopole
            </h3>
            
            <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
              Statt weniger Tech-Giganten kontrollieren Nutzer ihre Daten:
            </p>
            
            <Timeline />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DecentralizedSection;
