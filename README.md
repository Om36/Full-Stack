# Full-Stack (Node.js)

This repository contains multiple exercises and small projects. CI/CD is configured in `.github/workflows/main.yml` to run install, test, build steps for each package and to deploy static frontends to GitHub Pages and backend images to GHCR.

Important: GHCR secret
- If you plan to publish backend Docker images to GitHub Container Registry (GHCR), create a Personal Access Token (PAT) and add it as a repository secret named `GHCR_PAT` (and optionally `GHCR_USER`).
- The workflow expects the secret `GHCR_PAT` to exist; see `.github/workflows/main.yml` for the login step.

See also:
- `.github/workflows/main.yml` — CI/CD workflow (contains GHCR usage details)
