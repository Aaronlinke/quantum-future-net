import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TechnologySection from "@/components/TechnologySection";
import SecuritySection from "@/components/SecuritySection";
import SustainabilitySection from "@/components/SustainabilitySection";
import DecentralizedSection from "@/components/DecentralizedSection";
import ParticipationSection from "@/components/ParticipationSection";
import LexUniversalisSection from "@/components/LexUniversalisSection";
import Footer from "@/components/Footer";
import AIChat from "@/components/AIChat";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <TechnologySection />
        <SecuritySection />
        <SustainabilitySection />
        <DecentralizedSection />
        <LexUniversalisSection />
        <ParticipationSection />
      </main>
      <Footer />
      <AIChat />
    </div>
  );
};

export default Index;
