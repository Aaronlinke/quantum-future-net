import { Rocket, Mail, Github, Twitter, Linkedin, MessageSquare } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/40 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/40 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="glass rounded-3xl p-12 md:p-16 border-2 border-primary/30 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-8">
            <Rocket className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">Die Zukunft beginnt jetzt</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
            Sei Teil der Web 4.0 Revolution
          </h2>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Registriere dich jetzt für frühen Zugang zum Testnet, erhalte exklusive Updates 
            und gestalte die Zukunft des Internets aktiv mit.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button className="px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/20">
              Early Access anfordern
            </button>
            <button className="px-8 py-4 glass rounded-xl font-bold text-lg border-2 border-primary/30 hover:border-primary/50 transition-all duration-300 hover:scale-105">
              Whitepaper lesen
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="p-6 glass rounded-xl border border-border/20">
              <div className="text-4xl font-bold text-primary mb-2">10k+</div>
              <p className="text-sm text-muted-foreground">Entwickler auf der Warteliste</p>
            </div>
            <div className="p-6 glass rounded-xl border border-border/20">
              <div className="text-4xl font-bold text-secondary mb-2">50+</div>
              <p className="text-sm text-muted-foreground">Partner-Organisationen</p>
            </div>
            <div className="p-6 glass rounded-xl border border-border/20">
              <div className="text-4xl font-bold text-accent mb-2">2025</div>
              <p className="text-sm text-muted-foreground">Testnet Launch</p>
            </div>
          </div>

          <div className="border-t border-border/20 pt-8">
            <h3 className="text-xl font-bold mb-6">Bleib verbunden</h3>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="#"
                className="p-4 glass rounded-xl border border-border/20 hover:border-primary/40 transition-all duration-300 hover:scale-110"
                aria-label="Discord"
              >
                <MessageSquare className="w-6 h-6 text-primary" />
              </a>
              <a
                href="#"
                className="p-4 glass rounded-xl border border-border/20 hover:border-primary/40 transition-all duration-300 hover:scale-110"
                aria-label="GitHub"
              >
                <Github className="w-6 h-6 text-primary" />
              </a>
              <a
                href="#"
                className="p-4 glass rounded-xl border border-border/20 hover:border-primary/40 transition-all duration-300 hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter className="w-6 h-6 text-primary" />
              </a>
              <a
                href="#"
                className="p-4 glass rounded-xl border border-border/20 hover:border-primary/40 transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-6 h-6 text-primary" />
              </a>
              <a
                href="#"
                className="p-4 glass rounded-xl border border-border/20 hover:border-primary/40 transition-all duration-300 hover:scale-110"
                aria-label="Newsletter"
              >
                <Mail className="w-6 h-6 text-primary" />
              </a>
            </div>
          </div>

          <div className="mt-12 p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border border-primary/20">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Open Source • Community-Driven • Decentralized by Design</strong>
              <br />
              Web 4.0 gehört niemanden und allen gleichzeitig. Gemeinsam erschaffen wir ein Internet, 
              das wirklich für die Menschen da ist.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;