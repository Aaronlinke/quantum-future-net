import { Users, Code, Lightbulb, GraduationCap, Handshake } from "lucide-react";
import FeatureCard from "./FeatureCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ParticipationSection = () => {
  const handleJoin = () => {
    toast.success("Danke für Ihr Interesse! Die Mitwirkung an dieser Vision beginnt mit dem Teilen dieser Konzepte und dem Engagement in Open-Source-Projekten.");
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="glass rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-primary/20 to-secondary/20" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 flex items-center gap-4 text-gradient">
              <Users className="w-10 h-10" />
              Ihre Rolle in der Revolution
            </h2>
            
            <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
              Jeder kann zur Entwicklung des neuen Internets beitragen:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <FeatureCard
                icon={Code}
                title="Entwickler"
                description="Mitwirken an Open-Source-Projekten für dezentrale Protokolle"
              />
              <FeatureCard
                icon={Lightbulb}
                title="Visionäre"
                description="Ideen und Konzepte für nutzerzentrierte Anwendungen einbringen"
              />
              <FeatureCard
                icon={GraduationCap}
                title="Botschafter"
                description="Wissen über die neue Internet-Generation verbreiten"
              />
            </div>
            
            <div className="text-center">
              <Button
                variant="hero"
                size="lg"
                onClick={handleJoin}
                className="gap-2"
              >
                <Handshake className="w-5 h-5" />
                Jetzt mitwirken
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParticipationSection;
