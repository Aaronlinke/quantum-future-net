import { Bot } from "lucide-react";
import { toast } from "sonner";

const AIChat = () => {
  const handleClick = () => {
    toast.info("KI-Assistent aktiviert! Stellen Sie Ihre Fragen zur Zukunft des Internets.");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-accent hover:bg-accent/80 text-white flex items-center justify-center shadow-[0_5px_15px_rgba(0,0,0,0.3)] hover:shadow-[var(--shadow-glow-orange)] transition-all duration-300 animate-pulse-glow z-50"
      aria-label="AI Chat"
    >
      <Bot className="w-8 h-8" />
    </button>
  );
};

export default AIChat;
