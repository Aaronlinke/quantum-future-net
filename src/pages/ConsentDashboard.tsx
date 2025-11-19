import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface ConsentLog {
  id: string;
  agent_id: string;
  action: string;
  data_type: string;
  granted: boolean;
  created_at: string;
  revoked_at: string | null;
}

interface AccessEvent {
  agent_id: string;
  agent_name: string;
  last_access: string;
  access_count: number;
  data_types: string[];
}

export default function ConsentDashboard() {
  const { user } = useAuth();
  const [consentLogs, setConsentLogs] = useState<ConsentLog[]>([]);
  const [accessEvents, setAccessEvents] = useState<AccessEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchConsentData();
    }
  }, [user]);

  const fetchConsentData = async () => {
    setLoading(true);

    // Fetch consent logs
    const { data: logs, error: logsError } = await supabase
      .from('consent_logs')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });

    if (logsError) {
      console.error('Error fetching consent logs:', logsError);
    } else {
      setConsentLogs(logs || []);
    }

    // Fetch agent interactions to build access timeline
    const { data: interactions, error: interactionsError } = await supabase
      .from('agent_interactions')
      .select('agent_id, created_at')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });

    if (interactionsError) {
      console.error('Error fetching interactions:', interactionsError);
    } else if (interactions) {
      // Group by agent and count
      const agentMap = new Map<string, { count: number; lastAccess: string }>();
      
      interactions.forEach(interaction => {
        const existing = agentMap.get(interaction.agent_id);
        if (!existing || new Date(interaction.created_at) > new Date(existing.lastAccess)) {
          agentMap.set(interaction.agent_id, {
            count: (existing?.count || 0) + 1,
            lastAccess: interaction.created_at,
          });
        }
      });

      // Fetch agent names
      const agentIds = Array.from(agentMap.keys());
      const { data: agents } = await supabase
        .from('agents')
        .select('id, name')
        .in('id', agentIds);

      const events: AccessEvent[] = [];
      agentMap.forEach((stats, agentId) => {
        const agent = agents?.find(a => a.id === agentId);
        const agentLogs = logs?.filter(l => l.agent_id === agentId) || [];
        const dataTypes = [...new Set(agentLogs.map(l => l.data_type))];

        events.push({
          agent_id: agentId,
          agent_name: agent?.name || 'Unknown Agent',
          last_access: stats.lastAccess,
          access_count: stats.count,
          data_types: dataTypes,
        });
      });

      setAccessEvents(events);
    }

    setLoading(false);
  };

  const revokeConsent = async (logId: string) => {
    const { error } = await supabase
      .from('consent_logs')
      .update({ 
        granted: false,
        revoked_at: new Date().toISOString() 
      })
      .eq('id', logId);

    if (error) {
      toast.error('Failed to revoke consent');
    } else {
      toast.success('Consent revoked successfully');
      fetchConsentData();
    }
  };

  const getConsentIcon = (granted: boolean, revoked: boolean) => {
    if (revoked) return <XCircle className="h-5 w-5 text-red-500" />;
    if (granted) return <CheckCircle className="h-5 w-5 text-green-500" />;
    return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Consent Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage data access permissions and view agent activity
          </p>
        </div>
      </div>

      {/* Access Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Agent Access</CardTitle>
          <CardDescription>
            Timeline of agents that accessed your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading access data...</div>
          ) : accessEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No agent access recorded yet
            </div>
          ) : (
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {accessEvents.map((event) => (
                  <div key={event.agent_id} className="border-l-2 border-primary pl-4 pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold">{event.agent_name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(event.last_access), 'PPpp')}
                        </div>
                      </div>
                      <Badge variant="secondary">{event.access_count} accesses</Badge>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {event.data_types.map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Consent Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Consent History</CardTitle>
          <CardDescription>
            All permissions granted and revoked
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading consent logs...</div>
          ) : consentLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No consent logs found
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {consentLogs.map((log) => (
                  <Card key={log.id} className="border">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            {getConsentIcon(log.granted, !!log.revoked_at)}
                            <span className="font-semibold">
                              {log.action} - {log.data_type}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Agent: {log.agent_id}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Granted: {format(new Date(log.created_at), 'PPpp')}
                          </div>
                          {log.revoked_at && (
                            <div className="text-xs text-red-500">
                              Revoked: {format(new Date(log.revoked_at), 'PPpp')}
                            </div>
                          )}
                        </div>
                        {log.granted && !log.revoked_at && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => revokeConsent(log.id)}
                          >
                            Revoke
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
