Deploy SeeBotWork to production with optional commit message.

**Usage**: `/project:deploy [commit message]`

**What to do:**
- If arguments provided, use `$ARGUMENTS` as the commit message
- If no arguments, generate a descriptive commit message based on git changes
- Run the deployment pipeline:
  1. `git add .` (stage all changes)
  2. `git commit -m "[message]"`
  3. `npm run deploy` (builds frontend + deploys worker)
- Verify deployment success
- Show the live URL: https://hero.directory

**Examples**:
- `/project:deploy` - Auto-generate commit message
- `/project:deploy fix: Update CSS build process` - Use specific message

**Context**: This deploys both the React frontend and Cloudflare Worker backend in a single command.