# Ghostty Platform-Native Patterns

## Overview

Ghostty demonstrates how to build a cross-platform application while respecting and leveraging platform-specific design patterns, APIs, and conventions. Rather than forcing a least-common-denominator Electron experience, Ghostty creates native applications for each platform.

**Design Philosophy:** "Shared core, native experiences."

```
Shared Zig Core (terminal logic, rendering abstraction)
           ↓
    ┌──────┴──────┐
    ↓             ↓
macOS SwiftUI   Linux GTK
(Native)        (Native)
```

## macOS Application

### Architecture Overview

The macOS application is a **true native application** written in Swift using SwiftUI and AppKit.

```
SwiftUI View Hierarchy
    ↓
App Structure
├─ Window Management
├─ Tab System
├─ Split/Pane Management
├─ Preferences Panel
├─ Menu System
├─ Global Keybinds
    ↓
apprt Layer
(Zig/Swift Interop)
    ↓
Metal Renderer
    ↓
GPU Rendering
```

### Technology Stack

**Framework Level:**
- **SwiftUI:** Modern declarative UI framework
- **AppKit:** Native macOS application frameworks
- **Metal:** GPU-accelerated rendering

**Integration:**
- **CoreText:** System font management
- **Pasteboard:** Clipboard integration
- **NSWindow:** Window management
- **NSMenu:** Menu system
- **Foundation:** Core macOS APIs

**Build System:**
- Zig build system (not Xcode)
- Swift Package Manager integration
- Native code compilation

### SwiftUI Architecture

**Key Components:**

1. **App Structure:**
   ```swift
   @main
   struct GhosttyApp: App {
       // Application state
       // Window scenes
       // Commands
   }
   ```

2. **Window Scene:**
   ```swift
   WindowGroup {
       MainTerminalView()
           .environmentObject(appState)
   }
   .commands {
       // Menu commands
   }
   ```

3. **Terminal View:**
   ```swift
   struct TerminalView: NSViewRepresentable {
       // Metal rendering view
       // Gesture handling
       // Event processing
   }
   ```

### Metal Rendering Integration

**From Swift to GPU:**

```
SwiftUI View
    ↓
MetalView (NSViewRepresentable)
    ↓
Metal Device & Command Queue
    ↓
Shader Compilation & Execution
    ↓
Screen Rendering
```

**Key Integration Points:**

1. **NSViewRepresentable:**
   - Bridges SwiftUI to native Metal views
   - Manages Metal device lifecycle
   - Handles view updates and redrawing

2. **Metal Command Queue:**
   - Submits render commands to GPU
   - Synchronizes with display refresh (120Hz capable)
   - Manages metal command buffers

3. **Shader Coordination:**
   - Metal Shading Language (MSL) shaders
   - Compiled at app startup
   - Receive vertex/fragment data from Zig core

**Font Rendering Path:**
```
SwiftUI Font Selection
    ↓
CoreText Font Discovery
    ↓
Font Metrics Calculation
    ↓
Glyph Rasterization (CoreGraphics)
    ↓
Texture Atlasing
    ↓
Metal Rendering
```

### Window Management

**Multi-Window Support:**
- Each terminal session in separate window
- Independent window state
- Window restoration on app relaunch
- Save/restore window positions and sizes

**Tab System:**
- Tabs within single window
- Drag tabs between windows
- Tab management UI in titlebar
- Context menus for tab operations

**Split/Pane System:**
- Horizontal and vertical splits
- Balanced resizing
- Keyboard navigation between panes
- Full screen support

**Implementation:**
- SwiftUI NavigationStack for tab management
- ZStack for layering panes
- Geometry reader for calculating split positions
- State management for pane hierarchy

### Preferences Panel (macOS Exclusive)

Ghostty has a native macOS preferences panel, not a config file editor.

**Features:**
- Visual font selection
- Color picker for theme
- Keyboard binding customization
- Advanced settings in separate tab
- Live preview of changes
- Settings synced to config file

