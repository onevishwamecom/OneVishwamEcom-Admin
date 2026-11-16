import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const PROD_API_URL = 'https://asia-south1-onevishwam.cloudfunctions.net/api';

function updateEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf-8');

  if (/^VITE_API_URL=.*$/m.test(content)) {
    content = content.replace(/^VITE_API_URL=.*$/m, `VITE_API_URL=${PROD_API_URL}`);
  } else {
    content += `\nVITE_API_URL=${PROD_API_URL}`;
  }

  if (/^VITE_API_BASE_URL=.*$/m.test(content)) {
    content = content.replace(/^VITE_API_BASE_URL=.*$/m, `VITE_API_BASE_URL=${PROD_API_URL}`);
  } else {
    content += `\nVITE_API_BASE_URL=${PROD_API_URL}`;
  }

  fs.writeFileSync(filePath, content, 'utf-8');
}

console.log('\n🔒 [Admin Pre-Build / Deploy Policy Check]');
console.log(`⚡ Enforcing Production API: ${PROD_API_URL}`);

updateEnvFile(path.join(rootDir, '.env.production'));
updateEnvFile(path.join(rootDir, '.env'));

console.log('✅ Admin environment verified for production deployment.\n');
