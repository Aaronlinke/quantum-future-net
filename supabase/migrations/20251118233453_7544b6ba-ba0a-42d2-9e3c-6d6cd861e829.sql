-- Create knowledge graph tables for Web4 system

-- Nodes table: represents entities in the knowledge graph
CREATE TABLE public.knowledge_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  node_type TEXT NOT NULL, -- e.g., 'concept', 'data_pod', 'agent', 'person', 'organization'
  label TEXT NOT NULL,
  properties JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Edges table: represents relationships between nodes
CREATE TABLE public.knowledge_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  source_node_id UUID NOT NULL REFERENCES public.knowledge_nodes(id) ON DELETE CASCADE,
  target_node_id UUID NOT NULL REFERENCES public.knowledge_nodes(id) ON DELETE CASCADE,
  edge_type TEXT NOT NULL, -- e.g., 'related_to', 'contains', 'created_by', 'uses'
  properties JSONB DEFAULT '{}'::jsonb,
  weight NUMERIC DEFAULT 1.0, -- For relationship strength
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT different_nodes CHECK (source_node_id != target_node_id)
);

-- Semantic queries table: stores user queries and their results
CREATE TABLE public.semantic_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  query_text TEXT NOT NULL,
  query_type TEXT NOT NULL, -- e.g., 'search', 'recommendation', 'insight'
  results JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.knowledge_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_edges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.semantic_queries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for knowledge_nodes
CREATE POLICY "Users can view their own nodes"
  ON public.knowledge_nodes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own nodes"
  ON public.knowledge_nodes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own nodes"
  ON public.knowledge_nodes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own nodes"
  ON public.knowledge_nodes FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for knowledge_edges
CREATE POLICY "Users can view their own edges"
  ON public.knowledge_edges FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own edges"
  ON public.knowledge_edges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own edges"
  ON public.knowledge_edges FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own edges"
  ON public.knowledge_edges FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for semantic_queries
CREATE POLICY "Users can view their own queries"
  ON public.semantic_queries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own queries"
  ON public.semantic_queries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_knowledge_nodes_user_id ON public.knowledge_nodes(user_id);
CREATE INDEX idx_knowledge_nodes_type ON public.knowledge_nodes(node_type);
CREATE INDEX idx_knowledge_edges_user_id ON public.knowledge_edges(user_id);
CREATE INDEX idx_knowledge_edges_source ON public.knowledge_edges(source_node_id);
CREATE INDEX idx_knowledge_edges_target ON public.knowledge_edges(target_node_id);
CREATE INDEX idx_semantic_queries_user_id ON public.semantic_queries(user_id);

-- Trigger for updating updated_at
CREATE TRIGGER update_knowledge_nodes_updated_at
  BEFORE UPDATE ON public.knowledge_nodes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();