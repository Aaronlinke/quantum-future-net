import { Database, Users, Lock } from "lucide-react";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

const Timeline = () => {
  const { ref: ref1, isVisible: isVisible1 } = useScrollAnimation();
  const { ref: ref2, isVisible: isVisible2 } = useScrollAnimation();
  const { ref: ref3, isVisible: isVisible3 } = useScrollAnimation();

  const items = [
    {
      icon: Database,
      title: "Verteilte Datenspeicherung",
      description: "IPFS und ähnliche Protokolle ersetzen zentrale Server",
      ref: ref1,
      isVisible: isVisible1,
    },
    {
      icon: Users,
      title: "Peer-to-Peer Kommunikation",
      description: "Direkte Verbindungen ohne Zwischeninstanzen",
      ref: ref2,
      isVisible: isVisible2,
    },
    {
      icon: Lock,
      title: "Blockchain-basierte Identitäten",
      description: "Nutzer besitzen ihre digitalen Identitäten vollständig",
      ref: ref3,
      isVisible: isVisible3,
    },
  ];

  return (
    <div className="space-y-8">
      {items.map((item, idx) => (
        <div
          key={idx}
          ref={item.ref}
          className={`glass rounded-2xl p-6 transition-all duration-700 ${
            item.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
          style={{ transitionDelay: `${idx * 150}ms` }}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
              <item.icon className="w-6 h-6 text-secondary" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
