import { ShieldCheck, Lock, EyeOff, Shield } from "lucide-react";
import FeatureCard from "./FeatureCard";
import { Progress } from "@/components/ui/progress";

const SecuritySection = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="glass rounded-3xl p-8 md:p-12 border-destructive/30 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-destructive/30 to-transparent" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 flex items-center gap-4 text-gradient">
              <ShieldCheck className="w-10 h-10" />
              Sicherheit & Privatsphäre
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <FeatureCard
                icon={Lock}
                title="Selbstsouveräne Identitäten"
                description="Nutzer kontrollieren ihre digitalen Identitäten vollständig über Blockchain-Technologie"
              />
              <FeatureCard
                icon={EyeOff}
                title="Zero-Knowledge-Proofs"
                description="Verifikation ohne Preisgabe persönlicher Informationen"
              />
              <FeatureCard
                icon={Shield}
                title="Post-Quanten-Kryptographie"
                description="Verschlüsselungsmethoden, die auch Quantencomputern standhalten"
              />
            </div>
            
            <div className="glass rounded-2xl p-8 border-accent/30">
              <h4 className="text-2xl font-semibold mb-6">Entwicklungsfortschritt</h4>
              <div className="space-y-6">
                {[
                  { label: "Quantenkryptographie", value: 72, color: "hsl(192 100% 42%)" },
                  { label: "Zero-Knowledge-Proofs", value: 58, color: "hsl(270 65% 60%)" },
                  { label: "Post-Quanten-Algorithmen", value: 35, color: "hsl(32 100% 50%)" },
                ].map((item, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">{item.label}</span>
                      <span className="text-accent font-bold">{item.value}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: `${item.value}%`,
                          background: `linear-gradient(90deg, ${item.color}, hsl(270 65% 60%))`,
                          animation: `progress-fill 2s ease-out ${idx * 0.3}s forwards`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
