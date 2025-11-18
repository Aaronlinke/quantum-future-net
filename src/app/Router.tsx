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
