import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import App from './App';
import HomePage from '@/features/homepage/pages/HomePage';
import NotFound from '@/pages/NotFound';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import DataPods from '@/pages/DataPods';
import Consent from '@/pages/Consent';
import AgentMarketplace from '@/pages/AgentMarketplace';
import MyAgents from '@/pages/MyAgents';
import KnowledgeGraph from '@/pages/KnowledgeGraph';
import AdminDashboard from '@/pages/AdminDashboard';
import AgentHistory from '@/pages/AgentHistory';
import ConsentDashboard from '@/pages/ConsentDashboard';
import MultiAgentDashboard from '@/pages/MultiAgentDashboard';
import BlockchainDID from '@/pages/BlockchainDID';
import P2PNetwork from '@/pages/P2PNetwork';
import AnimationsDemo from '@/pages/AnimationsDemo';
import IPFSStorage from '@/pages/IPFSStorage';
import { AuthProvider } from '@/hooks/useAuth';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'auth',
        element: <Auth />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'data-pods',
        element: <DataPods />,
      },
      {
        path: 'consent',
        element: <Consent />,
      },
      {
        path: 'agent-marketplace',
        element: <AgentMarketplace />,
      },
      {
        path: 'my-agents',
        element: <MyAgents />,
      },
      {
        path: 'knowledge-graph',
        element: <KnowledgeGraph />,
      },
      {
        path: 'admin',
        element: <AdminDashboard />,
      },
      {
        path: 'agent-history',
        element: <AgentHistory />,
      },
      {
        path: 'consent-dashboard',
        element: <ConsentDashboard />,
      },
      {
        path: 'multi-agent',
        element: <MultiAgentDashboard />,
      },
      {
        path: 'blockchain-did',
        element: <BlockchainDID />,
      },
      {
        path: 'p2p-network',
        element: <P2PNetwork />,
      },
      {
        path: 'animations',
        element: <AnimationsDemo />,
      },
      {
        path: 'ipfs-storage',
        element: <IPFSStorage />,
      },
    ],
  },
]);

export function AppRouter() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <RouterProvider router={router} />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
