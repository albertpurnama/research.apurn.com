# Ghostty Technical Architecture Deep Dive

## Overview

Ghostty's architecture is built around a shared Zig core with platform-specific UI layers. This document provides an in-depth analysis of the technical design, focusing on terminal emulation, rendering architecture, and cross-platform patterns.

**Core Facts:**
- 218,698 lines of Zig code across `src/`
- 42.3k GitHub stars, 477 contributors
- Multi-renderer architecture (Metal/OpenGL)
- Zig (80.4%), Swift (11.2%), C++ (3.3%), C (2.6%)
- libghostty library for terminal parsing/state

## Architecture Overview

### High-Level Design

```
┌──────────────────────────────────────────────────────────┐
│              Platform-Specific Layer                      │
│  ┌─────────────────────┐         ┌─────────────────────┐ │
│  │  macOS (SwiftUI)    │         │  Linux (GTK)        │ │
│  │  + AppKit           │         │  + system libs      │ │
│  └──────────┬──────────┘         └──────────┬──────────┘ │
└─────────────┼────────────────────────────────┼────────────┘
              │                                 │
              └────────────────────┬────────────┘
                                   │
┌──────────────────────────────────▼────────────────────────┐
│              Application Runtime Layer (apprt)            │
│         Platform abstraction + windowing                  │
└──────────────────────┬───────────────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────────────┐
│              Shared Zig Core (~218k lines)              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Terminal    │  │   Config     │  │   Input      │  │
│  │  Emulation   │  │   System     │  │   Handling   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   CLI        │  │   Unicode    │  │   SIMD       │  │
│  │   Commands   │  │   Processing │  │   Ops        │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└───────────────────┬──────────────────────────────────────┘
                    │
        ┌───────────┴──────────────┐
        │                          │
┌───────▼──────────┐      ┌────────▼─────────┐
│  Metal Renderer  │      │ OpenGL Renderer  │
│  (macOS GPU)     │      │ (Linux GPU)      │
└──────────────────┘      └──────────────────┘
```

### Directory Structure

```
src/
├── terminal/           # Terminal emulation state machine (primary focus)
├── renderer/           # Multi-renderer abstraction
│   ├── metal/         # Metal renderer for macOS
│   ├── opengl/        # OpenGL renderer for Linux
│   └── shaders/       # GPU shader code
├── apprt/             # Application runtime (platform layer)
│   └── gtk/           # GTK integration for Linux
├── config/            # Configuration parsing and management
├── input/             # Input handling (keyboard, mouse)
├── cli/               # Command-line interface
├── unicode/           # Unicode processing
├── simd/              # SIMD optimizations
├── crash/             # Crash reporting
└── [other modules]    # Additional functionality
```

## Terminal Emulation

### Core Concept

The terminal emulator implements a **state machine** that processes incoming byte streams and maintains terminal state (cursor position, attributes, screen buffer, etc.).

### Control Sequence Parsing

Ghostty implements comprehensive terminal control sequence support:

**Control Sequence Types:**
1. **CSI (Control Sequence Introducer):** `ESC[...` - Cursor movement, attributes
2. **OSC (Operating System Command):** `ESC]...` - System notifications, special features
3. **VT52 Sequences:** Legacy terminal compatibility
4. **Kitty Protocol:** Modern protocol extensions for graphics and other features
5. **tmux Control Mode:** Integration with tmux session management

**Examples:**
- `ESC[31m` - Set foreground color to red
- `ESC[H` - Move cursor to home position
- `ESC]0;Title ST` - Set window title
- Kitty graphics protocol for image rendering

### Standards Compliance

**ECMA-48 (ISO/IEC 6429):**
- Ghostty implements the ECMA-48 standard for terminal control
- Comprehensive coverage of cursor movement, text attributes, color modes
- Mode controls (insert/replace, auto-wrap, etc.)

