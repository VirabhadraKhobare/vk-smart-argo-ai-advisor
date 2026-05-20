const fs = require('fs');
const path = require('path');

const targets = [
  'node_modules/react-dev-utils/checkRequiredFiles.js',
];

for (const rel of targets) {
  const p = path.join(__dirname, '..', rel);
  try {
    let c = fs.readFileSync(p, 'utf8');
    if (c.includes('fs.F_OK')) {
      c = c.replace(/fs\.F_OK/g, 'fs.constants.F_OK');
      fs.writeFileSync(p, c, 'utf8');
      console.log('[patch-fs-const] Patched', p);
    } else {
      console.log('[patch-fs-const] No occurrences in', p);
    }
  } catch (err) {
    console.error('[patch-fs-const] Failed to patch', p, err.message);
  }
}
