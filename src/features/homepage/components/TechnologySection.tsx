import { Cpu, Zap, Shield, Globe } from "lucide-react";
import NetworkVisualization from "./NetworkVisualization";

const TechnologySection = () => {
  return (
    <section id="tech-section" className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="glass rounded-3xl p-8 md:p-12 border-primary/30 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-primary/30 to-transparent" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 flex items-center gap-4 text-gradient">
              <Cpu className="w-10 h-10" />
              Technische Revolution
            </h2>
            
            <h3 className="text-3xl font-bold mb-6 text-primary border-l-4 border-primary pl-4">
              Quanteninternet
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-4">
                <h4 className="text-2xl font-semibold flex items-center gap-2">
                  <Shield className="w-6 h-6 text-destructive" />
                  Aktuelles Internet
                </h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">×</span>
                    <span>Begrenzte Geschwindigkeit durch Lichtgeschwindigkeit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">×</span>
                    <span>Anfällig für Abhören und Manipulation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">×</span>
                    <span>Begrenzte Bandbreite</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-2xl font-semibold flex items-center gap-2">
                  <Zap className="w-6 h-6 text-success" />
                  Quanteninternet
                </h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-success mt-1">✓</span>
                    <span>Instantane Übertragung durch Verschränkung</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success mt-1">✓</span>
                    <span>Absolut abhörsicher durch Quantengesetze</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success mt-1">✓</span>
                    <span>Unbegrenzte Bandbreite durch Parallelverarbeitung</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success mt-1">✓</span>
                    <span>Dezentrale Architektur ohne Single Points of Failure</span>
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
