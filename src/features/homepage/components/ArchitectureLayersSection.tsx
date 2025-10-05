import { Layers, Zap, Database, Users, Globe, Network } from "lucide-react";

const ArchitectureLayersSection = () => {
  const layers = [
    {
      icon: Zap,
      title: "Layer 0: Quantum/Optical",
      subtitle: "Physikalische Infrastruktur",
      description: "Quantenkommunikationsnetzwerke, optische Datenverarbeitung und energieautonome Edge-Knoten bilden die Basis.",
      color: "primary"
    },
    {
      icon: Network,
      title: "Layer 1: Autonomous Fabric",
      subtitle: "Protokolle & Konsens",
      description: "Meta-Protokolle mit Intent-Routing, selbstheilenden Mechanismen und quantenresistenter Verschlüsselung.",
      color: "secondary"
    },
    {
      icon: Database,
      title: "Layer 2: Knowledge Graph",
      subtitle: "Daten & Wissen",
      description: "Globales, dezentrales Wissensnetzwerk mit personalisierten Daten-Pods und unveränderlicher Nachverfolgbarkeit.",
      color: "accent"
    },
    {
      icon: Users,
      title: "Layer 3: Symbiotic AI",
      subtitle: "Autonome Agenten",
      description: "Intelligente Agenten-Ökosysteme mit erklärbarer KI, adaptiven Schnittstellen und ethischer Governance.",
      color: "success"
    },
    {
      icon: Globe,
      title: "Layer 4: Human Experience",
      subtitle: "Anwendung & Erleben",
      description: "Hyper-personalisierte, conversational Interfaces mit nahtloser AR/VR-Integration und emergenten Services.",
      color: "primary"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 flex items-center justify-center gap-4 text-gradient">
            <Layers className="w-10 h-10" />
            Web 4 Architektur-Schichten
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Eine fünfschichtige Architektur, die Komplexität verbirgt und Interoperabilität fördert
          </p>
        </div>

        <div className="space-y-6">
          {layers.map((layer, index) => {
            const Icon = layer.icon;
            return (
              <div
                key={index}
                className="glass rounded-2xl p-6 md:p-8 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-[1.02]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className={`p-4 bg-${layer.color}/20 rounded-xl shrink-0`}>
                    <Icon className={`w-8 h-8 text-${layer.color}`} />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold mb-2">{layer.title}</h3>
                    <p className="text-lg font-semibold text-muted-foreground mb-3">
                      {layer.subtitle}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      {layer.description}
                    </p>
                  </div>
                  <div className="text-6xl font-bold text-primary/10 shrink-0">
                    {index}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ArchitectureLayersSection;
