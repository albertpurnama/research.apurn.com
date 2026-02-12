# Research Codebase Documentation

This document tracks all cloned repositories and codebases used across research projects. All codebases are organized in `.codebases` folders within their respective research directories to avoid duplication and keep them out of the final research output.

## Directory Structure

```
research/
├── CLAUDE.md (this file)
├── chatgpt-ads/
│   ├── .codebases/          # Cloned repositories for chatgpt-ads research
│   ├── *.md                 # Research documentation
│   └── CLAUDE.md            # Codebase documentation for this project
├── ucp-ap2-acp-x402/
│   ├── .codebases/          # Cloned repositories for ucp-ap2-acp-x402 research
│   ├── *.md                 # Research documentation
│   └── CLAUDE.md            # Codebase documentation for this project
└── [other research projects]/
    ├── .codebases/
    ├── *.md
    └── CLAUDE.md
```

## Guidelines

- **All codebases must be cloned into `.codebases/` folder** in the respective research directory
- Each research project has its own `CLAUDE.md` to document its cloned repositories
- This root `CLAUDE.md` provides a master index of all research projects
- `.codebases` folders are excluded from final research output to prevent duplication

## Research Projects

### 1. chatgpt-ads
**Location:** `/research/chatgpt-ads/`
- **Purpose:** Research into ChatGPT advertising and integration patterns
- **Cloned Repositories:** See `chatgpt-ads/CLAUDE.md`

### 2. ucp-ap2-acp-x402
**Location:** `/research/ucp-ap2-acp-x402/`
- **Purpose:** Research into UCP gateway architecture, commerce protocols, and payment systems
- **Cloned Repositories:** See `ucp-ap2-acp-x402/CLAUDE.md`

### 3. greg-brockman-ai-attribution
**Location:** `/research/greg-brockman-ai-attribution/`
- **Purpose:** Research on how Greg Brockman would solve attribution for AI recommendations, with focus on The Prompting Company's GEO business model
- **Cloned Repositories:** See `greg-brockman-ai-attribution/CLAUDE.md`

### 4. agentblame
**Location:** `/research/agentblame/`
- **Purpose:** Research into AI code attribution tracking system - tracks which lines of code were written by AI vs humans
- **Cloned Repositories:** See `agentblame/CLAUDE.md`

### 5. ctrl0-plg
**Location:** `/research/ctrl0-plg/`
- **Purpose:** Technical research on product-led growth implementation in Ctrl0 (The Prompting Company) - analyzing metrics instrumentation, onboarding flows, analytics architecture, entitlements, feature flags, and engagement loops
- **Cloned Repositories:** See `ctrl0-plg/CLAUDE.md`

### 6. clawdbot
**Location:** `/research/clawdbot/`
- **Purpose:** Research into Clawdbot, an open-source personal AI assistant platform that runs locally on user devices with multi-channel support (WhatsApp, Telegram, Slack, Discord, Signal, iMessage, Teams, etc.)
- **Cloned Repositories:** See `clawdbot/CLAUDE.md`

### 7. ghostty
**Location:** `/research/ghostty/`
- **Purpose:** Technical research on Ghostty's architecture - focusing on Zig-based terminal emulation, GPU-accelerated rendering (Metal/OpenGL), libghostty library design, and platform-native patterns (SwiftUI on macOS, GTK on Linux)
- **Cloned Repositories:** See `ghostty/CLAUDE.md`

### 8. webmcp
**Location:** `/research/webmcp/`
- **Purpose:** Research into WebMCP, Chrome's proposed standard for exposing structured tools to AI agents. Includes Declarative API (HTML forms) and Imperative API (JavaScript) for making websites "agent-ready".
- **Source:** https://developer.chrome.com/blog/webmcp-epp
- **Status:** Early Preview Program (EPP) - docs gated behind sign-up

## Usage

When cloning a new repository for research:

1. Navigate to the research project directory
2. Clone into `.codebases/` folder:
   ```bash
   git clone <repo-url> .codebases/<repo-name>
   ```
3. Document the clone in the project's `CLAUDE.md` file with:
   - Repository URL
   - Clone date
   - Purpose in the research
   - Key files/directories referenced
