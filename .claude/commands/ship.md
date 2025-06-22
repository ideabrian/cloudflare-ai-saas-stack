---
description: "Build, lint, typecheck and deploy the hey-builders app to Cloudflare Workers"
allowed-tools: ["Bash"]
---

# Ship Command

Deploys the hey-builders application to Cloudflare Workers with full validation.

## What it does:
1. Runs linting and formatting with Biome
2. Performs TypeScript type checking
3. Builds the application
4. Deploys to Cloudflare Workers

Execute: `npm run lint && npm run check && npm run deploy`

This ensures code quality before deployment and handles the complete build-to-deploy pipeline.