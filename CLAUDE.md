# Obsidian Shepherd

Ward member management plugin for Obsidian (Preact, not React).

## Build & Deploy
- `npm run build` — builds to `main.js`
- Copy to vault: `cp main.js ~/JoshOS/.obsidian/plugins/shepherd/main.js`
- Reload in Obsidian: Settings → Community Plugins → Shepherd → reload

## Architecture
- Preact with `h` import (not React/JSX runtime)
- `src/services/MemberService.ts` — parses member markdown files
- `src/services/WriteService.ts` — writes back to markdown
- `src/components/` — UI components rendered in sidebar panel
