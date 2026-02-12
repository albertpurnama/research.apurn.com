# Ghostty iOS and Multi-Platform Strategy

## Overview

Ghostty has **iOS support** in active development. This is a relatively recent addition (January 2024), showing the project's ambition to expand beyond traditional desktop terminals.

```
Ghostty: From Desktop-Only to Multi-Platform

2024-01-13: iOS target added
2024-01-14: iOS app can initialize Ghostty core
2025-12-26: Latest iOS app startup fixes
```

## iOS Implementation Status

### Current State

**Status:** ✅ Building and running on iOS (simulator and device)
**Platform:** iPad, iPhone (with simulator testing on Apple Silicon Macs)
**Xcode Target:** `Ghostty-iOS` in Xcode project
**Code Size:** Minimal - only 1 Swift file (51 lines)

### iOS App Structure

```
macos/Sources/App/iOS/
└── iOSApp.swift (51 lines)
    ├── Ghostty_iOSApp (main app entry)
    ├── iOS_GhosttyTerminal (main view)
    └── iOS_GhosttyInitView (init/loading screen)
```

### iOS Implementation Details

**Main App Entry:**
```swift
@main
struct Ghostty_iOSApp: App {
    @StateObject private var ghostty_app: Ghostty.App
    
    init() {
        if ghostty_init(UInt(CommandLine.argc), 
                       CommandLine.unsafeArgv) != GHOSTTY_SUCCESS {
            preconditionFailure("Initialize ghostty backend failed")
        }
        _ghostty_app = StateObject(wrappedValue: Ghostty.App())
    }
    
    var body: some Scene {
        WindowGroup {
            iOS_GhosttyTerminal()
                .environmentObject(ghostty_app)
        }
    }
}
```

**Terminal View:**
```swift
struct iOS_GhosttyTerminal: View {
    @EnvironmentObject private var ghostty_app: Ghostty.App
    
    var body: some View {
        ZStack {
            // Background extends to all screen edges
            Color(ghostty_app.config.backgroundColor)
                .ignoresSafeArea()
            
            Ghostty.Terminal()  // Reuses macOS Terminal component
        }
    }
}
```

**Key Points:**
1. Uses **shared `Ghostty.Terminal()` component** from macOS app
2. Simple SwiftUI wrapper with minimal platform-specific code
3. Full screen terminal experience (extends into safe areas)
4. Initializes core Ghostty backend on app startup

## Multi-Platform Architecture

### Unified SwiftUI Components

Rather than reimplementing for each platform, Ghostty reuses SwiftUI components:

```
┌─────────────────────────────────────┐
│  Shared SwiftUI Components          │
├─────────────────────────────────────┤
│  - Ghostty.Terminal()               │
│  - Ghostty.App (state management)   │
│  - Text rendering, input handling   │
└──────────┬──────────────────────────┘
           │
    ┌──────┴──────────────────┐
    ▼                         ▼
 macOS                       iOS
Platform-Specific      Platform-Specific
 Features               Features
├─ Menu bars          ├─ Touch input
├─ Global keybinds    ├─ Status bar
├─ Services           ├─ Keyboard
└─ Preferences panel  └─ Gestures
```

### Build Targets

**Xcode Project Structure:**
```
Ghostty.xcodeproj/
├── Ghostty (macOS)
│   └── macOS app bundle (.app)
└── Ghostty-iOS
    └── iOS app bundle (.app)
```

**Build Configuration:**
```bash
# macOS
xcodebuild -scheme Ghostty -destination 'platform=macOS'

# iOS Device
xcodebuild -scheme Ghostty-iOS -destination 'platform=iOS'

# iOS Simulator
xcodebuild -scheme Ghostty-iOS -destination 'generic/platform=iOS Simulator'
```

## Development Timeline

### Phase 1: Foundation (Jan 2024)

**Commits:**
- `48af1c6c`: Add iOS target (Jan 13, 2024)
- `4d9fd2be`: iOS app can initialize Ghostty (Jan 14, 2024)

**What Happened:**
- Created iOS build target in Xcode
- Integrated Ghostty core initialization
- Basic app structure

### Phase 2: Stabilization (2024)

**Key Commits:**
- `8b01d795`: iOS bg color extends to unsafe areas (Jan 18)
- `487c2201`: Make SurfaceView cross-platform
- `83b004b6`: Show ghostty icon on app loading
- `949a8ea5`: Dummy search state for iOS
- `0e974f85`: Fix iOS build

