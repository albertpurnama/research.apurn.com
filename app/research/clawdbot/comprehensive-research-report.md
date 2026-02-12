# Clawdbot: Comprehensive Research Report

**Date:** January 25, 2026
**Repository:** https://github.com/clawdbot/clawdbot
**Website:** https://clawd.bot
**Documentation:** https://docs.clawd.bot

## Executive Summary

Clawdbot is an open-source personal AI assistant platform that enables users to run their own AI assistant on their devices, accessible through multiple messaging channels including WhatsApp, Telegram, Slack, Discord, Signal, iMessage, Microsoft Teams, and WebChat. With over 8,000 GitHub stars and active development, Clawdbot represents a significant implementation of local-first, privacy-focused AI assistant infrastructure.

**Key Differentiators:**
- **Local-First Architecture:** Runs on user's own devices rather than cloud-based services
- **Multi-Channel Support:** Integrates with 10+ messaging platforms
- **Multi-Agent Routing:** Isolated agents per workspace with per-agent sessions
- **Security-First Design:** DM pairing system with default security policies
- **Open Source:** MIT License with active community contributions
- **Cross-Platform:** Supports macOS, Linux, Windows (WSL2), iOS, and Android

## 1. Technical Architecture

### 1.1 Core Components

**Gateway (Control Plane)**
- WebSocket-based control plane at `ws://127.0.0.1:18789`
- Manages sessions, presence, config, cron jobs, webhooks
- Single control point for clients, tools, and events
- Supports Tailscale Serve/Funnel for remote access
- Built-in Control UI and WebChat interface

**Agent Runtime**
- Pi agent runtime in RPC mode
- Tool streaming and block streaming support
- Session isolation with activation modes
- Support for multiple AI model providers (Anthropic, OpenAI, Bedrock, local LLMs)

**Channel Integrations**
- **Core Channels:** WhatsApp (Baileys), Telegram (grammY), Slack (Bolt), Discord, Signal (signal-cli), iMessage, Google Chat
- **Extension Channels:** BlueBubbles, Microsoft Teams, Matrix, Zalo, Zalo Personal
- **Web Channel:** Built-in WebChat interface

**Platform Apps**
- **macOS:** Menu bar app with Voice Wake, Talk Mode, Canvas
- **iOS:** Node app with camera, Canvas, Voice Wake, screen recording
- **Android:** Node app with similar capabilities to iOS
- **Web:** Control UI and WebChat served from Gateway

### 1.2 Technology Stack

**Primary Stack:**
- **Language:** TypeScript (ESM)
- **Runtime:** Node.js ≥22.12.0
- **Package Manager:** pnpm 10.23.0
- **Build Tool:** TypeScript Compiler, Rolldown for UI
- **Testing:** Vitest with V8 coverage
- **Linting/Formatting:** Oxlint, Oxfmt

**Key Dependencies:**
- `@agentclientprotocol/sdk` - Agent Client Protocol support
- `@mariozechner/pi-agent-core` - Pi agent runtime
- `@whiskeysockets/baileys` - WhatsApp integration
- `grammy` - Telegram bot framework
- `@slack/bolt` - Slack integration
- `playwright-core` - Browser control
- `node-llama-cpp` - Local LLM support (optional)

**Security & Infrastructure:**
- `proper-lockfile` - File locking
- `sqlite-vec` - Vector storage
- `sharp` - Image processing
- `chromium-bidi` - Browser automation

### 1.3 Architecture Patterns

**Local-First Design:**
```
WhatsApp / Telegram / Slack / Discord / Signal / iMessage / Teams / WebChat
               │
               ▼
┌───────────────────────────────┐
│            Gateway            │
│       (control plane)         │
│     ws://127.0.0.1:18789      │
└──────────────┬────────────────┘
               │
               ├─ Pi agent (RPC)
               ├─ CLI (clawdbot …)
               ├─ WebChat UI
               ├─ macOS app
               └─ iOS / Android nodes
```

**Session Model:**
- `main` session for direct chats
- Group isolation with activation modes
- Queue modes for message handling
- Reply-back support
- Per-session tool allowlists

**Multi-Agent Routing:**
- Route inbound channels/accounts/peers to isolated agents
- Workspace separation
- Per-agent sessions
- Cross-agent communication via `sessions_*` tools

## 2. Feature Analysis

### 2.1 Core Features

**Multi-Channel Inbox**
- Unified control plane for all messaging channels
- Channel-specific routing and allowlists
- Group message handling with mention gating
- Per-channel chunking and routing
- DM pairing security system

