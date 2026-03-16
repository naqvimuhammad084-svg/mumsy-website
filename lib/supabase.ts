import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

// Debug logs to check if env variables are loading
console.log("SUPABASE URL:", supabaseUrl)
console.log("SUPABASE KEY:", supabaseAnonKey ? "Loaded" : "Missing")

function createSupabaseClient(): SupabaseClient {
  if (typeof window !== 'undefined' && (!supabaseUrl || !supabaseAnonKey)) {
    console.error(
      'Missing Supabase env variables. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local and restart the dev server.'
    )
  }

  // Use Supabase defaults so sessions persist correctly across navigations/reloads.
  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createSupabaseClient()

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey)
}