import { Bot, X, Send, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWeb4Chat } from "@/hooks/useWeb4Chat";
import { ScrollArea } from "@/components/ui/scroll-area";

const AIChatWindow = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, sendMessage, isLoading } = useWeb4Chat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const messageText = input;
    setInput("");
    await sendMessage(messageText);
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
        <div className="fixed bottom-28 right-8 w-96 h-[600px] glass rounded-2xl shadow-2xl z-50 flex flex-col animate-scale-in">
          <div className="p-4 border-b border-border/50 flex items-center gap-3 bg-gradient-to-r from-accent/10 to-primary/10">
            <div className="relative">
              <Bot className="w-6 h-6 text-accent animate-pulse" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground">Web 4.0 Assistent</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
                Live & Intelligent
              </p>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-accent to-accent/80 text-white"
                        : "bg-muted/80 backdrop-blur-sm text-foreground border border-border/50"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-muted/80 backdrop-blur-sm p-3 rounded-2xl border border-border/50">
                    <Loader2 className="w-5 h-5 text-accent animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border/50 bg-background/50 backdrop-blur-sm">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Frag mich über Web 4.0..."
                disabled={isLoading}
                className="flex-1 bg-background/80"
              />
              <Button 
                onClick={handleSend} 
                size="icon" 
                variant="default"
                disabled={isLoading || !input.trim()}
                className="bg-accent hover:bg-accent/90"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Powered by Lovable AI 🚀
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatWindow;
