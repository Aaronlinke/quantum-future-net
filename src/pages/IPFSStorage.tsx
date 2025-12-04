import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useIPFS } from '@/hooks/useIPFS';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { HardDrive, Upload, Download, Pin, PinOff, Globe, Copy, ExternalLink, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const IPFSStorage = () => {
  const { items, loading, uploading, addContent, getContent, pinContent, unpinContent, getGatewayUrls } = useIPFS();
  const { toast } = useToast();
  
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [contentInput, setContentInput] = useState('');
  const [filenameInput, setFilenameInput] = useState('');
  const [viewContent, setViewContent] = useState<string | null>(null);
  const [viewCid, setViewCid] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!contentInput.trim()) return;

    const result = await addContent(contentInput, {
      filename: filenameInput || undefined
    });

    if (result) {
      setUploadDialogOpen(false);
      setContentInput('');
      setFilenameInput('');
    }
  };

  const handleView = async (cid: string) => {
    const content = await getContent(cid);
    if (content) {
      setViewContent(content);
      setViewCid(cid);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: 'CID copied to clipboard'
    });
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <HardDrive className="h-8 w-8 text-primary" />
            IPFS Decentralized Storage
          </h1>
          <p className="text-muted-foreground">
            Content-addressed storage with IPFS integration for permanent, decentralized file storage.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-foreground">{items.length}</p>
                  <p className="text-sm text-muted-foreground">Total Files</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Pin className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {items.filter(i => i.pinned).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Pinned</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <HardDrive className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {formatBytes(items.reduce((acc, i) => acc + (i.size_bytes || 0), 0))}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Size</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Globe className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold text-foreground">4</p>
                  <p className="text-sm text-muted-foreground">Gateway Nodes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="files" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="files">My Files</TabsTrigger>
              <TabsTrigger value="gateways">Gateways</TabsTrigger>
            </TabsList>

            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload to IPFS
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Content to IPFS</DialogTitle>
                  <DialogDescription>
                    Content will be encrypted and stored with content-addressing for permanent availability.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Filename (optional)</label>
                    <Input
                      value={filenameInput}
                      onChange={(e) => setFilenameInput(e.target.value)}
                      placeholder="my-document.txt"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Content</label>
                    <Textarea
                      value={contentInput}
                      onChange={(e) => setContentInput(e.target.value)}
                      placeholder="Enter text content or paste JSON data..."
                      rows={6}
                      className="mt-1"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpload} disabled={uploading || !contentInput.trim()}>
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                    Upload
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <TabsContent value="files">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle>Stored Content</CardTitle>
                <CardDescription>
                  All content stored with IPFS content-addressing
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : items.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <HardDrive className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No content stored yet</p>
                    <p className="text-sm">Upload your first file to IPFS</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.cid}
                        className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-background/50 hover:bg-background/80 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <FileText className="h-5 w-5 text-primary shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate">
                              {item.filename || 'Unnamed content'}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono truncate">
                              {item.cid}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 shrink-0">
                          {item.size_bytes && (
                            <Badge variant="outline" className="text-xs">
                              {formatBytes(item.size_bytes)}
                            </Badge>
                          )}
                          {item.pinned && (
                            <Badge className="bg-green-500/20 text-green-500 text-xs">
                              Pinned
                            </Badge>
                          )}
                          {item.encrypted && (
                            <Badge className="bg-blue-500/20 text-blue-500 text-xs">
                              Encrypted
                            </Badge>
                          )}
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopy(item.cid)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleView(item.cid)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          
                          {item.pinned ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => unpinContent(item.cid)}
                            >
                              <PinOff className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => pinContent(item.cid)}
                            >
                              <Pin className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gateways">
            <Card className="bg-card/50 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle>IPFS Gateways</CardTitle>
                <CardDescription>
                  Public gateways for accessing IPFS content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'IPFS.io', url: 'https://ipfs.io/ipfs/', status: 'active' },
                    { name: 'Cloudflare', url: 'https://cloudflare-ipfs.com/ipfs/', status: 'active' },
                    { name: 'Pinata', url: 'https://gateway.pinata.cloud/ipfs/', status: 'active' },
                    { name: 'dweb.link', url: 'https://dweb.link/ipfs/', status: 'active' }
                  ].map((gateway) => (
                    <div
                      key={gateway.name}
                      className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-background/50"
                    >
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-foreground">{gateway.name}</p>
                          <p className="text-xs text-muted-foreground">{gateway.url}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-500/20 text-green-500">
                          {gateway.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.open(gateway.url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Content Viewer Dialog */}
        <Dialog open={!!viewContent} onOpenChange={() => { setViewContent(null); setViewCid(null); }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Content Preview</DialogTitle>
              <DialogDescription className="font-mono text-xs break-all">
                CID: {viewCid}
              </DialogDescription>
            </DialogHeader>
            <div className="bg-muted/50 rounded-lg p-4 max-h-96 overflow-auto">
              <pre className="text-sm text-foreground whitespace-pre-wrap break-words">
                {viewContent}
              </pre>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => viewCid && handleCopy(viewCid)}>
                <Copy className="h-4 w-4 mr-2" />
                Copy CID
              </Button>
              <Button onClick={() => { setViewContent(null); setViewCid(null); }}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
};

export default IPFSStorage;
