import { Stethoscope, GraduationCap, Landmark, ShoppingBag, Car, Building } from "lucide-react";

const UseCasesSection = () => {
  const useCases = [
    {
      icon: Stethoscope,
      title: "Gesundheitswesen",
      description: "Ihre medizinischen Daten in Ihrem persönlichen Pod. Ärzte greifen nur mit expliziter Erlaubnis zu. KI-Agenten überwachen Ihre Gesundheit und warnen proaktiv.",
      benefits: [
        "Vollständige Patientensouveränität",
        "Interoperabilität zwischen allen Kliniken",
        "KI-gestützte Früherkennung"
      ],
      color: "destructive"
    },
    {
      icon: GraduationCap,
      title: "Bildung",
      description: "Personalisierte Lernpfade durch adaptive KI-Tutoren. Verifiable Credentials für Abschlüsse. Dezentrale Peer-to-Peer-Lernplattformen.",
      benefits: [
        "Lebenslanger, portabler Bildungsnachweis",
        "Hyper-personalisierte Lernerfahrung",
        "Globaler Zugang zu Wissen"
      ],
      color: "primary"
    },
    {
      icon: Landmark,
      title: "Governance & Demokratie",
      description: "Transparente, manipulationssichere Wahlen über Blockchain. Partizipative Entscheidungsfindung durch dezentrale autonome Organisationen (DAOs).",
      benefits: [
        "Unveränderbare Abstimmungsergebnisse",
        "Direkte Bürgerbeteiligung",
        "Transparente Mittelverwendung"
      ],
      color: "secondary"
    },
    {
      icon: ShoppingBag,
      title: "E-Commerce & Supply Chain",
      description: "Lückenlose Produktverfolgung vom Ursprung bis zum Verbraucher. Smart Contracts für automatische Transaktionen. KI-optimierte Lieferketten.",
      benefits: [
        "100% Produkttransparenz",
        "Faire Bezahlung für Produzenten",
        "Effiziente, nachhaltige Logistik"
      ],
      color: "accent"
    },
    {
      icon: Car,
      title: "Mobilität & Smart Cities",
      description: "Autonome Fahrzeuge kommunizieren über dezentrale Netze. IoT-Sensoren optimieren Verkehrsfluss in Echtzeit. Nahtlose Multimodal-Reiseplanung.",
      benefits: [
        "Zero-Emission-Mobilitätsökosysteme",
        "Optimierte Verkehrsströme",
        "Sichere V2V-Kommunikation"
      ],
      color: "success"
    },
    {
      icon: Building,
      title: "Energie & Infrastruktur",
      description: "Dezentrale Energienetze mit Peer-to-Peer-Stromhandel. Smart Grids optimieren Verbrauch durch KI. Blockchain-basierte Energiezertifikate.",
      benefits: [
        "100% erneuerbare Energiequellen",
        "Demokratisierung der Energieversorgung",
        "Optimale Ressourcennutzung"
      ],
      color: "primary"
    }
  ];

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-success/30 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            Web 4.0 Use Cases
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Konkrete Anwendungen der Vision in allen Lebensbereichen
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            
            return (
              <div
                key={index}
                className="glass rounded-2xl p-6 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`p-4 bg-${useCase.color}/20 rounded-xl w-fit mb-4`}>
                  <Icon className={`w-8 h-8 text-${useCase.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{useCase.title}</h3>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                  {useCase.description}
                </p>
                <div className="space-y-2">
                  {useCase.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-success text-sm mt-0.5">✓</span>
                      <span className="text-xs text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
