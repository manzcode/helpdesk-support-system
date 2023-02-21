import { SupabaseClient, createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_PROJECT_URL || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "";
export const SECRET_KEY = process.env.SUPABASE_SECRET || "";
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