**xterm Compatibility:**
- Extensive xterm compatibility as de facto standard
- Project includes comprehensive xterm audit comparing Ghostty behavior
- When standards don't define behavior, xterm is the reference implementation
- Behavior defined by: (1) standards, (2) xterm, (3) other popular terminals

**Modern Extensions:**
- **Kitty Graphics Protocol:** For image/graphic rendering in terminal
- **Hyperlinks:** OSC 8 for clickable hyperlinks
- **Extended Colors:** True color (24-bit RGB) support
- **Keyboard Encoding:** Advanced keyboard reporting modes

### libghostty-vt Library

Ghostty extracts terminal parsing into a reusable C-compatible library.

**Purpose:**
- Standalone terminal parsing library usable in other projects
- C API for cross-language compatibility
- Can be compiled to WebAssembly

**Components:**
- Virtual Terminal (vt) state machine
- Control sequence parser
- Screen buffer management
- Character attribute tracking

**API Examples:**
```c
// Create terminal
ghostty_vt *vt = ghostty_vt_create();

// Process input bytes
ghostty_vt_process(vt, data, len);

// Read screen buffer
const ghostty_cell *cells = ghostty_vt_screen_cells(vt);

// Event handling
ghostty_event event;
while (ghostty_vt_next_event(vt, &event)) { ... }
```

**Availability:**
- Written in Zig with C bindings
- Compilable to WebAssembly (wasm32-freestanding target)
- Used internally by Ghostty, also available for external projects

### Terminal Features

**Screen Management:**
- Double buffering for flicker-free updates
- Scrollback buffer with configurable size
- Search functionality with regex support
- Synchronized updates (SR ECMAMode)

**Cursor Features:**
- Various cursor styles (block, underline, bar, blinking)
- Cursor position reporting
- Cursor save/restore operations

**Text Attributes:**
- Foreground/background colors (16, 256, or 24-bit)
- Font styles (bold, italic, underline, strikethrough, dim)
- Blink attribute
- URL hyperlinks (OSC 8)

**Rendering Modes:**
- Normal text rendering
- Alt screen (full-screen applications like vim, tmux)
- Primary screen (normal shell)
- Mouse reporting (click, drag, wheel)

## Rendering Architecture

### Multi-Renderer Design Philosophy

Ghostty uses **platform-native graphics APIs** rather than cross-platform abstractions:

- **macOS:** Metal (not OpenGL, not Vulkan)
- **Linux:** OpenGL (for wider GPU compatibility)

**Why?**
1. **Maximum Performance:** Each platform's native API is optimized for that platform
2. **Modern Features:** Access to latest GPU capabilities (shaders, tessellation, etc.)
3. **Simpler Code:** Avoid abstraction layers and compatibility quirks
4. **Better Integration:** Use platform-specific optimizations

### Metal Renderer (macOS)

**Architecture:**
```
SwiftUI View → Metal Renderer → GPU → Display
                ↓
        Command Buffer Queue
                ↓
        Shader Compilation
                ↓
        Texture Rendering
```

**Key Components:**

1. **Metal Device & Queues:**
   - GPU device connection
   - Command buffer queues for rendering commands
   - Synchronized rendering with display refresh rate

2. **Shader System:**
   - Metal Shader Language (MSL) shaders
   - Vertex and fragment shaders for glyph rendering
   - Text rendering with sub-pixel accuracy

3. **Texture Management:**
   - Glyph cache as textures
   - Screen buffer as texture
   - Minimal CPU-GPU transfer

4. **Font Rendering:**
   - CoreText for font discovery and metrics
   - Support for ligatures (unique among Metal-based terminals)
   - Fallback font chains for Unicode support
   - Sub-pixel anti-aliasing

**Performance:**
- Maintains 60fps under typical load
- Efficient batching of draw calls
- Minimal GPU memory usage through texture atlasing
- CPU → GPU synchronization via Metal fences

### OpenGL Renderer (Linux)

**Architecture:**
```
GTK Window → OpenGL Context → GPU → Display
             ↓
        GLSL Shaders
             ↓
        Texture Rendering
```

**Key Components:**

