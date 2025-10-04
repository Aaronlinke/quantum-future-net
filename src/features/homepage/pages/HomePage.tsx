import HeroSection from '../components/HeroSection';
import TechnologySection from '../components/TechnologySection';
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
      <TechnologySection />
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
