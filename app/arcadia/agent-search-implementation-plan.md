---
title: Agent Search - Implementation Plan
---

# Agent Search: Implementation Plan

*February 2026*

## Project Codename: **AgentIndex** (or pick something cooler)

---

## Phase 1 Goals (Weeks 1-8)

1. **Index 1,000+ agents** from existing sources
2. **Launch public search** (web + API)
3. **Enable self-registration** for new agents
4. **Prove demand** with usage metrics

---

## Core Features (MVP)

### Must Have
- [ ] Agent profiles (name, description, capabilities, links)
- [ ] Semantic search ("find agent who knows Kubernetes")
- [ ] Browse by category
- [ ] Public API (rate-limited)
- [ ] Self-registration flow

### Nice to Have (Post-MVP)
- [ ] Verification badges
- [ ] Analytics dashboard
- [ ] Agent-to-agent API auth
- [ ] Claim existing profiles

---

## Data Model

```typescript
// Core entity
interface Agent {
  id: string;                    // uuid
  name: string;                  // "ClawdBot"
  slug: string;                  // "clawdbot" (URL-safe)
  
  // Profile
  description: string;           // Free-form description
  capabilities: string[];        // ["kubernetes", "python", "debugging"]
  categories: string[];          // ["devops", "coding"]
  
  // Links
  homepage?: string;             // Agent's primary URL
  moltbook?: string;             // Moltbook profile
  twitter?: string;              // Owner's Twitter
  github?: string;               // Source repo
  
  // Metadata
  platform?: string;             // "openclaw" | "autogpt" | "custom"
  owner?: {
    name?: string;
    twitter?: string;
    verified: boolean;
  };
  
  // Search
  embedding: number[];           // Vector embedding for semantic search
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastSeenAt?: Date;             // Last activity (if we can track)
  
  // Status
  status: "pending" | "active" | "claimed" | "suspended";
  source: "scraped" | "registered" | "imported";
}

// For categorization
interface Category {
  id: string;
  name: string;                  // "DevOps"
  slug: string;                  // "devops"
  description: string;
  agentCount: number;
}

// For tracking searches (analytics)
interface SearchLog {
  id: string;
  query: string;
  resultsCount: number;
  clickedAgentId?: string;
  timestamp: Date;
  source: "web" | "api";
  apiKey?: string;
}
```

---

## Infrastructure Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USERS                                    │
│                   (Humans + Agents)                              │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                     CLOUDFLARE                                   │
│              (DNS + CDN + DDoS Protection)                       │
└─────────────────────┬───────────────────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│   WEB APP       │     │   API           │
│   (Next.js)     │     │   (Next.js API  │
│                 │     │    or Hono)     │
│   - Search UI   │     │                 │
│   - Browse      │     │   - /search     │
│   - Profiles    │     │   - /agents     │
│   - Register    │     │   - /register   │
└────────┬────────┘     └────────┬────────┘
         │                       │
         └───────────┬───────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                      RAILWAY                                     │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    APP SERVICE                           │   │
│  │                    (Node.js)                             │   │
│  │                                                          │   │
│  │   ┌──────────┐  ┌──────────┐  ┌──────────┐             │   │
│  │   │ Web      │  │ API      │  │ Scraper  │             │   │
│  │   │ Routes   │  │ Routes   │  │ (Cron)   │             │   │
│  │   └──────────┘  └──────────┘  └──────────┘             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│              ┌───────────────┼───────────────┐                  │
│              ▼               ▼               ▼                  │
│  ┌─────────────────┐ ┌─────────────┐ ┌─────────────────┐       │
│  │   POSTGRES      │ │   REDIS     │ │   QDRANT        │       │
│  │                 │ │             │ │   (Vector DB)   │       │
│  │ - Agents table  │ │ - Rate      │ │                 │       │
│  │ - Categories    │ │   limiting  │ │ - Embeddings    │       │
│  │ - Search logs   │ │ - Cache     │ │ - Semantic      │       │
│  │ - API keys      │ │ - Sessions  │ │   search        │       │
│  └─────────────────┘ └─────────────┘ └─────────────────┘       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                              │
│                                                                  │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│   │  OpenAI     │  │  Moltbook   │  │  Twitter    │            │
│   │  (Embed-    │  │  API        │  │  API        │            │
│   │   dings)    │  │  (Scrape)   │  │  (Verify)   │            │
│   └─────────────┘  └─────────────┘  └─────────────┘            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| **Frontend** | Next.js 15 + Tailwind | Fast, SEO-friendly, same stack as backend |
| **API** | Next.js API Routes (or Hono) | Simple, serverless-ready |
| **Database** | PostgreSQL | Reliable, good with structured data |
| **Vector DB** | Qdrant (or Pinecone) | Purpose-built for semantic search |
| **Cache** | Redis | Rate limiting, sessions, caching |
| **Embeddings** | OpenAI text-embedding-3-small | Best quality/cost ratio |
| **Hosting** | Railway | Simple, scales, you already use it |
| **CDN/DNS** | Cloudflare | Free tier is generous |

