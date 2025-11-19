import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useAgentExecution() {
  const [executing, setExecuting] = useState(false);

  const executeAgent = async (agentId: string, inputData: any, userId: string) => {
    setExecuting(true);

    try {
      const { data, error } = await supabase.functions.invoke('execute-agent', {
        body: {
          agentId,
          inputData,
          userId,
        },
      });

      if (error) throw error;

      toast.success('Agent executed successfully');
      return data;
    } catch (error) {
      console.error('Agent execution error:', error);
      toast.error('Failed to execute agent');
      throw error;
    } finally {
      setExecuting(false);
    }
  };

  return {
    executeAgent,
    executing,
  };
}
