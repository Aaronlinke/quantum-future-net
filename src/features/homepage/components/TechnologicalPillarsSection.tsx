import { Atom, Lock, Database, Brain, Cpu, Wifi } from "lucide-react";
import { useState } from "react";

const TechnologicalPillarsSection = () => {
  const [activePillar, setActivePillar] = useState(0);

  const pillars = [
    {
      icon: Atom,
      title: "Quantenkommunikation",
      subtitle: "Unknackbare Sicherheit",
      description: "Quantenverschränkung ermöglicht instantane, absolut sichere Datenübertragung. Jeder Abhörversuch verändert den Quantenzustand und wird sofort erkannt.",
      features: [
        "Quantenschlüsselverteilung (QKD) für perfekte Kryptographie",
        "Quantenrepeater für globale Reichweite",
        "Post-Quantum-Algorithmen als Fallback-Layer"
      ],
      color: "primary"
    },
    {
      icon: Lock,
      title: "Dezentrale Ledger",
      subtitle: "Beyond Blockchain",
      description: "Neue Formen von Directed Acyclic Graphs (DAGs) und Byzantine Fault Tolerance ersetzen energieintensive Proof-of-Work Systeme.",
      features: [
        "DAG-basierte Konsensmechanismen (10.000+ TPS)",
        "Sharding für unbegrenzte Skalierbarkeit",
        "Zero-Knowledge Proofs für Privacy"
      ],
      color: "secondary"
    },
    {
      icon: Database,
      title: "Knowledge Graphs",
      subtitle: "Semantisches Web 2.0",
      description: "Globale, dezentrale Wissensnetzwerke ermöglichen dynamische Schlussfolgerungen und automatische Kontextbildung aus vernetzten Daten.",
      features: [
        "RDF und SPARQL für universelle Datenabfragen",
        "Ontologie-gestützte Reasoning-Engines",
        "Federated Learning über verteilte Graphen"
      ],
      color: "accent"
    },
    {
      icon: Brain,
      title: "Generative AI",
      subtitle: "Autonome Agenten",
      description: "Foundation Models und Multi-Agent-Systeme arbeiten zusammen, um komplexe Aufgaben autonom zu lösen und Interfaces dynamisch zu generieren.",
      features: [
        "Multi-Modal Foundation Models (Text, Vision, Audio)",
        "Reinforcement Learning für Agent-Optimierung",
        "Explainable AI (XAI) für Transparenz"
      ],
      color: "success"
    },
    {
      icon: Cpu,
      title: "Edge Computing",
      subtitle: "Dezentrale Berechnung",
      description: "Fog und Edge Computing bringen die Verarbeitung näher zum Nutzer, reduzieren Latenz und erhöhen Privatsphäre durch lokale Datenverarbeitung.",
      features: [
        "WebAssembly für sichere Edge-Execution",
        "Homomorphic Encryption für verschlüsselte Berechnungen",
        "IoT-Integration mit energieautonomen Nodes"
      ],
      color: "primary"
    },
    {
      icon: Wifi,
      title: "6G & Optical Networks",
      subtitle: "Terabit-Geschwindigkeit",
      description: "Li-Fi und 6G-Netze ermöglichen Terabit-Geschwindigkeiten mit Ultra-Low-Latency für Echtzeit-Anwendungen wie holographische Telepräsenz.",
      features: [
        "Li-Fi mit 224 Gbit/s für Indoor-Netze",
        "6G mit Sub-Millisekunden-Latenz",
        "Optische Schaltkreise für Energie-Effizienz"
      ],
      color: "secondary"
    }
  ];

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "3s" }} />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Technologische Säulen
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Die fundamentalen Technologien, die Web 4.0 möglich machen
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            const isActive = activePillar === index;
            
            return (
              <div
                key={index}
                onClick={() => setActivePillar(index)}
                className={`glass rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  isActive ? 'border-2 border-primary shadow-lg shadow-primary/20' : 'border border-primary/20'
                }`}
              >
                <div className={`p-4 bg-${pillar.color}/20 rounded-xl w-fit mb-4`}>
                  <Icon className={`w-8 h-8 text-${pillar.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-2">{pillar.title}</h3>
                <p className="text-sm text-primary font-semibold mb-2">{pillar.subtitle}</p>
                <p className="text-sm text-muted-foreground">{pillar.description}</p>
              </div>
            );
          })}
        </div>

        <div className="glass rounded-3xl p-8 border-2 border-primary/30 animate-fade-in">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="text-primary">→</span>
            {pillars[activePillar].title}: Key Features
          </h3>
          <ul className="space-y-4">
            {pillars[activePillar].features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <span className="text-success text-xl mt-1">✓</span>
                <span className="text-lg text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default TechnologicalPillarsSection;
