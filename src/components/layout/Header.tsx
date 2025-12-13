import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Network className="w-6 h-6 text-primary" />
          <span className="text-2xl font-bold text-gradient">Web 4.0</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <a href="/#vision" className="text-sm font-medium hover:text-primary transition-colors">
            Vision
          </a>
          <a href="/#technology" className="text-sm font-medium hover:text-primary transition-colors">
            Technologie
          </a>
          <a href="/#use-cases" className="text-sm font-medium hover:text-primary transition-colors">
            Use Cases
          </a>
          <a href="/#roadmap" className="text-sm font-medium hover:text-primary transition-colors">
            Roadmap
          </a>
          {user && (
            <>
              <Link to="/agent-marketplace" className="text-sm font-medium hover:text-primary transition-colors">
                Agenten
              </Link>
              <Link to="/my-agents" className="text-sm font-medium hover:text-primary transition-colors">
                Meine Agenten
              </Link>
              <Link to="/knowledge-graph" className="text-sm font-medium hover:text-primary transition-colors">
                Knowledge Graph
              </Link>
              <Link to="/agent-history" className="text-sm font-medium hover:text-primary transition-colors">
                History
              </Link>
              <Link to="/consent-dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                Consent
              </Link>
              <Link to="/multi-agent" className="text-sm font-medium hover:text-primary transition-colors">
                Multi-Agent
              </Link>
              <Link to="/blockchain-did" className="text-sm font-medium hover:text-primary transition-colors">
                Blockchain DID
              </Link>
              <Link to="/p2p-network" className="text-sm font-medium hover:text-primary transition-colors">
                P2P
              </Link>
              <Link to="/ipfs-storage" className="text-sm font-medium hover:text-primary transition-colors">
                IPFS
              </Link>
            </>
          )}
          {user ? (
            <Link to="/profile">
              <Button variant="outline" className="gap-2">
                <User className="w-4 h-4" />
                Profil
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button>Anmelden</Button>
            </Link>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <a
              href="/#vision"
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Vision
            </a>
            <a
              href="/#technology"
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Technologie
            </a>
            <a
              href="/#use-cases"
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Use Cases
            </a>
            <a
              href="/#roadmap"
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Roadmap
            </a>
            {user && (
              <>
                <Link
                  to="/agent-marketplace"
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Agenten
                </Link>
                <Link
                  to="/my-agents"
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Meine Agenten
                </Link>
                <Link
                  to="/knowledge-graph"
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Knowledge Graph
                </Link>
                <Link
                  to="/agent-history"
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  History
                </Link>
                <Link
                  to="/consent-dashboard"
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Consent
                </Link>
                <Link
                  to="/multi-agent"
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Multi-Agent
                </Link>
                <Link
                  to="/blockchain-did"
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blockchain DID
                </Link>
                <Link
                  to="/p2p-network"
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  P2P Netzwerk
                </Link>
                <Link
                  to="/ipfs-storage"
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  IPFS Storage
                </Link>
              </>
            )}
            {user ? (
              <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full gap-2">
                  <User className="w-4 h-4" />
                  Profil
                </Button>
              </Link>
            ) : (
              <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full">Anmelden</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
