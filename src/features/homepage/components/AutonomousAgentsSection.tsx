import { Bot, MessageSquare, Shield, Sparkles } from "lucide-react";

const AutonomousAgentsSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="glass rounded-3xl p-8 md:p-12 border-secondary/30 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-secondary/30 to-transparent" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 flex items-center gap-4 text-gradient">
              <Bot className="w-10 h-10" />
              Autonome KI-Agenten
            </h2>
            
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              Ihr persönlicher KI-Agent versteht Ihre Absichten und handelt eigenständig in Ihrem Auftrag
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="p-3 bg-secondary/20 rounded-xl h-fit">
                    <MessageSquare className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Conversational Interfaces</h3>
                    <p className="text-muted-foreground">
                      Interaktion über natürliche Sprache, multimodal und ohne explizite grafische Oberflächen
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="p-3 bg-accent/20 rounded-xl h-fit">
                    <Sparkles className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Erklärbare KI (XAI)</h3>
                    <p className="text-muted-foreground">
                      Alle Agenten können ihre Entscheidungen und Handlungen transparent erklären
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="p-3 bg-success/20 rounded-xl h-fit">
                    <Shield className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Ethische Governance</h3>
                    <p className="text-muted-foreground">
                      Eingebaute Verhaltensregeln und Überwachungsmechanismen für sichere Agentenaktionen
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl p-6 border-primary/20">
                <h3 className="text-2xl font-bold mb-4 text-primary">Agent Markup Language (AML)</h3>
                <p className="text-muted-foreground mb-4">
                  Standardisierte Sprache für die Definition von:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">→</span>
                    <span>Agentenfähigkeiten und Ziele</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">→</span>
                    <span>Sicherheitsmerkmale und Berechtigungen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">→</span>
                    <span>Interaktionsprotokolle zwischen Agenten</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">→</span>
                    <span>Audit-Trails für Rechenschaftspflicht</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AutonomousAgentsSection;
