import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: ReactNode;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <div className="glass rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_35px_hsl(var(--secondary)/0.3)] group relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <Icon className="w-6 h-6 text-primary group-hover:text-accent transition-colors" />
          <h4 className="text-xl font-semibold">{title}</h4>
        </div>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
