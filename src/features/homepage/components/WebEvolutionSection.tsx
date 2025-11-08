import { Globe, Database, Network, Brain, Sparkles, ArrowRight } from "lucide-react";

const WebEvolutionSection = () => {
  const webVersions = [
    {
      version: "Web 1.0",
      era: "1990-2004",
      title: "The Static Web",
      icon: Globe,
      description: "Read-Only Internet. Statische HTML-Seiten ohne Interaktion.",
      characteristics: [
        "Statische Webseiten",
        "Keine Benutzerinteraktion",
        "Reine Informationsvermittlung",
        "Zentrale Server"
      ],
      color: "muted",
      gradient: "from-muted/20 to-muted/5"
    },
    {
      version: "Web 2.0",
      era: "2004-2014",
      title: "The Social Web",
      icon: Database,
      description: "Read-Write Internet. Soziale Medien, User-Generated Content, Cloud.",
      characteristics: [
        "Soziale Netzwerke",
        "User-Generated Content",
        "Cloud-Plattformen",
        "Datenzentralisierung (Big Tech)"
      ],
      color: "secondary",
      gradient: "from-secondary/20 to-secondary/5"
    },
    {
      version: "Web 3.0",
      era: "2014-2024",
      title: "The Semantic Web",
      icon: Network,
      description: "Read-Write-Own. Blockchain, Dezentralisierung, Token Economy.",
      characteristics: [
        "Blockchain & Kryptowährungen",
        "Smart Contracts",
        "NFTs & Digital Ownership",
        "Erste Dezentralisierung"
      ],
      color: "accent",
      gradient: "from-accent/20 to-accent/5"
    },
    {
      version: "Web 4.0",
      era: "2025+",
      title: "The Intuitive Web",
      icon: Brain,
      description: "Intent-Driven, Autonom, Nachhaltig. KI-Agenten, Quantenkommunikation, Full Decentralization.",
      characteristics: [
        "Autonome KI-Agenten",
        "Intent-Based Interaction",
        "Quantenkommunikation",
        "Vollständige Datensouveränität",
        "Nachhaltig & Ethisch"
      ],
      color: "primary",
      gradient: "from-primary/30 to-primary/5",
      highlight: true
    }
  ];

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/40 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/40 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">Evolution des Internets</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Von Web 1.0 zu Web 4.0
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Eine Reise durch vier Generationen des Internets – von statischen Seiten zur intelligenten, autonomen Zukunft
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {webVersions.map((web, index) => {
            const Icon = web.icon;
            const isHighlight = web.highlight;
            
            return (
              <div
                key={index}
                className={`relative animate-fade-in ${
                  isHighlight ? 'md:col-span-2 lg:col-span-4' : ''
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div
                  className={`glass rounded-2xl p-6 h-full border-2 transition-all duration-300 hover:scale-105 ${
                    isHighlight
                      ? 'border-primary/50 shadow-lg shadow-primary/20'
                      : 'border-border/20 hover:border-primary/30'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${web.gradient} rounded-2xl -z-10`} />
                  
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`p-3 bg-${web.color}/20 rounded-xl`}>
                      <Icon className={`w-6 h-6 text-${web.color}`} />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold mb-1">{web.version}</h3>
                      <p className="text-sm text-muted-foreground">{web.era}</p>
                    </div>
                  </div>

                  <h4 className={`text-xl font-bold mb-3 text-${web.color}`}>
                    {web.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {web.description}
                  </p>

                  <div className={isHighlight ? 'grid md:grid-cols-2 gap-4' : ''}>
                    <div>
                      <h5 className="text-xs font-bold mb-2 text-foreground/70">
                        Charakteristika:
                      </h5>
                      <ul className="space-y-2">
                        {web.characteristics.map((char, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <span className={`text-${web.color} mt-0.5`}>•</span>
                            <span>{char}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {index < webVersions.length - 1 && !isHighlight && (
                    <div className="absolute -right-3 top-1/2 -translate-y-1/2 hidden lg:block">
                      <ArrowRight className="w-6 h-6 text-primary/40" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="glass rounded-2xl p-8 border-2 border-primary/30 text-center">
          <h3 className="text-2xl font-bold mb-4 text-gradient">
            Der Quantensprung zu Web 4.0
          </h3>
          <p className="text-muted-foreground max-w-3xl mx-auto mb-6">
            Web 4.0 ist nicht nur eine Evolution, sondern eine Revolution. Es kombiniert die besten Eigenschaften 
            aller vorherigen Generationen und fügt völlig neue Dimensionen hinzu: Autonomie, Intent-Driven Interaction, 
            Quantensicherheit und wahre Dezentralisierung mit vollständiger Datensouveränität.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <span className="px-4 py-2 bg-primary/20 rounded-full text-primary font-semibold text-sm">
              10x Schneller
            </span>
            <span className="px-4 py-2 bg-success/20 rounded-full text-success font-semibold text-sm">
              100x Sicherer
            </span>
            <span className="px-4 py-2 bg-accent/20 rounded-full text-accent font-semibold text-sm">
              Absolut Dezentral
            </span>
            <span className="px-4 py-2 bg-secondary/20 rounded-full text-secondary font-semibold text-sm">
              KI-Gesteuert
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WebEvolutionSection;