**Technology:**
- SwiftUI Form/List views
- NSFontPanel for font selection
- NSColorPanel for color selection
- Settings Bundle integration
- macOS AppKit controls

### Menu System

**Standard macOS Menus:**
- File (New Window, Open, etc.)
- Edit (Copy, Paste, Select All)
- View (Zoom, Full Screen, Splits)
- Terminal (Clear Buffer, Reset)
- Help (Documentation links)

**Implementation:**
```swift
.commands {
    CommandGroup(replacing: .newItem) {
        Button("New Window", action: { ... })
    }
    CommandGroup(replacing: .pasteboard) {
        Button("Copy", action: { ... })
        Button("Paste", action: { ... })
    }
}
```

### Global Keybinds

**Feature:** Hotkeys work even when app is in background (especially ⌘+Backtick to focus window).

**Implementation:**
- NSEvent.addLocalMonitorForEvents
- Event tap to capture global keyboard events
- Zig config integration for keybind definitions

**Examples:**
- ⌘+N - New window
- ⌘+T - New tab
- ⌘+D - Split horizontally
- ⌘+Shift+D - Split vertically

### Zig/Swift Interop

**Challenge:** How does the Zig core communicate with the Swift UI?

**Solution:** C FFI (Foreign Function Interface)

```
Zig Core
    ↓
C-Compatible Export
    ↓
Swift Bridging Header
    ↓
Swift Code
```

**Implementation Details:**

1. **Zig Exports C Functions:**
   ```zig
   export fn ghostty_create_terminal(options: *const Options) ?*Terminal {
       // Implementation
   }
   ```

2. **C Bridging Header:**
   ```objc
   // Ghostty-Bridging-Header.h
   #include "ghostty.h"
   ```

3. **Swift Usage:**
   ```swift
   let terminal = ghostty_create_terminal(&options)
   ```

**Key FFI Points:**
- Terminal creation/destruction
- Event loop integration
- Screen buffer access for rendering
- Input event routing

### AppKit Integration

**Services Integration:**
- Print support
- Export to file
- Dictionary lookup
- Sharing options

**Pasteboard (Clipboard):**
- Read/write text
- Preserve formatting
- Drag-and-drop support
- Custom pasteboard types

**Notification Center:**
- App activation/deactivation
- Window focus changes
- Configuration reloads

### Build Process

**Building on macOS:**

```bash
zig build               # Debug build
zig build -Doptimize=ReleaseFast  # Optimized
zig build run          # Build and run
zig build test         # Unit tests
```

**What Happens:**
1. Zig compiler builds core library
2. Swift compiler compiles UI code
3. Linker combines Zig core + Swift UI
4. App bundle created with executable + resources
5. Code signing and notarization (for distribution)

**No Xcode Required:**
- Pure Zig build system
- Swift compilation happens under the hood
- All configuration in build.zig

## Linux/FreeBSD Application

### Architecture Overview

The Linux and FreeBSD applications use **GTK 4+** for the native UI.

```
GTK Window
    ↓
GTK Drawing Area
    ↓
OpenGL Context
    ↓
OpenGL Rendering
```

### Technology Stack

**Framework Level:**
- **GTK 4+:** Modern GNOME toolkit
- **OpenGL:** GPU-accelerated rendering
- **GObject:** Type system and signals

**Integration:**
- **fontconfig:** Font discovery
- **FreeType:** Font rendering
- **X11/Wayland:** Display server support
- **DBus:** System integration
- **XDG:** Desktop standards

**Build System:**
- Zig build system
- blueprint-compiler (required dependency)
- GTK development libraries

### GTK Architecture

**Window Structure:**
```
GtkApplicationWindow
    ↓
GtkBox (container)
    ├─ GtkHeaderBar (title bar, buttons)
    ├─ GtkNotebook (tabs)
    │   └─ TerminalWidget (custom)
    │       └─ OpenGL Context
    └─ GtkInfoBar (messages)
```

