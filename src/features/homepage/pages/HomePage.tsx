import HeroSection from '../components/HeroSection';
import Web4VisionSection from '../components/Web4VisionSection';
import ArchitectureLayersSection from '../components/ArchitectureLayersSection';
import TechnologicalPillarsSection from '../components/TechnologicalPillarsSection';
import TechnologySection from '../components/TechnologySection';
import AutonomousAgentsSection from '../components/AutonomousAgentsSection';
import DataSovereigntySection from '../components/DataSovereigntySection';
import DecentralizedSection from '../components/DecentralizedSection';
import SecuritySection from '../components/SecuritySection';
import SustainabilitySection from '../components/SustainabilitySection';
import UseCasesSection from '../components/UseCasesSection';
import RoadmapSection from '../components/RoadmapSection';
import LexUniversalisSection from '../components/LexUniversalisSection';
import ParticipationSection from '../components/ParticipationSection';
import AIChatWindow from '@/features/chat/components/AIChatWindow';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <Web4VisionSection />
      <ArchitectureLayersSection />
      <TechnologicalPillarsSection />
      <TechnologySection />
      <AutonomousAgentsSection />
      <DataSovereigntySection />
      <DecentralizedSection />
      <SecuritySection />
      <SustainabilitySection />
      <UseCasesSection />
      <RoadmapSection />
      <LexUniversalisSection />
      <ParticipationSection />
      <AIChatWindow />
    </div>
  );
};

export default HomePage;
