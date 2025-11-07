const { createMockUser, generateTestToken } = require('../utils/testHelpers');

describe('Test Helper Utilities', () => {
  describe('createMockUser', () => {
    it('should create a user with default values', () => {
      const user = createMockUser();
      
      expect(user).toHaveProperty('_id');
      expect(user.email).toBe('test@example.com');
      expect(user.username).toBe('testuser');
    });
    
    it('should override default values', () => {
      const user = createMockUser({ email: 'custom@example.com' });
      
      expect(user.email).toBe('custom@example.com');
      expect(user.username).toBe('testuser');
    });
  });
  
  describe('generateTestToken', () => {
    it('should generate a valid JWT token', () => {
      const token = generateTestToken();
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });
    
    it('should generate token with custom userId', () => {
      const customId = 'custom123';
      const token = generateTestToken(customId);
      
      expect(token).toBeDefined();
    });
  });
});
