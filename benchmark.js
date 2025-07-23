// benchmark.js
const { performance } = require('perf_hooks');
const path = require('path');
const fs = require('fs');

// Load rules (adjust path if needed: './dist/src/rules/...' vs './dist/rules/...')
const { checkImplicitSubscriptions } = require('./dist/src/rules/implicit-subscription');
const { checkAsyncPipes } = require('./dist/src/rules/async-pipe-check');
const { suggestSignalUsage } = require('./dist/src/rules/signal-suggestion');
const { checkUnusedObservables } = require('./dist/src/rules/unused-observable');

const RUNS = 5;

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: node benchmark.js <file.ts>');
    process.exit(1);
  }

  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) {
    console.error('File not found:', absolutePath);
    process.exit(1);
  }

  console.log(`\n🔍 Benchmarking ${path.basename(absolutePath)}...\n`);

  const results = [];

  for (let i = 0; i < RUNS; i++) {
    const start = performance.now();
    const startMemory = process.memoryUsage().heapUsed;

    // ✅ Pass filePath string to each rule
    checkImplicitSubscriptions(absolutePath);
    checkAsyncPipes(absolutePath);
    suggestSignalUsage(absolutePath);
    checkUnusedObservables(absolutePath);

    const time = performance.now() - start;
    const memoryUsed = process.memoryUsage().heapUsed - startMemory;

    console.log(`🏃 Run ${i + 1}/${RUNS}: ${time.toFixed(2)}ms`);
    results.push({ time, memoryUsed });
  }

  const avgTime = results.reduce((sum, r) => sum + r.time, 0) / results.length;
  const peakMemoryMB = (Math.max(...results.map(r => r.memoryUsed)) / 1024 / 1024).toFixed(2);

  console.log(`
📊 Results
==============
⏱️  Average: ${avgTime.toFixed(2)}ms
🚀 Fastest: ${Math.min(...results.map(r => r.time)).toFixed(2)}ms
🐢 Slowest: ${Math.max(...results.map(r => r.time)).toFixed(2)}ms
🧠 Memory: ${peakMemoryMB} MB
`);
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});