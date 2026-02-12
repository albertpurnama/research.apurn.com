# WebMCP Technical Research

## Overview

WebMCP is a proposed web standard from Chrome that allows websites to expose structured tools for AI agents. It provides two APIs:
1. **Declarative API** - Actions defined directly in HTML forms
2. **Imperative API** - Complex interactions via JavaScript

## The Problem

Current AI agents interact with websites by:
- Parsing DOM elements
- Guessing button locations and form fields
- Using vision models to understand layouts
- Clicking and typing like a human would

This is slow, brittle, and error-prone. A small UI change can break an agent workflow.

## The Solution

WebMCP flips the model: instead of agents figuring out your site, **you tell agents what they can do**.

```
Traditional: Agent → scrapes DOM → guesses actions → hopes it works
WebMCP:      Agent → reads WebMCP manifest → calls structured tools → reliable execution
```

---

## How to Try It (Developer Guide)

### Step 1: Join the Early Preview Program

WebMCP is currently restricted to EPP members.

1. Go to: https://developer.chrome.com/docs/ai/join-epp
2. Sign up with your Google account
3. Wait for approval (usually 1-2 weeks)

### Step 2: Get Chrome Canary

EPP features typically require Chrome Canary or Dev channel:

```bash
# macOS - Download Chrome Canary
open https://www.google.com/chrome/canary/

# Or via Homebrew
brew install --cask google-chrome-canary
```

### Step 3: Enable the Flag (Speculative)

Once in EPP, you'll likely need to enable a flag:

```
chrome://flags/#enable-webmcp
```

*Note: Exact flag name TBD - will be in EPP documentation*

### Step 4: Implement WebMCP on Your Site

Based on the announcement, WebMCP has two implementation paths:

#### Declarative API (HTML Forms)

For standard actions that map to forms:

```html
<!-- Speculative syntax based on announcement -->
<form webmcp-action="book-flight">
  <input name="origin" webmcp-param="departure_city" />
  <input name="destination" webmcp-param="arrival_city" />
  <input type="date" name="date" webmcp-param="travel_date" />
  <button type="submit">Search Flights</button>
</form>
```

#### Imperative API (JavaScript)

For complex, dynamic interactions:

```javascript
// Speculative API based on announcement
navigator.webmcp.registerTool({
  name: "search-flights",
  description: "Search for available flights",
  parameters: {
    origin: { type: "string", description: "Departure city code" },
    destination: { type: "string", description: "Arrival city code" },
    date: { type: "date", description: "Travel date" }
  },
  handler: async (params) => {
    // Your existing search logic
    const results = await searchFlights(params);
    return { flights: results };
  }
});
```

---

## Use Cases (from Chrome Blog)

| Use Case | How WebMCP Helps |
|----------|------------------|
| **Customer Support** | Agent fills support tickets with technical details automatically |
| **E-commerce** | Agent searches products, configures options, navigates checkout |
| **Travel** | Agent searches flights, filters results, handles bookings |

---

## Architecture (Speculative)

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   AI Agent      │────▶│   Chrome/Browser │────▶│   Your Website  │
│  (Claude, etc)  │     │   WebMCP Runtime │     │   WebMCP Tools  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                              │
                              ▼
                        ┌──────────────────┐
                        │  Tool Discovery  │
                        │  - Manifest file │
                        │  - DOM scanning  │
                        │  - JS registry   │
                        └──────────────────┘
```

### Flow

1. Agent requests available tools from WebMCP runtime
2. Browser discovers tools via manifest/DOM/JS registry
3. Agent calls tool with structured parameters
4. Browser executes tool (fills form, runs JS handler)
5. Result returned to agent

---

## Comparison with Existing Approaches

| Approach | Pros | Cons |
|----------|------|------|
| **DOM Scraping** | Works everywhere | Brittle, slow, unreliable |
| **Vision Models** | Handles any UI | Expensive, still guesses |
| **Browser APIs** | Structured | Only for browser features |
| **Website APIs** | Fast, reliable | Requires building separate API |
| **WebMCP** | Structured + works with existing UI | New standard, limited support |

---

## Open Questions

- [ ] What's the exact manifest format?
- [ ] How does tool discovery work?
- [ ] Can tools require user confirmation?
- [ ] How does it handle authentication?
- [ ] What about cross-origin tools?
- [ ] Will other browsers adopt this?

---

## Next Steps

1. **Join EPP** - https://developer.chrome.com/docs/ai/join-epp
2. **Watch for docs** - Chrome will release detailed API docs to EPP members
3. **Prototype** - Once in EPP, build a simple demo
4. **Provide feedback** - Shape the standard before it's finalized

---

## Related Technologies

- **MCP (Model Context Protocol)** - Anthropic's protocol for AI ↔ tools. WebMCP appears to be the browser-native equivalent.
- **Chrome Built-in AI** - Gemini Nano in the browser (Writer, Rewriter, Translator APIs)
- **Browser Use / Puppeteer** - Current agent approaches for web automation

---

*Last updated: 2026-02-12*
