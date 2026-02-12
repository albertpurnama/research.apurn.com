# Clawdbot Research - Cloned Repositories

This document tracks all repositories cloned for the Clawdbot research project.

**Location:** `.codebases/`

## Cloned Repositories

## clawdbot/clawdbot
- **Repository URL:** https://github.com/clawdbot/clawdbot
- **Clone Date:** 2026-01-25
- **Purpose:** Main open source repository for Clawdbot - a personal AI assistant that runs on your own devices and answers on channels you already use (WhatsApp, Telegram, Slack, Discord, Signal, iMessage, Microsoft Teams, WebChat, etc.)
- **Key Files/Directories:**
  - `src/` - Main TypeScript source code
  - `src/gateway/` - Gateway WebSocket control plane
  - `src/channels/` - Channel integration code (WhatsApp, Telegram, Slack, Discord, etc.)
  - `src/agents/` - Pi agent runtime
  - `docs/` - Comprehensive documentation
  - `skills/` - Skills platform
  - `extensions/` - Plugin system for additional channels
  - `apps/` - Mobile and desktop apps (iOS, Android, macOS)
  - `package.json` - Version 2026.1.24-3, Node.js-based project
  - `README.md` - Main project documentation
  - `AGENTS.md` - Agent-specific guidelines and repository structure
- **Notes:**
  - Over 8,000+ GitHub stars
  - MIT License
  - Built with TypeScript, uses pnpm for package management
  - Requires Node ≥22.12.0
  - Active development with frequent releases (CalVer: vYYYY.M.D)
  - Multi-channel personal AI assistant with local-first approach
  - Supports various AI model providers (Anthropic, OpenAI, local models)
  - Comprehensive security defaults with DM pairing system

## Guidelines

- All clones go in `.codebases/` folder
- Update this file each time a new repository is cloned
- Use descriptive purposes and key file references
- Keep codebases out of the final research documentation
