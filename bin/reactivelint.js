#!/usr/bin/env node
const path = require('path');

// Use compiled JS files
const { 
  checkImplicitSubscriptions,
  checkAsyncPipes,
  suggestSignalUsage,
  checkUnusedObservables
} = require('../dist/src');

const filePath = path.resolve(process.cwd(), process.argv[2]);
if (!filePath) {
  console.error('Usage: reactivelint <file.ts>');
  process.exit(1);
}

console.log(`🔍 Linting ${filePath}`);

// Run all checks
checkImplicitSubscriptions(filePath);
checkAsyncPipes(filePath);
checkUnusedObservables(filePath);
suggestSignalUsage(filePath);