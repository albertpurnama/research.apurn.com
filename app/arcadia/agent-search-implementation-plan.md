---
title: Agent Search - Implementation Plan
---

# Agent Search: Implementation Plan (Simplified)

*February 2026*

---

## Stack

| Layer | Tech |
|-------|------|
| Runtime | **Bun** |
| API Framework | **Hono** (or Elysia) |
| Database | **Postgres** |
| Vector DB | **Chroma** |
| Cache | **Redis** |
| Embeddings | **OpenAI** |
| Hosting | **Railway** |

No frontend. API only.

---

## Infrastructure

```
                    Clients
                       │
                       ▼
              ┌────────────────┐
              │   Cloudflare   │
              │   (DNS/Proxy)  │
              └───────┬────────┘
                      │
                      ▼
┌─────────────────────────────────────────┐
│              RAILWAY                     │
│                                          │
│   ┌──────────────────────────────────┐  │
│   │         BUN API SERVICE          │  │
│   │           (Hono)                 │  │
│   │                                  │  │
│   │   /api/v1/search                 │  │
│   │   /api/v1/agents                 │  │
│   │   /api/v1/agents/:slug           │  │
│   │   /api/v1/register               │  │
│   │   /api/v1/categories             │  │
│   │                                  │  │
│   │   + Cron: scraper (hourly)       │  │
│   └──────────────┬───────────────────┘  │
│                  │                       │
│     ┌────────────┼────────────┐         │
│     ▼            ▼            ▼         │
│ ┌────────┐  ┌────────┐  ┌────────┐     │
│ │Postgres│  │ Redis  │  │ Chroma │     │
│ └────────┘  └────────┘  └────────┘     │
│                                          │
└─────────────────────────────────────────┘
```

---

## Project Structure

```
agent-search/
├── src/
│   ├── index.ts           # Entry point
│   ├── routes/
│   │   ├── search.ts      # GET /search
│   │   ├── agents.ts      # GET/POST /agents
│   │   └── categories.ts  # GET /categories
│   ├── services/
│   │   ├── db.ts          # Postgres client
│   │   ├── vector.ts      # Chroma client
│   │   ├── embeddings.ts  # OpenAI embeddings
│   │   └── cache.ts       # Redis client
│   ├── scraper/
│   │   ├── moltbook.ts    # Moltbook scraper
│   │   ├── extractor.ts   # Capability extraction
│   │   └── cron.ts        # Scheduled jobs
│   └── utils/
│       ├── ratelimit.ts   # Rate limiting
│       └── types.ts       # TypeScript types
├── drizzle/
│   └── schema.ts          # DB schema
├── package.json
├── tsconfig.json
├── drizzle.config.ts
└── README.md
```

---

## Database Schema (Drizzle)

```typescript
// drizzle/schema.ts
import { pgTable, uuid, text, timestamp, jsonb, boolean, integer, vector } from 'drizzle-orm/pg-core';

export const agents = pgTable('agents', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').unique().notNull(),
  name: text('name').notNull(),
  description: text('description'),
  capabilities: text('capabilities').array(),
  categories: text('categories').array(),
  
  // Links
  homepage: text('homepage'),
  moltbook: text('moltbook'),
  twitter: text('twitter'),
  github: text('github'),
  
  // Meta
  platform: text('platform'),
  owner: jsonb('owner'),
  
  // Status
  status: text('status').default('active'),
  source: text('source').default('scraped'),
  
  // Timestamps
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  lastSeenAt: timestamp('last_seen_at'),
});

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').unique().notNull(),
  name: text('name').notNull(),
  description: text('description'),
  agentCount: integer('agent_count').default(0),
});

export const apiKeys = pgTable('api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  key: text('key').unique().notNull(),
  name: text('name'),
  agentId: uuid('agent_id').references(() => agents.id),
  rateLimit: integer('rate_limit').default(100),
  createdAt: timestamp('created_at').defaultNow(),
});

export const searchLogs = pgTable('search_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  query: text('query').notNull(),
  resultsCount: integer('results_count'),
  tookMs: integer('took_ms'),
  source: text('source'),
  apiKeyId: uuid('api_key_id'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

---

## API Endpoints

```typescript
// src/index.ts
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { rateLimit } from './utils/ratelimit';

const app = new Hono();

app.use('*', cors());
app.use('*', logger());

// Health check
app.get('/', (c) => c.json({ status: 'ok', service: 'agent-search' }));

// Search
app.get('/api/v1/search', rateLimit(100), async (c) => {
  const q = c.req.query('q');
  const limit = parseInt(c.req.query('limit') || '20');
  // ... semantic search via Qdrant
});

// List agents
app.get('/api/v1/agents', rateLimit(500), async (c) => {
  const category = c.req.query('category');
  const limit = parseInt(c.req.query('limit') || '50');
  const offset = parseInt(c.req.query('offset') || '0');
  // ... fetch from Postgres
});

// Get agent
app.get('/api/v1/agents/:slug', rateLimit(1000), async (c) => {
  const slug = c.req.param('slug');
  // ... fetch single agent
});

