#!/usr/bin/env node

// Import required modules
// Ensure 'glob' is listed in your package.json dependencies
const path = require('path');
const fs = require('fs');
const { glob } = require('glob'); // This should be glob.sync
const util = require('util');

// --- 1. Load Rules ---
console.log('🔧 Starting reactive-lint...');
console.log('📦 Attempting to load rules...');

let rules;
try {
    // Load the main entry point of your package (points to dist/index.js after build)
    rules = require('../');
    console.log('✅ Rules loaded successfully:', Object.keys(rules));
} catch (err) {
    console.error('❌ Failed to load rules from package root (../):', err.message);
    console.error('   Stack:', err.stack);
    process.exit(1);
}

const {
    checkImplicitSubscriptions,
    checkAsyncPipes,
    suggestSignalUsage,
    checkUnusedObservables
} = rules;

// --- 2. Load Configuration ---
let config = {};
let configLoaded = false;
try {
    const configPath = path.resolve(process.cwd(), 'reactive-lint.config.js');
    if (fs.existsSync(configPath)) {
        config = require(configPath);
        configLoaded = true;
        console.log('⚙️  User config loaded from:', configPath);
    } else {
        console.log('ℹ️  No user config file found at:', configPath, '(using defaults)');
    }
} catch (e) {
    console.warn('⚠️  Error loading user config file (using defaults):', e.message);
}
if (!configLoaded) {
    console.log('⚙️  Using default configuration.');
}

// --- 3. Handle CLI Arguments ---
const args = process.argv.slice(2);

if (args.includes('--version') || args.includes('-v')) {
    try {
        const pkg = require('../package.json');
        console.log(pkg.version);
    } catch (pkgErr) {
        console.error('❌ Could not read version from package.json');
    }
    process.exit(0);
}

if (args.includes('--help') || args.includes('-h')) {
    console.log(`
reactive-lint - Angular-specific linter for RxJS and Signals

Usage:
  reactivelint [file-or-glob] [options]

Examples:
  reactivelint src/app/component.ts
  reactivelint "src/app/**/*.ts" // Use quotes for globs

Options:
  -v, --version  Print the version number
  -h, --help     Show this help message
`);
    process.exit(0);
}

const pattern = args[0];
if (!pattern) {
    console.error('❌ Usage: reactivelint <file-or-glob>');
    console.error('   Use --help for more information.');
    process.exit(1);
}

// --- 4. Process Files (Using glob.sync) ---
console.log(`📁 Searching for files matching pattern: ${pattern}`);

try {
    // --- CRITICAL CHANGE: Use glob.sync to make the operation synchronous ---
    const files = glob.sync(pattern, { nodir: true, absolute: true });

    console.log(`📄 [DEBUG] Found files:`, files);

    if (files.length === 0) {
        console.warn(`⚠️  No .ts files found for pattern: ${pattern}`);
        process.exit(1); // Or exit 0 if preferred
    }

    console.log(`📄 Found ${files.length} file(s) to process.`);

    let hasOutput = false; // Flag to track if any rule produced output

    // --- Process Each File ---
    files.forEach((absolutePath, index) => {
        console.log(`🔍 [FILE ${index + 1}/${files.length}] Linting: ${path.relative(process.cwd(), absolutePath)}`);

        if (!fs.existsSync(absolutePath)) {
            console.warn(`⚠️  [FILE ${index + 1}] File not found (skipping): ${absolutePath}`);
            return; // Skip this file in the loop
        }

        // --- Execute Linting Rules ---
        try {
            let ruleExecuted = false;
            if (!config.rules || config.rules.implicitSubscriptions !== false) {
                console.log(`   📋 [FILE ${index + 1}] Running checkImplicitSubscriptions...`);
                checkImplicitSubscriptions(absolutePath);
                ruleExecuted = true;
                hasOutput = true;
            }
            if (!config.rules || config.rules.asyncPipes !== false) {
                console.log(`   📋 [FILE ${index + 1}] Running checkAsyncPipes...`);
                checkAsyncPipes(absolutePath);
                ruleExecuted = true;
                hasOutput = true;
            }
            if (!config.rules || config.rules.signals !== false) {
                console.log(`   📋 [FILE ${index + 1}] Running suggestSignalUsage...`);
                suggestSignalUsage(absolutePath);
                ruleExecuted = true;
                hasOutput = true;
            }
            if (!config.rules || config.rules.unusedObservables !== false) {
                console.log(`   📋 [FILE ${index + 1}] Running checkUnusedObservables...`);
                checkUnusedObservables(absolutePath);
                ruleExecuted = true;
                hasOutput = true;
            }
            if (!ruleExecuted) {
                 console.log(`   ℹ️  [FILE ${index + 1}] No rules enabled for this file.`);
            }

        } catch (ruleError) {
            console.error(`❌ [FILE ${index + 1}] Error in rule execution for ${absolutePath}:`, ruleError.message);
            console.error('   Stack:', ruleError.stack);
            hasOutput = true; // Count errors as output
        }

        console.log(`--- [END FILE ${index + 1}] ---`);
    });

    console.log('🏁 Linting process completed for all files.');
    if (!hasOutput) {
        console.log('ℹ️  No linting issues found or rules did not produce detectable output for the given files.');
    }
    // Allow process to exit naturally after all synchronous work is done.

} catch (globError) {
    console.error("❌ Unexpected error during file processing (glob.sync):", globError.message);
    console.error('   Stack:', globError.stack);
    process.exit(1); // Exit on unexpected error
}

// --- IMPORTANT ---
// Because we are using glob.sync, all file processing is synchronous.
// The script will naturally wait for the above code to finish before exiting.
// Therefore, we do NOT need process.exit(0) here.
console.log('[DEBUG] Script reached the end of the main execution thread (synchronous processing done).');