1. **Context Management:**
   - OpenGL 3.3+ (with fallback to older versions)
   - Off-screen rendering with FBOs
   - X11 or Wayland integration via GTK

2. **Shader System:**
   - GLSL vertex and fragment shaders
   - Similar architecture to Metal renderer
   - Glyph and screen rendering

3. **Font Rendering:**
   - System font discovery (fontconfig)
   - FreeType for font rasterization
   - Similar ligature and Unicode support

4. **Buffer Objects:**
   - Vertex Buffer Objects for glyph positions
   - Texture buffers for screen data
   - Efficient memory management

**Performance:**
- Similar 60fps target as Metal renderer
- GPU-accelerated scaling and effects
- Efficient use of OpenGL features

### Shader System

**Glyph Rendering Pipeline:**
1. **CPU Phase:** Determine which glyphs need rendering
2. **GPU Phase:** 
   - Vertex shader positions glyphs on screen
   - Fragment shader applies glyph texture + color
   - Anti-aliasing and sub-pixel rendering

**Screen Rendering:**
- Background color fills
- Glyph textures overlaid
- Cursor rendering
- Selection highlighting

**Special Effects:**
- Cursor blinking animation
- Smooth scrolling
- Color transitions
- Blur/transparency effects

### Font and Text Rendering

**Font System:**
- Platform-native font discovery (CoreText on macOS, fontconfig on Linux)
- Support for all standard font properties (family, size, weight, style)
- Fallback font chains for missing glyphs
- Ligature support in Metal renderer
- Sub-pixel rendering for smooth appearance

**Glyph Caching:**
- Rasterized glyphs cached as textures
- Lazy rendering (glyphs rendered on first use)
- Efficient texture atlasing
- Memory-constrained atlas management

**Unicode Support:**
- Full Unicode character support
- Combining character sequences
- Emoji support
- RTL language handling

## IO Threading and Performance

### Dedicated IO Thread

Ghostty uses a **dedicated IO thread** for reading and processing terminal input.

**Architecture:**
```
Main Thread          IO Thread
┌─────────┐         ┌─────────┐
│ Render  │         │ Read    │
│ Events  │  ←----→ │ Input   │
│ Updates │         │ Process │
└─────────┘         └─────────┘
    ↓                    ↓
 Display          Terminal State
```

**Benefits:**
1. **Responsiveness:** Rendering never blocks on IO
2. **Jitter Reduction:** IO latency doesn't cause frame drops
3. **Throughput:** Can handle high-speed input streams
4. **Consistency:** Predictable frame timing

**Implementation:**
- Queue-based communication between threads
- Lock-free or minimal-lock data structures
- Synchronization points for state consistency
- Efficient buffering of input data

### Performance Benchmarks

From Ghostty documentation:

**IO Performance:**
- Reading plain text dump 4x faster than iTerm
- Reading plain text dump 2x faster than Terminal.app
- Similar speed to Alacritty (highly optimized Rust terminal)

**Rendering:**
- Maintains 60fps under heavy load
- Minimal overhead during normal use
- Metal/OpenGL rendering ensures GPU acceleration

**Memory:**
- Efficient memory usage through shared buffers
- Configurable scrollback buffer size
- Minimal allocations during rendering loop

## Configuration System

### Configuration Files

**Config Location:**
- `~/.config/ghostty/config` on Linux
- `~/Library/Application Support/com.mitchellh.ghostty/config` on macOS

**Format:** Key-value format similar to X11 resources

**Example:**
```
# Window
window-width = 180
window-height = 50

# Appearance
font-family = "Monaco"
font-size = 12
background = "000000"
foreground = "ffffff"

# Behavior
copy-on-select = true
shell-integration = zsh
```

### Configuration Categories

1. **Appearance:**
   - Fonts (family, size, weight, italic)
   - Colors (foreground, background, palette)
   - Cursor style and color
   - Window decoration

2. **Behavior:**
   - Scrollback size
   - Copy/paste behavior
   - Shell integration
   - Keybindings
   - Mouse behavior