**Voice Capabilities**
- Voice Wake: Always-on speech activation (macOS/iOS/Android)
- Talk Mode: Continuous conversation mode
- ElevenLabs integration for TTS
- Push-to-talk overlay

**Live Canvas**
- Agent-driven visual workspace
- A2UI (Agent-to-UI) protocol
- Available on macOS/iOS/Android
- Real-time rendering controlled by AI

**Browser Control**
- Dedicated Clawdbot-managed Chrome/Chromium
- CDP (Chrome DevTools Protocol) control
- Snapshots, actions, uploads
- Profile management

**Node System**
- Device-local action execution
- Camera snap/clip
- Screen recording
- Location services
- System notifications
- macOS-specific: `system.run` for commands

### 2.2 Security & Privacy

**Default Security Posture:**
- DM pairing required by default (`dmPolicy="pairing"`)
- Unknown senders receive pairing code
- Local allowlist store
- Explicit opt-in required for open DM policies

**Sandbox Support:**
- Docker-based sandboxing for non-main sessions
- Per-session isolation
- Tool allowlist/denylist per session
- Configurable sandbox policies

**Credential Management:**
- Credentials stored in `~/.clawdbot/credentials/`
- OAuth support for Anthropic and OpenAI
- API key rotation
- Model failover support

**TCC Permissions (macOS):**
- Screen recording permission tracking
- Notification permission checks
- Permission-based tool gating
- `PERMISSION_MISSING` error handling

### 2.3 Automation & Integration

**Cron & Scheduling:**
- Built-in cron job support
- Scheduled wakeups
- Recurring task execution

**Webhooks:**
- Inbound webhook support
- External trigger integration
- Event-driven automation

**Gmail Pub/Sub:**
- Gmail event monitoring
- Email-triggered actions
- Pub/Sub integration

**Skills Platform:**
- Bundled skills
- Managed skills
- Workspace skills
- Install gating + UI
- ClawdHub registry for skill discovery

## 3. Installation & Deployment

### 3.1 Installation Methods

**Recommended (npm):**
```bash
npm install -g clawdbot@latest
clawdbot onboard --install-daemon
```

**Development (from source):**
```bash
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot
pnpm install
pnpm ui:build
pnpm build
pnpm clawdbot onboard --install-daemon
```

**Alternative Package Managers:**
- pnpm: `pnpm add -g clawdbot@latest`
- Bun: Supported for development

**Platform-Specific:**
- macOS: App bundle available, daemon via launchd
- Linux: systemd user service
- Windows: WSL2 strongly recommended
- Docker: Full Docker support with compose

### 3.2 Deployment Patterns

**Local Deployment:**
- Gateway runs on user's machine
- Direct channel connections
- Local tool execution
- Recommended for single-user setups

**Remote Gateway:**
- Gateway on Linux server/VM
- Clients connect via Tailscale or SSH tunnels
- Device nodes for local actions
- Suitable for always-on deployments

**Hybrid Mode:**
- Gateway on server
- Device nodes (macOS/iOS/Android) for device-specific actions
- Exec tools run on gateway host
- Device actions run on paired devices

### 3.3 Configuration

**Minimal Configuration:**
```json5
{
  agent: {
    model: "anthropic/claude-opus-4-5"
  }
}
```

**Configuration File:** `~/.clawdbot/clawdbot.json`

**Configuration Sections:**
- Agent settings (model, workspace, sandbox)
- Gateway settings (bind, port, auth, Tailscale)
- Channel configurations (WhatsApp, Telegram, Slack, etc.)
- Browser settings
- Security policies
- Cron jobs
- Webhooks

**Environment Variables:**
- `TELEGRAM_BOT_TOKEN` - Telegram bot authentication
- `SLACK_BOT_TOKEN` - Slack bot token
- `SLACK_APP_TOKEN` - Slack app-level token
- `DISCORD_BOT_TOKEN` - Discord bot token
- Model provider API keys

## 4. Development Practices

### 4.1 Development Workflow

**Pre-commit Hooks:**
- Automated via `prek install`
- Runs same checks as CI
- Format and lint enforcement

**Build Process:**
- TypeScript compilation via `tsc`
- UI build via Rolldown
- Canvas A2UI bundle generation
- Protocol schema generation

**Testing Strategy:**
- Vitest for unit tests
- E2E tests for integration scenarios
- Live tests with real API keys (opt-in)
- Docker-based test suites
- Coverage thresholds: 70% across metrics

**Code Quality:**
- Oxlint for linting
- Oxfmt for formatting
- File size guideline: ~500 LOC
- Strict TypeScript typing
- Brief code comments for complex logic

