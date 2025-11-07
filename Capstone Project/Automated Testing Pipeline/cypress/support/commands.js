// Custom commands for Cypress

// Login command
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(password);
  cy.get('[data-testid="login-button"]').click();
  cy.url().should('not.include', '/login');
});

// Seed data command
Cypress.Commands.add('seedData', (data) => {
  cy.request('POST', '/api/test/seed', data);
});

// Clear database command
Cypress.Commands.add('clearDatabase', () => {
  cy.request('POST', '/api/test/clear');
});

// Wait for API call
Cypress.Commands.add('waitForApi', (alias, timeout = 10000) => {
  cy.wait(alias, { timeout });
});

// Check accessibility
Cypress.Commands.add('checkA11y', () => {
  cy.injectAxe();
  cy.checkA11y();
});
