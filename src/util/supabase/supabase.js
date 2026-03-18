// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// // Get the token from sessionStorage
// const access_token = sessionStorage.getItem('user_token')

// // Create supabase client
// const supabase = access_token
//     ? createClient(supabaseUrl, supabaseAnonKey, {
//         global: {
//             headers: { Authorization: `Bearer ${access_token}` }
//         }
//     })
//     : createClient(supabaseUrl, supabaseAnonKey);

// export default supabase;


import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;