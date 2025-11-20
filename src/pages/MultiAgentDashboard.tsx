import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Network, Brain, Zap, Shield, Activity, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Agent {
  id: string;
  name: string;
  category: string;
  description: string;
  capabilities: any;
  rating: number;
  status: 'active' | 'idle' | 'processing';
  hierarchy_level: number;
}

export default function MultiAgentDashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [activeTab, setActiveTab] = useState('hierarchy');

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    try {
      const { data: agentsData, error } = await supabase
        .from('agents')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      // Assign hierarchy levels based on category
      const hierarchicalAgents = agentsData?.map((agent: any) => ({
        ...agent,
        status: 'idle' as const,
        hierarchy_level: getHierarchyLevel(agent.category)
      })) || [];

      setAgents(hierarchicalAgents);
    } catch (error) {
      console.error('Error loading agents:', error);
      toast.error('Fehler beim Laden der Agenten');
    } finally {
      setLoading(false);
    }
  };

  const getHierarchyLevel = (category: string): number => {
    const levels: Record<string, number> = {
      'orchestrator': 1,
      'director': 2,
      'manager': 3,
      'specialist': 4
    };
    return levels[category.toLowerCase()] || 4;
  };

  const getHierarchyColor = (level: number): string => {
    const colors = {
      1: 'from-purple-500 to-pink-500',
      2: 'from-blue-500 to-cyan-500',
      3: 'from-green-500 to-emerald-500',
      4: 'from-orange-500 to-amber-500'
    };
    return colors[level as keyof typeof colors] || colors[4];
  };

  const renderHierarchyView = () => {
    const grouped = agents.reduce((acc, agent) => {
      const level = agent.hierarchy_level;
      if (!acc[level]) acc[level] = [];
      acc[level].push(agent);
      return acc;
    }, {} as Record<number, Agent[]>);

    return (
      <div className="space-y-8">
        {Object.entries(grouped)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([level, levelAgents]) => (
            <div key={level} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`h-px flex-1 bg-gradient-to-r ${getHierarchyColor(Number(level))}`} />
                <Badge variant="outline" className="px-4 py-2">
                  Level {level}
                </Badge>
                <div className={`h-px flex-1 bg-gradient-to-l ${getHierarchyColor(Number(level))}`} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {levelAgents.map((agent) => (
                  <Card 
                    key={agent.id}
                    className="cursor-pointer transition-all hover:scale-105 hover:shadow-xl border-2"
                    onClick={() => setSelectedAgent(agent)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Brain className="h-5 w-5" />
                            {agent.name}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {agent.description}
                          </CardDescription>
                        </div>
                        <Badge 
                          variant={agent.status === 'active' ? 'default' : 'secondary'}
                          className="ml-2"
                        >
                          {agent.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(agent.capabilities) && agent.capabilities.map((cap: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {cap}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Rating: {agent.rating || 0}
                          </span>
                        </div>
                        <Badge variant="secondary">{agent.category}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
      </div>
    );
  };

  const renderNetworkView = () => (
    <div className="relative h-[600px] rounded-lg border bg-muted/20 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Network className="h-16 w-16 mx-auto text-muted-foreground" />
        <div>
          <h3 className="text-lg font-semibold">Netzwerk-Visualisierung</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Interaktive Netzwerk-Ansicht der Agent-Beziehungen
          </p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-96">
          <Activity className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            Multi-Agent System
          </h1>
          <p className="text-muted-foreground mt-2">
            Hierarchische KI-Agenten Orchestrierung
          </p>
        </div>
        <div className="flex gap-2">
          <Card className="px-4 py-2">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-xs text-muted-foreground">Aktive Agenten</div>
                <div className="text-lg font-bold">{agents.length}</div>
              </div>
            </div>
          </Card>
          <Card className="px-4 py-2">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="text-xs text-muted-foreground">Status</div>
                <div className="text-lg font-bold">Operational</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="hierarchy">Hierarchie</TabsTrigger>
          <TabsTrigger value="network">Netzwerk</TabsTrigger>
        </TabsList>
        
        <TabsContent value="hierarchy" className="mt-6">
          {renderHierarchyView()}
        </TabsContent>
        
        <TabsContent value="network" className="mt-6">
          {renderNetworkView()}
        </TabsContent>
      </Tabs>

      {selectedAgent && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6" />
              Ausgewählter Agent: {selectedAgent.name}
            </CardTitle>
            <CardDescription>
              Level {selectedAgent.hierarchy_level} • {selectedAgent.category}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">{selectedAgent.description}</p>
            <div className="flex gap-2">
              <Button onClick={() => toast.success(`${selectedAgent.name} wird ausgeführt...`)}>
                Agent ausführen
              </Button>
              <Button variant="outline" onClick={() => setSelectedAgent(null)}>
                Schließen
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}