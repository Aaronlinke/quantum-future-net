import { Bot, X, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AIChatWindow = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hallo! Ich bin Ihr KI-Assistent für die Zukunft des Internets. Fragen Sie mich über Quanteninternet, Blockchain oder dezentrale Netzwerke!",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Quanteninternet nutzt Verschränkung für absolute Sicherheit.",
        "Dezentrale Netzwerke eliminieren Single Points of Failure.",
        "Post-Quanten-Kryptographie schützt vor zukünftigen Bedrohungen.",
        "Zero-Knowledge-Proofs ermöglichen Privatsphäre ohne Kompromisse.",
        "Das neue Internet wird 70% weniger Energie verbrauchen.",
      ];
      const aiMessage: Message = {
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 500);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-accent hover:bg-accent/80 text-white flex items-center justify-center shadow-[0_5px_15px_rgba(0,0,0,0.3)] hover:shadow-[var(--shadow-glow-orange)] transition-all duration-300 animate-pulse-glow z-50"
        aria-label="AI Chat"
      >
        {isOpen ? <X className="w-8 h-8" /> : <Bot className="w-8 h-8" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-28 right-8 w-96 h-[500px] glass rounded-2xl shadow-2xl z-50 flex flex-col">
          <div className="p-4 border-b border-border flex items-center gap-3">
            <Bot className="w-6 h-6 text-accent" />
            <div>
              <h3 className="font-bold">KI-Assistent</h3>
              <p className="text-xs text-muted-foreground">Zukunft des Internets</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === "user"
                      ? "bg-accent text-white"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Frage stellen..."
              className="flex-1"
            />
            <Button onClick={handleSend} size="icon" variant="default">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatWindow;