### 4.2 Release Management

**Release Channels:**
- **stable:** Tagged releases (vYYYY.M.D), npm tag `latest`
- **beta:** Prerelease (vYYYY.M.D-beta.N), npm tag `beta`
- **dev:** Moving head on `main` branch

**Version Format:** CalVer (vYYYY.M.D or vYYYY.M.D-patch)

**Release Artifacts:**
- npm package
- macOS app bundle (signed and notarized)
- Docker images
- iOS/Android apps
- Appcast XML for auto-updates

**Release Process:**
1. Version bump across all platforms
2. Changelog update
3. Full gate (lint, build, test)
4. Git tag
5. npm publish with OTP
6. macOS app build, sign, notarize
7. Appcast update
8. GitHub release

### 4.3 Contributing Guidelines

**Contribution Flow:**
- Fork and create feature branch
- Follow code style (Oxlint/Oxfmt)
- Add tests for new features
- Update documentation
- Create PR with clear description

**PR Review Process:**
- Review via `gh pr view/diff`
- Prefer rebase for clean commits
- Squash when history is messy
- Add changelog entry with PR number
- Thank contributors
- Update clawtributors list

**Commit Guidelines:**
- Use `scripts/committer` for scoped commits
- Action-oriented messages
- Group related changes
- Reference issues/PRs in changelog

## 5. Market Position & Adoption

### 5.1 Community Metrics

- **GitHub Stars:** 8,000+
- **Contributors:** 100+ clawtributors
- **License:** MIT
- **Activity:** Daily releases and active development
- **Discord Community:** Active support channel

### 5.2 Use Cases

**Personal Assistant:**
- Direct message AI via preferred messaging app
- Multi-device access (phone, desktop, web)
- Continuous conversation across platforms
- Voice interaction on mobile

**Developer Productivity:**
- Browser automation
- Code execution via bash tool
- File operations (read, write, edit)
- System integration

**Home Automation:**
- Cron-based scheduled tasks
- Webhook triggers
- Device control via system.run
- Notification delivery

**Team Collaboration:**
- Group chat integration
- Multi-agent workspaces
- Session isolation per project
- Cross-agent communication

**Research & Analysis:**
- Browser-based research
- Document processing
- Image understanding
- Voice transcription

### 5.3 Competitive Landscape

**Differentiators vs Cloud AI Assistants:**
- **Privacy:** All processing on user's infrastructure
- **Cost:** No per-token costs after model subscription
- **Customization:** Full access to codebase and config
- **Integration:** Deep OS-level integrations
- **Ownership:** User owns all data and sessions

**Differentiators vs Other Open Source Assistants:**
- **Multi-Channel:** Unified inbox across 10+ platforms
- **Production Ready:** Well-documented, tested, released
- **Cross-Platform:** Mobile, desktop, web support
- **Security:** Built-in DM pairing and sandbox support
- **Ecosystem:** Skills platform and plugin system

## 6. Technical Insights

### 6.1 Agent Client Protocol (ACP)

Clawdbot uses Agent Client Protocol SDK (`@agentclientprotocol/sdk`) for standardized agent communication. This provides:
- Tool calling interfaces
- Streaming support
- Block-based responses
- Session management
- Cross-agent messaging

### 6.2 Pi Agent Integration

Built on top of `@mariozechner/pi-agent-core` and related packages:
- `pi-agent-core` - Core agent runtime
- `pi-ai` - AI model integrations
- `pi-coding-agent` - Coding-specific capabilities
- `pi-tui` - Terminal UI components

This provides a production-ready agent runtime with:
- Multiple model provider support
- Tool execution framework
- Session persistence
- Context management
- Streaming responses

### 6.3 Media Pipeline

Comprehensive media handling:
- Image processing via Sharp
- Audio transcription hooks
- Video processing
- File type detection
- Size cap enforcement
- Temporary file lifecycle management
- Media understanding capabilities

### 6.4 Browser Automation

Sophisticated browser control via Playwright:
- Dedicated browser instance per user
- Profile isolation
- Screenshot capture
- Page interaction
- Upload handling
- Action recording
- CDP-level control

### 6.5 WebSocket Protocol

Custom WebSocket protocol for Gateway communication:
- Presence updates
- Typing indicators
- Session management
- Config synchronization
- Event streaming
- Node pairing
- Remote control

## 7. Documentation Quality

### 7.1 Documentation Structure

**Getting Started:**
- Installation guide
- Onboarding wizard walkthrough
- Quick start examples
- FAQ section
- Showcase of capabilities

