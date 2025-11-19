import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useAgentExecution } from '@/hooks/useAgentExecution';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import * as Icons from 'lucide-react';
import { LucideIcon, Play } from 'lucide-react';

interface UserAgent {
  id: string;
  agent_id: string;
  is_enabled: boolean;
  installed_at: string;
  last_used_at: string | null;
  agents: {
    name: string;
    description: string;
    category: string;
    version: string;
    icon: string;
    capabilities: any;
  };
}

const MyAgents = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { executeAgent, executing } = useAgentExecution();
  const [userAgents, setUserAgents] = useState<UserAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [executionInput, setExecutionInput] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserAgents();
    }
  }, [user]);

  const fetchUserAgents = async () => {
    try {
      const { data, error } = await supabase
        .from('user_agents')
        .select(`
          *,
          agents (
            name,
            description,
            category,
            version,
            icon,
            capabilities
          )
        `)
        .eq('user_id', user!.id)
        .order('installed_at', { ascending: false });

      if (error) throw error;
      setUserAgents(data as any);
    } catch (error: any) {
      toast.error('Fehler beim Laden: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleAgent = async (agentId: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from('user_agents')
        .update({ is_enabled: !currentState })
        .eq('user_id', user!.id)
        .eq('id', agentId);

      if (error) throw error;
      
      toast.success(currentState ? 'Agent deaktiviert' : 'Agent aktiviert');
      fetchUserAgents();
    } catch (error: any) {
      toast.error('Fehler: ' + error.message);
    }
  };

  const handleExecuteAgent = async (agentId: string) => {
    if (!user) return;

    const input = executionInput[agentId] || '';
    if (!input.trim()) {
      toast.error('Bitte geben Sie Eingabedaten ein');
      return;
    }

    try {
      await executeAgent(agentId, { query: input }, user.id);
      setExecutionInput(prev => ({ ...prev, [agentId]: '' }));
    } catch (error) {
      console.error('Ausführungsfehler:', error);
    }
  };

  const uninstallAgent = async (agentId: string) => {
    try {
      const { error } = await supabase
        .from('user_agents')
        .delete()
        .eq('user_id', user!.id)
        .eq('id', agentId);

      if (error) throw error;
      
      toast.success('Agent deinstalliert');
      fetchUserAgents();
    } catch (error: any) {
      toast.error('Fehler: ' + error.message);
    }
  };

  const getIconComponent = (iconName: string): LucideIcon => {
    return (Icons as any)[iconName] || Icons.Bot;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Lade Ihre Agenten...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-4 text-gradient">Meine Agenten</h1>
            <p className="text-lg text-muted-foreground">
              Verwalten Sie Ihre installierten KI-Agenten
            </p>
          </div>
          <Button onClick={() => navigate('/agent-marketplace')}>
            Zum Marketplace
          </Button>
        </div>

        {userAgents.length === 0 ? (
          <Card className="glass border-secondary/30">
            <CardContent className="pt-6 text-center py-12">
              <Icons.Bot className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground mb-4">
                Sie haben noch keine Agenten installiert
              </p>
              <Button onClick={() => navigate('/agent-marketplace')}>
                Agenten entdecken
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userAgents.map((userAgent) => {
              const IconComponent = getIconComponent(userAgent.agents.icon);
              return (
                <Card key={userAgent.id} className="glass border-secondary/30">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <IconComponent className="w-10 h-10 text-primary" />
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{userAgent.agents.category}</Badge>
                        <Switch
                          checked={userAgent.is_enabled}
                          onCheckedChange={() => toggleAgent(userAgent.id, userAgent.is_enabled)}
                        />
                      </div>
                    </div>
                    <CardTitle>{userAgent.agents.name}</CardTitle>
                    <CardDescription>{userAgent.agents.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Version:</span>
                        <span className="font-medium">{userAgent.agents.version}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Installiert:</span>
                        <span className="font-medium">
                          {new Date(userAgent.installed_at).toLocaleDateString('de-DE')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant={userAgent.is_enabled ? 'default' : 'secondary'}>
                          {userAgent.is_enabled ? 'Aktiv' : 'Inaktiv'}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {Array.isArray(userAgent.agents.capabilities) && userAgent.agents.capabilities.slice(0, 3).map((cap, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {cap}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="default" className="w-full" disabled={!userAgent.is_enabled}>
                          <Play className="h-4 w-4 mr-2" />
                          Agent ausführen
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{userAgent.agents.name} ausführen</DialogTitle>
                          <DialogDescription>
                            Geben Sie Eingabedaten ein, die der Agent verarbeiten soll
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="input">Eingabedaten</Label>
                            <Input
                              id="input"
                              placeholder="Eingabe oder Abfrage eingeben..."
                              value={executionInput[userAgent.agent_id] || ''}
                              onChange={(e) => setExecutionInput(prev => ({ ...prev, [userAgent.agent_id]: e.target.value }))}
                            />
                          </div>
                          <Button
                            onClick={() => handleExecuteAgent(userAgent.agent_id)}
                            disabled={executing}
                            className="w-full"
                          >
                            {executing ? 'Wird ausgeführt...' : 'Agent starten'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      onClick={() => uninstallAgent(userAgent.id)}
                    >
                      Deinstallieren
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAgents;