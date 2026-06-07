const https = require('https');

const PRIVATE_KEY = 'FUjluJ4Qx989uXii4BY_4';
const PUBLIC_KEY  = '_mQR5uoVX0txu4vAT';

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(body) : '';
    const req = https.request({
      hostname: 'api.emailjs.com',
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'privateKey': PRIVATE_KEY,
        ...(bodyStr ? { 'Content-Length': Buffer.byteLength(bodyStr) } : {})
      }
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(d) }); }
        catch { resolve({ status: res.statusCode, body: d }); }
      });
    });
    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

async function main() {
  // Step 1: List existing email services
  console.log('\n--- Checking existing services ---');
  const servicesRes = await request('GET', '/api/v1.0/services', null);
  console.log('Status:', servicesRes.status);
  console.log('Services:', JSON.stringify(servicesRes.body, null, 2));

  // Step 2: List existing templates
  console.log('\n--- Checking existing templates ---');
  const templatesRes = await request('GET', '/api/v1.0/templates', null);
  console.log('Status:', templatesRes.status);
  console.log('Templates:', JSON.stringify(templatesRes.body, null, 2));
}

main().catch(console.error);