**Core Concepts:**
- Architecture overview
- Session model
- Agent loop
- Channel routing
- Multi-agent routing
- Model configuration
- Security model

**Platform Guides:**
- macOS setup and features
- iOS node setup
- Android node setup
- Linux deployment
- Windows (WSL2) setup

**Channel Guides:**
- WhatsApp integration
- Telegram setup
- Slack configuration
- Discord setup
- Signal integration
- iMessage (macOS)
- Microsoft Teams
- Matrix, Zalo extensions

**Tools & Features:**
- Browser control
- Canvas & A2UI
- Voice Wake & Talk Mode
- Nodes (camera, screen, location)
- Skills platform
- Cron & automation
- Webhooks

**Operations:**
- Gateway runbook
- Remote access setup
- Tailscale integration
- Docker deployment
- Health checks
- Troubleshooting
- Logging

**Reference:**
- Configuration reference (all keys)
- Agent templates (AGENTS.md, SOUL.md, etc.)
- CLI command reference
- RPC protocol
- Release guide

### 7.2 Code Documentation

**AGENTS.md:**
- Comprehensive repository guidelines
- Project structure
- Development workflow
- Security notes
- Multi-agent safety
- Release process
- Agent-specific vocabulary

**Inline Documentation:**
- TypeScript types and interfaces
- JSDoc comments for complex functions
- Configuration schemas with descriptions
- Tool schemas with examples

**Examples:**
- Configuration examples for each channel
- Skill templates
- Tool usage examples
- Integration patterns

## 8. Strategic Observations

### 8.1 Strengths

**Technical:**
- Well-architected, modular codebase
- Comprehensive test coverage
- Strong typing throughout
- Production-ready release process
- Active development with frequent updates

**Product:**
- Clear value proposition (privacy, local-first)
- Excellent documentation
- Multi-platform support
- Extensible via plugins/skills
- Security-conscious design

**Community:**
- Active contributor base (100+)
- Responsive to PRs and issues
- Clear contribution guidelines
- Welcoming to new contributors

**Ecosystem:**
- Multiple channels supported out of box
- Extension system for new channels
- Skills registry (ClawdHub)
- Compatible with major AI providers

### 8.2 Opportunities

**Expansion Areas:**
- More channel integrations (Messenger, LinkedIn, etc.)
- Enhanced voice capabilities
- Better mobile experiences
- Cloud deployment options (for non-technical users)
- Pre-configured Docker images
- Managed hosting option
- Enterprise features (audit logs, SSO, etc.)

**Technical Improvements:**
- More local LLM providers
- Improved context management
- Better media understanding
- Enhanced Canvas capabilities
- More sophisticated routing
- Performance optimizations

**Community Growth:**
- Video tutorials
- Use case showcases
- Plugin marketplace
- Community skills
- Integration templates
- Deployment blueprints

### 8.3 Challenges

**Complexity:**
- Installation requires technical knowledge
- Configuration can be overwhelming
- Multiple credentials to manage
- Platform-specific setup differences

**Resource Requirements:**
- Requires always-on device
- Model subscriptions or API costs
- Compute for local LLMs
- Storage for sessions

**Ecosystem Fragmentation:**
- Multiple messaging platform policies
- Platform-specific limitations
- API changes breaking integrations
- Mobile OS restrictions

**Competition:**
- Cloud AI assistants (ChatGPT, Claude, etc.)
- Platform-native assistants (Siri, Google Assistant)
- Other open-source projects
- Custom solutions

## 9. Use Case Deep Dives

### 9.1 Personal AI Assistant

**Setup:**
- Install on personal Mac/Linux machine
- Connect WhatsApp, Telegram, and iMessage
- Subscribe to Claude Pro
- Enable Voice Wake on iPhone

**Daily Usage:**
- Morning briefing via WhatsApp
- Voice commands while cooking
- Quick research via Telegram
- iMessage for private queries
- Canvas for visual tasks on iPad

**Value:**
- Privacy: All conversations stay local
- Convenience: Use preferred messaging app
- Continuity: Same assistant across devices
- Cost: Fixed subscription, no per-token charges

### 9.2 Developer Productivity

**Setup:**
- Deploy on Linux VPS
- Connect Slack workspace
- Enable browser control
- Configure sandbox for group channels

**Workflows:**
- Code reviews via Slack mentions
- Browser automation for testing
- File operations for quick edits
- System commands for deployments
- Cross-session coordination

**Value:**
- Always available on team Slack
- Automated testing and validation
- Quick prototyping and exploration
- Shared knowledge across team

