import { createClient } from '@supabase/supabase-js';

// NOTE: We are not using the Database generic type yet, as it's not defined.
// You can generate this type using Supabase CLI: `npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts`
// and then update createClient to be:
// import type { Database } from '@/types/supabase';
// export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing environment variable NEXT_PUBLIC_SUPABASE_URL");
}
if (!supabaseAnonKey) {
  throw new Error("Missing environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY. Please ensure it's set in your .env.local file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
