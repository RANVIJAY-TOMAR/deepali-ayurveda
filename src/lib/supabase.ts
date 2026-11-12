import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

/**
 * ============================================================================
 * DEEPALI AYURVEDA — SUPABASE CLIENT CONFIGURATION
 * ============================================================================
 * Framework: Vite + React 18 + TypeScript
 *
 * NOTE ON ENVIRONMENT VARIABLES:
 * Vite exposes client-side environment variables via import.meta.env, and only
 * variables prefixed with `VITE_` are bundled for the browser.
 *
 * SECURITY AUDIT:
 * - Only the public Project URL and 'anon' Publishable Key are consumed here.
 * - Service-role keys, database passwords, and master secrets are NEVER included.
 * ============================================================================
 */

// Read Vite-prefixed environment variables
const rawSupabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const rawSupabaseAnonKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
) as string | undefined;

export const SUPABASE_URL = (rawSupabaseUrl || '').trim();
export const SUPABASE_ANON_KEY = (rawSupabaseAnonKey || '').trim();

/**
 * Checks whether valid, non-placeholder Supabase credentials are provided.
 */
export function isSupabaseConfigured(): boolean {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return false;
  }

  const isPlaceholderUrl = 
    SUPABASE_URL.includes('your-project.supabase.co') || 
    !SUPABASE_URL.startsWith('https://');

  const isPlaceholderKey = 
    SUPABASE_ANON_KEY === 'your-supabase-anon-publishable-key' ||
    SUPABASE_ANON_KEY.length < 20;

  return !isPlaceholderUrl && !isPlaceholderKey;
}

// Dummy fallback values to prevent createClient from crashing on initial launch before user enters keys
const FALLBACK_URL = 'https://placeholder-deepali.supabase.co';
const FALLBACK_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';

const clientUrl = isSupabaseConfigured() ? SUPABASE_URL : FALLBACK_URL;
const clientKey = isSupabaseConfigured() ? SUPABASE_ANON_KEY : FALLBACK_ANON_KEY;

/**
 * Reusable Supabase client instance with database types.
 */
export const supabase: SupabaseClient<Database> = createClient<Database>(clientUrl, clientKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface ConnectionTestResult {
  success: boolean;
  status: 'connected' | 'not_configured' | 'error';
  message: string;
  projectUrl?: string;
  details?: unknown;
}

/**
 * Performs a safe basic query to verify the connection to the Supabase project
 * without altering data or requiring existing custom database tables.
 */
export async function testSupabaseConnection(): Promise<ConnectionTestResult> {
  if (!isSupabaseConfigured()) {
    const msg = 
      'Supabase is not configured yet. Please add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local and restart the dev server.';
    console.warn(`[Deepali Ayurveda Supabase] ${msg}`);
    return {
      success: false,
      status: 'not_configured',
      message: msg,
      projectUrl: SUPABASE_URL || undefined,
    };
  }

  try {
    // Test 1: Verify auth service handshake (no database table required)
    const { error: authError } = await supabase.auth.getSession();

    if (authError) {
      const msg = `Supabase authentication check failed: ${authError.message}`;
      console.error(`[Deepali Ayurveda Supabase] ${msg}`, authError);
      return {
        success: false,
        status: 'error',
        message: msg,
        projectUrl: SUPABASE_URL,
        details: authError,
      };
    }

    // Test 2: Safe ping to PostgREST API
    // We request headers only (head: true) on products table
    const { error: restError, status } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true });

    // In PostgREST:
    // status 401 = invalid API key
    // status 404 / PGRST205 = table not found yet (migrations pending)
    // status 200 = table exists and query succeeded
    if (status === 401) {
      const msg = 'Connection failed: The provided VITE_SUPABASE_ANON_KEY is invalid.';
      console.error(`[Deepali Ayurveda Supabase] ${msg}`, restError);
      return {
        success: false,
        status: 'error',
        message: msg,
        projectUrl: SUPABASE_URL,
        details: restError,
      };
    }

    const tableDeployed = status === 200;
    const successMsg = tableDeployed
      ? `Successfully connected to Supabase: 'products' table active at ${SUPABASE_URL}`
      : `Successfully authenticated with Supabase API at ${SUPABASE_URL}. (Database tables awaiting migration execution).`;

    console.log(`%c[Deepali Ayurveda Supabase] ${successMsg}`, 'color: #A7835E; font-weight: bold;');
    
    return {
      success: true,
      status: 'connected',
      message: successMsg,
      projectUrl: SUPABASE_URL,
      details: {
        httpStatus: status,
        tableStatus: tableDeployed ? 'Products table active' : 'Awaiting migration execution',
      },
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    const msg = `Network or CORS error connecting to Supabase: ${errorMsg}`;
    console.error(`[Deepali Ayurveda Supabase] ${msg}`, err);
    return {
      success: false,
      status: 'error',
      message: msg,
      projectUrl: SUPABASE_URL,
      details: err,
    };
  }
}

// Expose safe tester on window object in browser for quick F12 console verification
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).testSupabaseConnection = testSupabaseConnection;
  (window as unknown as Record<string, unknown>).isSupabaseConfigured = isSupabaseConfigured;
  (window as unknown as Record<string, unknown>).supabase = supabase;
}

// Development Mode Status Log
if (import.meta.env.DEV) {
  if (isSupabaseConfigured()) {
    testSupabaseConnection().then((res) => {
      if (res.success) {
        console.log(`%c[Deepali Ayurveda Supabase] Connected to ${SUPABASE_URL}`, 'color: #10B981; font-weight: bold;');
      } else {
        console.warn(`[Deepali Ayurveda Supabase] ${res.message}`);
      }
    });
  } else {
    console.info(
      '%c[Deepali Ayurveda Supabase] Ready for credentials.%c Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local to activate backend features.',
      'color: #A7835E; font-weight: bold;',
      'color: inherit;'
    );
  }
}
