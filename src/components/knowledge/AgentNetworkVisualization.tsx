import { useEffect, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useAgentCommunication } from '@/hooks/useAgentCommunication';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

interface Agent {
  id: string;
  name: string;
  category: string;
  status: string;
}

interface AgentNetworkVisualizationProps {
  onNodeClick?: (node: any) => void;
}

const AgentNetworkVisualization = ({ onNodeClick }: AgentNetworkVisualizationProps) => {
  const graphRef = useRef<any>();
  const [agents, setAgents] = useState<Agent[]>([]);
  const { agentStatuses, messages } = useAgentCommunication();

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    const { data, error } = await supabase
      .from('agents')
      .select('id, name, category')
      .eq('is_active', true);

    if (!error && data) {
      setAgents(data.map(a => ({ ...a, status: 'active' })));
    }
  };

  const getNodeColor = (agent: Agent) => {
    const status = agentStatuses[agent.id]?.status || 'idle';
    const colors: Record<string, string> = {
      'idle': '#6B7280',
      'active': '#3B82F6',
      'processing': '#10B981',
      'error': '#EF4444'
    };
    return colors[status] || colors.idle;
  };

  const getNodeSize = (agent: Agent) => {
    const messageCount = messages.filter(
      (msg) => msg.from_agent_id === agent.id || msg.to_agent_id === agent.id
    ).length;
    return 10 + Math.min(messageCount * 2, 20);
  };

  const graphData = {
    nodes: agents.map((agent) => ({
      id: agent.id,
      name: agent.name,
      category: agent.category,
      status: agentStatuses[agent.id]?.status || 'idle',
      val: getNodeSize(agent),
      color: getNodeColor(agent)
    })),
    links: messages.map((msg) => ({
      source: msg.from_agent_id,
      target: msg.to_agent_id,
      type: msg.message_type,
      status: msg.status
    }))
  };

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.d3Force('charge').strength(-400);
      graphRef.current.d3Force('link').distance(150);
      graphRef.current.d3Force('center').strength(0.5);
    }
  }, []);

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-4 left-4 z-10 space-y-2">
        <div className="glass p-4 rounded-lg">
          <h3 className="text-sm font-semibold mb-3">Agent Status</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              <span className="text-xs">Idle</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-xs">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs">Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs">Error</span>
            </div>
          </div>
        </div>

        <div className="glass p-4 rounded-lg">
          <h3 className="text-sm font-semibold mb-2">Network Stats</h3>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Agents:</span>
              <Badge variant="secondary">{agents.length}</Badge>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Messages:</span>
              <Badge variant="secondary">{messages.length}</Badge>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Active:</span>
              <Badge variant="secondary">
                {Object.values(agentStatuses).filter((s) => s.status === 'active').length}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        nodeLabel={(node: any) => `${node.name} (${node.status})`}
        nodeColor="color"
        nodeRelSize={6}
        linkDirectionalArrowLength={8}
        linkDirectionalArrowRelPos={1}
        linkColor={(link: any) => {
          const colors: Record<string, string> = {
            'pending': 'rgba(147, 197, 253, 0.4)',
            'delivered': 'rgba(134, 239, 172, 0.4)',
            'processed': 'rgba(134, 239, 172, 0.6)',
            'failed': 'rgba(252, 165, 165, 0.4)'
          };
          return colors[link.status] || 'rgba(139, 92, 246, 0.3)';
        }}
        linkWidth={2}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.003}
        onNodeClick={onNodeClick}
        backgroundColor="transparent"
        nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
          const label = node.name;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map((n) => n + fontSize * 0.4);

          // Draw node circle with glow effect
          const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.val * 1.5);
          gradient.addColorStop(0, node.color);
          gradient.addColorStop(1, 'transparent');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.val * 1.5, 0, 2 * Math.PI, false);
          ctx.fill();

          // Draw solid node
          ctx.fillStyle = node.color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.val, 0, 2 * Math.PI, false);
          ctx.fill();

          // Draw status indicator
          if (node.status === 'processing') {
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.val + 2, 0, 2 * Math.PI, false);
            ctx.stroke();
          }

          // Draw label background
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.fillRect(
            node.x - bckgDimensions[0] / 2,
            node.y + node.val + 4,
            bckgDimensions[0],
            bckgDimensions[1]
          );

          // Draw label text
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(label, node.x, node.y + node.val + 4 + bckgDimensions[1] / 2);
        }}
      />
    </div>
  );
};

export default AgentNetworkVisualization;
