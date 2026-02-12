# WebMCP Research

WebMCP is a Chrome initiative (announced Feb 10, 2026) that provides a standard way for websites to expose structured tools to AI agents. Instead of agents scraping the DOM and guessing how to interact with your site, WebMCP lets you define explicit actions agents can take - like booking flights, filing support tickets, or navigating checkout flows.

Think of it as making your website "agent-ready" with a clear contract for what AI agents can do.

---

## Research Files

| File | Description |
|------|-------------|
| [RESEARCH.md](./RESEARCH.md) | Start here. Architecture overview + how to try it |
| [CLAUDE.md](./CLAUDE.md) | Source links and references |

---

## Key Insight

WebMCP bridges the gap between "AI agents clicking around websites" and "AI agents calling structured APIs". It's the middle ground - you keep your existing website but add a machine-readable layer that tells agents exactly how to interact with it.

**Two APIs:**
1. **Declarative API** - Define actions in HTML forms (simple, static)
2. **Imperative API** - Handle complex interactions via JavaScript (dynamic)

---

## Status

🔒 **Early Preview Program** - Not publicly available yet. Need to join Chrome's EPP to access docs and demos.

**Sign up:** https://developer.chrome.com/docs/ai/join-epp
