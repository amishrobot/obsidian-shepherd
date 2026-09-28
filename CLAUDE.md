# Obsidian Shepherd

Linear: initiative **JoshOS**. Session handoffs are status updates on that Linear home: read the latest one before starting, and post one before stopping with work in flight (`$JOSHOS_CODE/scripts/handoff`).

Ward member management plugin for Obsidian (Preact, not React).

## Build & Deploy
- `npm run build` — builds to `main.js`
- Copy to vault: `cp main.js styles.css ~/JoshOS_Vault/.obsidian/plugins/shepherd/`
- Reload in Obsidian: Settings → Community Plugins → Shepherd → reload

## Architecture
- Preact with `h` import (not React/JSX runtime)
- `src/services/MemberService.ts` — parses member markdown files
- `src/services/WriteService.ts` — writes back to markdown
- `src/components/` — UI components rendered in sidebar panel
