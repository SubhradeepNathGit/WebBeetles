import supabaseAdmin from './src/util/supabase/supabaseAdmin.js';

async function listBuckets() {
  const { data, error } = await supabaseAdmin.storage.listBuckets();
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Buckets:", data.map(b => b.name));
  }
}

listBuckets();