**Custom Widget (TerminalWidget):**
```
GtkWidget subclass
├─ Drawing callback → OpenGL rendering
├─ Size allocation
├─ Event handling (keyboard, mouse)
└─ Accessibility features
```

### OpenGL Rendering

**From GTK to GPU:**

```
GTK Event Loop
    ↓
TerminalWidget::draw()
    ↓
OpenGL Context Activation
    ↓
Shader Execution
    ↓
Buffer Swapping
```

**OpenGL Context Creation:**
- Created via GTK's native widget
- Pixel format negotiation with display server
- Version detection (3.3+ preferred)
- Fallback to older versions if needed

**Font Rendering Path:**
```
fontconfig Discovery
    ↓
Font Selection
    ↓
FreeType Rasterization
    ↓
Glyph Texture Atlas
    ↓
OpenGL Rendering
```

### Menu System

**GNOME/GTK Conventions:**
- HeaderBar with app menu
- Application menu (hamburger icon)
- Context menus on right-click
- Keyboard accelerators

**GTK Menus:**
```
GtkApplication (provides app menu)
GtkApplicationWindow (window menu)
GtkPopoverMenu (context menus)
```

**Integration with apprt:**
- apprt provides abstract menu API
- GTK backend implements with native widgets
- Keybindings through GTK action system

### Clipboard and Drag-Drop

**Clipboard Integration:**
- GtkClipboard for system clipboard
- Atom-based format negotiation
- Support for primary (X11) and clipboard (standard)

**Drag-and-Drop:**
- Drop targets for files
- Text drag-and-drop
- Image pasting

### Accessibility

**GTK Accessibility:**
- Screen reader support via ATK
- Keyboard navigation
- High contrast mode support

**Terminal Accessibility:**
- Text selection for screen readers
- Proper semantic structure
- Keyboard navigation of UI

### Blueprint Compiler

**Why Blueprint?**
- Modern DSL for GTK UI definition
- More readable than pure C GTK code
- Compiles to C/GObject code
- Generated at build time

**Blueprint Example:**
```blueprint
using Gtk 4.0;

ApplicationWindow app_window {
    title: "Ghostty";
    default-width: 800;
    default-height: 600;
    
    Box {
        orientation: vertical;
        
        HeaderBar {
            // title bar content
        }
        
        Notebook {
            // tabs content
        }
    }
}
```

**Build Integration:**
- `blueprint-compiler` transforms `.blp` → C code
- Zig build system orchestrates compilation
- Generated files linked into final binary

### Build Process

**Building on Linux:**

```bash
zig build                      # Debug build
zig build -Doptimize=ReleaseFast   # Optimized
zig build run                 # Build and run
zig build test               # Tests
```

**Requirements:**
- Zig toolchain
- GTK 4+ development libraries
- blueprint-compiler
- OpenGL development libraries
- fontconfig, freetype

**What Happens:**
1. blueprint-compiler processes `.blp` files → C code
2. Zig compiler builds core library
3. C compiler builds GTK bindings + generated code
4. Linker combines everything
5. Final executable with all resources

### Platform-Specific Features

**X11 vs Wayland:**
- Ghostty works on both
- GTK handles abstraction
- Some features (global shortcuts) differ

**Wayland Improvements:**
- Better multi-monitor support
- Fractional scaling
- More modern architecture
- Ghostty contributes upstream improvements

**Desktop Integration:**
- .desktop file for app launcher
- Desktop entry specification compliance
- Category metadata for app menus
- MimeType associations

## Cross-Platform abstraction (apprt)

### Purpose

The `apprt` (application runtime) layer provides a platform-agnostic interface to platform-specific features.

### Interface Design

**Core apprt Responsibilities:**
- Window creation/management
- Event loop integration
- Input event routing
- Clipboard management
- File dialogs
- Configuration loading

**Platform Implementations:**
- macOS via AppKit/SwiftUI
- Linux via GTK

### apprt API (Zig)

