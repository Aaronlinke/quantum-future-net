import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Shield, Bot, Activity, TrendingUp, Database } from 'lucide-react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
  roles: string[];
}

interface Agent {
  id: string;
  name: string;
  category: string;
  is_active: boolean;
  install_count: number;
  rating: number;
}

interface Stats {
  totalUsers: number;
  totalAgents: number;
  totalDataPods: number;
  totalKnowledgeNodes: number;
  activeInteractions: number;
}

export default function AdminDashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalAgents: 0,
    totalDataPods: 0,
    totalKnowledgeNodes: 0,
    activeInteractions: 0,
  });

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (error || !data) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }

    setIsAdmin(true);
    await Promise.all([fetchUsers(), fetchAgents(), fetchStats()]);
    setLoading(false);
  };

  const fetchUsers = async () => {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, display_name, created_at')
      .order('created_at', { ascending: false });

    if (profiles) {
      const usersWithRoles = await Promise.all(
        profiles.map(async (profile) => {
          const { data: authUser } = await supabase.auth.admin.getUserById(profile.id);
          const { data: roles } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', profile.id);

          return {
            id: profile.id,
            email: authUser?.user?.email || '',
            display_name: profile.display_name || '',
            created_at: profile.created_at,
            roles: roles?.map(r => r.role) || [],
          };
        })
      );
      setUsers(usersWithRoles);
    }
  };

  const fetchAgents = async () => {
    const { data } = await supabase
      .from('agents')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setAgents(data);
  };

  const fetchStats = async () => {
    const [usersCount, agentsCount, podsCount, nodesCount, interactionsCount] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('agents').select('id', { count: 'exact', head: true }),
      supabase.from('data_pods').select('id', { count: 'exact', head: true }),
      supabase.from('knowledge_nodes').select('id', { count: 'exact', head: true }),
      supabase.from('agent_interactions').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    ]);

    setStats({
      totalUsers: usersCount.count || 0,
      totalAgents: agentsCount.count || 0,
      totalDataPods: podsCount.count || 0,
      totalKnowledgeNodes: nodesCount.count || 0,
      activeInteractions: interactionsCount.count || 0,
    });
  };

  const updateUserRole = async (userId: string, role: string, action: 'add' | 'remove') => {
    if (action === 'add') {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: role as 'admin' | 'moderator' | 'user' });

      if (error) {
        toast.error('Failed to add role');
      } else {
        toast.success('Role added successfully');
        fetchUsers();
      }
    } else {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role as 'admin' | 'moderator' | 'user');

      if (error) {
        toast.error('Failed to remove role');
      } else {
        toast.success('Role removed successfully');
        fetchUsers();
      }
    }
  };

  const toggleAgentStatus = async (agentId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('agents')
      .update({ is_active: !currentStatus })
      .eq('id', agentId);

    if (error) {
      toast.error('Failed to update agent status');
    } else {
      toast.success(`Agent ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchAgents();
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading admin dashboard...</div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users, agents, and platform settings</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAgents}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Pods</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDataPods}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Knowledge Nodes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalKnowledgeNodes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeInteractions}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and roles</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.display_name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {user.roles.map((role) => (
                            <Badge key={role} variant="secondary">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Select
                          onValueChange={(value) => {
                            const [action, role] = value.split(':');
                            updateUserRole(user.id, role, action as 'add' | 'remove');
                          }}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Manage roles" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="add:admin">Add Admin</SelectItem>
                            <SelectItem value="add:moderator">Add Moderator</SelectItem>
                            <SelectItem value="remove:admin">Remove Admin</SelectItem>
                            <SelectItem value="remove:moderator">Remove Moderator</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Management</CardTitle>
              <CardDescription>Review and manage AI agents</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Installs</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agents.map((agent) => (
                    <TableRow key={agent.id}>
                      <TableCell className="font-medium">{agent.name}</TableCell>
                      <TableCell>{agent.category}</TableCell>
                      <TableCell>
                        <Badge variant={agent.is_active ? 'default' : 'secondary'}>
                          {agent.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>{agent.install_count}</TableCell>
                      <TableCell>{agent.rating?.toFixed(1) || 'N/A'}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleAgentStatus(agent.id, agent.is_active)}
                        >
                          {agent.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
