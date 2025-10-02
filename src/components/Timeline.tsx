import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Timeline = () => {
  const phases = [
    {
      date: "2023-2025",
      title: "Protokolle und Standards",
      description: "Entwicklung der grundlegenden Technologien",
    },
    {
      date: "2026-2028",
      title: "Pilotnetzwerke",
      description: "Test in ausgewählten Städten und Regionen",
    },
    {
      date: "2029-2032",
      title: "Globaler Rollout",
      description: "Schrittweise Migration vom alten zum neuen Internet",
    },
  ];

  return (
    <div className="relative max-w-4xl mx-auto py-12">
      <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-primary/30 -translate-x-1/2 hidden md:block" />
      
      <div className="space-y-12">
        {phases.map((phase, index) => (
          <div
            key={index}
            className={`relative grid md:grid-cols-2 gap-8 items-center ${
              index % 2 === 0 ? "" : "md:text-right"
            }`}
          >
            <div className={index % 2 === 0 ? "" : "md:order-2"}>
              <div className="glass rounded-2xl p-6 border-secondary/30 transition-all duration-500 hover:translate-x-2 hover:shadow-[0_10px_30px_hsl(var(--secondary)/0.3)]">
                <div className="text-success text-xl font-bold mb-3">{phase.date}</div>
                <h4 className="text-2xl font-semibold mb-3">{phase.title}</h4>
                <p className="text-muted-foreground mb-4">{phase.description}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info(`Details für Phase: ${phase.title}`)}
                >
                  Details
                </Button>
              </div>
            </div>
            
            <div className="hidden md:flex justify-center">
              <div className="w-8 h-8 rounded-full bg-primary border-4 border-background shadow-[0_0_20px_hsl(var(--primary)/0.5)] animate-pulse-glow" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