**Example Interface:**
```zig
pub const Window = struct {
    // Window operations
    pub fn create(config: WindowConfig) !*Window { ... }
    pub fn show(self: *Window) void { ... }
    pub fn set_size(self: *Window, width: u32, height: u32) void { ... }
    pub fn close(self: *Window) void { ... }
};

pub const EventLoop = struct {
    pub fn run(self: *EventLoop) void { ... }
    pub fn post_event(self: *EventLoop, event: Event) void { ... }
};
```

### Implementation Pattern

**macOS Specific Code Location:**
- Direct implementation in main.swift
- Callbacks bridge to Zig

**Linux Specific Code Location:**
- `src/apprt/gtk/` with GTK bindings
- Zig FFI to GTK libraries

### Rendering Integration

Both platforms provide:
- Surface for rendering
- Event notification system
- Resize/repaint callbacks

**macOS:**
- MTLDevice for Metal
- Display link for synchronization

**Linux:**
- GLXContext for OpenGL
- GDK window for event integration

## Renderer Abstraction

### Design

Ghostty abstracts rendering through a common interface:

```zig
pub const Renderer = struct {
    pub fn init(config: RendererConfig) !*Renderer { ... }
    pub fn resize(self: *Renderer, width: u32, height: u32) void { ... }
    pub fn render(self: *Renderer, terminal: *Terminal) void { ... }
    pub fn deinit(self: *Renderer) void { ... }
};
```

### Platform Implementations

**Metal Renderer (macOS):**
- Path: Integrated into macOS build
- Language: Zig (with Metal FFI)
- Shaders: Metal Shading Language

**OpenGL Renderer (Linux):**
- Path: `src/renderer/opengl/`
- Language: Zig (with OpenGL FFI)
- Shaders: GLSL

### Shader Management

**Common Shader System:**
- Both Metal and OpenGL have similar concepts
- Vertex + Fragment shader pairs
- Similar data flow
- Different languages (MSL vs GLSL)

**Shader Files:**
- `src/renderer/shaders/` contains shader sources
- Compiled at build time
- Embedded in binary
- No runtime shader compilation

### Renderer Selection

**macOS:** Metal always (native GPU framework)
**Linux:** OpenGL (broader GPU compatibility)

**Rationale:**
- Metal: Modern, optimized for Apple hardware
- OpenGL: Broader hardware support than Vulkan on Linux

## Font System

### Font Discovery

**macOS (CoreText):**
```swift
let fonts = NSFont.availableFonts(matching: descriptor)
```

**Linux (fontconfig):**
```c
FcPattern *pattern = FcNameParse("monospace-12");
FcFontSet *fonts = FcFontSort(config, pattern, ...);
```

### Font Metrics

Both platforms provide:
- Character width/height
- Ascender/descender information
- Ligature support (Metal only)
- Fallback chains for Unicode

**Unified API:** Zig module abstracts both:
```zig
pub const Font = struct {
    pub fn measure(self: *Font, codepoint: u21) FontMetrics { ... }
    pub fn has_ligature_support(self: *Font) bool { ... }
};
```

### Ligature Support

**macOS (Metal):**
- Native CoreText ligature support
- Shaper library integration
- Unique to Ghostty among Metal-based terminals

**Linux (OpenGL):**
- No hardware ligature rendering
- Possible future enhancement

## Configuration Synchronization

### Single Source of Truth

Configuration file is single source:
- `~/.config/ghostty/config` (Linux)
- `~/Library/Application Support/.../config` (macOS)

**From Config to UI:**
```
Config File
    ↓
apprt Layer (file watching)
    ↓
Zig Core (parsed config)
    ↓
Platform UI Updates
```

**macOS Preference Panel:**
- Reads from config file on startup
- Updates config when user changes settings
- File watching triggers reloads
- Changes reflected in terminal immediately

### Hot Reload

**Watch Mechanism:**
- File system notifications (macOS FSEvents, Linux inotify)
- apprt layer notifies Zig core
- Terminal state updates without restart
- UI reflects changes

