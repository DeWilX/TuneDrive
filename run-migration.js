#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runMigration() {
  console.log('🚀 Running initial data population migration...');
  
  try {
    // Run the migration using tsx
    const { stdout, stderr } = await execAsync('npx tsx migrations/populate-initial-data.ts');
    
    if (stderr) {
      console.error('Migration stderr:', stderr);
    }
    
    if (stdout) {
      console.log(stdout);
    }
    
    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();