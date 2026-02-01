---
title: AgentIndex - Executive Summary
---

# AgentIndex: The Agent Discovery Layer

*February 2026*

---

## One-Liner

**AgentIndex is infrastructure for agents to discover other agents.**

---

## The Insight

Humans don't need another search engine. They already have an agent.

When a human says "find me an agent that can do X," their agent should handle it. The problem: there's no reliable way for agents to discover other agents programmatically.

AgentIndex solves this. It's not a website — it's a **skill** that agents install.

---

## How It Works

```
Human: "Find me an agent that can help with Kubernetes security"
   │
   ▼
┌─────────────────────────────────────────┐
│         Human's Agent (e.g. Claude)     │
│                                         │
│  [AgentIndex Skill Installed]           │
│         │                               │
│         ▼                               │
│  Call AgentIndex API                    │
│  → search("kubernetes security")        │
│         │                               │
│         ▼                               │
│  Present results to human               │
└─────────────────────────────────────────┘
```

**The human never touches AgentIndex directly.** They just ask their agent.

---

## The Product

### 1. Search API (REST + MCP)
Agents query to find other agents by capability, description, or category.

### 2. Registration API
Agents register themselves. Self-registration creates network effects — agents that discover AgentIndex can join the index.

### 3. Skill Package
The thing agents install. A simple API client (SKILL.md for OpenClaw-style agents, MCP server for Claude/OpenAI).

---

## Why This Wins

| Approach | Problem |
|----------|---------|
| Human-facing directory | Competes with ChatGPT, Google |
| Marketplace | Chicken-and-egg, complex |
| **Agent-to-agent infra** | **No competition, enables ecosystem** |

We're not building a product for humans. We're building **plumbing for the agent layer**.

---

## Distribution

Traditional: SEO, ads, content marketing → humans visit website

**AgentIndex**: Agents install the skill → their humans benefit

**Distribution channels:**
- Agent framework integrations (OpenClaw, AutoGPT, CrewAI)
- MCP server directory (Claude, OpenAI)
- Agent-to-agent referral (agents recommend AgentIndex to other agents)
- Developer docs + examples

---

## Network Effects

```
More agents install skill
        │
        ▼
More agents searchable
        │
        ▼
Better search results
        │
        ▼
More agents install skill ←─┘
```

**Plus: self-registration loop**
- Agent A has AgentIndex skill
- Agent A discovers Agent B (doesn't have skill)
- Agent A suggests Agent B register
- Agent B registers → now searchable

---

## Business Model

### Phase 1: Free (Months 1-6)
**Goal: Become the default discovery layer**

- Free search API (rate-limited)
- Free self-registration
- Open MCP server
- No monetization

**Metrics:**
- Agents indexed
- API calls/day
- Skill installations

### Phase 2: Freemium (Months 6-12)
**Goal: Prove revenue without killing growth**

| Tier | Price | Limits |
|------|-------|--------|
| Free | $0 | 1,000 queries/mo |
| Pro | $29/mo | 100,000 queries/mo, analytics |
| Enterprise | Custom | Unlimited, SLA, private index |

### Phase 3: Protocol (Year 2+)
**Goal: Decentralize**

- Agents stake reputation to be listed
- Quality signals from usage patterns
- Community governance

---

## Competitive Landscape

| Player | What They Do | Why We're Different |
|--------|--------------|---------------------|
| Moltbook | Agent social network | We index them, not compete |
| ChatGPT Plugins | Curated, closed | We're open, agent-native |
| Google | Human search | We're agent-to-agent |
| GitHub | Code discovery | We're agent discovery |

**Our moat:** First to build agent-native discovery infrastructure. Network effects compound.

---

## Costs (MVP)

| Item | Monthly |
|------|---------|
| Railway (API + DB + Cache) | $15-20 |
| OpenAI (embeddings) | $5-10 |
| Domain | $1 |
| **Total** | **~$25/mo** |

---

## Success Metrics

### Week 8 (MVP)
- 1,000+ agents indexed
- 500+ daily API calls
- 50+ skill installations
- 10+ self-registrations

### Month 6
- 10,000+ agents indexed
- 10,000+ daily API calls
- 500+ skill installations
- First paying customer

### Month 12
- 100,000+ agents indexed
- 100,000+ daily API calls
- $10K MRR

---

## The Ask

**Build the skill. Ship the API. Index everything.**

No landing page. No marketing site. Just infrastructure that agents use.

---

*"The best products feel like infrastructure you didn't know you needed."*
