# AgentBlame Research - Codebase Documentation

This document tracks all cloned repositories and codebases used for the AgentBlame research project.

## Cloned Repositories

### 1. agentblame (forked)
- **Repository URL:** https://github.com/albertpurnama/agentblame
- **Original Repository:** https://github.com/mesa-dot-dev/agentblame
- **Clone Location:** `.codebases/agentblame/`
- **Clone Date:** 2025-01-19
- **Purpose:** Research into AI code attribution tracking system
- **Key Files Referenced:**
  - `packages/cli/src/index.ts` - CLI entry point
  - `packages/cli/src/capture.ts` - Hook capture system
  - `packages/cli/src/process.ts` - Commit processing and matching
  - `packages/cli/src/blame.ts` - Git blame-like output
  - `packages/cli/src/sync.ts` - Squash/rebase merge handling
  - `packages/cli/src/transfer-notes.ts` - GitHub Actions transfer
  - `packages/cli/src/lib/database.ts` - SQLite persistence
  - `packages/cli/src/lib/hooks.ts` - Editor hook installation
  - `packages/cli/src/lib/git/gitNotes.ts` - Git notes operations
  - `packages/chrome/src/content/content.ts` - Chrome extension content script
  - `packages/chrome/src/lib/github-api.ts` - GitHub API client

## Directory Structure

```
agentblame/
├── CLAUDE.md (this file)
├── RESEARCH.md (architecture overview)
├── GIT-NOTES-DEEP-DIVE.md (technical deep dive)
└── .codebases/
    └── agentblame/
        ├── packages/
        │   ├── cli/           # CLI tool (@mesadev/agentblame)
        │   └── chrome/        # Chrome extension
        ├── docs/              # Screenshots and assets
        └── scripts/           # Build scripts
```
