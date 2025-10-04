import { Leaf, Sun, Zap, Recycle } from "lucide-react";
import FeatureCard from "./FeatureCard";

const SustainabilitySection = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="glass rounded-3xl p-8 md:p-12 border-success/30 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-tr from-success/30 to-transparent" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 flex items-center gap-4 text-gradient">
              <Leaf className="w-10 h-10" />
              Nachhaltigkeit & Effizienz
            </h2>
            
            <h3 className="text-3xl font-bold mb-6 text-success border-l-4 border-success pl-4">
              Grünes Internet
            </h3>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Das neue Internet reduziert den Energieverbrauch um bis zu 70% durch:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              <FeatureCard
                icon={Sun}
                title="Öko-Rechenzentren"
                description="100% erneuerbare Energien und Abwärmenutzung für Wohngebiete"
              />
              <FeatureCard
                icon={Zap}
                title="Effiziente Protokolle"
                description="Reduzierung des Datenverkehrs durch optimierte Standards"
              />
              <FeatureCard
                icon={Recycle}
                title="Hardware-Langlebigkeit"
                description="Modulare, reparierbare Geräte mit 10+ Jahren Lebensdauer"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SustainabilitySection;
