describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.clearDatabase();
    cy.visit('/');
  });
  
  describe('User Registration', () => {
    it('should register a new user successfully', () => {
      cy.visit('/register');
      
      cy.get('[data-testid="username-input"]').type('newuser');
      cy.get('[data-testid="email-input"]').type('newuser@example.com');
      cy.get('[data-testid="password-input"]').type('Password123!');
      cy.get('[data-testid="confirm-password-input"]').type('Password123!');
      
      cy.get('[data-testid="register-button"]').click();
      
      cy.url().should('include', '/dashboard');
      cy.get('[data-testid="welcome-message"]').should('be.visible');
    });
    
    it('should show validation errors for invalid input', () => {
      cy.visit('/register');
      
      cy.get('[data-testid="register-button"]').click();
      
      cy.get('[data-testid="error-message"]').should('be.visible');
      cy.url().should('include', '/register');
    });
  });
  
  describe('User Login', () => {
    beforeEach(() => {
      // Seed a test user
      cy.seedData({
        users: [{
          email: 'test@example.com',
          password: 'Password123!',
          username: 'testuser'
        }]
      });
    });
    
    it('should login successfully with valid credentials', () => {
      cy.login('test@example.com', 'Password123!');
      
      cy.url().should('include', '/dashboard');
      cy.get('[data-testid="user-menu"]').should('be.visible');
    });
    
    it('should show error for invalid credentials', () => {
      cy.visit('/login');
      
      cy.get('[data-testid="email-input"]').type('wrong@example.com');
      cy.get('[data-testid="password-input"]').type('wrongpassword');
      cy.get('[data-testid="login-button"]').click();
      
      cy.get('[data-testid="error-message"]')
        .should('be.visible')
        .and('contain', 'Invalid credentials');
    });
  });
  
  describe('User Logout', () => {
    it('should logout successfully', () => {
      cy.seedData({
        users: [{
          email: 'test@example.com',
          password: 'Password123!',
          username: 'testuser'
        }]
      });
      
      cy.login('test@example.com', 'Password123!');
      
      cy.get('[data-testid="user-menu"]').click();
      cy.get('[data-testid="logout-button"]').click();
      
      cy.url().should('include', '/login');
      cy.get('[data-testid="user-menu"]').should('not.exist');
    });
  });
});
