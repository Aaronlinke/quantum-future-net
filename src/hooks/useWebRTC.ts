import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface P2PConnection {
  id: string;
  user_id: string;
  peer_id: string;
  connection_type: string;
  status: string;
  ice_servers?: any;
  connected_at?: string;
  disconnected_at?: string;
  created_at: string;
}

interface WebRTCConfig {
  iceServers: RTCIceServer[];
}

const DEFAULT_ICE_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' }
];

export function useWebRTC(userId: string, connectionType: string = 'data_pod_share') {
  const [connections, setConnections] = useState<P2PConnection[]>([]);
  const [peers, setPeers] = useState<Map<string, RTCPeerConnection>>(new Map());
  const [dataChannels, setDataChannels] = useState<Map<string, RTCDataChannel>>(new Map());
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const signalingChannel = useRef<any>(null);

  // Initialize WebRTC signaling via Supabase Realtime
  useEffect(() => {
    const channel = supabase
      .channel('webrtc-signaling')
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        console.log('Peers online:', state);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('Peer joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('Peer left:', key, leftPresences);
        handlePeerDisconnect(key);
      })
      .on('broadcast', { event: 'offer' }, ({ payload }) => {
        handleOffer(payload);
      })
      .on('broadcast', { event: 'answer' }, ({ payload }) => {
        handleAnswer(payload);
      })
      .on('broadcast', { event: 'ice-candidate' }, ({ payload }) => {
        handleIceCandidate(payload);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ user_id: userId, online_at: new Date().toISOString() });
        }
      });

    signalingChannel.current = channel;

    return () => {
      supabase.removeChannel(channel);
      peers.forEach((peer) => peer.close());
    };
  }, [userId]);

  // Subscribe to P2P connection updates
  useEffect(() => {
    if (!userId) return;

    const loadConnections = async () => {
      try {
        const { data, error } = await supabase
          .from('p2p_connections' as any)
          .select('*')
          .eq('user_id', userId)
          .eq('status', 'connected');

        if (!error && data) {
          setConnections(data as unknown as P2PConnection[]);
        }
      } catch (error) {
        console.warn('P2P connections table not yet available:', error);
      }
    };

    loadConnections();

    const channel = supabase
      .channel('p2p-connections')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'p2p_connections' as any,
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('P2P connection updated:', payload);
          loadConnections();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const createPeerConnection = useCallback((peerId: string): RTCPeerConnection => {
    const pc = new RTCPeerConnection({ iceServers: DEFAULT_ICE_SERVERS });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        signalingChannel.current?.send({
          type: 'broadcast',
          event: 'ice-candidate',
          payload: { target: peerId, candidate: event.candidate, from: userId }
        });
      }
    };

    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState);
      if (pc.connectionState === 'connected') {
        updateConnectionStatus(peerId, 'connected');
        toast.success(`Connected to peer ${peerId}`);
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        updateConnectionStatus(peerId, 'disconnected');
        handlePeerDisconnect(peerId);
      }
    };

    pc.ondatachannel = (event) => {
      const channel = event.channel;
      setupDataChannel(channel, peerId);
    };

    peers.set(peerId, pc);
    setPeers(new Map(peers));

    return pc;
  }, [userId, peers]);

  const setupDataChannel = (channel: RTCDataChannel, peerId: string) => {
    channel.onopen = () => {
      console.log('Data channel opened with', peerId);
      toast.success(`Data channel established with peer`);
    };

    channel.onmessage = (event) => {
      console.log('Received data:', event.data);
      try {
        const data = JSON.parse(event.data);
        handleReceivedData(data, peerId);
      } catch (e) {
        console.error('Error parsing data:', e);
      }
    };

    channel.onclose = () => {
      console.log('Data channel closed with', peerId);
      dataChannels.delete(peerId);
      setDataChannels(new Map(dataChannels));
    };

    dataChannels.set(peerId, channel);
    setDataChannels(new Map(dataChannels));
  };

  const connectToPeer = async (targetPeerId: string) => {
    try {
      const pc = createPeerConnection(targetPeerId);
      const dc = pc.createDataChannel('data');
      setupDataChannel(dc, targetPeerId);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Store connection in database
      try {
        await supabase.from('p2p_connections' as any).insert({
          user_id: userId,
          peer_id: targetPeerId,
          connection_type: connectionType,
          status: 'connecting',
          ice_servers: DEFAULT_ICE_SERVERS as any
        });
      } catch (error) {
        console.warn('Could not store P2P connection in database:', error);
      }

      // Send offer via signaling channel
      signalingChannel.current?.send({
        type: 'broadcast',
        event: 'offer',
        payload: { target: targetPeerId, offer, from: userId }
      });

      toast.info(`Connecting to peer ${targetPeerId}...`);
    } catch (error) {
      console.error('Error connecting to peer:', error);
      toast.error('Failed to connect to peer');
    }
  };

  const handleOffer = async (payload: any) => {
    if (payload.target !== userId) return;

    const { offer, from } = payload;
    const pc = createPeerConnection(from);

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    signalingChannel.current?.send({
      type: 'broadcast',
      event: 'answer',
      payload: { target: from, answer, from: userId }
    });
  };

  const handleAnswer = async (payload: any) => {
    if (payload.target !== userId) return;

    const { answer, from } = payload;
    const pc = peers.get(from);
    if (pc) {
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    }
  };

  const handleIceCandidate = async (payload: any) => {
    if (payload.target !== userId) return;

    const { candidate, from } = payload;
    const pc = peers.get(from);
    if (pc) {
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const handlePeerDisconnect = (peerId: string) => {
    const pc = peers.get(peerId);
    if (pc) {
      pc.close();
      peers.delete(peerId);
      setPeers(new Map(peers));
    }
    dataChannels.delete(peerId);
    setDataChannels(new Map(dataChannels));
  };

  const sendData = (peerId: string, data: any) => {
    const channel = dataChannels.get(peerId);
    if (channel && channel.readyState === 'open') {
      channel.send(JSON.stringify(data));
    } else {
      toast.error('Data channel not ready');
    }
  };

  const handleReceivedData = (data: any, peerId: string) => {
    console.log('Received data from', peerId, ':', data);
    // Handle different data types based on your application logic
    if (data.type === 'data_pod_share') {
      toast.success(`Received data pod from peer`);
    }
  };

  const updateConnectionStatus = async (peerId: string, status: string) => {
    try {
      await supabase
        .from('p2p_connections' as any)
        .update({
          status,
          ...(status === 'connected' ? { connected_at: new Date().toISOString() } : {}),
          ...(status === 'disconnected' ? { disconnected_at: new Date().toISOString() } : {})
        })
        .eq('user_id', userId)
        .eq('peer_id', peerId);
    } catch (error) {
      console.warn('Could not update P2P connection status:', error);
    }
  };

  const disconnect = (peerId: string) => {
    handlePeerDisconnect(peerId);
    updateConnectionStatus(peerId, 'disconnected');
    toast.info(`Disconnected from peer`);
  };

  return {
    connections,
    peers,
    dataChannels,
    connectToPeer,
    disconnect,
    sendData,
    localStream
  };
}
