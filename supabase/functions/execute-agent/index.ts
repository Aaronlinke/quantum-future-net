import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { agentId, inputData, userId } = await req.json();

    if (!agentId || !inputData || !userId) {
      throw new Error('Missing required parameters');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get agent details
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .single();

    if (agentError || !agent) {
      throw new Error('Agent not found');
    }

    // Create interaction record
    const { data: interaction, error: interactionError } = await supabase
      .from('agent_interactions')
      .insert({
        agent_id: agentId,
        user_id: userId,
        input_data: inputData,
        status: 'pending',
      })
      .select()
      .single();

    if (interactionError) {
      throw new Error('Failed to create interaction');
    }

    // Execute agent logic based on capabilities
    let outputData: any = {};

    try {
      // Check if agent has AI capability
      if (agent.capabilities?.includes('ai_analysis')) {
        outputData = await executeAIAnalysis(inputData);
      } else if (agent.capabilities?.includes('data_processing')) {
        outputData = await executeDataProcessing(inputData);
      } else if (agent.capabilities?.includes('knowledge_extraction')) {
        outputData = await executeKnowledgeExtraction(inputData, userId, supabase);
      } else {
        outputData = {
          message: 'Agent executed successfully',
          processed: true,
          timestamp: new Date().toISOString(),
        };
      }

      // Update interaction with output
      await supabase
        .from('agent_interactions')
        .update({
          output_data: outputData,
          status: 'completed',
        })
        .eq('id', interaction.id);

      return new Response(
        JSON.stringify({ 
          success: true, 
          interactionId: interaction.id,
          output: outputData 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (execError) {
      // Update interaction as failed
      const errorMessage = execError instanceof Error ? execError.message : 'Unknown error';
      await supabase
        .from('agent_interactions')
        .update({
          output_data: { error: errorMessage },
          status: 'failed',
        })
        .eq('id', interaction.id);

      throw execError;
    }
  } catch (error) {
    console.error('Error executing agent:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function executeAIAnalysis(inputData: any) {
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  
  if (!LOVABLE_API_KEY) {
    throw new Error('LOVABLE_API_KEY not configured');
  }

  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        {
          role: 'system',
          content: 'You are an AI agent analyzing user data. Provide concise, actionable insights.',
        },
        {
          role: 'user',
          content: `Analyze this data and provide insights: ${JSON.stringify(inputData)}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('AI Gateway error:', response.status, errorText);
    throw new Error(`AI analysis failed: ${response.status}`);
  }

  const data = await response.json();
  return {
    analysis: data.choices[0].message.content,
    model: 'google/gemini-2.5-flash',
    timestamp: new Date().toISOString(),
  };
}

async function executeDataProcessing(inputData: any) {
  // Simple data processing logic
  const processed = {
    originalDataSize: JSON.stringify(inputData).length,
    processed: true,
    dataType: typeof inputData,
    keys: Object.keys(inputData),
    timestamp: new Date().toISOString(),
  };

  return processed;
}

async function executeKnowledgeExtraction(inputData: any, userId: string, supabase: any) {
  const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
  
  if (!LOVABLE_API_KEY) {
    throw new Error('LOVABLE_API_KEY not configured');
  }

  // Use AI to extract entities and relationships
  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LOVABLE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        {
          role: 'system',
          content: 'Extract entities and relationships from the provided text. Return a JSON object with "entities" array (each with "label" and "type") and "relationships" array (each with "source", "target", and "type").',
        },
        {
          role: 'user',
          content: `Extract knowledge from: ${JSON.stringify(inputData)}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error('Knowledge extraction AI call failed');
  }

  const data = await response.json();
  const aiResponse = data.choices[0].message.content;

  // Parse AI response and create knowledge graph nodes
  let extractedKnowledge;
  try {
    extractedKnowledge = JSON.parse(aiResponse);
  } catch {
    extractedKnowledge = {
      entities: [],
      relationships: [],
      raw: aiResponse,
    };
  }

  // Create nodes in knowledge graph
  const createdNodes = [];
  if (extractedKnowledge.entities && Array.isArray(extractedKnowledge.entities)) {
    for (const entity of extractedKnowledge.entities.slice(0, 5)) {
      const { data: node } = await supabase
        .from('knowledge_nodes')
        .insert({
          user_id: userId,
          node_type: entity.type || 'entity',
          label: entity.label,
          properties: { extracted_from: 'agent', source_data: inputData },
        })
        .select()
        .single();

      if (node) createdNodes.push(node);
    }
  }

  return {
    extractedEntities: extractedKnowledge.entities?.length || 0,
    extractedRelationships: extractedKnowledge.relationships?.length || 0,
    createdNodes: createdNodes.length,
    nodes: createdNodes,
    timestamp: new Date().toISOString(),
  };
}
