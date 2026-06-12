import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const purchaseItemId = 'd46028cc-3567-4f71-a6bc-5ce34e63cfb0';
  
  const { data, error } = await supabase
    .from('purchase_items')
    .select('id, is_exam_completed, created_at, updated_at, course_id, purchases(user_id)')
    .eq('id', purchaseItemId)
    .maybeSingle();
    
  console.log("Error:", error);
  console.log("Data:", data);
}

test();
