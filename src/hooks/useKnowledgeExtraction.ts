import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ExtractionResult {
  extracted: {
    entities: Array<{
      type: string;
      label: string;
      properties: Record<string, any>;
    }>;
    relationships: Array<{
      from: string;
      to: string;
      type: string;
      properties: Record<string, any>;
    }>;
  };
  created: {
    nodes: number;
    edges: number;
  };
  nodeIds: Record<string, string>;
}

export function useKnowledgeExtraction() {
  const [extracting, setExtracting] = useState(false);
  const [lastResult, setLastResult] = useState<ExtractionResult | null>(null);
  const { toast } = useToast();

  const extractFromContent = async (
    content: string | Record<string, any>,
    dataPodId?: string
  ): Promise<ExtractionResult | null> => {
    try {
      setExtracting(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase.functions.invoke('knowledge-extraction', {
        body: {
          dataPodContent: content,
          userId: user.id,
          dataPodId
        }
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Extraction failed');
      }

      setLastResult(data);

      toast({
        title: 'Knowledge extracted',
        description: `Created ${data.created.nodes} nodes and ${data.created.edges} relationships`
      });

      return data;
    } catch (error: any) {
      console.error('Knowledge extraction error:', error);
      toast({
        title: 'Extraction failed',
        description: error.message,
        variant: 'destructive'
      });
      return null;
    } finally {
      setExtracting(false);
    }
  };

  const extractFromDataPod = async (dataPodId: string): Promise<ExtractionResult | null> => {
    try {
      setExtracting(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      // Fetch the data pod content
      const { data: dataPod, error: fetchError } = await supabase
        .from('data_pods')
        .select('*')
        .eq('id', dataPodId)
        .single();

      if (fetchError) throw fetchError;

      // Use metadata for analysis (actual content is encrypted)
      const contentToAnalyze = dataPod.metadata && typeof dataPod.metadata === 'object' 
        ? dataPod.metadata 
        : { data_type: dataPod.data_type, description: 'Encrypted data pod' };

      return await extractFromContent(contentToAnalyze as Record<string, any>, dataPodId);
    } catch (error: any) {
      console.error('Data pod extraction error:', error);
      toast({
        title: 'Extraction failed',
        description: error.message,
        variant: 'destructive'
      });
      return null;
    } finally {
      setExtracting(false);
    }
  };

  const extractFromText = async (text: string): Promise<ExtractionResult | null> => {
    return extractFromContent(text);
  };

  return {
    extracting,
    lastResult,
    extractFromContent,
    extractFromDataPod,
    extractFromText
  };
}
