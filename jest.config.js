module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^src/(.*)$': '<rootDir>/dist/src/$1'  // ✅ Map src/ to dist/src/
  },
  testMatch: ['<rootDir>/test/**/*.test.ts'],
  clearMocks: true
};