import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useWebRTC } from '@/hooks/useWebRTC';
import { supabase } from '@/integrations/supabase/client';
import { Network, Users, WifiOff, Wifi, Send } from 'lucide-react';
import { toast } from 'sonner';

const P2PNetwork = () => {
  const [userId, setUserId] = useState<string>('');
  const [targetPeerId, setTargetPeerId] = useState('');
  const [messageText, setMessageText] = useState('');
  const [selectedPeer, setSelectedPeer] = useState<string | null>(null);
  const { connections, peers, dataChannels, connectToPeer, disconnect, sendData } = useWebRTC(userId);

  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getUserId();
  }, []);

  const handleConnect = () => {
    if (!targetPeerId.trim()) {
      toast.error('Please enter a peer ID');
      return;
    }
    connectToPeer(targetPeerId);
    setTargetPeerId('');
  };

  const handleSendMessage = () => {
    if (!selectedPeer || !messageText.trim()) {
      toast.error('Select a peer and enter a message');
      return;
    }
    sendData(selectedPeer, {
      type: 'message',
      content: messageText,
      timestamp: new Date().toISOString()
    });
    setMessageText('');
    toast.success('Message sent');
  };

  const getConnectionStatus = (peerId: string) => {
    const peer = peers.get(peerId);
    if (!peer) return 'disconnected';
    return peer.connectionState;
  };

  const getChannelStatus = (peerId: string) => {
    const channel = dataChannels.get(peerId);
    if (!channel) return 'closed';
    return channel.readyState;
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 text-center animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 flex items-center justify-center gap-3 text-gradient">
            <Network className="w-12 h-12" />
            P2P Netzwerk
          </h1>
          <p className="text-lg text-muted-foreground">
            WebRTC-basiertes dezentrales Peer-to-Peer Netzwerk
          </p>
          {userId && (
            <Badge variant="outline" className="mt-4 text-sm">
              Deine Peer-ID: {userId.substring(0, 8)}...
            </Badge>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Connection Panel */}
          <Card className="glass p-6 col-span-1 animate-slide-in-right">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Neue Verbindung
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Peer-ID</label>
                <Input
                  placeholder="Peer-ID eingeben..."
                  value={targetPeerId}
                  onChange={(e) => setTargetPeerId(e.target.value)}
                  className="glass"
                />
              </div>
              <Button 
                onClick={handleConnect} 
                className="w-full glow-border-animated"
              >
                <Wifi className="w-4 h-4 mr-2" />
                Verbinden
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-border/50">
              <h3 className="text-sm font-medium mb-3">Statistiken</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Aktive Peers:</span>
                  <Badge variant="secondary">{peers.size}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Verbindungen:</span>
                  <Badge variant="secondary">{connections.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data Channels:</span>
                  <Badge variant="secondary">{dataChannels.size}</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Active Connections */}
          <Card className="glass p-6 col-span-2 animate-scale-in">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Network className="w-6 h-6 text-primary" />
              Aktive Verbindungen
            </h2>

            {peers.size === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <WifiOff className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Keine aktiven Verbindungen</p>
                <p className="text-sm mt-2">Verbinde dich mit einem Peer um zu starten</p>
              </div>
            ) : (
              <div className="space-y-3">
                {Array.from(peers.entries()).map(([peerId, peer]) => (
                  <div
                    key={peerId}
                    className={`glass-hover p-4 rounded-lg border border-border/50 transition-all cursor-pointer ${
                      selectedPeer === peerId ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedPeer(peerId)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          getConnectionStatus(peerId) === 'connected' 
                            ? 'bg-green-500 animate-pulse' 
                            : 'bg-gray-500'
                        }`} />
                        <div>
                          <p className="font-medium">Peer: {peerId.substring(0, 12)}...</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {getConnectionStatus(peerId)}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Channel: {getChannelStatus(peerId)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          disconnect(peerId);
                        }}
                      >
                        Trennen
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedPeer && getChannelStatus(selectedPeer) === 'open' && (
              <div className="mt-6 pt-6 border-t border-border/50">
                <h3 className="text-sm font-medium mb-3">Nachricht senden</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nachricht eingeben..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="glass"
                  />
                  <Button onClick={handleSendMessage} className="glow-border-animated">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Connection History */}
        <Card className="glass p-6 mt-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl font-bold mb-4">Verbindungsverlauf</h2>
          {connections.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Kein Verlauf vorhanden</p>
          ) : (
            <div className="space-y-2">
              {connections.map((conn) => (
                <div key={conn.id} className="flex items-center justify-between p-3 glass-hover rounded-lg">
                  <div>
                    <p className="font-medium">Peer: {conn.peer_id.substring(0, 12)}...</p>
                    <p className="text-sm text-muted-foreground">
                      {conn.connection_type} • {new Date(conn.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant={conn.status === 'connected' ? 'default' : 'secondary'}>
                    {conn.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default P2PNetwork;
