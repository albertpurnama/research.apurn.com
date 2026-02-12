# Ghostty Research - Cloned Repositories

This document tracks all repositories cloned for the Ghostty research project.

**Location:** `.codebases/`

## Cloned Repositories

### ghostty-org/ghostty
- **Repository URL:** https://github.com/ghostty-org/ghostty.git
- **Clone Date:** 2026-01-28
- **Purpose:** Research into Ghostty's technical architecture (Zig-based terminal emulation, GPU rendering with Metal/OpenGL, libghostty library design) and platform-native patterns (SwiftUI on macOS, GTK on Linux)
- **Key Files/Directories:**
  - `src/` - Core Zig source code (218,698 lines total)
    - `src/terminal/` - Terminal emulation state machine and control sequence parsing
    - `src/renderer/` - Multi-renderer architecture
      - `src/renderer/metal/` - Metal renderer for macOS GPU acceleration
      - `src/renderer/opengl/` - OpenGL renderer for Linux GPU acceleration
      - `src/renderer/shaders/` - GPU shaders for rendering
    - `src/apprt/` - Application runtime (platform abstraction)
      - `src/apprt/gtk/` - GTK application runtime for Linux/FreeBSD
    - `src/config/` - Configuration system
    - `src/input/` - Input handling
    - `src/cli/` - CLI implementation
    - `src/terminal/osc/` - Operating System Command sequences
    - `src/terminal/kitty/` - Kitty-specific protocol extensions
    - `src/terminal/tmux/` - Tmux control mode support
  - `macos/` - macOS SwiftUI application AND iOS app
    - `macos/Sources/App/macOS/` - macOS-specific code (AppDelegate, main.swift)
    - `macos/Sources/App/iOS/` - iOS app entry point (iOSApp.swift, 51 lines minimal code)
    - `macos/Sources/Features/` - Feature implementations (shared between macOS and iOS)
    - `macos/Sources/Ghostty/` - Core Ghostty components (reused by both platforms)
    - `macos/Tests/` - Test suite
    - Built with SwiftUI and native Metal rendering
    - iOS app: In active development (since Jan 2024), builds and runs on simulator and device, not yet publicly distributed
  - `include/` - C headers for libghostty API
  - `build.zig` - Zig build system configuration (10,886 lines)
  - `build.zig.zon` - Build dependencies specification
  - `pkg/` - Platform-specific packages (Flatpak, Snap, macOS, etc.)
  - `test/` - Test suite
  - `AGENTS.md` - Agent development guide with build commands
  - `HACKING.md` - Developer documentation (15,873 lines)
  - `CONTRIBUTING.md` - Contribution guidelines (16,823 lines)
  - `README.md` - Main project documentation

- **Technology Stack:**
  - **Languages:** Zig (80.4%), Swift (11.2%), C++ (3.3%), C (2.6%), Shell (0.7%), HTML (0.5%)
  - **Core Zig:** Terminal emulation, rendering abstraction, configuration parsing
  - **Platform-Specific:**
    - macOS: SwiftUI-based GUI with Metal renderer
    - Linux/FreeBSD: GTK-based GUI with OpenGL renderer
  - **Build System:** Zig build system with platform-specific targets
  - **Rendering:** Metal (macOS), OpenGL (Linux)
  - **Terminal Standard:** ECMA-48 compliant with xterm compatibility and modern extensions (Kitty, tmux control mode)

- **Architecture Highlights:**
  - Multi-renderer architecture (Metal for macOS, OpenGL for Linux)
  - Zig core with Swift/C interop for platform-native UIs
  - libghostty-vt library for terminal parsing/state (C-compatible)
  - IO threading for responsive terminal I/O
  - GPU-accelerated rendering maintaining 60fps under load
  - Standards-compliant terminal emulation (ECMA-48, xterm compatibility)
  - Cross-platform libghostty API for embedding terminals in other applications

- **Project Stats:**
  - **GitHub Stars:** 42.3k
  - **Contributors:** 477
  - **License:** MIT
  - **Status:** Active development (14,106+ commits)
  - **Release Pattern:** Regular releases with detailed documentation

- **Key Development Features:**
  - Built with modern Zig (requires specific version for main branch)
  - Requires Xcode 26 and macOS 26 SDK for development (main branch)
  - Comprehensive test suite with benchmarking
  - Agent-friendly development with AGENTS.md and example prompts in `.agents/commands/`
  - Full CI/CD pipeline with GitHub Actions

- **Notable Design Decisions:**
  - Shared Zig core with platform-native UI layers (not cross-platform Electron/GTK everywhere)
  - GPU acceleration as first-class concern (not fallback)
  - libghostty-vt as extractable, reusable terminal parsing library
  - Native preferences panel and menu system (especially on macOS)
  - Focus on standards compliance as foundation, then modern extensions

## Guidelines

- All clones go in `.codebases/` folder
- Update this file each time a new repository is cloned
- Use descriptive purposes and key file references
- Keep codebases out of the final research documentation