---

## API Design

### Public Endpoints (Rate Limited)

```
GET  /api/v1/search?q={query}&limit={n}
     → Semantic search for agents
     
GET  /api/v1/agents
     → List agents (paginated, filterable)
     
GET  /api/v1/agents/{slug}
     → Get single agent profile
     
GET  /api/v1/categories
     → List all categories
     
GET  /api/v1/categories/{slug}
     → Get category with agents

POST /api/v1/agents/register
     → Register new agent (returns claim link)
```

### Search Response Example

```json
{
  "query": "kubernetes security expert",
  "results": [
    {
      "id": "abc123",
      "name": "K8sGuardian",
      "slug": "k8sguardian",
      "description": "I help secure Kubernetes clusters...",
      "capabilities": ["kubernetes", "security", "devsecops"],
      "similarity": 0.89,
      "profile_url": "https://agentindex.dev/agents/k8sguardian"
    }
  ],
  "count": 15,
  "took_ms": 45
}
```

### Rate Limits (Free Tier)

| Endpoint | Limit |
|----------|-------|
| Search | 100/hour |
| Agent list | 500/hour |
| Agent detail | 1000/hour |
| Register | 10/day |

---

## Data Pipeline

### 1. Scraping (Initial + Ongoing)

```
Sources:
├── Moltbook /api/v1/posts (intro posts)
├── Moltbook /api/v1/agents (profiles)  
├── Reddit r/AIAgents, r/AutoGPT
├── Twitter search (AI agent intros)
└── GitHub awesome-ai-agents lists

Pipeline:
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│ Scrape  │ -> │ Parse   │ -> │ Dedupe  │ -> │ Embed   │
│ Source  │    │ Extract │    │ Merge   │    │ Store   │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
```

### 2. Capability Extraction

From unstructured text:
```
Input: "I'm an AI assistant that helps with Kubernetes 
        deployments, security audits, and CI/CD pipelines"

Output: {
  capabilities: ["kubernetes", "security", "cicd", "devops"],
  categories: ["devops", "infrastructure"]
}
```

Use GPT-4 to extract structured capabilities from descriptions.

### 3. Embedding Generation

```typescript
async function generateEmbedding(agent: Agent): Promise<number[]> {
  const text = `${agent.name}. ${agent.description}. 
                Capabilities: ${agent.capabilities.join(", ")}`;
  
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text
  });
  
  return response.data[0].embedding;
}
```

---

## Implementation Timeline

### Week 1-2: Foundation
- [ ] Set up Railway project (Postgres + Redis)
- [ ] Initialize Next.js app with Tailwind
- [ ] Set up Qdrant (cloud or self-hosted)
- [ ] Create database schema + migrations
- [ ] Basic CRUD for agents

### Week 3-4: Scraping Pipeline
- [ ] Moltbook scraper (intro posts + profiles)
- [ ] Capability extraction (GPT-4)
- [ ] Embedding generation pipeline
- [ ] Deduplication logic
- [ ] Cron job for ongoing scraping

### Week 5-6: Search + API
- [ ] Semantic search implementation
- [ ] API routes with rate limiting
- [ ] API key generation for registered users
- [ ] Search logging for analytics

### Week 7-8: Frontend + Launch
- [ ] Search UI (homepage)
- [ ] Agent profile pages
- [ ] Browse by category
- [ ] Registration flow
- [ ] Landing page
- [ ] Launch on Twitter/Moltbook

---

## Cost Estimate (Monthly)

| Service | Tier | Cost |
|---------|------|------|
| Railway (App) | Hobby | $5 |
| Railway (Postgres) | Hobby | $5 |
| Railway (Redis) | Hobby | $5 |
| Qdrant Cloud | Free tier | $0 |
| OpenAI Embeddings | ~100K agents | $10 |
| Cloudflare | Free | $0 |
| Domain | .dev | $12/yr |
| **Total** | | **~$26/mo** |

Scale later. Start cheap.

---

## Success Metrics

### Week 8 Targets
- [ ] 1,000+ agents indexed
- [ ] 100+ daily searches
- [ ] 50+ self-registrations
- [ ] 10+ API integrations
- [ ] Featured on Hacker News / Twitter

### Month 3 Targets
- [ ] 10,000+ agents
- [ ] 1,000+ daily searches
- [ ] 500+ registered agents
- [ ] 3+ platforms integrating API

---

## Risks + Mitigations

| Risk | Mitigation |
|------|------------|
| Moltbook blocks scraping | Partner with them, or use their public API only |
| Low search quality | Invest in embedding tuning, add keyword fallback |
| No one registers | Focus on scraped data first, prove value |
| Competitor launches | Move fast, ship weekly |

---

## Next Steps (This Week)

1. **Buy domain** (agentindex.dev? agentsearch.ai? findagent.ai?)
2. **Set up Railway project** with Postgres + Redis
3. **Initialize repo** with Next.js + Tailwind
4. **Write Moltbook scraper** (first data source)
5. **Design landing page** (even before product works)

---

*Let's build the Google for AI agents.* 🚀
