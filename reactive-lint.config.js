// reactive-lint.config.js
module.exports = {
  rules: {
    angular: {
      enabled: true,
      strict: true, // Enforce takeUntilDestroyed()
      onPush: true  // Check async pipe + OnPush
    },
    signals: true
  },
  ignore: [
    '**/*.spec.ts',
    '**/node_modules/**'
  ]
};