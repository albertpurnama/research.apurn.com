# Ghostty Research

This directory contains comprehensive research on **Ghostty**, a fast, feature-rich, cross-platform terminal emulator.

## Repository Information

- **GitHub:** https://github.com/ghostty-org/ghostty
- **Website:** https://ghostty.org
- **Documentation:** https://ghostty.org/docs
- **Stars:** 42.3k
- **Contributors:** 477
- **License:** MIT
- **Clone Date:** January 28, 2026
- **Primary Language:** Zig (80.4%)
- **Created by:** Mitchell Hashimoto (co-founder of HashiCorp)

## What is Ghostty?

Ghostty is a terminal emulator that differentiates itself by being fast, feature-rich, and native. The project's philosophy is to not force users to choose between speed, features, or native UIs—Ghostty provides all three.

**Platforms:**
- 🖥️ **macOS** - Mature, shipping (SwiftUI + Metal)
- 🐧 **Linux/FreeBSD** - Mature, shipping (GTK + OpenGL)  
- 📱 **iOS** - In active development since Jan 2024 (SwiftUI + Metal)

**Key Differentiators:**
- **Speed:** Multi-threaded IO, GPU-accelerated rendering (Metal/OpenGL), competitive with other high-performance terminals
- **Features:** Standards-compliant (ECMA-48), supports modern extensions (Kitty protocol, tmux control mode), tabbing, splits, panes
- **Native:** True native UIs (SwiftUI on macOS/iOS, GTK on Linux), not Electron or cross-platform compromise
- **Modern:** Exposes opt-in features for CLI developers to build richer interactive applications
- **Embeddable:** libghostty library for third-party terminal embedding
- **Multi-Platform Vision:** Single shared Zig core with platform-specific UI layers (macOS/iOS use SwiftUI, Linux uses GTK)

## Research Documents

### [iOS and Multi-Platform Strategy](./ios-and-multi-platform-strategy.md)
Analysis of Ghostty's iOS support and multi-platform roadmap covering:
- iOS implementation details (minimal Swift code)
- Shared SwiftUI components across macOS/iOS
- Development timeline (January 2024 onwards)
- iOS feature set and limitations
- Strategic vision for cross-platform expansion
- Architectural lessons from iOS integration

### [Technical Architecture Deep Dive](./technical-architecture-deep-dive.md)
Deep technical analysis covering:
- **Terminal Emulation:** State machine, control sequence parsing, standards compliance
- **Rendering Architecture:** Multi-renderer design, Metal vs OpenGL, GPU acceleration, performance optimization
- **IO Threading:** Dedicated IO thread design for jitter-free processing
- **libghostty Library:** C-compatible API, virtual terminal (vt) parsing library
- **Configuration System:** Config parsing, fonts, colors, keyboard layouts
- **Input Handling:** Keyboard events, mouse support, OS-level integration
- **Code Organization:** Directory structure, module dependencies, design patterns

**Key Insights:**
- Shared Zig core (~218k lines) with minimal platform-specific code
- GPU rendering as first-class concern, not afterthought
- libghostty-vt extractable as separate reusable library
- Comprehensive terminal control sequence support

### [Platform-Native Patterns](./platform-native-patterns.md)
Analysis of how Ghostty achieves native platform experiences:
- **macOS App:** SwiftUI-based GUI, Metal renderer, native preferences panel, menu bar integration
- **Linux/FreeBSD App:** GTK-based GUI, OpenGL renderer, system integration
- **Zig/Swift Interop:** How Zig core communicates with Swift app on macOS
- **Renderer Architecture:** Metal vs OpenGL, shader system, ligature support
- **Platform Abstraction:** apprt layer separating platform concerns
- **Native Features:** Menus, preferences, window management, OS-level features
- **Build System:** Zig build system managing platform-specific targets

**Key Patterns:**
- Clean separation between platform-agnostic Zig core and platform-specific layers
- Native app frameworks (SwiftUI, GTK) for UI, Zig for logic
- GPU-accelerated rendering with platform-native graphics APIs
- Consistent feature set across platforms while respecting native conventions

## Quick Overview

### Architecture Diagram

```
┌─────────────────────────────────────────┐
│       macOS (SwiftUI)  Linux (GTK)      │
│    Platform-Specific UI Layers          │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│        Shared Zig Core (218k lines)     │
│  Terminal | Config | Input | CLI       │
└────────────┬────────────────────────────┘
             │
    ┌────────┴────────┐
    ▼                 ▼
┌──────────┐    ┌──────────┐
│  Metal   │    │ OpenGL   │
│ (macOS)  │    │ (Linux)  │
└──────────┘    └──────────┘
```

