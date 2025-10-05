import { Sparkles, Brain, Shield, Leaf, Network, Atom } from "lucide-react";

const Web4VisionSection = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/30 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />
      </div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-gradient">
            Web 4.0: Das Intuitive Internet
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Eine fundamentale Neukonzeption des Internets – autonom, ethisch, nachhaltig und menschenzentriert
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="glass rounded-2xl p-6 border-primary/30 hover:border-primary/60 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/20 rounded-xl">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Intent-Driven</h3>
            </div>
            <p className="text-muted-foreground">
              Das System versteht nicht nur Daten, sondern auch Absichten und Kontext. Es agiert proaktiv und vorausschauend.
            </p>
          </div>

          <div className="glass rounded-2xl p-6 border-secondary/30 hover:border-secondary/60 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-secondary/20 rounded-xl">
                <Sparkles className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold">Agentenbasiert</h3>
            </div>
            <p className="text-muted-foreground">
              Autonome KI-Agenten handeln im Auftrag des Nutzers über dezentrale Netzwerke hinweg.
            </p>
          </div>

          <div className="glass rounded-2xl p-6 border-accent/30 hover:border-accent/60 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-accent/20 rounded-xl">
                <Network className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold">Dezentral</h3>
            </div>
            <p className="text-muted-foreground">
              Durchgängig dezentrale Architektur für maximale Zensurresistenz und Nutzersouveränität.
            </p>
          </div>

          <div className="glass rounded-2xl p-6 border-success/30 hover:border-success/60 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-success/20 rounded-xl">
                <Leaf className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-xl font-bold">Nachhaltig</h3>
            </div>
            <p className="text-muted-foreground">
              Optimierte Protokolle minimieren den Energieverbrauch und fördern grüne Datenverarbeitung.
            </p>
          </div>

          <div className="glass rounded-2xl p-6 border-primary/30 hover:border-primary/60 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/20 rounded-xl">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Ethisch</h3>
            </div>
            <p className="text-muted-foreground">
              Privacy by Design, erklärbare KI und aktive Bias-Minderung sind fundamentale Prinzipien.
            </p>
          </div>

          <div className="glass rounded-2xl p-6 border-secondary/30 hover:border-secondary/60 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-secondary/20 rounded-xl">
                <Atom className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold">Quantum-Ready</h3>
            </div>
            <p className="text-muted-foreground">
              Quantenkommunikation und -kryptographie für unknackbare Sicherheit der Zukunft.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Web4VisionSection;
