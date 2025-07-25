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

// Handle --version
const args = process.argv.slice(2);
if (args.includes('--version') || args.includes('-v')) {
  const pkg = require('../package.json');
  console.log(pkg.version);
  process.exit(0);
}

// Handle --help
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
reactive-lint - Angular-specific linter for RxJS and Signals

Usage:
  reactive-lint [file|glob] [options]

Options:
  --version, -v    Print version
  --help, -h       Show this help

Examples:
  reactive-lint src/app/**/*.ts
  reactive-lint components/my-component.ts
`);
  process.exit(0);
}

// Get file pattern from CLI
const pattern = args[0];
if (!pattern) {
  console.error('Usage: reactive-lint <file-or-glob>');
  console.error('Use --help for more info');
  process.exit(1);
}

// Use glob to resolve files
glob(pattern, { nodir: true }, (err, files) => {
  if (err) {
    console.error('Error reading files:', err);
    process.exit(1);
  }

  if (files.length === 0) {
    console.warn(`No .ts files found for pattern: ${pattern}`);
    process.exit(1);
  }

  files.forEach(file => {
    const absolutePath = path.resolve(process.cwd(), file);
    
    if (!fs.existsSync(absolutePath)) {
      console.warn(`File not found (skipping): ${file}`);
      return;
    }

    console.log(`🔍 Linting ${path.relative(process.cwd(), absolutePath)}`);

    // Run all rules
    if (!config.rules || config.rules.implicitSubscriptions !== false) {
      checkImplicitSubscriptions(absolutePath);
    }
    if (!config.rules || config.rules.asyncPipes !== false) {
      checkAsyncPipes(absolutePath);
    }
    if (!config.rules || config.rules.signals !== false) {
      suggestSignalUsage(absolutePath);
    }
    if (!config.rules || config.rules.unusedObservables !== false) {
      checkUnusedObservables(absolutePath);
    }

    console.log('---');
  });
});