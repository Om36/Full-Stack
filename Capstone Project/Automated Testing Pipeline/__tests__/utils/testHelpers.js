const jwt = require('jsonwebtoken');

// Mock user factory
const createMockUser = (overrides = {}) => ({
  _id: '507f1f77bcf86cd799439011',
  email: 'test@example.com',
  username: 'testuser',
  password: 'hashedpassword123',
  createdAt: new Date('2025-01-01'),
  ...overrides
});

// Mock product factory
const createMockProduct = (overrides = {}) => ({
  _id: '507f1f77bcf86cd799439012',
  name: 'Test Product',
  description: 'Test description',
  price: 99.99,
  stock: 100,
  category: 'electronics',
  createdAt: new Date('2025-01-01'),
  ...overrides
});

// Generate JWT token for testing
const generateTestToken = (userId = '507f1f77bcf86cd799439011') => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'test_secret',
    { expiresIn: '1h' }
  );
};

// Mock MongoDB ObjectId
const mockObjectId = (id = '507f1f77bcf86cd799439011') => id;

// Wait utility with fake timers support
const waitFor = async (callback, options = {}) => {
  const { timeout = 5000, interval = 50 } = options;
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    try {
      const result = await callback();
      if (result) return result;
    } catch (error) {
      // Continue waiting
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  throw new Error(`Timeout waiting for condition after ${timeout}ms`);
};

module.exports = {
  createMockUser,
  createMockProduct,
  generateTestToken,
  mockObjectId,
  waitFor
};
