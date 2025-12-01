import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { action, fromAgentId, toAgentId, messageType, payload } = await req.json();

    if (action === 'send_message') {
      // Send message from one agent to another
      const { data: message, error: messageError } = await supabaseClient
        .from('agent_messages')
        .insert({
          from_agent_id: fromAgentId,
          to_agent_id: toAgentId,
          message_type: messageType,
          payload: payload,
          status: 'pending'
        })
        .select()
        .single();

      if (messageError) throw messageError;

      // Update sender agent status
      await supabaseClient
        .from('agent_status')
        .upsert({
          agent_id: fromAgentId,
          status: 'active',
          current_task: `Sent ${messageType} to agent ${toAgentId}`,
          last_active: new Date().toISOString()
        });

      return new Response(
        JSON.stringify({ success: true, message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'get_messages') {
      // Get pending messages for an agent
      const { agentId } = await req.json();
      
      const { data: messages, error } = await supabaseClient
        .from('agent_messages')
        .select('*')
        .eq('to_agent_id', agentId)
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, messages }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'process_message') {
      // Mark message as processed
      const { messageId, response } = await req.json();

      const { error } = await supabaseClient
        .from('agent_messages')
        .update({
          status: 'processed',
          processed_at: new Date().toISOString()
        })
        .eq('id', messageId);

      if (error) throw error;

      // If there's a response, send it back
      if (response) {
        const { data: originalMessage } = await supabaseClient
          .from('agent_messages')
          .select('from_agent_id, to_agent_id')
          .eq('id', messageId)
          .single();

        if (originalMessage) {
          await supabaseClient
            .from('agent_messages')
            .insert({
              from_agent_id: originalMessage.to_agent_id,
              to_agent_id: originalMessage.from_agent_id,
              message_type: 'task_response',
              payload: response,
              status: 'pending'
            });
        }
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'update_status') {
      // Update agent status
      const { agentId, status, currentTask, metadata } = await req.json();

      const { error } = await supabaseClient
        .from('agent_status')
        .upsert({
          agent_id: agentId,
          status,
          current_task: currentTask,
          metadata: metadata || {},
          last_active: new Date().toISOString()
        });

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Agent communication error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
