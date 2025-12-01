import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AgentMessage {
  id: string;
  from_agent_id: string;
  to_agent_id: string;
  message_type: string;
  payload: any;
  status: string;
  created_at: string;
  processed_at?: string;
}

interface AgentStatus {
  agent_id: string;
  status: 'idle' | 'active' | 'processing' | 'error';
  current_task?: string;
  last_active: string;
  metadata?: any;
}

export function useAgentCommunication(agentId?: string) {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [agentStatuses, setAgentStatuses] = useState<Record<string, AgentStatus>>({});
  const [loading, setLoading] = useState(false);

  // Subscribe to real-time agent messages
  useEffect(() => {
    if (!agentId) return;

    const messageChannel = supabase
      .channel('agent-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'agent_messages',
          filter: `to_agent_id=eq.${agentId}`
        },
        (payload) => {
          console.log('New message received:', payload);
          setMessages((prev) => [...prev, payload.new as AgentMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
    };
  }, [agentId]);

  // Subscribe to real-time agent status updates
  useEffect(() => {
    const statusChannel = supabase
      .channel('agent-status')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agent_status'
        },
        (payload) => {
          console.log('Agent status updated:', payload);
          const status = payload.new as AgentStatus;
          setAgentStatuses((prev) => ({
            ...prev,
            [status.agent_id]: status
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(statusChannel);
    };
  }, []);

  const sendMessage = async (
    fromAgentId: string,
    toAgentId: string,
    messageType: string,
    payload: any
  ) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('agent-communication', {
        body: {
          action: 'send_message',
          fromAgentId,
          toAgentId,
          messageType,
          payload
        }
      });

      if (error) throw error;

      toast.success('Message sent successfully');
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateAgentStatus = async (
    agentId: string,
    status: 'idle' | 'active' | 'processing' | 'error',
    currentTask?: string,
    metadata?: any
  ) => {
    try {
      const { error } = await supabase.functions.invoke('agent-communication', {
        body: {
          action: 'update_status',
          agentId,
          status,
          currentTask,
          metadata
        }
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const processMessage = async (messageId: string, response?: any) => {
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('agent-communication', {
        body: {
          action: 'process_message',
          messageId,
          response
        }
      });

      if (error) throw error;

      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
      toast.success('Message processed');
    } catch (error) {
      console.error('Error processing message:', error);
      toast.error('Failed to process message');
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    agentStatuses,
    loading,
    sendMessage,
    updateAgentStatus,
    processMessage
  };
}
