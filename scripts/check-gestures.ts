#!/usr/bin/env tsx
/**
 * Check for required gesture image assets
 * Warns if gesture PNGs are missing but doesn't fail the build
 */

import { existsSync } from 'fs';
import { join } from 'path';

const REQUIRED_GESTURES = [
  'mano_a_borsa.png',
  'corna.png',
  'ma_che_vuoi.png',
  'vieni_qua.png',
  'piano_piano.png',
  'basta_stop.png',
  'perfetto_ok.png',
  'prometto_giuro.png',
  'vattene_via.png',
  'silenzio.png',
];

const GESTURES_DIR = join(process.cwd(), 'public', 'gestures');

console.log('🔍 Checking gesture assets...\n');

let missingCount = 0;
const missingFiles: string[] = [];

for (const gesture of REQUIRED_GESTURES) {
  const filePath = join(GESTURES_DIR, gesture);
  const exists = existsSync(filePath);
  
  if (exists) {
    console.log(`✅ ${gesture}`);
  } else {
    console.log(`⚠️  ${gesture} - MISSING`);
    missingCount++;
    missingFiles.push(gesture);
  }
}

console.log('');

if (missingCount > 0) {
  console.log(`⚠️  WARNING: ${missingCount} gesture image(s) missing`);
  console.log('');
  console.log('Missing files:');
  missingFiles.forEach(file => console.log(`  - ${file}`));
  console.log('');
  console.log('📝 Add these files to /public/gestures/ before production deployment');
  console.log('   See /public/gestures/README.md for details');
  console.log('');
  console.log('Build will continue, but gesture pages may show placeholders.');
} else {
  console.log('✅ All gesture assets present!');
}

// Don't fail the build - just warn
process.exit(0);
