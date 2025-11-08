import HeroSection from '../components/HeroSection';
import Web4VisionSection from '../components/Web4VisionSection';
import WebEvolutionSection from '../components/WebEvolutionSection';
import ArchitectureLayersSection from '../components/ArchitectureLayersSection';
import TechnologicalPillarsSection from '../components/TechnologicalPillarsSection';
import TechnologySection from '../components/TechnologySection';
import AutonomousAgentsSection from '../components/AutonomousAgentsSection';
import DataSovereigntySection from '../components/DataSovereigntySection';
import DecentralizedSection from '../components/DecentralizedSection';
import SecuritySection from '../components/SecuritySection';
import SustainabilitySection from '../components/SustainabilitySection';
import UseCasesSection from '../components/UseCasesSection';
import DeveloperHubSection from '../components/DeveloperHubSection';
import EcosystemSection from '../components/EcosystemSection';
import RoadmapSection from '../components/RoadmapSection';
import FAQSection from '../components/FAQSection';
import LexUniversalisSection from '../components/LexUniversalisSection';
import ParticipationSection from '../components/ParticipationSection';
import CTASection from '../components/CTASection';
import AIChatWindow from '@/features/chat/components/AIChatWindow';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <Web4VisionSection />
      <WebEvolutionSection />
      <ArchitectureLayersSection />
      <TechnologicalPillarsSection />
      <TechnologySection />
      <AutonomousAgentsSection />
      <DataSovereigntySection />
      <DecentralizedSection />
      <SecuritySection />
      <SustainabilitySection />
      <UseCasesSection />
      <DeveloperHubSection />
      <EcosystemSection />
      <RoadmapSection />
      <FAQSection />
      <LexUniversalisSection />
      <ParticipationSection />
      <CTASection />
      <AIChatWindow />
    </div>
  );
};

export default HomePage;
