import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  icon: string;
  capabilities: any;
  install_count: number;
  rating: number;
  is_installed?: boolean;
}

const AgentMarketplace = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchAgents();
    }
  }, [user]);

  const fetchAgents = async () => {
    try {
      const { data: agentsData, error: agentsError } = await supabase
        .from('agents')
        .select('*')
        .eq('is_active', true)
        .order('install_count', { ascending: false });

      if (agentsError) throw agentsError;

      const { data: userAgentsData, error: userAgentsError } = await supabase
        .from('user_agents')
        .select('agent_id')
        .eq('user_id', user!.id);

      if (userAgentsError) throw userAgentsError;

      const installedIds = new Set(userAgentsData.map(ua => ua.agent_id));
      
      const agentsWithStatus = agentsData.map(agent => ({
        ...agent,
        is_installed: installedIds.has(agent.id)
      }));

      setAgents(agentsWithStatus);
    } catch (error: any) {
      toast.error('Fehler beim Laden der Agenten: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInstall = async (agentId: string) => {
    try {
      const { error } = await supabase
        .from('user_agents')
        .insert({
          user_id: user!.id,
          agent_id: agentId,
          is_enabled: true
        });

      if (error) throw error;

      await supabase
        .from('agents')
        .update({ install_count: agents.find(a => a.id === agentId)!.install_count + 1 })
        .eq('id', agentId);

      toast.success('Agent erfolgreich installiert!');
      fetchAgents();
    } catch (error: any) {
      toast.error('Fehler bei der Installation: ' + error.message);
    }
  };

  const handleUninstall = async (agentId: string) => {
    try {
      const { error } = await supabase
        .from('user_agents')
        .delete()
        .eq('user_id', user!.id)
        .eq('agent_id', agentId);

      if (error) throw error;

      toast.success('Agent deinstalliert');
      fetchAgents();
    } catch (error: any) {
      toast.error('Fehler beim Deinstallieren: ' + error.message);
    }
  };

  const getIconComponent = (iconName: string): LucideIcon => {
    return (Icons as any)[iconName] || Icons.Bot;
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || agent.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(agents.map(a => a.category)))];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Lade Agent Marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gradient">Agent Marketplace</h1>
          <p className="text-lg text-muted-foreground">
            Entdecken Sie KI-Agenten für Ihr dezentrales Web-Erlebnis
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Input
            placeholder="Agenten durchsuchen..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Kategorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat === 'all' ? 'Alle Kategorien' : cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => navigate('/my-agents')} variant="outline">
            Meine Agenten
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => {
            const IconComponent = getIconComponent(agent.icon);
            return (
              <Card key={agent.id} className="glass border-secondary/30">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <IconComponent className="w-10 h-10 text-primary" />
                    <Badge variant="secondary">{agent.category}</Badge>
                  </div>
                  <CardTitle>{agent.name}</CardTitle>
                  <CardDescription>{agent.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Version:</span>
                      <span className="font-medium">{agent.version}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Installationen:</span>
                      <span className="font-medium">{agent.install_count}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {Array.isArray(agent.capabilities) && agent.capabilities.slice(0, 3).map((cap, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {cap}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {agent.is_installed ? (
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      onClick={() => handleUninstall(agent.id)}
                    >
                      Deinstallieren
                    </Button>
                  ) : (
                    <Button 
                      className="w-full"
                      onClick={() => handleInstall(agent.id)}
                    >
                      Installieren
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Keine Agenten gefunden</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentMarketplace;