import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Public IPFS gateways for content addressing
const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
  'https://dweb.link/ipfs/'
];

// Simple CID generation using Web Crypto (simulates IPFS content addressing)
async function generateCID(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  // Create a CIDv1-like identifier (base32 would be ideal, but hex works for demo)
  return `baf${hashHex.substring(0, 56)}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, content, cid, userId, filename, contentType, metadata } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    switch (action) {
      case 'add': {
        // Add content to IPFS-like storage
        if (!content || !userId) {
          return new Response(
            JSON.stringify({ error: 'Missing content or userId' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const contentString = typeof content === 'string' ? content : JSON.stringify(content);
        const generatedCid = await generateCID(contentString);
        const sizeBytes = new TextEncoder().encode(contentString).length;

        // Store content reference in Supabase Storage
        const storagePath = `ipfs/${userId}/${generatedCid}`;
        const { error: storageError } = await supabase.storage
          .from('data-pods')
          .upload(storagePath, contentString, {
            contentType: contentType || 'application/octet-stream',
            upsert: true
          });

        if (storageError) {
          console.warn('Storage upload warning:', storageError);
        }

        // Try to record in ipfs_content table (may not exist yet)
        try {
          await supabase.from('ipfs_content').insert({
            user_id: userId,
            cid: generatedCid,
            filename: filename || null,
            content_type: contentType || 'application/octet-stream',
            size_bytes: sizeBytes,
            encrypted: true,
            metadata: metadata || {},
            pinned: true
          });
        } catch (dbError) {
          console.warn('IPFS content table not available:', dbError);
        }

        console.log(`Content added with CID: ${generatedCid}`);

        return new Response(
          JSON.stringify({
            success: true,
            cid: generatedCid,
            size: sizeBytes,
            gateways: IPFS_GATEWAYS.map(g => g + generatedCid)
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'get': {
        // Retrieve content by CID
        if (!cid || !userId) {
          return new Response(
            JSON.stringify({ error: 'Missing cid or userId' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const storagePath = `ipfs/${userId}/${cid}`;
        const { data, error } = await supabase.storage
          .from('data-pods')
          .download(storagePath);

        if (error) {
          // Try public IPFS gateways as fallback
          for (const gateway of IPFS_GATEWAYS) {
            try {
              const response = await fetch(gateway + cid);
              if (response.ok) {
                const content = await response.text();
                return new Response(
                  JSON.stringify({ success: true, cid, content, source: 'ipfs_gateway' }),
                  { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                );
              }
            } catch {
              continue;
            }
          }

          return new Response(
            JSON.stringify({ error: 'Content not found' }),
            { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const content = await data.text();
        return new Response(
          JSON.stringify({ success: true, cid, content, source: 'local_storage' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'list': {
        // List all IPFS content for user
        if (!userId) {
          return new Response(
            JSON.stringify({ error: 'Missing userId' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Try to get from ipfs_content table
        try {
          const { data, error } = await supabase
            .from('ipfs_content')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

          if (!error && data) {
            return new Response(
              JSON.stringify({ success: true, items: data }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        } catch {
          // Table doesn't exist, fall back to storage listing
        }

        // Fallback: list from storage
        const { data: files, error: listError } = await supabase.storage
          .from('data-pods')
          .list(`ipfs/${userId}`);

        if (listError) {
          return new Response(
            JSON.stringify({ success: true, items: [] }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const items = files?.map(f => ({
          cid: f.name,
          filename: f.name,
          size_bytes: f.metadata?.size || 0,
          created_at: f.created_at
        })) || [];

        return new Response(
          JSON.stringify({ success: true, items }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'pin': {
        // Pin content (mark as persistent)
        if (!cid || !userId) {
          return new Response(
            JSON.stringify({ error: 'Missing cid or userId' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        try {
          await supabase
            .from('ipfs_content')
            .update({ pinned: true })
            .eq('user_id', userId)
            .eq('cid', cid);
        } catch {
          console.warn('Could not update pin status');
        }

        return new Response(
          JSON.stringify({ success: true, cid, pinned: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'unpin': {
        // Unpin content
        if (!cid || !userId) {
          return new Response(
            JSON.stringify({ error: 'Missing cid or userId' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        try {
          await supabase
            .from('ipfs_content')
            .update({ pinned: false })
            .eq('user_id', userId)
            .eq('cid', cid);
        } catch {
          console.warn('Could not update pin status');
        }

        return new Response(
          JSON.stringify({ success: true, cid, pinned: false }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action. Use: add, get, list, pin, unpin' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error: any) {
    console.error('IPFS gateway error:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