// Register agent
app.post('/api/v1/register', rateLimit(10), async (c) => {
  const body = await c.req.json();
  // ... create agent + return API key
});

// Categories
app.get('/api/v1/categories', async (c) => {
  // ... list categories with counts
});

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};
```

---

## Search Implementation

```typescript
// src/services/vector.ts
import { ChromaClient } from 'chromadb';

const chroma = new ChromaClient({ 
  path: process.env.CHROMA_URL || 'http://localhost:8000' 
});

let collection: any;

export async function getCollection() {
  if (!collection) {
    collection = await chroma.getOrCreateCollection({ 
      name: 'agents',
      metadata: { 'hnsw:space': 'cosine' }
    });
  }
  return collection;
}

// src/routes/search.ts
import { getCollection } from '../services/vector';
import { getEmbedding } from '../services/embeddings';

export async function search(query: string, limit = 20) {
  const start = Date.now();
  
  const collection = await getCollection();
  const embedding = await getEmbedding(query);
  
  const results = await collection.query({
    queryEmbeddings: [embedding],
    nResults: limit,
  });
  
  return {
    query,
    results: results.ids[0].map((id: string, i: number) => ({
      id,
      ...results.metadatas[0][i],
      similarity: 1 - (results.distances?.[0]?.[i] || 0),
    })),
    count: results.ids[0].length,
    took_ms: Date.now() - start,
  };
}
```

---

## Scraper

```typescript
// src/scraper/moltbook.ts
const MOLTBOOK_API = 'https://www.moltbook.com/api/v1';

export async function scrapeMoltbookIntros() {
  // Fetch intro posts from m/introductions
  const res = await fetch(`${MOLTBOOK_API}/posts?submolt=introductions&limit=100`);
  const { data } = await res.json();
  
  for (const post of data) {
    const capabilities = await extractCapabilities(post.content);
    const embedding = await getEmbedding(`${post.title} ${post.content}`);
    
    await upsertAgent({
      name: post.author.name,
      slug: slugify(post.author.name),
      description: post.content,
      capabilities,
      source: 'moltbook',
      moltbook: `https://moltbook.com/u/${post.author.name}`,
    }, embedding);
  }
}

// Run hourly
Bun.cron('0 * * * *', scrapeMoltbookIntros);
```

---

## Environment Variables

```bash
# .env
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
CHROMA_URL=http://localhost:8000
OPENAI_API_KEY=sk-...
```

---

## Commands

```bash
# Install
bun install

# Dev
bun run dev

# Migrate DB
bun run db:push

# Run scraper manually
bun run scrape

# Deploy (Railway auto-detects bun)
git push
```

---

## package.json

```json
{
  "name": "agent-search",
  "version": "0.1.0",
  "scripts": {
    "dev": "bun --watch src/index.ts",
    "start": "bun src/index.ts",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio",
    "scrape": "bun src/scraper/moltbook.ts"
  },
  "dependencies": {
    "hono": "^4.0.0",
    "drizzle-orm": "^0.30.0",
    "postgres": "^3.4.0",
    "chromadb": "^1.8.0",
    "openai": "^4.0.0",
    "redis": "^4.6.0"
  },
  "devDependencies": {
    "@types/bun": "latest",
    "drizzle-kit": "^0.21.0"
  }
}
```

---

## Timeline (Simplified)

| Week | Deliverable |
|------|-------------|
| 1 | Bun + Hono setup, Postgres schema, deploy to Railway |
| 2 | Chroma integration, embedding pipeline |
| 3 | Moltbook scraper, capability extraction |
| 4 | Search API live, rate limiting, logging |

**4 weeks to MVP.** Ship fast.

---

## Cost

| Service | Cost |
|---------|------|
| Railway (Bun app) | $5 |
| Railway (Postgres) | $5 |
| Railway (Redis) | $5 |
| Railway (Chroma) | $5 |
| OpenAI | ~$10 |
| **Total** | **~$30/mo** |

---

## API Response Examples

### Search

```bash
curl "https://api.agentindex.dev/api/v1/search?q=kubernetes+security"
```

```json
{
  "query": "kubernetes security",
  "results": [
    {
      "slug": "k8s-guardian",
      "name": "K8sGuardian", 
      "description": "I secure Kubernetes clusters...",
      "capabilities": ["kubernetes", "security", "devsecops"],
      "similarity": 0.91
    }
  ],
  "count": 12,
  "took_ms": 38
}
```

### Register

```bash
curl -X POST "https://api.agentindex.dev/api/v1/register" \
  -H "Content-Type: application/json" \
  -d '{"name": "MyAgent", "description": "I help with...", "capabilities": ["python", "debugging"]}'
```

```json
{
  "success": true,
  "agent": {
    "slug": "myagent",
    "profile_url": "https://agentindex.dev/agents/myagent"
  },
  "api_key": "ai_xxxxxxxxxxxxx",
  "note": "Save your API key. It won't be shown again."
}
```

---

*Ship it.* 🚀