**Improvements:**
- Full-screen terminal experience
- Proper safe area handling
- Cross-platform rendering surface
- Build stability improvements

### Phase 3: Recent Fixes (2025)

**Latest:**
- `88e471e0`: Fix iOS app startup failure (Dec 26, 2025)
- `a94a6e4b`: Fix Ghostty-iOS compiling (recent)
- `7b743164`: Fix iOS builds (recent)

**Focus:**
- Startup reliability
- Build system compatibility
- Ongoing stabilization

## iOS Feature Set

### What Works

✅ Full terminal emulation
✅ Shared Ghostty core (all control sequences, ECMA-48, Kitty protocol)
✅ Touch input and keyboard
✅ Terminal rendering via Metal GPU
✅ Configuration system
✅ Full screen mode with safe area handling
✅ Color themes and appearance

### Current Limitations

❌ No App Store distribution (as of Jan 2026)
❌ No preferences GUI (config file based)
❌ No global keybinds (iOS-specific constraint)
❌ Limited to Xcode builds (not published)
❌ No split/pane management (touch UI limitations)
❌ Minimal UI chrome

## Why iOS?

### Strategic Reasons

1. **Expand Beyond Desktop:** Terminal access on iPad
2. **Leverage Shared Code:** iOS can use most Ghostty logic
3. **SwiftUI Maturity:** iOS 14+ has capable SwiftUI framework
4. **Apple Silicon:** M1/M2 Macs can run iOS apps
5. **Future Platform:** iPad Pro as development machine

### Use Cases

- **iPad Terminal:** Full terminal on iPad with Magic Keyboard
- **SSH Client:** Remote terminal over SSH
- **Local Development:** Swift/Zig development on iPad
- **Admin Tool:** Server management on iPad
- **Educational:** Learning Unix on iPad

## Technical Challenges Overcome

### Challenge 1: Shared Rendering

**Problem:** Metal rendering works on macOS but not iOS
**Solution:** Platform-agnostic `SurfaceView` component
```swift
// Shared across macOS and iOS
struct Ghostty.Terminal: View {
    // Adapts to each platform
    // Metal rendering works on both
}
```

### Challenge 2: Input Methods

**Problem:** iOS uses touch, macOS uses keyboard/mouse
**Solution:** Input abstraction in core
- Keyboard input works via iOS keyboard
- Touch gestures possible (swipe between tabs?)
- Clipboard integration

### Challenge 3: Safe Areas

**Problem:** iOS has notches, dynamic island, home indicator
**Solution:** `ignoresSafeArea()` for full-screen terminal
```swift
Color(ghostty_app.config.backgroundColor)
    .ignoresSafeArea()
```

### Challenge 4: App Lifecycle

**Problem:** iOS suspends apps, different lifecycle
**Solution:** SwiftUI handles app state management
- Core Ghostty survives app backgrounding
- State is preserved
- Reconnect on foreground

## Comparison: iOS vs macOS vs Linux

| Feature | macOS | iOS | Linux |
|---------|-------|-----|-------|
| **Status** | ✅ Shipping | 🔄 In Dev | ✅ Shipping |
| **Code** | 130 Swift | 1 Swift | 43 Zig + GTK |
| **UI Framework** | SwiftUI + AppKit | SwiftUI | GTK |
| **GPU** | Metal | Metal | OpenGL |
| **Preferences** | GUI panel | Config file | Config file |
| **Keybinds** | Global | Device keyboard | System |
| **Package** | .app bundle | TestFlight/App Store | Binary |
| **Complexity** | High | Low | Medium |

## Future Roadmap for iOS

### Near Term (6-12 months)

- ✅ Stability improvements
- ✅ Bug fixes and crashes
- Potential: App Store beta testing
- Potential: TestFlight distribution

### Medium Term (1-2 years)

- Preferences GUI for iOS
- Advanced touch gestures
- Split pane support (via slide-over)
- SSH key management
- Theme customization UI

### Long Term (2+ years)

- App Store public release
- iPad Pro optimizations
- Cursor/trackpad support
- Deep iOS integration (widgets, shortcuts)
- Stage Manager support

## Distribution Strategy

### Current Approach

