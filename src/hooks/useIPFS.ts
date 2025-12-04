import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface IPFSContent {
  cid: string;
  filename?: string;
  content_type?: string;
  size_bytes?: number;
  encrypted?: boolean;
  pinned?: boolean;
  created_at?: string;
}

interface AddResult {
  cid: string;
  size: number;
  gateways: string[];
}

export function useIPFS() {
  const [items, setItems] = useState<IPFSContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const loadItems = async () => {
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.functions.invoke('ipfs-gateway', {
        body: { action: 'list', userId: user.id }
      });

      if (error) throw error;

      setItems(data.items || []);
    } catch (error: any) {
      console.error('Failed to load IPFS items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const addContent = async (
    content: string | Record<string, any>,
    options?: {
      filename?: string;
      contentType?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<AddResult | null> => {
    try {
      setUploading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('ipfs-gateway', {
        body: {
          action: 'add',
          content,
          userId: user.id,
          filename: options?.filename,
          contentType: options?.contentType,
          metadata: options?.metadata
        }
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      toast({
        title: 'Content added to IPFS',
        description: `CID: ${data.cid.substring(0, 20)}...`
      });

      await loadItems();

      return {
        cid: data.cid,
        size: data.size,
        gateways: data.gateways
      };
    } catch (error: any) {
      console.error('IPFS add error:', error);
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive'
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const getContent = async (cid: string): Promise<string | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('ipfs-gateway', {
        body: { action: 'get', cid, userId: user.id }
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Retrieval failed');
      }

      return data.content;
    } catch (error: any) {
      console.error('IPFS get error:', error);
      toast({
        title: 'Retrieval failed',
        description: error.message,
        variant: 'destructive'
      });
      return null;
    }
  };

  const pinContent = async (cid: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('ipfs-gateway', {
        body: { action: 'pin', cid, userId: user.id }
      });

      if (error) throw error;

      toast({
        title: 'Content pinned',
        description: 'Content will be persisted'
      });

      await loadItems();
      return true;
    } catch (error: any) {
      console.error('IPFS pin error:', error);
      toast({
        title: 'Pin failed',
        description: error.message,
        variant: 'destructive'
      });
      return false;
    }
  };

  const unpinContent = async (cid: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase.functions.invoke('ipfs-gateway', {
        body: { action: 'unpin', cid, userId: user.id }
      });

      if (error) throw error;

      toast({
        title: 'Content unpinned',
        description: 'Content may be garbage collected'
      });

      await loadItems();
      return true;
    } catch (error: any) {
      console.error('IPFS unpin error:', error);
      toast({
        title: 'Unpin failed',
        description: error.message,
        variant: 'destructive'
      });
      return false;
    }
  };

  const getGatewayUrls = (cid: string): string[] => {
    return [
      `https://ipfs.io/ipfs/${cid}`,
      `https://cloudflare-ipfs.com/ipfs/${cid}`,
      `https://gateway.pinata.cloud/ipfs/${cid}`,
      `https://dweb.link/ipfs/${cid}`
    ];
  };

  return {
    items,
    loading,
    uploading,
    addContent,
    getContent,
    pinContent,
    unpinContent,
    getGatewayUrls,
    refresh: loadItems
  };
}
