// Import commands
import './commands';

// Configure Cypress
Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing tests on uncaught exceptions
  return false;
});

// Code coverage
import '@cypress/code-coverage/support';

// Before each test
beforeEach(() => {
  // Clear cookies and local storage
  cy.clearCookies();
  cy.clearLocalStorage();
});

// After each test
afterEach(() => {
  // Take screenshot on failure
  cy.screenshot({ capture: 'runner', onFail: true });
});