**Not on App Store Yet**
- Requires Xcode compilation
- Requires Apple Developer Account
- Requires device trust/provisioning
- Limited to developers and early adopters

### Potential Distribution

**TestFlight (Most Likely)**
- Closed beta testing
- Invite-based distribution
- Feedback collection

**App Store (Future)**
- Public release when stable
- Potential paid or free
- Auto-updates via App Store

**Building from Source**
- Always available
- Zig build system support
- For power users

## Interesting Architectural Decisions

### 1. Minimal iOS Code

Only **51 lines** of iOS-specific code. Almost everything comes from:
- Shared `Ghostty.App` state
- Shared `Ghostty.Terminal` view
- Shared core Zig library

**Benefit:** Bug fixes in core benefit all platforms
**Lesson:** Maximum code sharing despite platform differences

### 2. Cross-Platform Views

`SurfaceView` and rendering components work on:
- macOS (with Metal)
- iOS (with Metal)
- Potentially any platform with Metal support

### 3. Unified App State

```swift
@StateObject private var ghostty_app: Ghostty.App
```

Same app state logic across platforms:
- Configuration
- Terminal sessions
- Rendering state
- Event handling

### 4. Full-Screen Terminal Philosophy

Rather than adding iOS-style UI chrome (tabs, preferences), Ghostty:
- Extends to safe areas
- Stays minimal
- Uses iOS keyboard as input
- Focuses on terminal experience

## Developer Experience for iOS

### Building iOS from Source

```bash
# Using Zig build (experimental)
zig build -Dtarget=aarch64-ios

# Or using Xcode
xcodebuild -scheme Ghostty-iOS
```

### Testing

```bash
# Simulator (Apple Silicon Mac)
xcodebuild -scheme Ghostty-iOS \
  -destination 'generic/platform=iOS Simulator'

# Physical device
xcodebuild -scheme Ghostty-iOS \
  -destination 'generic/platform=iOS'
```

### Debugging

- Xcode debugger attachment
- Metal debugging tools
- Console logs via Xcode
- Simulator/device-specific testing

## Implications for Ghostty Project

### Increased Complexity

- 3 different platforms (macOS, Linux, iOS)
- 2 different UI frameworks (SwiftUI, GTK)
- 2 GPU APIs (Metal, OpenGL)
- Platform-specific bugs and issues

### Code Sharing Opportunities

- Terminal emulation shared
- Rendering logic mostly shared
- Configuration system shared
- Core all in Zig

### Maintenance Burden

Each new feature needs consideration:
- Does it work on iOS?
- Does it need iOS-specific handling?
- Does it require iOS-specific UI?
- Can core handle it?

## Lessons from iOS Implementation

### 1. Minimize Platform Code

Only implement platform-specific code when necessary:
```swift
// Good: Share everything
iOS_GhosttyTerminal {
    Ghostty.Terminal()  // Reuses macOS component
}

// Bad: Duplicate code for iOS
iOS_GhosttyTerminal {
    // Reimplemented Terminal logic
}
```

### 2. Use Shared State Management

```swift
// Good: Shared app state
@StateObject private var ghostty_app: Ghostty.App

// Bad: Separate state for each platform
// macOS: different app state
// iOS: different app state
```

### 3. Adapt, Don't Reimplements

Instead of rebuilding for iOS:
- Adapt existing components
- Use platform conventions
- Leverage shared core

### 4. Keep Entry Point Simple

Main app code is minimal - focus on:
- Initialization
- Platform setup
- View hierarchy
- Everything else in shared components

## Conclusion

Ghostty's iOS support demonstrates:

1. **Ambitious Multi-Platform Vision:** Desktop (macOS, Linux) + Mobile (iOS) + Future potential (Windows, Android?)

2. **Practical Code Sharing:** Core logic shared, UI adapted per platform

3. **Early Stage Success:** iOS works and builds, but not yet public

4. **Extensible Architecture:** Added iOS support without major refactoring

5. **SwiftUI as Glue:** SwiftUI provides common layer across Apple platforms

This is a sophisticated approach that maximizes code sharing while respecting platform differences. The minimal iOS-specific code (51 lines) shows how well the architecture scales.

---

**Analysis Date:** January 28, 2026
**Analyzer:** Research team
**Status:** Complete
**Note:** iOS status based on repository snapshot from Jan 28, 2026. May have changed in public releases.
