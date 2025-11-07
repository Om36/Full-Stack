const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    
    // Video and screenshot settings
    video: true,
    screenshotOnRunFailure: true,
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    
    // Retry configuration for flaky tests
    retries: {
      runMode: 2,
      openMode: 0
    },
    
    // Viewport settings
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Timeouts
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000,
    requestTimeout: 15000,
    
    // Reporter
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: true,
      json: true
    },
    
    setupNodeEvents(on, config) {
      // Code coverage
      require('@cypress/code-coverage/task')(on, config);
      return config;
    }
  },
  
  // Component testing
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack'
    },
    specPattern: 'client/src/**/*.cy.{js,jsx}'
  }
});
