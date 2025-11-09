import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, XCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ConsentLog {
  id: string;
  agent_id: string;
  data_type: string;
  action: string;
  granted: boolean;
  revoked_at: string | null;
  created_at: string;
}

const Consent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<ConsentLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchLogs();
  }, [user, navigate]);

  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from('consent_logs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Fehler beim Laden der Consent Logs');
    } else {
      setLogs(data || []);
    }
    setIsLoading(false);
  };

  const handleRevoke = async (id: string) => {
    const { error } = await supabase
      .from('consent_logs')
      .update({ revoked_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      toast.error('Fehler beim Widerrufen');
    } else {
      toast.success('Zugriff erfolgreich widerrufen');
      fetchLogs();
    }
  };

  const isActive = (log: ConsentLog) => log.granted && !log.revoked_at;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const activeLogs = logs.filter(isActive);
  const revokedLogs = logs.filter(log => log.revoked_at);
  const deniedLogs = logs.filter(log => !log.granted && !log.revoked_at);

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">Consent Management</h1>
          <p className="text-muted-foreground">
            Kontrolliere, welche Agenten auf deine Daten zugreifen dürfen
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="glass border-secondary/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Aktive Zugriffsrechte</p>
                  <p className="text-3xl font-bold mt-2">{activeLogs.length}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="glass border-secondary/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Widerrufene Zugriffe</p>
                  <p className="text-3xl font-bold mt-2">{revokedLogs.length}</p>
                </div>
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="glass border-secondary/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Abgelehnt</p>
                  <p className="text-3xl font-bold mt-2">{deniedLogs.length}</p>
                </div>
                <Shield className="w-10 h-10 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Consents */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Aktive Zugriffsrechte</h2>
            {activeLogs.length === 0 ? (
              <Card className="glass border-secondary/30">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Shield className="w-16 h-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">
                    Keine aktiven Zugriffsrechte vorhanden
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {activeLogs.map((log) => (
                  <Card key={log.id} className="glass border-secondary/30">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            Agent: {log.agent_id}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="secondary">{log.data_type}</Badge>
                              <Badge variant="outline">{log.action}</Badge>
                              <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Aktiv
                              </Badge>
                            </div>
                          </CardDescription>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRevoke(log.id)}
                        >
                          Widerrufen
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        Erteilt am {new Date(log.created_at).toLocaleString('de-DE')}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* History */}
          {(revokedLogs.length > 0 || deniedLogs.length > 0) && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Verlauf</h2>
              <div className="grid gap-4">
                {[...revokedLogs, ...deniedLogs].map((log) => (
                  <Card key={log.id} className="glass border-secondary/30 opacity-60">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Shield className="w-4 h-4" />
                        Agent: {log.agent_id}
                      </CardTitle>
                      <CardDescription>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="secondary">{log.data_type}</Badge>
                          <Badge variant="outline">{log.action}</Badge>
                          {log.revoked_at ? (
                            <Badge variant="destructive">
                              <XCircle className="w-3 h-3 mr-1" />
                              Widerrufen am {new Date(log.revoked_at).toLocaleDateString('de-DE')}
                            </Badge>
                          ) : (
                            <Badge variant="destructive">Abgelehnt</Badge>
                          )}
                        </div>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Consent;
