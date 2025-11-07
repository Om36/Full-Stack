module.exports = {
  // Test environment
  testEnvironment: 'node',
  
  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'routes/**/*.js',
    'models/**/*.js',
    'client/src/**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/build/**',
    '!**/coverage/**'
  ],
  
  // Coverage thresholds (quality gates)
  coverageThreshold: {
    global: {
      lines: 80,
      branches: 70,
      functions: 75,
      statements: 80
    }
  },
  
  // Test patterns
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
  
  // Module paths
  moduleDirectories: ['node_modules', '<rootDir>'],
  
  // Transform
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  
  // Test timeout
  testTimeout: 10000,
  
  // Verbose output
  verbose: true,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Reset mocks between tests
  resetMocks: true,
  
  // Restore mocks between tests
  restoreMocks: true
};
