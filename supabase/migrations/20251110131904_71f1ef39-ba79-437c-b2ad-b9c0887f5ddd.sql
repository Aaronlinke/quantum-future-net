-- Create agents table for the marketplace
CREATE TABLE public.agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  version text NOT NULL DEFAULT '1.0.0',
  icon text,
  capabilities jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  install_count integer NOT NULL DEFAULT 0,
  rating numeric(3,2) DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create user_agents table for installed agents
CREATE TABLE public.user_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id uuid NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  is_enabled boolean NOT NULL DEFAULT true,
  settings jsonb DEFAULT '{}'::jsonb,
  installed_at timestamp with time zone DEFAULT now(),
  last_used_at timestamp with time zone,
  UNIQUE(user_id, agent_id)
);

-- Create agent_interactions table for logging
CREATE TABLE public.agent_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id uuid NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  input_data jsonb NOT NULL,
  output_data jsonb,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for agents (public read)
CREATE POLICY "Anyone can view active agents"
  ON public.agents FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage agents"
  ON public.agents FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for user_agents
CREATE POLICY "Users can view their installed agents"
  ON public.user_agents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can install agents"
  ON public.user_agents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their agents"
  ON public.user_agents FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can uninstall agents"
  ON public.user_agents FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for agent_interactions
CREATE POLICY "Users can view their interactions"
  ON public.agent_interactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create interactions"
  ON public.agent_interactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON public.agents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default agents
INSERT INTO public.agents (name, description, category, icon, capabilities) VALUES
(
  'Web4 Assistant',
  'Ihr persönlicher KI-Assistent für das dezentrale Web. Hilft bei Navigation, Datenmanagement und Smart Contracts.',
  'assistant',
  'Bot',
  '["natural_language", "data_management", "smart_contracts", "multi_turn_conversation"]'::jsonb
),
(
  'Knowledge Graph Agent',
  'Erstellt und pflegt Ihren persönlichen Wissensgraphen. Verbindet Informationen semantisch und findet versteckte Zusammenhänge.',
  'knowledge',
  'Network',
  '["semantic_analysis", "graph_building", "relationship_discovery", "rdf_storage"]'::jsonb
),
(
  'Task Automation Agent',
  'Automatisiert wiederkehrende Aufgaben und Workflows. Lernt aus Ihrem Verhalten und schlägt Optimierungen vor.',
  'automation',
  'Zap',
  '["workflow_automation", "task_scheduling", "pattern_recognition", "proactive_suggestions"]'::jsonb
),
(
  'Privacy Guardian',
  'Überwacht und schützt Ihre Privatsphäre. Analysiert Zugriffsanfragen und warnt vor verdächtigen Aktivitäten.',
  'security',
  'Shield',
  '["privacy_monitoring", "consent_management", "threat_detection", "access_control"]'::jsonb
),
(
  'Data Translator',
  'Übersetzt Daten zwischen verschiedenen Formaten und Systemen. Unterstützt Migration zwischen Web2 und Web4.',
  'utility',
  'ArrowLeftRight',
  '["format_conversion", "data_migration", "api_integration", "schema_mapping"]'::jsonb
);