// ==============================================================================
// DEEPALI AYURVEDA — SUPABASE SERVICE ROLE CLIENT HELPER
// File: supabase/functions/_shared/supabaseClient.ts
// ==============================================================================
// Uses Deno.env to securely load environment variables at runtime.
// Never contains hardcoded API keys, URLs, or secrets.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';

export function createServiceRoleClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Server configuration error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
