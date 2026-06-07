const https = require('https');

const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlub3lyZndreGpiY3ZhbXBhc3hzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc4MzE0NCwiZXhwIjoyMDc4MzU5MTQ0fQ.gmiTlHA44I54OApP9Er-mjJFdsAQxEALfYwrv1uHWmY';
const HOSTNAME = 'ynoyrfwkxjbcvampasxs.supabase.co';

function makeRequest(path, method, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = JSON.stringify(body);
    const req = https.request({
      hostname: HOSTNAME,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + SERVICE_KEY,
        'apikey': SERVICE_KEY,
        'Content-Length': Buffer.byteLength(bodyStr),
        'Prefer': 'return=representation'
      }
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: d }));
    });
    req.on('error', reject);
    req.write(bodyStr);
    req.end();
  });
}

async function main() {
  console.log('Creating otp_tokens table...');

  // Use the SQL endpoint via postgrest rpc
  const sql = `
    CREATE TABLE IF NOT EXISTS public.otp_tokens (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      email text NOT NULL,
      otp text NOT NULL,
      user_type text NOT NULL DEFAULT 'student',
      expires_at timestamptz NOT NULL DEFAULT (now() + interval '10 minutes'),
      created_at timestamptz DEFAULT now()
    );

    ALTER TABLE public.otp_tokens ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "service_role_all" ON public.otp_tokens;
    CREATE POLICY "service_role_all" ON public.otp_tokens 
      FOR ALL TO service_role USING (true) WITH CHECK (true);
  `;

  const res = await makeRequest('/rest/v1/rpc/exec_sql', 'POST', { sql });
  console.log('Status:', res.status);
  console.log('Body:', res.body);

  if (res.status === 404) {
    console.log('\nrpc/exec_sql not found. Trying alternative...');
    // Try inserting a test row to see if table exists
    const testRes = await makeRequest('/rest/v1/otp_tokens?select=id&limit=1', 'GET', {});
    if (testRes.status === 200) {
      console.log('Table already exists!');
    } else {
      console.log('Table does not exist. Status:', testRes.status, testRes.body);
      console.log('\nPlease run this SQL in Supabase SQL Editor:');
      console.log(sql);
    }
  }
}

main().catch(console.error);
