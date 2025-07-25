#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const glob = require('glob');

// Import rules
const { 
  checkImplicitSubscriptions,
  checkAsyncPipes,
  suggestSignalUsage,
  checkUnusedObservables
} = require('../dist/src');

// Load config
let config = {};
try {
  config = require('../reactive-lint.config.js');
} catch (e) {
  console.warn('No config file found, using defaults');
}

// Parse CLI args
const pattern = process.argv[2] || 'examples/angular-bad-code.ts';

// Use glob.sync to get files synchronously
const files = glob.sync(pattern, {
  nodir: true,
  absolute: true
});

if (files.length === 0) {
  console.warn(`No files found for pattern: ${pattern}`);
  process.exit(1);
}

files.forEach(file => {
  if (!fs.existsSync(file)) return;

  console.log(`🔍 Linting ${path.relative(process.cwd(), file)}`);

  // Run all rules
  if (!config.rules || config.rules.implicitSubscriptions !== false) {
    checkImplicitSubscriptions(file);
  }
  if (!config.rules || config.rules.asyncPipes !== false) {
    checkAsyncPipes(file);
  }
  if (!config.rules || config.rules.signals !== false) {
    suggestSignalUsage(file);
  }
  if (!config.rules || config.rules.unusedObservables !== false) {
    checkUnusedObservables(file);
  }

  console.log('---');
});