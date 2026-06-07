import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY

// Admin client bypasses RLS — only use for server-like operations (registration, email verification)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
        storageKey: 'supabase-admin-key' // Prevent Multiple GoTrueClient warning
    }
});

export default supabaseAdmin;