## Event Flow

### Input Event Routing

```
Platform Event
    ↓
apprt Layer Converts to Zig Event Type
    ↓
Zig Input Module Processes
    ↓
Terminal Emulation Updates
    ↓
Render Loop Triggered
```

### macOS Flow:
```
AppKit Event (NSEvent)
    ↓
SwiftUI Gesture/Event Handler
    ↓
Zig/C FFI Boundary
    ↓
Zig Input Processing
```

### Linux Flow:
```
GTK Signal (gtk_widget_event)
    ↓
apprt GTK Binding
    ↓
Zig Event Type
    ↓
Zig Input Processing
```

## Testing Strategies

### Platform-Specific Testing

**macOS:**
- XCTest for SwiftUI/AppKit integration
- Benchmark tests for Metal rendering
- UI tests for window management

**Linux:**
- GTK signal verification
- Rendering correctness tests
- Font system testing

### Cross-Platform Testing

**Shared Tests:**
- Terminal emulation (via libghostty-vt)
- Configuration parsing
- Unicode handling
- Input encoding

## Best Practices Demonstrated

### 1. Platform Respect

Don't force uniformity:
- macOS gets native SwiftUI experience
- Linux gets native GTK experience
- Different conventions honored (⌘ on Mac, Ctrl on Linux)

### 2. Clean Abstraction Layers

Clear separation:
- apprt abstracts windowing
- Renderer abstracts GPU API
- Terminal emulation independent of UI

### 3. Shared Core Focus

Where possible, share code:
- Terminal logic (Zig)
- Configuration parsing (Zig)
- Rendering algorithms (same shader logic)

### 4. Native API Usage

Use what's best for each platform:
- Metal for macOS (not OpenGL or Vulkan)
- GTK 4+ for Linux (not Qt or Electron)
- Platform-specific frameworks when beneficial

### 5. Build System Discipline

Keep builds simple:
- Single build system (Zig) not platform-specific
- No Xcode project files to maintain
- Consistent command line interface

## Comparison: Ghostty vs Alternatives

### vs. Electron Apps

**Ghostty Approach:**
- Native UI frameworks (SwiftUI, GTK)
- Small binary size
- Native performance
- Platform conventions respected

**Electron Approach:**
- Uniform but generic UI
- Large binary size
- Performance overhead
- No platform conventions

### vs. Alacritty

**Ghostty Approach:**
- Rich UI (tabs, panes, preferences)
- Native platform features
- Sophisticated input handling

**Alacritty Approach:**
- Minimal UI
- Simple configuration
- Smaller scope

### vs. iTerm2

**Ghostty Approach:**
- Modern rendering (Metal)
- Cross-platform
- Open source
- Simpler preferences

**iTerm2 Approach:**
- Very mature feature set
- macOS only
- Longer development history
- More complex preferences

## Future Platform Support

### Windows

**Challenges:**
- Windows console model different from Unix
- Windows Terminal as alternative
- Smaller developer audience

**Potential Approach:**
- Native Windows API (no .NET/WPF for performance)
- Similar architecture pattern
- DirectX 12 or 11 for rendering

### Web/Wayland-Specific

**Opportunities:**
- Wayland-specific features
- Web-based Ghostty (WebAssembly + libghostty-vt)
- Remote terminal via web

## Conclusion

Ghostty demonstrates how to build truly cross-platform applications while honoring platform differences. Rather than imposing a uniform experience, it:

1. **Shares logic** where possible (Zig core)
2. **Uses native UI** frameworks (SwiftUI, GTK)
3. **Respects conventions** (keybinds, menus, preferences)
4. **Leverages native APIs** (Metal, OpenGL, CoreText, fontconfig)
5. **Maintains clean abstractions** (apprt, renderer interface)

This approach results in applications that feel native on each platform while sharing the sophisticated terminal emulation logic that makes Ghostty excellent.

---

**Analysis Date:** January 28, 2026
**Analyzer:** Research team
**Status:** Complete