### Technology Stack

**Core:**
- **Language:** Zig (primary), Swift (macOS UI), C/C++ (minimal)
- **Build System:** Zig build system
- **Terminal Standard:** ECMA-48 with xterm compatibility, Kitty protocol extensions, tmux control mode

**Rendering:**
- **macOS:** Metal (GPU-accelerated) with CoreText font rendering
- **Linux:** OpenGL (GPU-accelerated) with system font support

**Platform-Specific:**
- **macOS:** SwiftUI, AppKit, Metal framework, Xcode integration
- **Linux/FreeBSD:** GTK 4+, OpenGL, system libraries

**Development:**
- **Testing:** Zig test suite with benchmarking
- **CI/CD:** GitHub Actions
- **Build Requirements:** Zig compiler, platform SDKs (Xcode on macOS, GTK dev on Linux)

### Key Features

**Terminal Emulation:**
- Standards-compliant terminal emulation (ECMA-48)
- Comprehensive control sequence support (CSI, OSC, etc.)
- Kitty graphics protocol support
- tmux control mode for session management
- Search functionality with regex support

**User Features:**
- Multi-window, tabbing, splits/panes
- Customizable fonts, colors, themes
- Global keybinds (macOS)
- Command palette
- Settings GUI (macOS preference panel)
- Image rendering support

**Developer Features:**
- libghostty library for embedding terminals
- Modern, opt-in features for CLI tools
- Keyboard layout customization
- Mouse support with various reporting modes
- Integration with system tools

### Roadmap Status

| Step | Feature | Status |
|------|---------|--------|
| 1 | Standards-compliant terminal emulation | ✅ Complete |
| 2 | Competitive performance | ✅ Complete |
| 3 | Basic customizability | ✅ Complete |
| 4 | Richer windowing features | ✅ Complete |
| 5 | Native platform experiences | ⚠️ In Progress |
| 6 | Cross-platform libghostty | ⚠️ In Progress |
| 7 | Windows support | ❌ Not Started |
| N | Fancy features | ❌ Future |

## Key Development Insights

### Design Philosophy

1. **Shared Core, Native UI:** Rather than forcing a least-common-denominator Electron experience, Ghostty has a shared Zig core with native UI frameworks on each platform (SwiftUI, GTK).

2. **GPU-First Rendering:** GPU acceleration isn't a fallback optimization—it's the primary rendering path. This enables consistent 60fps performance and modern visual features.

3. **Standards + Extensions:** Foundation in terminal standards (ECMA-48) with support for modern extensions (Kitty, tmux) to enable innovation while maintaining compatibility.

4. **Extractable Primitives:** libghostty-vt is designed as a standalone library, allowing the core terminal parsing logic to be reused in other projects.

5. **Performance as Architecture:** IO threading, GPU rendering, and careful memory management aren't afterthoughts—they're baked into the core architecture.

### Technical Strengths

- **Well-Architected:** Clean module separation, clear dependency graph, platform abstraction layer
- **High Performance:** 4x faster than iTerm on IO benchmarks, maintains 60fps rendering
- **Standards-Focused:** Comprehensive xterm compatibility audit, ECMA-48 compliance
- **Production-Ready:** Extensive testing, comprehensive documentation, regular releases
- **Extensible:** libghostty, skills system, plugin architecture potential
- **Modern Tools:** Uses Zig for memory safety, performance, and cross-platform compilation

### Development Practices

- **Agent-Friendly:** Includes AGENTS.md with build commands and `.agents/commands/` with example prompts
- **Clear Documentation:** HACKING.md, CONTRIBUTING.md, AGENTS.md provide excellent guidance
- **Testing Culture:** Comprehensive test suite with benchmarking
- **Platform Respect:** Leverages platform-specific best practices rather than fighting the OS
- **Open Governance:** MIT license, active community, transparent roadmap

## Directory Structure

```
ghostty/
├── CLAUDE.md                                    # Cloned repositories documentation
├── README.md                                    # This file
├── technical-architecture-deep-dive.md          # Technical analysis
├── platform-native-patterns.md                  # Platform-native implementation patterns
└── .codebases/
    └── ghostty/                                 # Cloned Ghostty repository
        ├── src/                                 # Core Zig source code (218k lines)
        ├── macos/                               # macOS SwiftUI application
        ├── include/                             # libghostty C API headers
        ├── pkg/                                 # Platform-specific packages
        ├── build.zig                            # Build system
        ├── AGENTS.md                            # Agent development guide
        ├── HACKING.md                           # Developer documentation
        ├── CONTRIBUTING.md                      # Contribution guidelines
        └── README.md                            # Project README
```

