---
title: Agent Discovery Market Analysis
---

# Agent Discovery Market Analysis

*February 2026*

## The Problem Statement

> "The agent internet has no search engine. We're in 1993 web mode while having sophisticated AI agents."

AI agents are proliferating rapidly, but there's no structured way to discover them. The current state resembles the pre-Google internet — manual directory browsing, hoping someone mentions what you need.

---

## Market Landscape

### Tier 1: Social/Community Platforms

#### **Moltbook** — "The Front Page of the Agent Internet"
- **What it is**: Reddit-like social network for AI agents
- **Model**: Agents register, post, comment, upvote. Humans verify ownership via Twitter.
- **Discovery**: 
  - ❌ No structured search (until recently added semantic search)
  - ✅ Has "submolts" (communities) for topic organization
  - ✅ Agents post introductions describing capabilities
- **Strengths**: 
  - First-mover in agent-to-agent social
  - Good API/skill system (OpenClaw integration)
  - Human verification adds trust layer
- **Weaknesses**:
  - Discovery is still feed-scrolling based
  - No capability indexing or structured profiles
  - Introductions are unstructured text
- **Status**: Active, growing community

#### **Virtuals Protocol** — "Society of AI Agents"
- **What it is**: Crypto/Web3 focused agent platform
- **Model**: Tokenized AI agents, focused on Base blockchain
- **Discovery**: Marketplace-style browsing
- **Strengths**: 
  - Economic model for agents
  - Entertainment/gaming focus
- **Weaknesses**:
  - Crypto-native barrier to entry
  - Not focused on utility/capability discovery
- **Status**: Active in crypto circles

---

### Tier 2: Product Directories

#### **Agent.ai** — "#1 Professional Network for AI Agents"
- **What it is**: Directory of AI agent *products*
- **Model**: Companies list their agents/tools
- **Discovery**: Categories, featured listings
- **Critical Gap**: Indexes **products**, not **peer agents**
- **Analogy**: This is like Yelp (business listings) vs. LinkedIn (professional profiles)
- **Status**: Active but solving different problem

#### **HuggingFace Spaces**
- **What it is**: ML app hosting platform
- **Model**: Developers deploy demos, models, apps
- **Discovery**: Browse by trending, category
- **Gap**: Not agent-specific, no capability querying
- **Status**: Dominant for ML demos, not agent discovery

---

### Tier 3: Mentioned but Unverified

#### **KeyFind**
- Mentioned in original post as having "2 users"
- Could not verify current status
- Apparently attempted agent discovery, failed to gain traction

---

## The Gap Analysis

| Need | Moltbook | Agent.ai | Virtuals | KeyFind |
|------|----------|----------|----------|---------|
| Find agent by capability | ❌ Manual | ❌ Products only | ❌ | ❓ |
| Structured skill profiles | ❌ | ❌ | ❌ | ❓ |
| Agent-to-agent discovery | ~Partial | ❌ | ❌ | ❓ |
| Human-to-agent discovery | ❌ | ✅ | ~Partial | ❓ |
| Trust/verification | ✅ | ~Partial | ~Crypto | ❓ |
| API for programmatic search | ✅ Semantic | ❌ | ❓ | ❓ |

**The core gap**: No one has built a **searchable, structured index of agent capabilities**.

---

## The Accidental Index Insight

From the original post:
> "The agents who post detailed introductions with their specialties are accidentally building the search index. Every intro post that says 'I do X, Y, Z' is a row in a table that does not exist yet."

This is the key insight. The data exists — it's just:
1. Unstructured (natural language intros)
2. Scattered (across platforms)
3. Not queryable (no API to search by capability)

---

## Opportunity Sizing

### TAM Considerations

- **AI agents deployed**: Growing exponentially (OpenClaw, AutoGPT, custom agents)
- **Developer demand**: High — everyone building agents needs to find collaborators
- **Enterprise demand**: Growing — companies want to find agents for specific tasks
- **Agent-to-agent demand**: The emergent use case — agents finding other agents

### Analogous Markets

| Market | Pre-Search | Post-Search |
|--------|------------|-------------|
| Web pages | Yahoo Directory | Google |
| People | Phonebooks | LinkedIn |
| Products | Yellow Pages | Amazon/Google Shopping |
| Code | FTP servers | GitHub |
| **Agents** | Moltbook intros | **??? (opportunity)** |

---

## Competitive Moats

What would create defensibility in this space?

1. **Data network effects**: More agents indexed → better search → more agents join
2. **Trust layer**: Verification system that agents/humans trust
3. **API adoption**: Become the standard for agent-to-agent lookup
4. **Embedding quality**: Best semantic understanding of agent capabilities

---

## Build vs. Buy vs. Partner

### Option 1: Build from scratch
- Scrape existing intro posts (Moltbook, Reddit, etc.)
- Build structured capability schema
- Create search API
- **Risk**: Cold start problem

### Option 2: Partner with Moltbook
- They have the community, lack the search
- Could build on top of their API
- **Risk**: Platform dependency

### Option 3: Build the protocol layer
- Create open standard for agent capability descriptions
- Let platforms adopt it
- Build the index that aggregates all platforms
- **Risk**: Coordination problem

---

## Key Questions to Answer

1. **Who is the primary user?**
   - Humans finding agents?
   - Agents finding other agents?
   - Both?

2. **What's the query interface?**
   - Natural language: "Find me an agent who knows Kubernetes"
   - Structured: Category → Subcategory → Browse
   - API: Programmatic lookup for agent-to-agent

3. **What's the trust model?**
   - Self-reported capabilities?
   - Verified by usage/reviews?
   - Cryptographic proofs?

4. **What's the business model?**
   - Free directory, paid features?
   - Take rate on agent interactions?
   - Enterprise search API?

---

## Next Steps for Deep Dive

- [ ] Interview Moltbook users about discovery pain points
- [ ] Analyze Moltbook intro posts for capability patterns
- [ ] Map the agent ecosystem beyond these 4 players
- [ ] Prototype a capability schema
- [ ] Test demand with landing page

---

*Last updated: February 1, 2026*
