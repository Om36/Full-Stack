# Automated Testing Pipeline - Deployment & Execution Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running Tests](#running-tests)
5. [CI/CD Setup](#cicd-setup)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- **Node.js**: v16.x, 18.x, or 20.x
- **npm**: v8.x or higher
- **MongoDB**: v6.x (for local development)
- **Git**: v2.x or higher
- **Make** (optional, for Makefile commands)

### System Requirements
- **OS**: Linux, macOS, or Windows with WSL2
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: 2GB free space

---

## Installation

### Step 1: Clone the Repository
```bash
git clone <your-repository-url>
cd my-project
```

### Step 2: Install Dependencies
```bash
npm install
```

Or using Make:
```bash
make install
```

### Step 3: Install Testing Dependencies
```bash
npm install --save-dev jest @types/jest babel-jest supertest mongodb-memory-server cypress @cypress/code-coverage @testing-library/react @testing-library/jest-dom eslint prettier husky nyc wait-on cross-env mochawesome
```

### Step 4: Setup Environment Variables
Copy the test environment file:
```bash
cp .env-example .env.test
```

Edit `.env.test` with your configuration:
```env
NODE_ENV=test
PORT=3001
MONGODB_URI=mongodb://localhost:27017/test_db
JWT_SECRET=test_secret_key_for_testing
API_TIMEOUT=5000
LOG_LEVEL=error
```

### Step 5: Setup Git Hooks
```bash
make setup-hooks
```

Or manually:
```bash
npx husky install
npx husky add .husky/pre-commit "npm run lint && npm run test:unit"
npx husky add .husky/pre-push "npm run test"
```

---

## Configuration

### Package.json Scripts
Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "test": "npm run test:unit && npm run test:integration && npm run test:e2e",
    "test:unit": "cross-env NODE_ENV=test jest --testPathPattern=__tests__/unit --coverage",
    "test:integration": "cross-env NODE_ENV=test jest --testPathPattern=__tests__/integration --runInBand",
    "test:e2e": "cypress run",
    "test:e2e:open": "cypress open",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage --coverageReporters=text --coverageReporters=html",
    "lint": "eslint . --ext .js,.jsx",
    "lint:fix": "eslint . --ext .js,.jsx --fix",
    "format": "prettier --write \"**/*.{js,jsx,json,md}\"",
    "format:check": "prettier --check \"**/*.{js,jsx,json,md}\"",
    "prepare": "husky install"
  }
}
```

---

## Running Tests

### Quick Start

#### Run All Tests
```bash
make test
# OR
npm test
```

#### Run Unit Tests Only
```bash
make test-unit
# OR
npm run test:unit
```

#### Run Integration Tests Only
```bash
make test-integration
# OR
npm run test:integration
```

#### Run E2E Tests Only
```bash
make test-e2e
# OR
npm run test:e2e
```

### Development Mode

#### Watch Mode (Auto-rerun on file changes)
```bash
make test-watch
# OR
npm run test:watch
```

#### Open Cypress Interactive Mode
```bash
npm run test:e2e:open
```

### Coverage Reports

#### Generate Coverage Report
```bash
make coverage
# OR
npm run test:coverage
```

#### View HTML Coverage Report
```bash
open coverage/index.html
# On Windows:
start coverage/index.html
```

---

## CI/CD Setup

### GitHub Actions

The pipeline is automatically configured via `.github/workflows/ci.yml`.

#### Workflow Triggers
- **Push** to `main` or `develop` branches
- **Pull Requests** to `main` or `develop` branches

#### Required Secrets (GitHub Repository Settings)

1. Go to: Repository → Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `SNYK_TOKEN`: Your Snyk API token (optional)

#### Branch Protection Rules

1. Go to: Repository → Settings → Branches
2. Add rule for `main` branch:
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - Select required checks:
     - Unit Tests
     - Integration Tests
     - E2E Tests
     - Coverage Report & Quality Gate
     - Lint and Code Quality

### Local CI Simulation

Test the entire CI pipeline locally:
```bash
make ci
```

This will run:
1. Linting
2. All tests (unit, integration, E2E)
3. Coverage report generation
4. Quality gate checks

---

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
**Problem**: Tests fail with "MongoServerError: connect ECONNREFUSED"

**Solution**:
```bash
# Start MongoDB locally
sudo systemctl start mongod
# OR use Docker
docker run -d -p 27017:27017 mongo:6
```

#### 2. Port Already in Use
**Problem**: "Error: listen EADDRINUSE: address already in use :::3000"

**Solution**:
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
# OR change PORT in .env.test
```

#### 3. Cypress Binary Not Found
**Problem**: "The cypress npm package is installed, but the Cypress binary is missing"

**Solution**:
```bash
# Reinstall Cypress
npm install cypress --force
# Verify installation
npx cypress verify
```

#### 4. Coverage Threshold Not Met
**Problem**: "ERROR: Coverage for lines (75%) does not meet global threshold (80%)"

**Solution**: Write more tests or adjust thresholds in `jest.config.js`:
```javascript
coverageThreshold: {
  global: {
    lines: 70,      // Adjust as needed
    branches: 65,
    functions: 70,
    statements: 70
  }
}
```

#### 5. Husky Hooks Not Working
**Problem**: Pre-commit hooks not running

**Solution**:
```bash
# Reinstall husky
rm -rf .husky
npm run prepare
make setup-hooks
```

#### 6. Out of Memory Error
**Problem**: "JavaScript heap out of memory"

**Solution**:
```bash
# Increase Node.js memory
export NODE_OPTIONS="--max-old-space-size=4096"
npm test
```

---

## Running Tests in Different Environments

### Development
```bash
NODE_ENV=development npm test
```

### Staging
```bash
NODE_ENV=staging npm test
```

### Production (Smoke Tests)
```bash
NODE_ENV=production npm run test:e2e
```

---

## Test Results and Reports

### Locations
- **Coverage Reports**: `./coverage/`
- **Cypress Screenshots**: `./cypress/screenshots/`
- **Cypress Videos**: `./cypress/videos/`
- **Cypress Reports**: `./cypress/reports/`

### Viewing Reports

#### Coverage Report
```bash
open coverage/index.html
```

#### Cypress Report
```bash
open cypress/reports/mochawesome.html
```

---

## Cleaning Up

### Remove Test Artifacts
```bash
make clean
```

This removes:
- Coverage reports
- Cypress screenshots
- Cypress videos
- Build caches

---

## Performance Optimization

### Speed Up Tests

1. **Run tests in parallel** (Jest default)
2. **Use `--maxWorkers` flag**:
   ```bash
   npm test -- --maxWorkers=4
   ```
3. **Cache node_modules in CI**
4. **Run only changed tests**:
   ```bash
   npm test -- --onlyChanged
   ```

---

## Best Practices

1. **Always run tests before pushing**
2. **Keep coverage above thresholds**
3. **Fix flaky tests immediately**
4. **Use deterministic test data**
5. **Mock external dependencies**
6. **Keep tests fast and isolated**
7. **Review coverage reports regularly**

---

## Support

For issues or questions:
- Check the [Troubleshooting](#troubleshooting) section
- Review test logs in CI/CD artifacts
- Contact the development team

---

## Version History

- **v1.0.0** (2025-11-06): Initial release with full testing pipeline
