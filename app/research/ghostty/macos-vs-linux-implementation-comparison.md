# macOS vs Linux Implementation Comparison

## Overview

Ghostty has **radically different implementations** for macOS and Linux. Rather than sharing UI code, the project takes a "use what's best for each platform" approach.

```
┌─────────────────────────────┐
│    Shared Zig Core (218k)   │
├─────────────────────────────┤
│      Terminal, Renderer,    │
│    Config, Input, CLI, etc  │
└──────────────┬──────────────┘
               │
      ┌────────┴────────┐
      ▼                 ▼
  macOS             Linux
```

## Summary Comparison Table

| Dimension | macOS | Linux |
|-----------|-------|-------|
| **UI Framework** | SwiftUI + AppKit | GTK 4+ |
| **Implementation Language** | Swift | Zig |
| **Files** | 130 Swift files | 43 Zig files |
| **Code Size** | 1.4MB source | 864KB total (1,975 LOC main) |
| **UI Definition** | SwiftUI declarative code | Blueprint (`.blp` files) |
| **Rendering** | Metal GPU | OpenGL GPU |
| **Build System** | Zig (via Swift integration) | Zig + blueprint-compiler |
| **Package Type** | macOS app bundle | Native Linux binary |
| **Approach** | Native-first, full platform leverage | Minimal wrapper, GTK-first |

---

## macOS Implementation (Swift)

### Architecture

```
SwiftUI View Hierarchy
    ↓
Swift Feature Modules
├─ Terminal Feature
├─ Splits Feature
├─ Settings Feature
├─ Command Palette
├─ Update System
├─ Services
└─ Global Keybinds
    ↓
AppKit Integration
├─ NSWindow
├─ NSMenu
├─ Pasteboard
└─ Services
    ↓
Metal GPU Rendering
```

### Key Characteristics

**Full Native Framework:**
- Uses **SwiftUI** for modern declarative UI
- Uses **AppKit** for native capabilities (menu bar, services, etc.)
- Can access any macOS API directly
- No abstraction layer needed

**Comprehensive Feature Set:**
- Native preferences panel with visual controls
- Global keybinds (hotkey from background)
- App Intents for Siri/automation
- Services integration
- QuickTerminal floating window
- Update system with release notes
- Full split/tab management

**Code Organization (130 Swift files):**
```
Sources/
├── App/
│   ├── macOS/          (AppDelegate, main entry)
│   └── iOS/            (iOS app variant)
├── Features/           (Feature modules)
│   ├── Terminal/
│   ├── Splits/
│   ├── Settings/
│   ├── Command Palette/
│   ├── Global Keybinds/
│   ├── Update/
│   ├── Services/
│   ├── ClipboardConfirmation/
│   ├── Secure Input/
│   ├── App Intents/
│   └── [others...]
├── Ghostty/
│   └── Surface View  (Metal rendering view)
└── Helpers/
    └── Extensions
```

**Test Suite:**
- GhosttyUITests/ - SwiftUI/AppKit UI tests
- Tests/ - Unit tests with benchmarks
- Tests for themes, config, window management, clipboard, update system

**Why Swift?**

1. **Native Integration:** SwiftUI has tight integration with macOS features
2. **Type Safety:** Swift provides compile-time safety with less verbosity than Zig
3. **Developer Velocity:** Swift is optimized for rapid macOS app development
4. **Platform APIs:** Direct access to all macOS APIs without FFI overhead
5. **Tool Support:** Xcode, Swift Package Manager, extensive documentation

---

## Linux Implementation (Zig)

### Architecture

```
Zig App Entry
    ↓
GTK Application (via GObject bindings)
├─ Application class
├─ Window widgets
├─ UI definitions (Blueprint)
└─ Event handling
    ↓
OpenGL GPU Rendering
```

### Key Characteristics

**Minimal Zig Wrapper:**
- **Zig FFI to GTK** - Not a full reimplementation
- Blueprint files for UI definition (compiled to GTK XML)
- GObject class wrappers in Zig
- ~2,000 lines of Zig code

**Lightweight Implementation:**
- `App.zig` (99 lines) - Main entry point
- `class.zig` (367 lines) - GObject wrapper infrastructure
- `key.zig` (535 lines) - Keyboard handling
- Additional modules for specific features

