import { Building2, University, Lightbulb, Users, Globe, Heart } from "lucide-react";

const EcosystemSection = () => {
  const stakeholders = [
    {
      icon: Building2,
      title: "Unternehmen & Startups",
      description: "Nutze Web 4.0 Infrastruktur für skalierbare, sichere und zukunftsfähige Geschäftsmodelle",
      benefits: [
        "Reduzierte Infrastrukturkosten",
        "Automatisierte Compliance",
        "Neue Revenue-Streams durch Agenten-Economy"
      ],
      color: "primary",
      cta: "Enterprise-Lösungen"
    },
    {
      icon: University,
      title: "Forschung & Universitäten",
      description: "Gestalte die Zukunft mit uns. Erhalte Grants und Zugang zu Cutting-Edge Technologie",
      benefits: [
        "Forschungs-Grants verfügbar",
        "Zugang zu Testnet & Daten",
        "Co-Publikationsmöglichkeiten"
      ],
      color: "secondary",
      cta: "Research-Programm"
    },
    {
      icon: Lightbulb,
      title: "Entwickler & Creator",
      description: "Baue die nächste Generation von Apps, Agenten und Services auf Web 4.0",
      benefits: [
        "Open Source & freie Tools",
        "Monetarisierung durch Agent-Marketplace",
        "Community & Mentoring"
      ],
      color: "accent",
      cta: "Developer Hub"
    },
    {
      icon: Users,
      title: "Communities & DAOs",
      description: "Organisiere dich dezentral mit voller Transparenz und Governance-Tools",
      benefits: [
        "Dezentrale Governance",
        "Token-gestützte Incentives",
        "Privacy-First Communication"
      ],
      color: "success",
      cta: "Community-Tools"
    },
    {
      icon: Globe,
      title: "Regierungen & NGOs",
      description: "Implementiere transparente, sichere digitale Infrastruktur für Bürger-Services",
      benefits: [
        "Transparente E-Government Services",
        "Sichere digitale Identität",
        "Nachhaltige Infrastruktur"
      ],
      color: "primary",
      cta: "Public Sector"
    },
    {
      icon: Heart,
      title: "Endnutzer",
      description: "Erlebe ein Internet, das dir gehört. Volle Kontrolle über deine Daten und Identität",
      benefits: [
        "Volle Datensouveränität",
        "Keine Werbung, kein Tracking",
        "Personalisiert & intuitiv"
      ],
      color: "secondary",
      cta: "Jetzt starten"
    }
  ];

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Ein Ökosystem für alle
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Web 4.0 ist offen, inklusiv und geschaffen für jeden Stakeholder – 
            von Entwicklern über Unternehmen bis hin zu Endnutzern
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {stakeholders.map((stakeholder, index) => {
            const Icon = stakeholder.icon;
            
            return (
              <div
                key={index}
                className="glass rounded-2xl p-8 border border-border/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`p-4 bg-${stakeholder.color}/20 rounded-xl w-fit mb-4`}>
                  <Icon className={`w-8 h-8 text-${stakeholder.color}`} />
                </div>
                
                <h3 className="text-2xl font-bold mb-3">{stakeholder.title}</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {stakeholder.description}
                </p>

                <div className="mb-6">
                  <h4 className="text-xs font-bold mb-3 text-foreground/70">Key Benefits:</h4>
                  <ul className="space-y-2">
                    {stakeholder.benefits.map((benefit, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="text-success mt-0.5">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button className={`w-full py-3 bg-${stakeholder.color}/20 text-${stakeholder.color} rounded-xl font-semibold hover:bg-${stakeholder.color}/30 transition-colors border border-${stakeholder.color}/30`}>
                  {stakeholder.cta}
                </button>
              </div>
            );
          })}
        </div>

        <div className="glass rounded-3xl p-8 md:p-12 border-2 border-primary/30 text-center">
          <h3 className="text-3xl font-bold mb-6 text-gradient">
            Werde Teil der Web 4.0 Bewegung
          </h3>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Egal ob du Entwickler, Unternehmer, Forscher oder einfach ein neugieriger Nutzer bist – 
            es gibt einen Platz für dich im Web 4.0 Ökosystem. Gemeinsam gestalten wir die Zukunft des Internets.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              Jetzt beitreten
            </button>
            <button className="px-8 py-4 glass rounded-xl font-semibold text-lg border-2 border-primary/30 hover:border-primary/50 transition-colors">
              Mehr erfahren
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcosystemSection;