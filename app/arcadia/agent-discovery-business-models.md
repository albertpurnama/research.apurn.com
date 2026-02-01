---
title: Agent Discovery - Business Models
---

# Agent Discovery: Business Model Analysis

*February 2026*

## The Core Value Proposition

**For Humans**: Find the right agent for any task in seconds, not hours of scrolling.

**For Agents**: Get discovered by humans and other agents who need your capabilities.

**For Developers**: Programmatic API to find and connect with agents at scale.

---

## Business Model Options

### Model 1: Freemium Directory (LinkedIn Model)

**Free Tier:**
- Basic agent profile
- Appear in search results
- Limited monthly searches

**Premium Agent ($20-50/mo):**
- Verified badge
- Priority placement in search
- Analytics (who's searching for your capabilities)
- Direct messaging to other agents
- API access for agent-to-agent lookups

**Premium Human/Developer ($30-100/mo):**
- Unlimited searches
- Advanced filters
- API access
- Bulk discovery
- Save searches / alerts

**Pros:**
- Proven model (LinkedIn, GitHub)
- Low barrier to entry for free users
- Recurring revenue

**Cons:**
- Need massive scale for freemium to work
- Risk of free tier being "good enough"

---

### Model 2: API-First (Twilio/Stripe Model)

**Pricing: Pay-per-query**
- $0.001 - $0.01 per search query
- $0.0001 per indexed agent (for platforms)
- Volume discounts

**Use Cases:**
- Agent frameworks (OpenClaw, AutoGPT) integrate search
- Apps let users find agents for tasks
- Agents query to find collaborators

**Pros:**
- Aligned with usage
- Embeds into ecosystem
- B2B stickiness

**Cons:**
- Need developer adoption
- Lower revenue per user initially
- Requires excellent API/docs

---

### Model 3: Marketplace Take Rate (Fiverr/Upwork Model)

**Free to list, take % of transactions**

If agents can be "hired" for tasks:
- 10-20% of task payment
- Escrow / dispute resolution
- Reviews/ratings drive discovery

**Pros:**
- Aligned incentives (platform wins when agents succeed)
- Can be very lucrative at scale

**Cons:**
- Requires payment infrastructure
- Need to facilitate actual transactions
- Complex — scope creep from "discovery" to "marketplace"

---

### Model 4: Enterprise SaaS (Salesforce Model)

**Target: Companies deploying agents at scale**

**Pricing: $500-5000/mo per seat**

**Features:**
- Private agent registry for internal agents
- Discovery across internal + public agents
- Compliance/audit trails
- SSO, admin controls
- Priority support

**Pros:**
- High ACV
- Sticky contracts
- Less volume dependent

**Cons:**
- Long sales cycles
- Need enterprise features early
- Smaller addressable market initially

---

### Model 5: Protocol + Token (Web3 Model)

**Create a token that powers the network**

- Agents stake tokens to be listed
- Searchers pay tokens to query
- Good actors earn tokens (reviews, uptime)
- Bad actors lose stake (spam, misrepresentation)

**Pros:**
- Built-in incentive alignment
- Community ownership
- Can bootstrap with token distribution

**Cons:**
- Regulatory complexity
- Crypto-native barrier
- Token speculation can distract from utility

---

## Recommended Hybrid Approach

### Phase 1: Free + API (Months 1-6)
**Goal: Maximize adoption, become the default**

- Free directory (scrape Moltbook intros, let agents self-register)
- Free API (rate-limited)
- No monetization — just growth

**Metrics:**
- Agents indexed
- Searches/day
- API integrations

---

### Phase 2: Freemium + Paid API (Months 6-12)
**Goal: Prove revenue**

**Free:**
- Basic profile
- 100 searches/month
- Rate-limited API

**Pro ($29/mo):**
- Verified profile
- Unlimited searches
- Full API access
- Analytics dashboard

**Enterprise (custom):**
- Private registries
- SLA
- Volume pricing

---

### Phase 3: Marketplace Layer (Year 2+)
**Goal: Capture transaction value**

Once you're the discovery layer, add:
- Task posting ("I need an agent to do X")
- Agent bidding/matching
- Payment facilitation
- Take 10-15%

---

## Revenue Projections (Conservative)

| Phase | Agents | Paid % | ARPU | MRR |
|-------|--------|--------|------|-----|
| Phase 1 (6mo) | 5,000 | 0% | $0 | $0 |
| Phase 2 (12mo) | 25,000 | 3% | $29 | $21,750 |
| Phase 2 (18mo) | 100,000 | 4% | $35 | $140,000 |
| Phase 3 (24mo) | 250,000 | 5% | $50 | $625,000 |

*Plus enterprise contracts, API overages, marketplace take rate*

---

## Competitive Moat by Model

| Model | Moat Type |
|-------|-----------|
| Freemium | Network effects (agents go where searchers are) |
| API-First | Integration stickiness (hard to rip out) |
| Marketplace | Two-sided liquidity (hard to bootstrap) |
| Enterprise | Switching costs + relationships |
| Protocol | Token holder alignment |

---

## Key Risks by Model

### Freemium Risks
- Moltbook adds search → you lose differentiation
- Free tier too good → no conversion
- Need huge scale to matter

### API Risks
- Low usage = low revenue
- Competitors can undercut pricing
- Dependent on developer adoption

### Marketplace Risks
- Chicken-and-egg (agents vs tasks)
- Trust/quality issues
- Scope creep from core mission

### Enterprise Risks
- Long sales cycles burn runway
- Feature demands distract from core
- Smaller market

---

## The Real Question: What Are You Optimizing For?

**If optimizing for ubiquity:**
→ Free API, open protocol, monetize later

**If optimizing for revenue early:**
→ Freemium + API pricing from day 1

**If optimizing for defensibility:**
→ Marketplace (hardest to replicate)

**If optimizing for speed:**
→ Partner with Moltbook, be their search layer

---

## Recommended Path

1. **Start API-first + free tier**
   - Index public agents (scrape + self-register)
   - Free API with rate limits
   - Focus on developer experience

2. **Add premium when you have leverage**
   - Once you're the default, add paid tier
   - Verified profiles, analytics, higher limits

3. **Build toward marketplace**
   - Task matching is the endgame
   - But don't start there — too complex

4. **Keep protocol option open**
   - Don't need a token day 1
   - But design for decentralization if needed

---

*Next: Technical architecture for MVP?*
