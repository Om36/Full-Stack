// Load test environment variables
require('dotenv').config({ path: '.env.test' });

// Set test timeout
jest.setTimeout(10000);

// Mock console methods to reduce noise
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Global test utilities
global.testUtils = {
  sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  generateId: () => Math.random().toString(36).substring(7),
};

// Clean up after all tests
afterAll(async () => {
  // Close any open connections
  await new Promise(resolve => setTimeout(resolve, 500));
});
