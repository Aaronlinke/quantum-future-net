import { Button } from "@/components/ui/button";
import { Compass, Save } from "lucide-react";
import { toast } from "sonner";

const HeroSection = () => {
  const handleSave = () => {
    toast.success("Vision gespeichert!");
  };

  const handleExplore = () => {
    document.getElementById("tech-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
      </div>
      
      <div className="container mx-auto max-w-4xl text-center relative z-10">
        <div className="inline-block px-4 py-2 bg-primary/20 rounded-full mb-6 animate-fade-in">
          <span className="text-sm font-semibold text-primary">Web 4.0 – Die nächste Dimension</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
          Das Internet neu denken
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
          Eine fundamentale Neukonzeption: autonom, intuitiv, dezentral und ethisch. 
          Web 4.0 überwindet die Grenzen des semantischen Webs und schafft ein intelligent agierendes Ökosystem.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button 
            variant="hero" 
            size="lg" 
            onClick={handleExplore}
            className="gap-2"
          >
            <Compass className="w-5 h-5" />
            Erkunden
          </Button>
          <Button 
            variant="secondary" 
            size="lg" 
            onClick={handleSave}
            className="gap-2"
          >
            <Save className="w-5 h-5" />
            Speichern
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
