import { useState } from 'react';
import { Network, Plus, Trash2, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useKnowledgeGraph, KnowledgeNode } from '@/hooks/useKnowledgeGraph';
import GraphVisualization from '@/components/knowledge/GraphVisualization';

const KnowledgeGraph = () => {
  const { nodes, edges, loading, createNode, createEdge, deleteNode, deleteEdge } = useKnowledgeGraph();
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [isNodeDialogOpen, setIsNodeDialogOpen] = useState(false);
  const [isEdgeDialogOpen, setIsEdgeDialogOpen] = useState(false);

  const [newNode, setNewNode] = useState({
    label: '',
    node_type: 'concept',
    description: ''
  });

  const [newEdge, setNewEdge] = useState({
    source_node_id: '',
    target_node_id: '',
    edge_type: 'related_to'
  });

  const handleCreateNode = async () => {
    await createNode(newNode.node_type, newNode.label, {
      description: newNode.description
    });
    setNewNode({ label: '', node_type: 'concept', description: '' });
    setIsNodeDialogOpen(false);
  };

  const handleCreateEdge = async () => {
    await createEdge(
      newEdge.source_node_id,
      newEdge.target_node_id,
      newEdge.edge_type
    );
    setNewEdge({ source_node_id: '', target_node_id: '', edge_type: 'related_to' });
    setIsEdgeDialogOpen(false);
  };

  const handleNodeClick = (node: any) => {
    const fullNode = nodes.find(n => n.id === node.id);
    if (fullNode) {
      setSelectedNode(fullNode);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <Network className="w-10 h-10 text-primary" />
            Knowledge Graph
          </h1>
          <p className="text-lg text-muted-foreground">
            Visualize and explore the interconnected web of your data, concepts, and relationships.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Nodes</CardTitle>
              <CardDescription>Total entities in graph</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{nodes.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Relationships</CardTitle>
              <CardDescription>Connections between nodes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-secondary">{edges.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Node Types</CardTitle>
              <CardDescription>Unique entity categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-accent">
                {new Set(nodes.map(n => n.node_type)).size}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="graph" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="graph">Graph View</TabsTrigger>
            <TabsTrigger value="manage">Manage</TabsTrigger>
          </TabsList>

          <TabsContent value="graph" className="space-y-4">
            <div className="flex gap-4">
              <Dialog open={isNodeDialogOpen} onOpenChange={setIsNodeDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Node
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Node</DialogTitle>
                    <DialogDescription>Add a new entity to your knowledge graph</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="label">Label</Label>
                      <Input
                        id="label"
                        value={newNode.label}
                        onChange={(e) => setNewNode({ ...newNode, label: e.target.value })}
                        placeholder="e.g., Artificial Intelligence"
                      />
                    </div>
                    <div>
                      <Label htmlFor="node_type">Type</Label>
                      <Select
                        value={newNode.node_type}
                        onValueChange={(value) => setNewNode({ ...newNode, node_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="concept">Concept</SelectItem>
                          <SelectItem value="data_pod">Data Pod</SelectItem>
                          <SelectItem value="agent">Agent</SelectItem>
                          <SelectItem value="person">Person</SelectItem>
                          <SelectItem value="organization">Organization</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={newNode.description}
                        onChange={(e) => setNewNode({ ...newNode, description: e.target.value })}
                        placeholder="Brief description"
                      />
                    </div>
                    <Button onClick={handleCreateNode} className="w-full">
                      Create Node
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isEdgeDialogOpen} onOpenChange={setIsEdgeDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Add Relationship
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Relationship</DialogTitle>
                    <DialogDescription>Connect two nodes in your graph</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="source">Source Node</Label>
                      <Select
                        value={newEdge.source_node_id}
                        onValueChange={(value) => setNewEdge({ ...newEdge, source_node_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select source node" />
                        </SelectTrigger>
                        <SelectContent>
                          {nodes.map(node => (
                            <SelectItem key={node.id} value={node.id}>
                              {node.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="target">Target Node</Label>
                      <Select
                        value={newEdge.target_node_id}
                        onValueChange={(value) => setNewEdge({ ...newEdge, target_node_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select target node" />
                        </SelectTrigger>
                        <SelectContent>
                          {nodes.map(node => (
                            <SelectItem key={node.id} value={node.id}>
                              {node.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="edge_type">Relationship Type</Label>
                      <Select
                        value={newEdge.edge_type}
                        onValueChange={(value) => setNewEdge({ ...newEdge, edge_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="related_to">Related To</SelectItem>
                          <SelectItem value="contains">Contains</SelectItem>
                          <SelectItem value="created_by">Created By</SelectItem>
                          <SelectItem value="uses">Uses</SelectItem>
                          <SelectItem value="depends_on">Depends On</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleCreateEdge} className="w-full">
                      Create Relationship
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Card className="h-[600px] p-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              ) : nodes.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Network className="w-16 h-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No nodes yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start building your knowledge graph by adding nodes
                  </p>
                </div>
              ) : (
                <GraphVisualization
                  nodes={nodes}
                  edges={edges}
                  onNodeClick={handleNodeClick}
                />
              )}
            </Card>

            {selectedNode && (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedNode.label}</CardTitle>
                  <CardDescription>Type: {selectedNode.node_type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {selectedNode.properties?.description || 'No description'}
                    </p>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          deleteNode(selectedNode.id);
                          setSelectedNode(null);
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Node
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="manage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Nodes</CardTitle>
                <CardDescription>Manage your knowledge graph entities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {nodes.map(node => (
                    <div
                      key={node.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/5"
                    >
                      <div>
                        <div className="font-medium">{node.label}</div>
                        <div className="text-sm text-muted-foreground">{node.node_type}</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNode(node.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>All Relationships</CardTitle>
                <CardDescription>Manage connections between nodes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {edges.map(edge => {
                    const source = nodes.find(n => n.id === edge.source_node_id);
                    const target = nodes.find(n => n.id === edge.target_node_id);
                    return (
                      <div
                        key={edge.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/5"
                      >
                        <div>
                          <div className="font-medium">
                            {source?.label} → {target?.label}
                          </div>
                          <div className="text-sm text-muted-foreground">{edge.edge_type}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteEdge(edge.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default KnowledgeGraph;