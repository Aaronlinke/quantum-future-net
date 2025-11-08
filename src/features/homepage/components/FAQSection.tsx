import { HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Was ist Web 4.0 genau?",
      answer: "Web 4.0 ist die nächste Generation des Internets, die auf Intent-Driven Interaction, autonomen KI-Agenten, Quantenkommunikation und vollständiger Dezentralisierung basiert. Es überwindet die Limitierungen von Web 2.0 (Zentralisierung) und Web 3.0 (begrenzte Skalierbarkeit) durch ein komplett neues Architektur-Paradigma."
    },
    {
      question: "Wie unterscheidet sich Web 4.0 von Web 3.0?",
      answer: "Während Web 3.0 primär auf Blockchain und Token-Economy fokussiert ist, geht Web 4.0 weit darüber hinaus: Es integriert autonome KI-Agenten, die in deinem Auftrag handeln, verwendet Quantenkommunikation für ultimative Sicherheit, und implementiert echte Intent-Based Interfaces, wo du nicht mehr mit Anwendungen interagierst, sondern einfach deine Absicht ausdrückst."
    },
    {
      question: "Wann wird Web 4.0 verfügbar sein?",
      answer: "Die Entwicklung läuft bereits. Phase 1 (Foundation & Protocol) ist für 2025-2026 geplant, das öffentliche Testnet für 2026-2027, und der globale Rollout für 2028-2029. Early Adopters können sich bereits jetzt für das geschlossene Alpha-Programm registrieren."
    },
    {
      question: "Ist Web 4.0 Open Source?",
      answer: "Ja, absolut! Alle Core-Protokolle, das Meta-Framework und grundlegende Tools werden als Open Source unter der MIT-Lizenz veröffentlicht. Wir glauben an Community-Driven Development und Transparenz auf allen Ebenen."
    },
    {
      question: "Wie sicher ist Web 4.0?",
      answer: "Web 4.0 nutzt Quantenkommunikation (QKD) für unknackbare Verschlüsselung, Zero-Knowledge Proofs für Privacy, und eine vollständig dezentralisierte Architektur, die Single Points of Failure eliminiert. Zusätzlich sind alle Agenten mit Explainable AI (XAI) und Audit-Trails ausgestattet."
    },
    {
      question: "Kann ich bestehende Web 2.0/3.0 Apps migrieren?",
      answer: "Ja! Web 4.0 ist rückwärtskompatibel durch Interoperabilitäts-Bridges. Du kannst bestehende Services schrittweise migrieren und von den neuen Features profitieren, ohne alles neu entwickeln zu müssen."
    },
    {
      question: "Was sind autonome Agenten?",
      answer: "Autonome Agenten sind KI-Entitäten, die in deinem Auftrag handeln können – sie suchen Informationen, führen Transaktionen durch, koordinieren mit anderen Agenten, und optimieren Prozesse, ohne dass du jeden Schritt manuell ausführen musst. Sie verstehen deine Absicht (Intent) und handeln entsprechend."
    },
    {
      question: "Wie wird die Nachhaltigkeit sichergestellt?",
      answer: "Web 4.0 verwendet energieeffiziente DAG-basierte Konsens-Mechanismen statt Proof-of-Work, nutzt Edge Computing zur Reduzierung von Datenübertragung, und implementiert Green-by-Design Prinzipien auf allen Architektur-Ebenen. Unser Ziel: 90% weniger Energieverbrauch als Web 2.0."
    },
    {
      question: "Brauche ich technisches Wissen, um Web 4.0 zu nutzen?",
      answer: "Nein! Während die Technologie hochkomplex ist, sind die Interfaces intuitiv und intent-basiert. Du interagierst mit deinem persönlichen KI-Agenten in natürlicher Sprache oder durch adaptive UIs, die sich an deine Bedürfnisse anpassen."
    },
    {
      question: "Wer steckt hinter Web 4.0?",
      answer: "Web 4.0 ist ein globales, Open-Source Projekt ohne zentrale Kontrolle. Es wird von einer Allianz aus Forschungsinstitutionen, Tech-Unternehmen, unabhängigen Entwicklern und einer wachsenden Community entwickelt. Governance erfolgt transparent über dezentrale Mechanismen."
    }
  ];

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-full mb-6">
            <HelpCircle className="w-5 h-5 text-accent" />
            <span className="text-sm font-semibold text-accent">Häufig gestellte Fragen</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
            FAQ zu Web 4.0
          </h2>
          <p className="text-xl text-muted-foreground">
            Antworten auf die wichtigsten Fragen zur Zukunft des Internets
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <div
                key={index}
                className="glass rounded-2xl border border-border/20 overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-6 flex items-center justify-between text-left hover:bg-primary/5 transition-colors"
                >
                  <h3 className="text-lg font-bold pr-4">{faq.question}</h3>
                  <ChevronDown
                    className={`w-6 h-6 text-primary transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="p-6 pt-0 text-muted-foreground">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center glass rounded-2xl p-8 border-2 border-accent/30">
          <h3 className="text-2xl font-bold mb-4">Weitere Fragen?</h3>
          <p className="text-muted-foreground mb-6">
            Unser Team und die Community sind hier, um zu helfen. Trete unserem Discord bei oder 
            schau in unsere umfangreiche Dokumentation.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-6 py-3 bg-accent text-accent-foreground rounded-xl font-semibold hover:bg-accent/90 transition-colors">
              Discord Community
            </button>
            <button className="px-6 py-3 glass rounded-xl font-semibold border border-border/20 hover:border-accent/40 transition-colors">
              Dokumentation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;