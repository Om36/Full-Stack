.PHONY: test test-unit test-integration test-e2e coverage clean install

# Install all dependencies
install:
	npm install
	npm run prepare

# Run all tests
test:
	npm run test:unit
	npm run test:integration
	npm run test:e2e

# Run unit tests only
test-unit:
	npm run test:unit

# Run integration tests only
test-integration:
	npm run test:integration

# Run E2E tests only
test-e2e:
	npm run test:e2e

# Run tests in watch mode
test-watch:
	npm run test:watch

# Generate coverage report
coverage:
	npm run test:coverage

# Run linter
lint:
	npm run lint

# Fix linting issues
lint-fix:
	npm run lint:fix

# Format code
format:
	npm run format

# Clean build artifacts and coverage
clean:
	rm -rf coverage/
	rm -rf cypress/screenshots/
	rm -rf cypress/videos/
	rm -rf node_modules/.cache/

# Setup git hooks
setup-hooks:
	npx husky install
	npx husky add .husky/pre-commit "npm run lint && npm run test:unit"
	npx husky add .husky/pre-push "npm run test"

# Run all quality checks (CI simulation)
ci:
	make lint
	make test
	make coverage

