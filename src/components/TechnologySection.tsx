import { Cpu, AlertTriangle } from "lucide-react";
import NetworkVisualization from "./NetworkVisualization";

const TechnologySection = () => {
  return (
    <section id="tech-section" className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 to-transparent animate-rotate-slow" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 flex items-center gap-4 text-gradient">
              <Cpu className="w-10 h-10" />
              Technische Revolution
            </h2>
            
            <h3 className="text-3xl font-bold mb-6 text-accent border-l-4 border-accent pl-4">
              Quanteninternet
            </h3>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Die nächste Generation der Datenübertragung basiert auf Quantenverschränkung und Quantenkryptographie:
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="glass rounded-2xl p-6 border-destructive/30 bg-destructive/5">
                <h4 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                  Aktuelles Internet
                </h4>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-destructive">•</span>
                    <span>Maximal Lichtgeschwindigkeit (300.000 km/s)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-destructive">•</span>
                    <span>Anfällig für Abhörangriffe</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-destructive">•</span>
                    <span>Bandbreitenlimitierungen</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-destructive">•</span>
                    <span>Zentrale Kontrollpunkte</span>
                  </li>
                </ul>
              </div>
              
              <div className="glass rounded-2xl p-6 border-primary/30 bg-primary/5">
                <h4 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                  <Cpu className="w-6 h-6 text-primary" />
                  Quanteninternet
                </h4>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Quantenverschränkung (sofortige Übertragung)</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Physikalisch abhörsichere Verbindungen</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Exponentiell höhere Bandbreiten</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Dezentrale Netzwerkarchitektur</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <NetworkVisualization />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;
