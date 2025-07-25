module.exports = {
  rules: {
    angular: {
      enabled: true,
      strict: true,
      onPush: true
    },
    signals: true
  },
  ignore: [
    '**/*.spec.ts',
    '**/node_modules/**'
  ]
};