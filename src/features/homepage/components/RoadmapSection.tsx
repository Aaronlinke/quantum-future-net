import { Rocket, Code, TestTube, Globe, Users, Sparkles } from "lucide-react";

const RoadmapSection = () => {
  const phases = [
    {
      icon: Code,
      phase: "Phase 1: Foundation",
      timeline: "2025-2026",
      title: "Protokoll & Core Development",
      description: "Entwicklung des Meta-Protokolls und grundlegender Infrastruktur",
      milestones: [
        "Meta-Protokoll Spezifikation v1.0",
        "Quantum-Safe Kryptographie Integration",
        "DAG-basierter Konsens Prototyp",
        "Dezentrale Identitäts-Framework (DID)"
      ],
      teams: ["Protocol Design Team", "Kryptographie Team", "DID Initiative"],
      color: "primary"
    },
    {
      icon: TestTube,
      phase: "Phase 2: Testing",
      timeline: "2026-2027",
      title: "Testnet & Alpha Launch",
      description: "Geschlossenes Testnetzwerk mit ausgewählten Partnern",
      milestones: [
        "Launch von Web 4.0 Testnet",
        "Autonomous Agent Framework Alpha",
        "Personal Data Pods MVP",
        "Knowledge Graph Prototype"
      ],
      teams: ["DevOps Team", "Agent Framework Team", "Data Sovereignty Team"],
      color: "secondary"
    },
    {
      icon: Users,
      phase: "Phase 3: Beta",
      timeline: "2027-2028",
      title: "Public Beta & Early Adopters",
      description: "Öffentliches Beta-Netzwerk für Early Adopters und Entwickler",
      milestones: [
        "Public Beta Launch (1M Nutzer)",
        "Developer SDK & Documentation",
        "First Commercial Use Cases",
        "Interoperabilitäts-Bridges zu Web 2.0/3.0"
      ],
      teams: ["Community Team", "Developer Relations", "Business Development"],
      color: "accent"
    },
    {
      icon: Globe,
      phase: "Phase 4: Scale",
      timeline: "2028-2029",
      title: "Global Rollout",
      description: "Weltweiter Launch mit voller Feature-Palette",
      milestones: [
        "Web 4.0 Production Launch",
        "1B+ Nutzer Onboarding-Kampagne",
        "Integration bestehender Services",
        "Etablierung als neuer Internet-Standard"
      ],
      teams: ["Global Operations", "Marketing", "Partner Integration"],
      color: "success"
    },
    {
      icon: Sparkles,
      phase: "Phase 5: Evolution",
      timeline: "2029+",
      title: "Kontinuierliche Evolution",
      description: "Stetige Verbesserung und Anpassung an neue Technologien",
      milestones: [
        "Brain-Computer Interface Integration",
        "Holographische Interfaces",
        "Quantum Internet Backbone",
        "Interplanetare Netzwerk-Erweiterung"
      ],
      teams: ["Research & Innovation", "Future Tech Team"],
      color: "primary"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 flex items-center justify-center gap-4 text-gradient">
            <Rocket className="w-10 h-10" />
            Roadmap zur Umsetzung
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Der Weg von der Vision zur Realität – in fünf strategischen Phasen
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-success opacity-30 hidden md:block"></div>

          <div className="space-y-8">
            {phases.map((phase, index) => {
              const Icon = phase.icon;
              
              return (
                <div
                  key={index}
                  className="relative animate-fade-in"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-6 top-6 w-5 h-5 rounded-full bg-primary border-4 border-background z-10 hidden md:block"></div>

                  <div className="md:ml-20 glass rounded-2xl p-6 md:p-8 border-primary/20 hover:border-primary/40 transition-all duration-300">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className={`p-4 bg-${phase.color}/20 rounded-xl h-fit`}>
                        <Icon className={`w-8 h-8 text-${phase.color}`} />
                      </div>

                      <div className="flex-grow">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className="text-sm font-bold px-3 py-1 bg-primary/20 rounded-full text-primary">
                            {phase.phase}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {phase.timeline}
                          </span>
                        </div>

                        <h3 className="text-2xl font-bold mb-2">{phase.title}</h3>
                        <p className="text-muted-foreground mb-4">{phase.description}</p>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-sm font-bold mb-3 text-primary">Key Milestones</h4>
                            <ul className="space-y-2">
                              {phase.milestones.map((milestone, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <span className="text-success mt-0.5">✓</span>
                                  <span>{milestone}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="text-sm font-bold mb-3 text-secondary">Teams Involved</h4>
                            <div className="flex flex-wrap gap-2">
                              {phase.teams.map((team, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs px-3 py-1 bg-secondary/20 rounded-full text-secondary"
                                >
                                  {team}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-12 text-center glass rounded-2xl p-8 border-primary/30">
          <h3 className="text-2xl font-bold mb-4 text-gradient">Werden Sie Teil der Revolution</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Web 4.0 ist ein offenes Ökosystem. Entwickler, Forscher und Visionäre sind eingeladen, 
            an diesem historischen Projekt mitzuwirken und die Zukunft des Internets aktiv zu gestalten.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <span className="px-4 py-2 bg-primary/20 rounded-full text-primary font-semibold text-sm">
              Open Source
            </span>
            <span className="px-4 py-2 bg-secondary/20 rounded-full text-secondary font-semibold text-sm">
              Community-Driven
            </span>
            <span className="px-4 py-2 bg-accent/20 rounded-full text-accent font-semibold text-sm">
              Transparent Governance
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
