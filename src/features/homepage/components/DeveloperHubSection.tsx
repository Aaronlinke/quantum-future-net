import { Code2, BookOpen, Github, Terminal, Blocks, Zap } from "lucide-react";

const DeveloperHubSection = () => {
  const features = [
    {
      icon: Code2,
      title: "Meta-Protokoll SDK",
      description: "Entwickle Anwendungen auf dem Web 4.0 Meta-Protokoll mit unserem TypeScript/Rust SDK",
      badge: "Alpha verfügbar"
    },
    {
      icon: Blocks,
      title: "Agent Builder Kit",
      description: "Erstelle autonome Agenten mit unserem Low-Code Framework und AML (Agent Markup Language)",
      badge: "Coming Soon"
    },
    {
      icon: Terminal,
      title: "CLI Tools",
      description: "Leistungsstarke Command-Line Tools für Deployment, Testing und Monitoring",
      badge: "Beta"
    },
    {
      icon: BookOpen,
      title: "Dokumentation",
      description: "Umfassende API-Referenz, Tutorials und Best Practices für Web 4.0 Entwicklung",
      badge: "Live"
    },
    {
      icon: Github,
      title: "Open Source",
      description: "Alle Core-Komponenten sind Open Source. Fork, contribute, und build with us!",
      badge: "MIT License"
    },
    {
      icon: Zap,
      title: "Testnet Access",
      description: "Erhalte Zugang zum Web 4.0 Testnet und entwickle auf realer Infrastruktur",
      badge: "Früher Zugang"
    }
  ];

  const codeExample = `// Web 4.0 Intent-Based Agent Interaction
import { Agent, Intent } from '@web4/sdk';

const myAgent = new Agent({
  name: 'PersonalAssistant',
  capabilities: ['search', 'summarize', 'schedule']
});

// Intent-driven interaction
const intent = Intent.create({
  goal: 'Find und summarize latest AI research',
  context: { topic: 'quantum computing', maxResults: 5 }
});

const result = await myAgent.execute(intent);
console.log(result.summary);`;

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 rounded-full mb-6">
            <Code2 className="w-5 h-5 text-secondary" />
            <span className="text-sm font-semibold text-secondary">Developer Hub</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Baue die Zukunft mit uns
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Alles was du brauchst, um Web 4.0 Anwendungen und autonome Agenten zu entwickeln
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <div
                key={index}
                className="glass rounded-2xl p-6 border border-border/20 hover:border-secondary/40 transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-secondary/20 rounded-xl">
                    <Icon className="w-6 h-6 text-secondary" />
                  </div>
                  <span className="text-xs px-2 py-1 bg-accent/20 rounded-full text-accent font-semibold">
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>

        <div className="glass rounded-2xl p-8 border-2 border-secondary/30">
          <div className="flex items-center gap-3 mb-6">
            <Terminal className="w-6 h-6 text-secondary" />
            <h3 className="text-2xl font-bold">Quick Start Example</h3>
          </div>
          <div className="bg-background/50 rounded-xl p-6 border border-border/20 overflow-x-auto">
            <pre className="text-sm text-muted-foreground font-mono">
              <code>{codeExample}</code>
            </pre>
          </div>
          <div className="mt-6 flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-secondary text-secondary-foreground rounded-xl font-semibold hover:bg-secondary/90 transition-colors">
              Zur Dokumentation
            </button>
            <button className="px-6 py-3 glass rounded-xl font-semibold border border-border/20 hover:border-secondary/40 transition-colors">
              GitHub Repository
            </button>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="glass rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-primary mb-2">2.5k+</div>
            <p className="text-sm text-muted-foreground">Entwickler im Testnet</p>
          </div>
          <div className="glass rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-secondary mb-2">150+</div>
            <p className="text-sm text-muted-foreground">Open Source Projekte</p>
          </div>
          <div className="glass rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-accent mb-2">24/7</div>
            <p className="text-sm text-muted-foreground">Community Support</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeveloperHubSection;