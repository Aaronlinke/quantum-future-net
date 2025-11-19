import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Clock, Bot, CheckCircle, XCircle, AlertCircle, Search } from 'lucide-react';
import { format } from 'date-fns';

interface Interaction {
  id: string;
  agent_id: string;
  status: string;
  input_data: any;
  output_data: any;
  created_at: string;
  agent_name?: string;
}

export default function AgentHistory() {
  const { user } = useAuth();
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [filteredInteractions, setFilteredInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user) {
      fetchInteractions();
    }
  }, [user]);

  useEffect(() => {
    filterInteractions();
  }, [interactions, statusFilter, searchQuery]);

  const fetchInteractions = async () => {
    setLoading(true);
    const { data: interactionsData, error } = await supabase
      .from('agent_interactions')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching interactions:', error);
      setLoading(false);
      return;
    }

    // Fetch agent names
    const agentIds = [...new Set(interactionsData.map(i => i.agent_id))];
    const { data: agents } = await supabase
      .from('agents')
      .select('id, name')
      .in('id', agentIds);

    const agentMap = new Map(agents?.map(a => [a.id, a.name]) || []);

    const enrichedInteractions = interactionsData.map(interaction => ({
      ...interaction,
      agent_name: agentMap.get(interaction.agent_id) || 'Unknown Agent',
    }));

    setInteractions(enrichedInteractions);
    setLoading(false);
  };

  const filterInteractions = () => {
    let filtered = interactions;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(i => i.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(i =>
        i.agent_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        JSON.stringify(i.input_data).toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredInteractions(filtered);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      completed: 'default',
      pending: 'secondary',
      failed: 'destructive',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-2">
            <Bot className="h-8 w-8" />
            Agent Interaction History
          </h1>
          <p className="text-muted-foreground">View all AI agent executions and their results</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Interactions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by agent name or input..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Interactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Interactions ({filteredInteractions.length})</CardTitle>
          <CardDescription>Detailed log of all agent activities</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading interactions...</div>
          ) : filteredInteractions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No interactions found matching your criteria.
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {filteredInteractions.map((interaction) => (
                  <Card key={interaction.id} className="border">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            {getStatusIcon(interaction.status)}
                            {interaction.agent_name}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            {format(new Date(interaction.created_at), 'PPpp')}
                          </CardDescription>
                        </div>
                        {getStatusBadge(interaction.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="text-sm font-semibold mb-1">Input Data:</div>
                        <div className="bg-muted p-3 rounded-md text-sm font-mono overflow-x-auto">
                          <pre>{JSON.stringify(interaction.input_data, null, 2)}</pre>
                        </div>
                      </div>
                      {interaction.output_data && (
                        <>
                          <Separator />
                          <div>
                            <div className="text-sm font-semibold mb-1">Output Data:</div>
                            <div className="bg-muted p-3 rounded-md text-sm font-mono overflow-x-auto">
                              <pre>{JSON.stringify(interaction.output_data, null, 2)}</pre>
                            </div>
                          </div>
                        </>
                      )}
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