3. **Advanced:**
   - Terminal modes
   - Performance tuning
   - Debug options
   - Platform-specific settings

### Dynamic Reloading

Configuration can be updated while terminal is running:
- Watch file for changes
- Reload on modification
- Apply changes smoothly without restart

## Input Handling

### Keyboard Input

**Processing Pipeline:**
1. OS captures key event
2. Platform layer (AppKit/GTK) converts to input event
3. Ghostty input module processes:
   - Modifier keys (Ctrl, Alt, Cmd/Super, Shift)
   - Character code
   - Repeat count
4. Terminal encodes for shell:
   - Control sequences (CSI sequences)
   - Raw keycodes (for special handling)
   - Paste handling

**Key Features:**
- Keyboard layout awareness
- Global keybinds (especially on macOS)
- Keyboard integration with terminal shell
- Special key encoding (arrows, function keys, etc.)

### Mouse Input

**Mouse Modes:**
- Basic click reporting
- Motion tracking
- Button release tracking
- Wheel scrolling
- Drag and drop

**Implementation:**
- Multiple mouse reporting formats (X11, SGR, URXVT)
- Coordinate conversion from window to terminal cells
- Selection via mouse dragging
- Right-click context menus

## Application Runtime (apprt)

### Purpose

The `apprt` layer abstracts platform-specific windowing and event handling.

**Responsibilities:**
- Window creation and management
- Event loop
- File descriptor management
- Clipboard integration
- Drag and drop
- Platform-specific features

### GTK Implementation

**Components:**
```
GTK Window
    ↓
GTK Drawing Area
    ↓
OpenGL Context
    ↓
[Rendering]
```

**Integration Points:**
- Window event handling (resize, focus, etc.)
- GTK menu system
- System clipboard
- File dialogs

**Features:**
- Multi-window support
- Tabbing
- Splits/panes

### macOS Implementation

**Components:**
```
SwiftUI View Hierarchy
    ↓
Metal View
    ↓
Metal Renderer
    ↓
[GPU Rendering]
```

**Integration Points:**
- AppKit window management
- SwiftUI state management
- Menu bar integration
- System services (printing, pasteboard, etc.)

## Build System

### Zig Build System

Ghostty uses **Zig's built-in build system** (build.zig).

**Build Targets:**
- **Main app:** Full application for current platform
- **libghostty-vt:** Terminal library (can target WebAssembly)
- **Tests:** Unit tests for all modules
- **Benchmarks:** Performance benchmarking tools
- **Distributions:** Source tarball, platform packages

**Configuration:**
- Platform detection
- Dependency management
- Compiler flags
- Asset compilation

**Build Commands:**
```bash
zig build              # Build debug version
zig build -Doptimize=ReleaseFast  # Optimized build
zig build run          # Build and run
zig build test         # Run tests
zig build lib-vt       # Build libghostty-vt
zig build lib-vt -Dtarget=wasm32-freestanding  # WebAssembly
```

### Dependencies

**External:**
- Platform SDKs (Xcode on macOS, GTK on Linux)
- Zig package manager (zig.zon)
- C libraries (fontconfig, freetype on Linux)

**Internal:**
- Shared Zig core
- Platform-specific layers

## Testing

### Test Categories

1. **Unit Tests:** Individual module testing
2. **Integration Tests:** Feature testing
3. **Benchmarks:** Performance testing
4. **UI Tests:** macOS UITests framework

### Test Coverage

- Terminal emulation (sequence parsing, state machine)
- Configuration parsing
- Unicode processing
- Input handling
- Rendering (conceptual tests)

### Running Tests

```bash
zig build test                              # All tests
zig build test -Dtest-filter=terminal     # Filter tests
zig build test-lib-vt                      # libghostty-vt tests
```

## Notable Design Patterns

### 1. Shared Core with Platform UIs

Rather than forcing a least-common-denominator experience:
- Zig core implements all logic
- Platform-specific UI layers use native frameworks (SwiftUI, GTK)
- Minimal code duplication
- Maximum platform integration