**File Structure:**
```
src/apprt/gtk/
├── *.zig                    (Core implementation files)
│   ├── App.zig             (99 lines)
│   ├── class.zig           (367 lines)
│   ├── key.zig             (535 lines)
│   ├── Surface.zig         (103 lines)
│   ├── gtk_version.zig     (140 lines)
│   ├── gsettings.zig       (101 lines)
│   ├── cgroup.zig          (210 lines)
│   ├── winproto.zig        (155 lines)
│   ├── adw_version.zig     (122 lines)
│   └── [others]
├── class/                   (GObject wrapper classes, 24 files)
│   ├── application.zig
│   ├── window.zig
│   ├── surface.zig
│   └── [UI widgets]
├── ui/                      (Blueprint UI definitions, 21 files)
│   ├── 1.0/                (GTK 1.0 compatible)
│   ├── 1.2/                (GTK 1.2)
│   ├── 1.3/
│   ├── 1.4/
│   └── 1.5/                (Latest, most features)
│       ├── window.blp
│       ├── surface.blp
│       ├── tab.blp
│       ├── split-tree.blp
│       ├── command-palette.blp
│       └── [others]
├── css/                     (Styling)
│   ├── style.css           (Light theme)
│   ├── style-dark.css      (Dark theme)
│   └── style-hc*.css       (High contrast)
├── ext/                     (Extensions)
├── ipc/                     (IPC communication)
└── winproto/                (Window protocol)
```

**Why Zig Instead of Swift?**

1. **Cross-Platform:** Zig compiles on many platforms
2. **Minimal Runtime:** No Swift runtime overhead
3. **Direct GTK Access:** FFI to GTK is simple and efficient
4. **Consistency:** Same language as core Ghostty
5. **Binary Size:** Minimal added code to GTK
6. **Control:** Direct memory management and system interaction

---

## Detailed Comparison

### Implementation Strategy

**macOS:**
- **Philosophy:** "Use the best native framework"
- **Approach:** Full Swift implementation leveraging SwiftUI + AppKit
- **Abstraction:** None - direct macOS API access
- **Code Sharing:** Only the Zig core is shared

**Linux:**
- **Philosophy:** "Minimal wrapper around proven toolkit"
- **Approach:** Thin Zig layer over GTK bindings
- **Abstraction:** High - GTK handles most complexity
- **Code Sharing:** Zig core + thin GTK wrapper

### UI Definition

**macOS (Swift):**
```swift
struct MainWindow: View {
    @EnvironmentObject var appState
    @State var selectedTab: String?
    
    var body: some View {
        VStack {
            // SwiftUI components
            TerminalView()
                .environmentObject(appState)
            CommandPalette()
        }
        .commands {
            // Menu commands
        }
    }
}
```

**Linux (Blueprint):**
```blueprint
using Gtk 4.0;

ApplicationWindow app_window {
    title: "Ghostty";
    default-width: 800;
    default-height: 600;
    
    Box {
        orientation: vertical;
        
        Notebook {
            // tabs
        }
    }
}
```

### Event Handling

**macOS:**
- SwiftUI gestures (`onKeyPress`, `onMouseEvent`)
- AppKit events (`NSEvent`)
- Direct Zig/C FFI callback

**Linux:**
- GTK signals connected to Zig handlers
- GObject signal system
- Blueprint event bindings

### Rendering

**macOS:**
```swift
struct MetalView: NSViewRepresentable {
    @EnvironmentObject var renderer
    
    func makeNSView(context: Context) -> MTKView {
        let view = MTKView()
        view.device = MTLCreateSystemDefaultDevice()
        return view
    }
    
    func updateNSView(_ nsView: MTKView, context: Context) {
        renderer.render(to: nsView)
    }
}
```

**Linux:**
```zig
pub const Surface = struct {
    // OpenGL setup via GTK GLArea
    gtk_gl_area: *c.GtkGLArea,
    
    pub fn render(self: *Surface) void {
        // OpenGL commands
    }
};
```

### Building

**macOS:**
```bash
zig build              # Uses build.zig
                       # Internally calls Swift compiler
                       # Links Zig core + Swift UI
```

**Linux:**
```bash
zig build              # Uses build.zig
                       # blueprint-compiler processes .blp files → C
                       # Zig compiler builds core + GTK bindings
                       # Links everything together
```

### Testing

**macOS:**
- XCTest framework
- SwiftUI/AppKit-specific tests
- UI testing via XCUITest
- 8 UI tests + unit tests

**Linux:**
- GTK test infrastructure
- Signal/event testing
- Integration testing via GTK

---

## Feature Parity and Differences

### Features Available on Both

✅ Multi-window support
✅ Tabbing
✅ Split/panes
✅ Configuration reload
✅ Mouse support
✅ Keyboard shortcuts
✅ Theme support (light/dark)
✅ Terminal emulation (all sequences)

### macOS-Exclusive Features

