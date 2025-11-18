import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface KnowledgeNode {
  id: string;
  user_id: string;
  node_type: string;
  label: string;
  properties: any;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeEdge {
  id: string;
  user_id: string;
  source_node_id: string;
  target_node_id: string;
  edge_type: string;
  properties: any;
  weight: number;
  created_at: string;
}

export function useKnowledgeGraph() {
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [edges, setEdges] = useState<KnowledgeEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchGraph = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const [nodesResult, edgesResult] = await Promise.all([
        supabase.from('knowledge_nodes').select('*').order('created_at', { ascending: false }),
        supabase.from('knowledge_edges').select('*').order('created_at', { ascending: false })
      ]);

      if (nodesResult.error) throw nodesResult.error;
      if (edgesResult.error) throw edgesResult.error;

      setNodes(nodesResult.data || []);
      setEdges(edgesResult.data || []);
    } catch (error: any) {
      toast({
        title: 'Error loading knowledge graph',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const createNode = async (node_type: string, label: string, properties: Record<string, any> = {}) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('knowledge_nodes')
        .insert({
          user_id: user.id,
          node_type,
          label,
          properties
        })
        .select()
        .single();

      if (error) throw error;

      setNodes(prev => [data, ...prev]);
      toast({
        title: 'Node created',
        description: `Created node: ${label}`
      });

      return data;
    } catch (error: any) {
      toast({
        title: 'Error creating node',
        description: error.message,
        variant: 'destructive'
      });
      return null;
    }
  };

  const createEdge = async (
    source_node_id: string,
    target_node_id: string,
    edge_type: string,
    properties: Record<string, any> = {},
    weight: number = 1.0
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('knowledge_edges')
        .insert({
          user_id: user.id,
          source_node_id,
          target_node_id,
          edge_type,
          properties,
          weight
        })
        .select()
        .single();

      if (error) throw error;

      setEdges(prev => [data, ...prev]);
      toast({
        title: 'Relationship created',
        description: `Created ${edge_type} relationship`
      });

      return data;
    } catch (error: any) {
      toast({
        title: 'Error creating relationship',
        description: error.message,
        variant: 'destructive'
      });
      return null;
    }
  };

  const deleteNode = async (nodeId: string) => {
    try {
      const { error } = await supabase
        .from('knowledge_nodes')
        .delete()
        .eq('id', nodeId);

      if (error) throw error;

      setNodes(prev => prev.filter(n => n.id !== nodeId));
      setEdges(prev => prev.filter(e => e.source_node_id !== nodeId && e.target_node_id !== nodeId));

      toast({
        title: 'Node deleted',
        description: 'Node and related edges removed'
      });
    } catch (error: any) {
      toast({
        title: 'Error deleting node',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const deleteEdge = async (edgeId: string) => {
    try {
      const { error } = await supabase
        .from('knowledge_edges')
        .delete()
        .eq('id', edgeId);

      if (error) throw error;

      setEdges(prev => prev.filter(e => e.id !== edgeId));

      toast({
        title: 'Relationship deleted',
        description: 'Edge removed from graph'
      });
    } catch (error: any) {
      toast({
        title: 'Error deleting edge',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    fetchGraph();
  }, []);

  return {
    nodes,
    edges,
    loading,
    createNode,
    createEdge,
    deleteNode,
    deleteEdge,
    refetch: fetchGraph
  };
}