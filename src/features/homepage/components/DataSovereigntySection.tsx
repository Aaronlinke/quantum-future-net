import { Shield, Key, Lock, UserCheck, Database, Eye } from "lucide-react";

const DataSovereigntySection = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="glass rounded-3xl p-8 md:p-12 border-primary/30 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/30 to-transparent" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 flex items-center gap-4 text-gradient">
              <Shield className="w-10 h-10" />
              Daten-Souveränität & Identität
            </h2>
            
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
              Volle Kontrolle über Ihre digitale Identität und Ihre Daten – ohne Mittelsmänner
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="p-3 bg-primary/20 rounded-xl h-fit">
                    <Key className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Dezentrale Identität (DID)</h3>
                    <p className="text-muted-foreground">
                      Selbst-souveräne Identitäten nach W3C-Standard. Sie kontrollieren Ihre ID vollständig – keine zentrale Autorität kann sie widerrufen oder manipulieren.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="p-3 bg-secondary/20 rounded-xl h-fit">
                    <Database className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Personal Data Pods (PDPs)</h3>
                    <p className="text-muted-foreground">
                      Ihre Daten leben in verschlüsselten, persönlichen Pods unter Ihrer Kontrolle. Apps greifen nur mit expliziter, granularer Erlaubnis zu.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="p-3 bg-accent/20 rounded-xl h-fit">
                    <Lock className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Zero-Knowledge Proofs</h3>
                    <p className="text-muted-foreground">
                      Beweisen Sie Eigenschaften über Ihre Daten (z.B. Alter über 18), ohne die Daten selbst preiszugeben. Ultimative Privacy.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="p-3 bg-success/20 rounded-xl h-fit">
                    <UserCheck className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Verifiable Credentials</h3>
                    <p className="text-muted-foreground">
                      Digital signierte Nachweise (Diplome, Zertifikate, Lizenzen) in Ihrer Wallet. Kryptographisch verifizierbar ohne zentrale Datenbank.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="p-3 bg-primary/20 rounded-xl h-fit">
                    <Eye className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Consent Management</h3>
                    <p className="text-muted-foreground">
                      Granulare Kontrolle darüber, wer welche Daten wann nutzen darf. Jederzeit widerrufbar mit sofortiger Wirkung über alle Services hinweg.
                    </p>
                  </div>
                </div>

                <div className="glass rounded-xl p-6 border-primary/30">
                  <h4 className="text-lg font-bold mb-3 text-primary">Privacy by Design</h4>
                  <p className="text-sm text-muted-foreground">
                    Datenschutz ist kein nachträgliches Feature, sondern fundamentales Architekturprinzip. 
                    Verschlüsselung, Minimierung und User-Consent sind in jede Ebene eingebaut.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 glass rounded-xl border-primary/20">
                <div className="text-4xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Nutzer-Kontrolle über Daten</div>
              </div>
              <div className="text-center p-6 glass rounded-xl border-secondary/20">
                <div className="text-4xl font-bold text-secondary mb-2">0</div>
                <div className="text-sm text-muted-foreground">Zentrale Single Points of Failure</div>
              </div>
              <div className="text-center p-6 glass rounded-xl border-accent/20">
                <div className="text-4xl font-bold text-accent mb-2">∞</div>
                <div className="text-sm text-muted-foreground">Skalierbarkeit durch Dezentralisierung</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataSovereigntySection;