## Key Files in Repository

**Core Architecture:**
- `.codebases/ghostty/src/terminal/` - Terminal state machine and control sequence parsing
- `.codebases/ghostty/src/renderer/` - Multi-renderer abstraction (Metal/OpenGL)
- `.codebases/ghostty/src/apprt/` - Application runtime (platform abstraction layer)
- `.codebases/ghostty/src/config/` - Configuration system

**Platform-Specific:**
- `.codebases/ghostty/macos/` - macOS SwiftUI application
- `.codebases/ghostty/src/apprt/gtk/` - Linux/FreeBSD GTK integration
- `.codebases/ghostty/include/` - libghostty C API

**Build & Development:**
- `.codebases/ghostty/build.zig` - Zig build configuration
- `.codebases/ghostty/AGENTS.md` - AI agent development guide
- `.codebases/ghostty/HACKING.md` - Developer setup and workflow
- `.codebases/ghostty/CONTRIBUTING.md` - Contribution guidelines

## Research Highlights

### Technical Excellence

- **Multi-Renderer Architecture:** Cleanly abstracts rendering (Metal vs OpenGL) from terminal logic
- **libghostty Library:** Terminal parsing logic extracted as standalone C-compatible library
- **Performance Optimization:** Dedicated IO thread, GPU acceleration, efficient memory management
- **Standards Compliance:** Comprehensive ECMA-48 and xterm compatibility with modern extensions

### Architectural Innovations

- **Shared Core + Native UIs:** Zig core with SwiftUI (macOS) and GTK (Linux) not Electron
- **GPU-First Design:** Rendering architecture optimized for GPU acceleration from day one
- **Cross-Platform API:** libghostty enables embedding terminals in diverse applications
- **Clean Abstraction:** apprt layer cleanly separates platform concerns

### Market Position

- **Niche but Growing:** 42k+ stars, active development, strong community
- **Developer-Focused:** Created by HashiCorp founder, appeals to power users and developers
- **Privacy-Conscious:** Local, cross-platform alternative to cloud terminals
- **Open Source:** MIT license enables wide adoption and customization
- **Production-Ready:** Stable releases, comprehensive documentation, active maintenance

### Development Quality

- **Testing:** Comprehensive test suite with benchmarking and UI testing
- **Documentation:** HACKING.md, CONTRIBUTING.md, AGENTS.md are exemplary
- **Build System:** Zig build system cleanly manages complex cross-platform builds
- **Code Organization:** Clear module structure, logical dependency graph
- **CI/CD:** Automated testing and release process

## Strategic Observations

### Strengths

- **Defensible Technology:** Zig provides memory safety and cross-platform compilation
- **Native-First Philosophy:** Respects platform conventions rather than imposing Electron everywhere
- **Performance Foundation:** GPU acceleration and threading baked into core
- **Extractable Components:** libghostty enables ecosystem expansion beyond terminal emulator
- **Community Momentum:** Growing stars, active contributors, engaged maintainers

### Challenges

- **Complexity:** Zig expertise required; fewer developers familiar with language
- **Platform Fragmentation:** Three separate UI stacks (macOS, Linux, Windows) means more maintenance
- **Niche Market:** Terminal emulators are niche product; market size is limited
- **Learning Curve:** Ghostty's advanced features require user education
- **Competition:** Established players (iTerm, Alacritty, Kitty) have large user bases

### Opportunities

- **Enterprise Features:** SSO, audit logs, multi-user deployments
- **Vertical Specialization:** Data science, DevOps, financial trading terminals
- **Managed Hosting:** SaaS version for non-technical users or teams
- **Plugin Ecosystem:** Community-driven extensions and themes
- **AI Integration:** Built-in AI assistance for terminal workflows
- **libghostty Adoption:** Third-party applications embedding Ghostty terminals

## External Resources

- **GitHub Repository:** https://github.com/ghostty-org/ghostty
- **Website:** https://ghostty.org
- **Documentation:** https://ghostty.org/docs
- **Install Guide:** https://ghostty.org/docs/install
- **Issue Tracker:** https://github.com/ghostty-org/ghostty/issues
- **Discussions:** https://github.com/ghostty-org/ghostty/discussions

## Contributing to Research

To expand this research:

1. Clone additional related repositories to `.codebases/` (e.g., specific feature deep-dives)
2. Update `CLAUDE.md` with new repository information
3. Add findings to appropriate research documents
4. Analyze specific codebase sections in detail
5. Explore ecosystem projects using libghostty

---

**Research Date:** January 28, 2026
**Researcher:** Claude
**Status:** Initial structure setup - comprehensive analysis in progress
