import { useEffect, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { KnowledgeNode, KnowledgeEdge } from '@/hooks/useKnowledgeGraph';

interface GraphVisualizationProps {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  onNodeClick?: (node: any) => void;
  onEdgeClick?: (edge: any) => void;
}

const GraphVisualization = ({ nodes, edges, onNodeClick, onEdgeClick }: GraphVisualizationProps) => {
  const graphRef = useRef<any>();

  const graphData = {
    nodes: nodes.map(node => ({
      id: node.id,
      name: node.label,
      type: node.node_type,
      properties: node.properties,
      val: 10,
      color: getNodeColor(node.node_type)
    })),
    links: edges.map(edge => ({
      id: edge.id,
      source: edge.source_node_id,
      target: edge.target_node_id,
      type: edge.edge_type,
      weight: edge.weight,
      properties: edge.properties
    }))
  };

  function getNodeColor(type: string): string {
    const colors: Record<string, string> = {
      'concept': '#8B5CF6',
      'data_pod': '#3B82F6',
      'agent': '#10B981',
      'person': '#F59E0B',
      'organization': '#EF4444',
      'default': '#6B7280'
    };
    return colors[type] || colors.default;
  }

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.d3Force('charge').strength(-300);
      graphRef.current.d3Force('link').distance(100);
    }
  }, []);

  return (
    <div className="w-full h-full relative">
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        nodeLabel="name"
        nodeColor="color"
        nodeRelSize={6}
        linkDirectionalArrowLength={6}
        linkDirectionalArrowRelPos={1}
        linkColor={() => 'rgba(139, 92, 246, 0.3)'}
        linkWidth={2}
        onNodeClick={onNodeClick}
        onLinkClick={onEdgeClick}
        backgroundColor="transparent"
        nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
          const label = node.name;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          const textWidth = ctx.measureText(label).width;
          const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.4);

          // Draw node circle
          ctx.fillStyle = node.color;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.val, 0, 2 * Math.PI, false);
          ctx.fill();

          // Draw label background
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.fillRect(
            node.x - bckgDimensions[0] / 2,
            node.y + node.val + 2,
            bckgDimensions[0],
            bckgDimensions[1]
          );

          // Draw label text
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(label, node.x, node.y + node.val + 2 + bckgDimensions[1] / 2);
        }}
      />
    </div>
  );
};

export default GraphVisualization;