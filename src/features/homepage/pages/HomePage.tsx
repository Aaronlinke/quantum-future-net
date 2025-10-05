import HeroSection from '../components/HeroSection';
import Web4VisionSection from '../components/Web4VisionSection';
import ArchitectureLayersSection from '../components/ArchitectureLayersSection';
import TechnologySection from '../components/TechnologySection';
import AutonomousAgentsSection from '../components/AutonomousAgentsSection';
import DecentralizedSection from '../components/DecentralizedSection';
import SecuritySection from '../components/SecuritySection';
import SustainabilitySection from '../components/SustainabilitySection';
import LexUniversalisSection from '../components/LexUniversalisSection';
import ParticipationSection from '../components/ParticipationSection';
import AIChatWindow from '@/features/chat/components/AIChatWindow';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <Web4VisionSection />
      <ArchitectureLayersSection />
      <TechnologySection />
      <AutonomousAgentsSection />
      <DecentralizedSection />
      <SecuritySection />
      <SustainabilitySection />
      <LexUniversalisSection />
      <ParticipationSection />
      <AIChatWindow />
    </div>
  );
};

export default HomePage;
