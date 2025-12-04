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
    const { dataPodContent, userId, dataPodId } = await req.json();

    if (!dataPodContent || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: dataPodContent, userId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Use AI to extract entities and relationships
    const extractionPrompt = `Analyze the following content and extract entities and relationships for a knowledge graph.

Content to analyze:
${typeof dataPodContent === 'string' ? dataPodContent : JSON.stringify(dataPodContent, null, 2)}

Return a JSON object with this exact structure:
{
  "entities": [
    { "type": "person|organization|concept|location|event|technology", "label": "Name", "properties": {} }
  ],
  "relationships": [
    { "from": "Entity1 Label", "to": "Entity2 Label", "type": "relates_to|belongs_to|created_by|located_in|part_of", "properties": {} }
  ]
}

Extract meaningful entities and their relationships. Be comprehensive but accurate.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a knowledge extraction AI. Extract entities and relationships from content and return valid JSON only.' },
          { role: 'user', content: extractionPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI extraction failed: ${response.status}`);
    }

    const aiData = await response.json();
    const aiContent = aiData.choices?.[0]?.message?.content || '';
    
    // Parse the AI response
    let extractedData;
    try {
      // Find JSON in the response
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in AI response');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError, aiContent);
      extractedData = { entities: [], relationships: [] };
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const createdNodes: any[] = [];
    const createdEdges: any[] = [];
    const nodeIdMap: Record<string, string> = {};

    // Create nodes for each entity
    for (const entity of extractedData.entities || []) {
      try {
        // Check if node already exists
        const { data: existingNode } = await supabase
          .from('knowledge_nodes')
          .select('id')
          .eq('user_id', userId)
          .eq('label', entity.label)
          .eq('node_type', entity.type)
          .maybeSingle();

        if (existingNode) {
          nodeIdMap[entity.label] = existingNode.id;
          continue;
        }

        const { data: newNode, error } = await supabase
          .from('knowledge_nodes')
          .insert({
            user_id: userId,
            node_type: entity.type,
            label: entity.label,
            properties: {
              ...entity.properties,
              source: 'auto_extraction',
              source_pod_id: dataPodId
            }
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating node:', error);
          continue;
        }

        createdNodes.push(newNode);
        nodeIdMap[entity.label] = newNode.id;
      } catch (error) {
        console.error('Error processing entity:', entity.label, error);
      }
    }

    // Create edges for relationships
    for (const rel of extractedData.relationships || []) {
      try {
        const sourceId = nodeIdMap[rel.from];
        const targetId = nodeIdMap[rel.to];

        if (!sourceId || !targetId) {
          console.warn(`Missing node for relationship: ${rel.from} -> ${rel.to}`);
          continue;
        }

        // Check if edge already exists
        const { data: existingEdge } = await supabase
          .from('knowledge_edges')
          .select('id')
          .eq('source_node_id', sourceId)
          .eq('target_node_id', targetId)
          .eq('edge_type', rel.type)
          .maybeSingle();

        if (existingEdge) continue;

        const { data: newEdge, error } = await supabase
          .from('knowledge_edges')
          .insert({
            user_id: userId,
            source_node_id: sourceId,
            target_node_id: targetId,
            edge_type: rel.type,
            properties: {
              ...rel.properties,
              source: 'auto_extraction'
            },
            weight: 1.0
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating edge:', error);
          continue;
        }

        createdEdges.push(newEdge);
      } catch (error) {
        console.error('Error processing relationship:', rel, error);
      }
    }

    console.log(`Knowledge extraction complete: ${createdNodes.length} nodes, ${createdEdges.length} edges`);

    return new Response(
      JSON.stringify({
        success: true,
        extracted: extractedData,
        created: {
          nodes: createdNodes.length,
          edges: createdEdges.length
        },
        nodeIds: nodeIdMap
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Knowledge extraction error:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