### 2. GPU-First Rendering

GPU acceleration isn't an afterthought:
- Native graphics APIs (Metal, OpenGL)
- Shaders for all text rendering
- Efficient texture-based caching
- 60fps as design constraint

### 3. Extracted Libraries

Core functionality extracted as reusable libraries:
- libghostty-vt for terminal parsing
- C-compatible API for language interop
- WebAssembly compilation support

### 4. Standards with Extensions

Terminal behavior defined by precedence:
1. Standards (ECMA-48, VT100, etc.)
2. de facto standards (xterm)
3. Popular modern extensions (Kitty, tmux)

### 5. Clean Module Separation

Clear module boundaries:
- Terminal emulation separate from rendering
- Configuration independent of behavior
- Platform code isolated from core logic
- apprt layer abstracts windowing

## Performance Considerations

### CPU Optimization

1. **Dedicated IO Thread:** Prevents rendering thread stalls
2. **Efficient Parsing:** Minimal allocations during parsing
3. **Batch Rendering:** Combine draw calls to reduce GPU overhead
4. **Caching:** Cache glyphs, font metrics, etc.

### GPU Optimization

1. **Texture Atlasing:** Minimize texture switches
2. **Batch Draw Calls:** Render multiple glyphs per call
3. **Shader Optimization:** Minimal per-pixel operations
4. **Memory Bandwidth:** Efficient texture formats

### Memory Optimization

1. **Configurable Scrollback:** Users can tune memory usage
2. **Efficient Buffers:** Minimal copying
3. **Lazy Loading:** Glyphs rendered on demand
4. **Pooling:** Reuse allocations

## Comparison with Competitors

### vs. iTerm2

**Ghostty Advantages:**
- Modern rendering (Metal specifically designed vs. legacy OpenGL)
- Ligature support in GPU renderer
- Cross-platform (iTerm is macOS only)
- Open source

**iTerm Advantages:**
- More mature feature set
- Larger user base and ecosystem
- Longer history and stability

### vs. Alacritty

**Ghostty Advantages:**
- Native UIs (SwiftUI, GTK vs. minimal Rust UI)
- Cross-platform preference panels
- Richer feature set

**Alacritty Advantages:**
- Simpler, more minimal design
- Potentially smaller memory footprint
- Rust's memory safety

### vs. Kitty

**Ghostty Advantages:**
- Native platform experiences
- Simpler configuration
- Cross-platform consistency

**Kitty Advantages:**
- Graphics protocol more mature
- Larger community
- Longer development history

## Future Directions

### Planned Work

**From Roadmap:**
1. ✅ Standards-compliant terminal emulation
2. ✅ Competitive performance
3. ✅ Basic customizability
4. ✅ Richer windowing features (tabs, panes)
5. ⚠️ Native platform experiences (settings panels, etc.)
6. ⚠️ Cross-platform libghostty library
7. ❌ Windows support (not yet started)
8. ❌ Fancy features (future)

### Potential Enhancements

- Windows terminal (using native Windows APIs)
- More comprehensive libghostty documentation
- Extended plugin/script system
- AI-assisted terminal workflows
- Advanced debugging tools

## Conclusion

Ghostty's architecture represents a thoughtful approach to terminal emulation:

1. **Performance-First:** GPU rendering and dedicated IO thread are core, not afterthoughts
2. **Native-First:** Respects platform conventions rather than imposing uniformity
3. **Standards-Focused:** Built on proven terminal standards with modern extensions
4. **Extraction-Friendly:** libghostty library enables ecosystem expansion
5. **Modern Tooling:** Zig provides memory safety without runtime overhead

The codebase demonstrates excellent software engineering with clear module boundaries, comprehensive testing, and thoughtful API design. It's a strong example of how to build cross-platform applications while respecting each platform's unique characteristics.

---

**Analysis Date:** January 28, 2026
**Analyzer:** Research team
**Status:** Complete