### 9.3 Smart Home Hub

**Setup:**
- Raspberry Pi or home server
- Connect Signal for family
- Enable cron jobs
- Configure webhooks

**Automations:**
- Morning routine reminders
- Weather notifications
- Smart home control via system.run
- Family coordination messages
- Event-driven alerts

**Value:**
- Family-wide AI assistant
- Privacy-focused (local processing)
- Customizable automations
- No cloud dependencies

### 9.4 Research Assistant

**Setup:**
- High-memory Linux workstation
- Enable browser control
- Configure local LLM fallback
- Set up skills for research

**Research Workflows:**
- Web research with citations
- PDF document analysis
- Screenshot and annotation
- Multi-document synthesis
- Cross-reference validation

**Value:**
- Deep research capabilities
- Document understanding
- Visual analysis
- Privacy for sensitive research

## 10. Future Directions

### 10.1 Likely Evolution

**Near-term (3-6 months):**
- More extension channels
- Enhanced mobile apps
- Better skill discovery
- Improved onboarding
- Performance optimizations

**Mid-term (6-12 months):**
- Richer Canvas capabilities
- More sophisticated routing
- Better context management
- Enhanced collaboration features
- Managed hosting option

**Long-term (12+ months):**
- Enterprise features
- Advanced orchestration
- Multi-agent workflows
- Marketplace ecosystem
- Integration framework

### 10.2 Open Questions

**Technical:**
- How to scale to larger teams?
- How to optimize for low-resource devices?
- How to handle model provider changes?
- How to improve context window usage?

**Product:**
- Should there be a hosted version?
- How to balance simplicity vs features?
- How to monetize sustainably?
- What's the right enterprise model?

**Community:**
- How to grow contributor base?
- How to maintain code quality at scale?
- How to coordinate distributed development?
- How to build sustainable governance?

## 11. Key Takeaways

### For Developers:
- **Well-architected:** Clean separation of concerns, modular design
- **Production-ready:** Comprehensive testing, release process, documentation
- **Extensible:** Plugin system, skills platform, clear patterns
- **Community-friendly:** Good contribution guidelines, active maintainer

### For Users:
- **Privacy-focused:** Local-first architecture, user owns data
- **Multi-platform:** Works across all major messaging platforms
- **Customizable:** Full configuration control, skills system
- **Cost-effective:** One-time setup, model subscriptions only

### For Researchers:
- **Local-first AI:** Demonstrates viable alternative to cloud services
- **Multi-agent coordination:** Interesting routing and session isolation
- **Security patterns:** DM pairing, sandboxing, permission-based tools
- **Integration architecture:** Shows how to unify disparate messaging APIs

### For Product Teams:
- **Onboarding matters:** Comprehensive wizard for complex setup
- **Documentation is key:** Extensive docs for all skill levels
- **Security default:** Opt-in for risky features, safe by default
- **Ecosystem thinking:** Skills, plugins, integrations drive value

## 12. Conclusion

Clawdbot represents a sophisticated, production-ready implementation of a local-first personal AI assistant. With strong technical foundations, excellent documentation, and an active community, it demonstrates that privacy-focused, user-owned AI infrastructure is viable and valuable.

The project's multi-channel approach, security-conscious design, and extensible architecture make it a compelling alternative to cloud-based AI assistants. While installation complexity remains a barrier for non-technical users, the value proposition for those who can deploy it is clear: complete privacy, lower long-term costs, and full customization.

As AI assistants become more integrated into daily workflows, Clawdbot's local-first architecture and open-source nature position it well to serve privacy-conscious users, developers, and organizations who want control over their AI infrastructure.

---

## References

- **GitHub Repository:** https://github.com/clawdbot/clawdbot
- **Website:** https://clawd.bot
- **Documentation:** https://docs.clawd.bot
- **Discord:** https://discord.gg/clawd
- **DeepWiki:** https://deepwiki.com/clawdbot/clawdbot
- **Nix Package:** https://github.com/clawdbot/nix-clawdbot

## Sources

- [Clawdbot GitHub Repository](https://github.com/clawdbot/clawdbot)
- [Clawdbot Website](https://clawd.bot/)
- [Clawdbot Documentation](https://docs.clawd.bot)
- [WebProNews Article](https://www.webpronews.com/clawdbots-local-lobster-the-open-source-agent-redefining-personal-ai/)
- [Cloudron Forum Discussion](https://forum.cloudron.io/topic/14943/clawdbot-your-free-open-source-ai-personal-assistant)
