import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Use anon key for full RLS-aware read/write; fall back to publishable key
const supabaseKey = (
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
)!;

export const createClient = () =>
  createBrowserClient(supabaseUrl, supabaseKey);