✅ Native preferences panel with visual controls
✅ App Intents (Siri integration)
✅ Services menu integration
✅ Global keybinds (works in background)
✅ QuickTerminal floating window
✅ macOS menu bar integration
✅ Update system with release notes UI

### Linux Potential (Not Yet Implemented)

- Preferences GUI (currently config-file based)
- Deeper Wayland integration
- System tray integration
- Desktop portal features

---

## Code Metrics

### macOS (Swift)

```
Directory Size: 7.8MB total
Source Code:   1.4MB
Swift Files:   130
Lines of Code: ~15,000 (estimated)

Organization:
- Very organized into feature modules
- Clear separation of concerns
- Each feature is self-contained
```

### Linux (Zig)

```
Directory Size: 864KB total
Zig Files:     43
Blueprint UIs:  21
Lines of Code: 1,975 (main Zig files)

Organization:
- Minimal code footprint
- GTK handles complexity
- Feature layout in Blueprint files
```

### Ratio

**Linux is 62% smaller** than macOS implementation in terms of source code.

---

## Why This Approach?

### Advantages

**Flexibility:**
- Each platform gets what's best
- No compromises on native look-and-feel
- Can leverage platform-specific capabilities

**Performance:**
- No abstraction layer overhead
- Native rendering APIs used directly
- Optimal for each platform

**Maintenance:**
- Code written in idiomatic style for platform
- Uses each platform's best tools
- Easier for platform-specific contributors

**Feature Velocity:**
- macOS can add features faster using SwiftUI
- New GTK features are simple to adopt
- No cross-platform constraints

### Disadvantages

**Development Effort:**
- Must maintain two different implementations
- Different testing and debugging processes
- Different knowledge required (Swift vs Zig)

**Code Duplication:**
- Some logic duplicated between platforms
- Feature requests require two implementations

**Maintenance Burden:**
- Contributors need platform-specific expertise
- Potential for feature divergence
- Platform-specific bugs

---

## Lessons Learned

### Philosophy: "Shared Core, Native Experiences"

This is a deliberate design decision. Rather than:

**❌ Electron/Tauri Approach:**
- Same code everywhere
- Generic UI experience
- Larger binaries

**❌ Qt/wxWidgets Approach:**
- Cross-platform frameworks
- Some native capabilities lost
- Abstraction overhead

**✅ Ghostty Approach:**
- Shared Zig terminal logic
- Native UI for each platform
- Best-of-breed performance and look

### When to Use This Pattern

**Good for:**
- Applications where native UI matters
- Performance-critical applications
- Apps needing deep platform integration
- Desktop applications (macOS, Linux, Windows)

**Not good for:**
- Web applications
- Simple CRUD apps
- Teams needing rapid development speed
- Large teams with diverse skills

---

## Technical Insights

### Zig as Platform Abstraction

**Interesting Pattern:**
Ghostty uses Zig as a "platform-neutral core" with **different higher layers**:

```
Zig Core (terminal emulation, rendering abstraction)
    ↓
Platform Layer
├─ macOS: Swift bindings + AppKit + SwiftUI
└─ Linux: Zig GTK bindings
```

Rather than:
```
Traditional Cross-Platform
    ↓
Shared C/C++ core
    ↓
Platform Bindings (Swift, GTK)
```

### FFI Strategy

**macOS:**
- Minimal FFI needed (Swift directly imports C)
- Zig exports C functions for Swift to call
- High-level abstractions in Swift

**Linux:**
- Zig imports GTK bindings (auto-generated)
- Thin wrapper to integrate with Zig event loop
- GObject model fits Zig's approach

---

## Build System Coordination

The **Zig build system** coordinates both implementations:

```bash
zig build
  ├─ Detect platform (macOS or Linux)
  ├─ If macOS:
  │   ├─ Build Zig core
  │   ├─ Compile Swift UI code
  │   └─ Link together
  └─ If Linux:
      ├─ Build Zig core
      ├─ Run blueprint-compiler
      ├─ Build GTK bindings
      └─ Link everything
```

**Benefit:** Single command line, platform-agnostic build script.

---

## Conclusion

Ghostty's architecture demonstrates a **pragmatic approach to cross-platform development**:

1. **Share logic, not UI** - Zig core is shared, UIs are native
2. **Respect platform conventions** - Each OS gets its best tools
3. **Optimize for each platform** - Metal on macOS, OpenGL on Linux
4. **Accept code duplication** - If it means better user experience
5. **Use appropriate languages** - Swift for macOS, Zig for Linux core

This is **not the only way to build cross-platform apps**, but it's a viable strategy for performance-critical, feature-rich desktop applications where native feel matters.

---

**Analysis Date:** January 28, 2026
**Analyzer:** Research team
**Status:** Complete
