# If Greg Brockman Ran The Prompting Company: Product Specification

**Date:** January 18, 2026
**Author:** Research Team
**Based on:** Greg Brockman's demonstrated product philosophy at Stripe and OpenAI

## Executive Summary

If Greg Brockman ran The Prompting Company, he would transform it from a service-based GEO consultancy into a **developer-first attribution infrastructure platform** built on three core principles from his Stripe and OpenAI experience:

1. **Platform over Verticals**: Build infrastructure that developers can use, not vertical applications
2. **API-First Architecture**: Everything accessible via clean, well-documented APIs
3. **Ship Fast, Build Right**: Launch quickly with stable foundations, iterate based on real usage

This document specifies the exact feature set Brockman would build, prioritized by his demonstrated philosophy.

---

## Part 1: The Brockman Philosophy Applied

### Core Principles from Stripe & OpenAI

#### 1. Developer-Centric Product Design

**From Stripe CTO Days:**
- "Their background in software and understanding of how a developer's brain works is what made the service successful" ([Fast Company](https://www.fastcompany.com/3031118/how-did-stripe-earn-so-much-nerd-cred-doing-payments))
- "Take the BS out of small interactions by using plain English error messages" ([Airbrake Interview](https://blog.airbrake.io/blog/devops/how-stripe-builds-software-an-interview-with-cto-greg-brockman))
- "Users can 'freeze' to a particular version of their service, meaning they never have to worry about breaking changes" ([Airbrake Interview](https://blog.airbrake.io/blog/devops/how-stripe-builds-software-an-interview-with-cto-greg-brockman))

**Application to The Prompting Company:**
- Attribution API with versioning and backward compatibility
- Plain English responses, not error codes
- SDK that "just works" with copy-paste examples

#### 2. Platform Over Verticals

**From OpenAI:**
- Building vertical applications was "tunnel vision" and "exactly backwards the way you're supposed to build a startup" ([Web Worth Reading](https://webworthreading.com/p/greg-brockman))
- Instead: "create a platform for developers" that unlocks collective ingenuity
- The OpenAI API decision "felt doomed" but "proved wildly successful, harnessing the collective ingenuity of developers" ([Web Worth Reading](https://webworthreading.com/p/greg-brockman))

**Application to The Prompting Company:**
- Don't build "Attribution Analytics for SaaS" or "Attribution for E-commerce"
- Build: **Attribution Infrastructure** that any developer can use for any vertical
- Let customers build their own attribution dashboards using your primitives

#### 3. Infrastructure-First Thinking

**From OpenAI:**
- Brockman is "so clear in his vision that compute is the currency of intelligence" ([Fortune](https://fortune.com/2025/11/05/openai-greg-brockman-ai-infrastructure-data-center-master-builder/))
- "Compute is one of the key bottlenecks for AI adoption" ([TechCrunch](https://techcrunch.com/snippet/3080158/openai-co-founder-greg-brockman-just-wants-more-compute/))
- Focus on what's truly scarce and build infrastructure around it

**Application to The Prompting Company:**
- **Attribution data** is the scarce resource (like compute for AI)
- Build infrastructure to collect, store, and serve attribution data at scale
- Make attribution data accessible, reliable, and real-time

#### 4. Ship Fast with Marathon Intensity

**From OpenAI:**
- "Basically hacked together the first API one weekend, I think over Christmas" ([Fortune](https://fortune.com/2025/11/05/openai-greg-brockman-ai-infrastructure-data-center-master-builder/))
- "Known for marathon coding sessions, deep technical reviews, and a hands-on approach" ([Fortune](https://fortune.com/2025/11/05/openai-greg-brockman-ai-infrastructure-data-center-master-builder/))
- "If something's not moving fast enough, Greg will take it into his own hands" ([Fortune](https://fortune.com/2025/11/05/openai-greg-brockman-ai-infrastructure-data-center-master-builder/))

**Application to The Prompting Company:**
- Launch attribution API in **2 weeks**, not 8 weeks
- Core team of 3 engineers working marathon sessions
- Brockman himself would code the first version over a weekend

---

## Part 2: Product Architecture - The Brockman Way

### System Design Philosophy

Based on Brockman's "responsible acceleration" approach:
- Move fast enough to capture the opportunity
- Move carefully enough to build stable foundations
- Empower developers to build what they need

```
┌─────────────────────────────────────────────────────────────┐
│            THE PROMPTING COMPANY PLATFORM                    │
│              "Attribution Infrastructure"                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Core Product: Not a dashboard, but an API platform         │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Layer 1: Attribution Ingestion API                 │    │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │    │
│  │  Collect attribution data from:                     │    │
│  │  • OpenAI (o3/o4-mini citations)                   │    │
│  │  • Claude (citation API when available)             │    │
│  │  • Gemini (citation API when available)             │    │
│  │  • Perplexity (sources API)                         │    │
│  │  • Custom LLM deployments                           │    │
│  └────────────────────────────────────────────────────┘    │
│                           ↓                                  │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Layer 2: Attribution Storage & Processing          │    │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │    │
│  │  • Real-time event streaming                        │    │
│  │  • Time-series database                             │    │
│  │  • Attribution graph computation                    │    │
│  │  • Influence score calculation                      │    │
│  └────────────────────────────────────────────────────┘    │
│                           ↓                                  │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Layer 3: Attribution Query API                     │    │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │    │
│  │  RESTful API with:                                  │    │
│  │  • Get attributions for a URL                       │    │
│  │  • Get attributions for a product                   │    │
│  │  • Get competitive attribution share                │    │
│  │  • Get attribution time-series                      │    │
│  │  • Webhooks for real-time alerts                    │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│               WHAT DEVELOPERS BUILD ON TOP                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  • SaaS companies: Attribution dashboards                   │
│  • E-commerce: AI recommendation ROI tracking               │
│  • Content creators: Citation performance analytics         │
│  • Agencies: Client reporting tools                         │
│  • Researchers: Attribution pattern analysis                │
│                                                              │
│  Platform enables any vertical use case                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Part 3: Feature Set - Launch Sequence

### Sprint 0: Weekend Hack (Day 1-2)
*"Greg basically hacked together the first API one weekend"*

**Goal:** Prove the concept works

**Features:**
1. **Attribution Collector**
   - Simple webhook that receives OpenAI citation data
   - Parse `url_citation` objects from o3/o4-mini responses
   - Store in PostgreSQL

2. **Basic Query Endpoint**
   ```bash
   GET /api/v1/attributions?url=https://rippling.com/docs/payroll-api
   ```
   Returns: Citation count and basic metrics

3. **Quick Dashboard**
   - Single HTML page showing attribution counts
   - Deployed on Vercel
   - Shows it works to early customers

**Success Metric:** Demo to first 3 customers by Monday morning

---

### Week 1-2: MVP Launch (The "Christmas API")
*Following Brockman's OpenAI API pattern*

#### Core API Endpoints

**1. Attribution Tracking**

```javascript
// Track attributions for your URLs
POST /api/v1/sources

{
  "name": "Rippling Payroll Docs",
  "urls": [
    "https://rippling.com/docs/payroll-api",
    "https://rippling.com/docs/payroll/*"  // wildcard support
  ],
  "metadata": {
    "product": "Rippling",
    "category": "documentation",
    "team": "payroll"
  }
}
```

**2. Query Attributions**

```javascript
// Get attribution data
GET /api/v1/attributions?source_id={id}&start_date=2026-01-01&end_date=2026-01-31

Response:
{
  "source": {
    "id": "src_abc123",
    "name": "Rippling Payroll Docs",
    "url": "https://rippling.com/docs/payroll-api"
  },
  "period": {
    "start": "2026-01-01",
    "end": "2026-01-31"
  },
  "metrics": {
    "citation_count": 567,
    "avg_influence_score": 0.45,
    "avg_confidence": 0.95,
    "primary_citations": 432,
    "secondary_citations": 135,
    "trend": {
      "vs_previous_period": "+23%",
      "direction": "up"
    }
  },
  "top_queries": [
    {
      "query": "startup payroll software",
      "citation_count": 234,
      "avg_influence": 0.52
    },
    {
      "query": "API integration payroll",
      "citation_count": 156,
      "avg_influence": 0.48
    }
  ],
  "model_breakdown": {
    "o4-mini": 423,
    "o3": 144
  }
}
```

**3. Competitive Attribution**

```javascript
// Compare attribution with competitors
POST /api/v1/competitors

{
  "your_product": "Rippling",
  "competitors": ["Gusto", "Justworks", "BambooHR"],
  "query_category": "startup payroll"
}

Response:
{
  "attribution_share": {
    "Rippling": 0.65,
    "Gusto": 0.35,
    "Justworks": 0.22,
    "BambooHR": 0.18
  },
  "insights": [
    {
      "type": "winning",
      "category": "API-focused queries",
      "share": 0.78,
      "message": "Leading in technical documentation queries"
    },
    {
      "type": "losing",
      "category": "ease of use",
      "share": 0.42,
      "message": "Gusto has stronger attribution for user-friendliness"
    },
    {
      "type": "opportunity",
      "category": "benefits administration",
      "share": 0.31,
      "message": "Gap in benefits content, high query volume"
    }
  ]
}
```

**4. Webhooks for Real-Time Alerts**

```javascript
// Register webhook
POST /api/v1/webhooks

{
  "url": "https://your-app.com/attribution-webhook",
  "events": [
    "attribution.cited",
    "attribution.spike_detected",
    "competitor.overtaking"
  ],
  "filters": {
    "source_id": "src_abc123",
    "min_influence_score": 0.3
  }
}

// Webhook payload example
POST https://your-app.com/attribution-webhook

{
  "event": "attribution.spike_detected",
  "timestamp": "2026-01-18T10:30:00Z",
  "data": {
    "source": {
      "id": "src_abc123",
      "name": "Rippling Payroll Docs",
      "url": "https://rippling.com/docs/payroll-api"
    },
    "spike": {
      "current_citations": 89,
      "previous_hour_avg": 12,
      "increase": "641%"
    },
    "likely_cause": "OpenAI featured in ChatGPT recommended queries"
  }
}
```

#### Developer Experience Features (The Stripe DNA)

**1. Plain English Error Messages**

```javascript
// Bad (typical API):
{
  "error": "ERR_401",
  "message": "Unauthorized"
}

// Good (Brockman style):
{
  "error": {
    "type": "authentication_error",
    "message": "Your API key is invalid. You're using a test key (pk_test_...) in production mode. Use your live key (pk_live_...) instead.",
    "doc_url": "https://docs.promptingco.com/errors/authentication"
  }
}
```

**2. API Version Freezing (From Stripe)**

```javascript
// Pin to specific API version
curl https://api.promptingco.com/v1/attributions \
  -H "Authorization: Bearer pk_live_abc123" \
  -H "API-Version: 2026-01-18"

// Automatic migration warnings
{
  "data": {...},
  "warnings": [
    {
      "type": "api_version_deprecated",
      "message": "You're using API version 2026-01-18. Version 2026-06-01 adds competitive intelligence features. Migrate before 2027-01-18.",
      "migration_guide": "https://docs.promptingco.com/migrations/2026-06-01"
    }
  ]
}
```

**3. Copy-Paste Examples That Work**

```javascript
// Every API endpoint includes working examples
// Example is guaranteed to work if you just paste your API key

const TPC = require('@promptingco/sdk');
const tpc = new TPC('pk_test_your_key_here');

// Get attributions (paste this, it just works)
const attributions = await tpc.attributions.list({
  source_id: 'src_example_123',  // Pre-populated example ID
  start_date: '2026-01-01'
});

console.log(attributions);
// Output:
// {
//   citation_count: 567,
//   avg_influence_score: 0.45,
//   ...
// }
```

**4. Smart SDK with Auto-Updates**

```javascript
// SDK automatically supports new features without updates
// (from Brockman's Stripe playbook)

const tpc = new TPC('pk_live_abc123');

// When we add "sentiment" feature to API,
// SDK automatically supports it without requiring upgrade
const attributions = await tpc.attributions.list({
  source_id: 'src_abc123',
  include: ['sentiment']  // New feature, old SDK version
});

// SDK fetches schema from API and adapts
```

**5. Automatic Retries with Exponential Backoff**

```javascript
// Built into SDK (developers don't think about it)
const tpc = new TPC('pk_live_abc123', {
  maxRetries: 3,  // Default: 3
  timeout: 30000  // Default: 30s
});

// SDK handles:
// - Rate limiting (429) → wait and retry
// - Server errors (5xx) → exponential backoff
// - Network errors → retry with backoff
// - Plain English errors for non-retriable failures
```

---

### Month 1-2: Platform Expansion

#### Feature Set

**1. Multi-Model Support**

```javascript
// Track attributions across all AI models
POST /api/v1/sources

{
  "name": "Rippling Docs",
  "urls": ["https://rippling.com/docs/*"],
  "models": [
    "openai/o4-mini",
    "openai/o3",
    "anthropic/claude-3.5-sonnet",
    "google/gemini-pro",
    "perplexity/sonar-pro"
  ]
}

// Query by model
GET /api/v1/attributions?source_id=src_abc&model=anthropic/claude-3.5-sonnet
```

**2. Attribution Graph API**

```javascript
// Understand multi-hop attribution
GET /api/v1/attribution-graph?product=Rippling&query=startup_payroll

Response:
{
  "query": "Best payroll for 50-person startup",
  "recommendation": "Rippling",
  "attribution_graph": {
    "nodes": [
      {
        "id": "source_1",
        "url": "https://rippling.com/docs/payroll-api",
        "type": "direct",
        "influence": 0.45
      },
      {
        "id": "source_2",
        "url": "https://www.g2.com/products/rippling/reviews",
        "type": "validation",
        "influence": 0.30,
        "cited_sources": ["source_1"]  // Referenced Rippling docs
      },
      {
        "id": "source_3",
        "url": "https://reddit.com/r/startups/payroll",
        "type": "social_proof",
        "influence": 0.12,
        "cited_sources": ["source_1", "source_2"]
      }
    ],
    "edges": [
      {"from": "source_1", "to": "source_2", "weight": 0.7},
      {"from": "source_1", "to": "source_3", "weight": 0.4},
      {"from": "source_2", "to": "source_3", "weight": 0.6}
    ]
  }
}
```

**3. Streaming API for Real-Time Monitoring**

```javascript
// WebSocket for real-time attribution stream
const ws = new WebSocket('wss://api.promptingco.com/v1/stream');

ws.on('connect', () => {
  ws.send(JSON.stringify({
    type: 'subscribe',
    source_id: 'src_abc123',
    filters: {
      min_influence_score: 0.3
    }
  }));
});

ws.on('message', (data) => {
  // Real-time attribution event
  {
    "type": "attribution.cited",
    "timestamp": "2026-01-18T10:30:15.234Z",
    "source": {
      "id": "src_abc123",
      "url": "https://rippling.com/docs/payroll-api"
    },
    "citation": {
      "query": "startup payroll software",
      "model": "openai/o4-mini",
      "influence_score": 0.52,
      "confidence": 0.95,
      "recommendation": "Rippling"
    }
  }
});
```

**4. Batch Analysis API**

```javascript
// Analyze historical attribution patterns
POST /api/v1/analyze/batch

{
  "source_ids": ["src_abc", "src_def", "src_ghi"],
  "analysis_types": [
    "trend_detection",
    "query_clustering",
    "competitor_gaps",
    "content_effectiveness"
  ],
  "time_range": {
    "start": "2025-01-01",
    "end": "2026-01-31"
  }
}

Response (async job):
{
  "job_id": "job_xyz789",
  "status": "processing",
  "estimated_completion": "2026-01-18T10:35:00Z",
  "webhook_url": "https://your-app.com/webhook"
}

// Webhook result
{
  "job_id": "job_xyz789",
  "status": "completed",
  "results": {
    "trends": [...],
    "query_clusters": [...],
    "competitor_gaps": [...],
    "recommendations": [
      {
        "priority": "high",
        "type": "content_gap",
        "message": "Create '50-100 employee guide' - high query volume, low attribution",
        "estimated_impact": "+892 citations/month"
      }
    ]
  }
}
```

---

### Month 3-6: Ecosystem & Scale

#### Advanced Features

**1. Attribution SDK for Client-Side Tracking**

```html
<!-- Embed in your docs/website -->
<script src="https://cdn.promptingco.com/tpc.js"></script>
<script>
  TPC.init('pk_live_abc123', {
    trackPageViews: true,
    correlateWithAI: true  // Correlate web traffic with AI citations
  });
</script>
```

```javascript
// Correlate traditional analytics with AI attribution
const insights = await tpc.correlate({
  google_analytics_property: 'UA-XXXXX',
  time_range: 'last_30_days'
});

// Shows: Users who came from AI recommendations vs. traditional channels
{
  "conversion_rate": {
    "ai_recommended": 0.34,  // 34% convert
    "organic_search": 0.12,  // 12% convert
    "direct": 0.08           // 8% convert
  },
  "insight": "Users arriving from AI recommendations convert 2.8x better than organic search"
}
```

**2. Attribution Testing Framework**

```javascript
// A/B test different content variations
POST /api/v1/experiments

{
  "name": "Payroll Docs - Technical vs. Non-Technical",
  "variants": [
    {
      "id": "technical",
      "url": "https://rippling.com/docs/payroll-api-v1"
    },
    {
      "id": "non-technical",
      "url": "https://rippling.com/docs/payroll-guide-v2"
    }
  ],
  "metrics": ["citation_count", "influence_score", "recommendation_rate"],
  "duration_days": 14
}

// Get experiment results
GET /api/v1/experiments/exp_abc123

Response:
{
  "status": "completed",
  "winner": "technical",
  "results": {
    "technical": {
      "citation_count": 234,
      "avg_influence_score": 0.52,
      "recommendation_rate": 0.78
    },
    "non-technical": {
      "citation_count": 189,
      "avg_influence_score": 0.43,
      "recommendation_rate": 0.61
    }
  },
  "confidence": 0.95,
  "recommendation": "Use technical variant - 23% more citations with higher influence"
}
```

**3. Marketplace & Integrations**

```javascript
// Pre-built integrations (the "app store" model)
const integrations = [
  {
    name: "Slack",
    description: "Get attribution alerts in Slack",
    install_url: "https://app.promptingco.com/integrations/slack"
  },
  {
    name: "Google Analytics",
    description: "Correlate AI traffic with GA data",
    install_url: "https://app.promptingco.com/integrations/ga"
  },
  {
    name: "Segment",
    description: "Send attribution events to your CDP",
    install_url: "https://app.promptingco.com/integrations/segment"
  },
  {
    name: "Notion",
    description: "Auto-create attribution reports in Notion",
    install_url: "https://app.promptingco.com/integrations/notion"
  }
];
```

**4. Developer Console (OpenAI Platform Style)**

Web dashboard at `platform.promptingco.com` with:
- API key management
- Usage metrics and billing
- API logs and debugging
- Webhook testing
- Interactive API explorer
- Code generation (generates working code in 7 languages)

---

## Part 4: Pricing - The Brockman Approach

### Philosophy: Align with Value Created

From Stripe's playbook: **charge based on value delivered**, not seat-based SaaS pricing.

```
┌─────────────────────────────────────────────────────────┐
│              ATTRIBUTION INFRASTRUCTURE                  │
│              "Pay for what you use"                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Free Tier (Developer Friendly)                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  • 10,000 attribution events/month                      │
│  • 5 tracked sources                                    │
│  • 7-day data retention                                 │
│  • Basic API access                                     │
│  • Community support                                    │
│                                                          │
│  → Goal: Let developers experiment, build, prove value  │
│                                                          │
│  ────────────────────────────────────────────────────   │
│                                                          │
│  Pay-As-You-Go (Stripe Model)                           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  • $0.01 per 100 attribution events                     │
│  • $10/month per tracked source                         │
│  • Unlimited data retention                             │
│  • Full API access                                      │
│  • Webhooks & real-time streaming                       │
│  • Email support                                        │
│                                                          │
│  → Scale pricing with usage (typical: $200-2,000/mo)    │
│                                                          │
│  ────────────────────────────────────────────────────   │
│                                                          │
│  Enterprise (Custom Infrastructure)                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  • Custom pricing based on volume                       │
│  • Dedicated infrastructure                             │
│  • SLA guarantees (99.95% uptime)                       │
│  • Private deployment options                           │
│  • Attribution data co-processing                       │
│  • Slack/Teams support channel                          │
│                                                          │
│  → For companies doing millions of attributions/month   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Pricing Calculator (Transparent)

```javascript
// Estimate your costs
GET /api/v1/pricing/estimate?attribution_events=500000&sources=25

Response:
{
  "monthly_estimate": {
    "attribution_events": {
      "count": 500000,
      "cost": 50.00,  // $0.01 per 100 events
      "breakdown": "500,000 events ÷ 100 × $0.01"
    },
    "tracked_sources": {
      "count": 25,
      "cost": 250.00,  // $10 per source
      "breakdown": "25 sources × $10"
    },
    "total": 300.00,
    "currency": "USD"
  },
  "alternative_plans": {
    "enterprise": {
      "estimated_cost": 250.00,  // Volume discount
      "savings": 50.00,
      "recommended": true,
      "message": "At your volume, Enterprise saves $600/year plus includes SLA"
    }
  }
}
```

---

## Part 5: Go-to-Market - The API-First Launch

### Week 1: Soft Launch to Existing Customers

**Target:** 5 existing Prompting Company clients (Rippling, Rho, Motion, Vapi, Fondo)

**Pitch:**
> "You're paying us for GEO optimization. Now see exactly when it's working. We built an API that tracks every time ChatGPT cites your docs."

**Offer:**
- Free for first 3 months
- Help them integrate (white-glove setup)
- Gather feedback for product iterations

**Success Metric:** 5/5 customers integrated and seeing value by end of week

---

### Week 2-3: Developer Community Launch

**Strategy:** Following OpenAI API playbook

**Channels:**
1. **Hacker News Launch**
   - Title: "Show HN: Attribution Infrastructure for AI Recommendations"
   - Post: Technical deep-dive on the architecture
   - Demo: Live API explorer with working examples
   - Open source: Client libraries for Python, Node.js, Go

2. **Product Hunt**
   - "The Stripe for AI Attribution"
   - Free tier that developers can try immediately
   - Demo video showing API → data in 30 seconds

3. **GitHub**
   - Open source SDKs and examples
   - `awesome-ai-attribution` repo with use cases
   - Attribution tracking template apps

4. **Dev.to / HashNode / Medium**
   - Technical blog posts about attribution architecture
   - "How we built real-time attribution streaming"
   - "Attribution graphs: Understanding multi-source influence"

**Target:** 500 developers signed up, 50 actively using API

---

### Month 2-3: Developer Evangelism

**Team:**
- 2 developer advocates (hire from Stripe/Twilio/Vercel)
- Brockman himself does developer outreach (like he did for OpenAI API)

**Activities:**
1. **Conference Talks**
   - "Attribution Infrastructure for the AI Era" at developer conferences
   - Live coding demos showing API integration

2. **Office Hours**
   - Weekly Zoom sessions where Brockman answers developer questions
   - Record and publish on YouTube

3. **Integration Partnerships**
   - Segment, Mixpanel, Amplitude (send attribution events to their platforms)
   - Vercel, Netlify (one-click attribution tracking for docs sites)
   - Stripe (attribution for AI-driven product recommendations)

4. **Cookbook & Examples**
   - `attribution-cookbook` repo (like OpenAI cookbook)
   - Example use cases:
     - E-commerce: Track AI shopping recommendations
     - SaaS: Track API documentation citations
     - Content: Track article citations by AI
     - Research: Track paper citations by AI assistants

**Target:** 2,000 developers, 200 paying customers

---

### Month 4-6: Enterprise Sales

**Team:**
- 2 enterprise sales reps (hire from Stripe, Twilio, or Segment)
- Focus on companies with >$10M revenue

**Targets:**
1. **B2B SaaS with Developer Tools**
   - Stripe, Twilio, Vercel, Supabase, Clerk
   - Pitch: "Measure which API docs drive AI recommendations"

2. **E-commerce Platforms**
   - Shopify, WooCommerce, BigCommerce
   - Pitch: "Track AI shopping assistant recommendations"

3. **Content Networks**
   - Stack Overflow, GitHub, Dev.to
   - Pitch: "Understand AI's influence on developer discovery"

**Success Metric:** 10 enterprise customers at $2-10k/month each

---

## Part 6: Technical Implementation - 2 Week Sprint

### Architecture (Brockman's Weekend Hack Scaled Up)

```
┌──────────────────────────────────────────────────────────┐
│                   TECHNOLOGY STACK                        │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Backend API (Node.js + TypeScript)                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  • Framework: Fastify (fast, low-overhead)               │
│  • Why: Performance critical, Brockman cares about speed │
│                                                           │
│  Data Storage                                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  • PostgreSQL: Relational data (users, sources, keys)   │
│  • TimescaleDB: Time-series (attribution events)         │
│  • Redis: Caching, rate limiting, real-time              │
│  • Why: Battle-tested, scales to billions of events     │
│                                                           │
│  Event Processing                                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  • Kafka: Event streaming                                │
│  • Flink: Stream processing & aggregation                │
│  • Why: Real-time attribution calculation at scale       │
│                                                           │
│  Infrastructure                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  • AWS (primary cloud)                                   │
│  • CloudFlare (CDN, DDoS protection, Edge workers)       │
│  • Kubernetes (container orchestration)                  │
│  • Why: Brockman's "compute is the currency" philosophy │
│                                                           │
│  Monitoring                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  • Datadog: Metrics, logs, APM                           │
│  • PagerDuty: Alerts                                     │
│  • Sentry: Error tracking                                │
│  • Why: "Move fast but build right" requires visibility │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

### Day 1-2: Core API (Weekend Hack)

**Saturday:**
- [ ] Fastify API server setup
- [ ] PostgreSQL schema for users, sources, API keys
- [ ] TimescaleDB schema for attribution events
- [ ] Basic auth with API keys
- [ ] First endpoint: `POST /v1/sources` (register URLs)
- [ ] Second endpoint: `POST /v1/events` (receive attribution events)
- [ ] Third endpoint: `GET /v1/attributions` (query data)

**Sunday:**
- [ ] OpenAI citation webhook receiver
- [ ] Parse `url_citation` objects
- [ ] Match citations to registered sources
- [ ] Store in TimescaleDB
- [ ] Basic aggregation queries
- [ ] Deploy to AWS
- [ ] Test with real OpenAI data

**By Monday Morning:**
- Working API deployed
- Demo to first customer
- They see their docs being cited in real-time

### Day 3-7: Production Hardening

- [ ] Rate limiting (Redis)
- [ ] API versioning (`API-Version` header)
- [ ] Error handling (plain English messages)
- [ ] Request validation with clear error messages
- [ ] API documentation site (like platform.openai.com)
- [ ] JavaScript SDK (copy-paste examples)
- [ ] Python SDK (copy-paste examples)
- [ ] Billing integration (Stripe, obviously)
- [ ] Usage tracking & limits
- [ ] Load testing (handle 10k req/sec)

### Day 8-14: Developer Experience

- [ ] Interactive API explorer (try API in browser)
- [ ] Code generation (generates working code in 7 languages)
- [ ] Webhook testing tools
- [ ] API logs dashboard
- [ ] Example apps in `examples/` repo
- [ ] Video tutorials
- [ ] Migration guides
- [ ] Status page (status.promptingco.com)

---

## Part 7: Success Metrics - Brockman's Approach

### Philosophy: "Let Usage Tell You If It's Working"

From OpenAI's playbook: If developers use it, it's working. If they don't, it's not.

### Week 1-2 Metrics

```
┌──────────────────────────────────────────────────────┐
│  CRITICAL METRICS (Week 1-2)                         │
├──────────────────────────────────────────────────────┤
│                                                       │
│  Developer Adoption:                                 │
│  • 5 existing customers integrated       ✅ Goal: 5 │
│  • 50 new developers signed up           ✅ Goal: 50│
│  • 10 developers made >10 API calls      ✅ Goal: 10│
│                                                       │
│  Technical Validation:                               │
│  • API uptime: 99.5%+                    ✅ Goal: 99%│
│  • P99 latency: <200ms                   ✅ Goal: <500ms│
│  • Zero data loss                        ✅ Goal: 0 │
│                                                       │
│  Product-Market Fit Signals:                         │
│  • 3+ customers say "I'd be disappointed if this    │
│    went away"                            ✅ Goal: 3 │
│  • 1+ customer refers another customer   ✅ Goal: 1 │
│                                                       │
└──────────────────────────────────────────────────────┘
```

### Month 1-3 Metrics

```
┌──────────────────────────────────────────────────────┐
│  GROWTH METRICS (Month 1-3)                          │
├──────────────────────────────────────────────────────┤
│                                                       │
│  Developers:                                         │
│  • 500 signed up                      ✅ Goal: 500   │
│  • 50 active (>100 API calls/week)    ✅ Goal: 50    │
│  • 25 paying                          ✅ Goal: 20    │
│                                                       │
│  Revenue:                                            │
│  • $10k MRR                           ✅ Goal: $10k  │
│  • 80% gross margin                   ✅ Goal: 75%   │
│                                                       │
│  Technical:                                          │
│  • 10M attribution events/day         ✅ Goal: 5M    │
│  • 99.9% API uptime                   ✅ Goal: 99.9% │
│  • P99 latency: <100ms                ✅ Goal: <200ms│
│                                                       │
│  Community:                                          │
│  • 1,000 GitHub stars on SDK          ✅ Goal: 500   │
│  • 5 community contributions          ✅ Goal: 3     │
│  • #1 for "AI attribution API"        ✅ Goal: Top 3 │
│                                                       │
└──────────────────────────────────────────────────────┘
```

---

## Part 8: The Brockman Difference

### What Makes This Different from the Previous Plan?

| **Previous Plan** | **Brockman's Plan** |
|-------------------|---------------------|
| 8-week MVP | **2-week MVP** (weekend hack + hardening) |
| Build dashboard first | **API-first, let developers build dashboards** |
| $2k-15k/month tiers | **Pay-as-you-go, scale with usage** |
| Target B2B SaaS | **Target developers, any vertical** |
| Service + product hybrid | **Pure infrastructure platform** |
| Manual GEO consulting | **Self-serve API with docs** |
| Competitive moat: data | **Competitive moat: developer love** |

### The Brockman Philosophy in Action

**1. Infrastructure Over Applications**
- Don't build "Attribution Dashboard for SaaS"
- Build: Attribution infrastructure for anyone

**2. Developer Experience Obsession**
- Plain English errors
- Copy-paste examples that work
- Version freezing (no breaking changes)
- Free tier that's actually useful

**3. Ship Fast, Build Right**
- Weekend hack proves concept
- 2 weeks to production
- Iterate based on real usage

**4. Platform Enables Ecosystem**
- Developers build attribution dashboards
- Agencies build client reporting tools
- Researchers build analysis tools
- Market size = entire AI recommendation space

---

## Part 9: Risks & Mitigation

### Risk 1: OpenAI Changes Citation APIs

**Brockman's Mitigation:**
- Multi-model from day 1 (Claude, Gemini, Perplexity)
- Focus on attribution methodology, not just API wrapper
- Build relationships with all major AI labs (Brockman's network)

### Risk 2: Low Developer Adoption

**Brockman's Mitigation:**
- Free tier that's generous (10k events/month)
- Copy-paste examples that work immediately
- Open source SDKs (community can contribute)
- Weekly office hours with Brockman himself

### Risk 3: Competitors Copy the Idea

**Brockman's Mitigation:**
- Speed to market (2 weeks, not 8 weeks)
- Developer experience moat (Stripe-level polish)
- Network effects (more developers = better attribution data)
- Brand: "The Stripe of AI Attribution"

### Risk 4: Can't Scale Infrastructure

**Brockman's Mitigation:**
- Brockman's superpower: infrastructure at scale
- Hire from Stripe/OpenAI engineering teams
- "Compute is the currency" philosophy = over-provision
- Start with battle-tested tech (Kafka, TimescaleDB, Kubernetes)

---

## Conclusion: The Brockman Transformation

If Greg Brockman ran The Prompting Company, he would transform it from:

**From:**
- GEO consulting service
- $6.5M seed-funded startup
- 7 enterprise customers
- Service-based revenue model

**To:**
- Attribution infrastructure platform
- Developer-first API company
- Thousands of developers
- Usage-based revenue model
- Platform ecosystem

**Timeline:**
- **Week 1:** API ships
- **Month 1:** 500 developers
- **Month 3:** $10k MRR
- **Year 1:** $200k MRR, category leader

**The Brockman Secret:**
> "Don't build what customers ask for. Build the infrastructure that lets them build what they need."

**From OpenAI:** Platform beats verticals
**From Stripe:** Developer experience is the moat
**From Brockman:** Ship fast, but build foundations that scale

---

## Appendix: Code Examples

### Full Working Example: Attribution Tracking in 5 Minutes

```bash
# 1. Install SDK
npm install @promptingco/attribution

# 2. Initialize (paste your API key)
cat > index.js << 'EOF'
const TPC = require('@promptingco/attribution');
const tpc = new TPC('pk_test_your_key_here');

async function main() {
  // Register your docs for tracking
  const source = await tpc.sources.create({
    name: 'My Product Docs',
    urls: ['https://myproduct.com/docs/*']
  });

  console.log('Source registered:', source.id);

  // Query attributions (real-time)
  const attributions = await tpc.attributions.list({
    source_id: source.id,
    limit: 10
  });

  console.log('Recent attributions:', attributions);

  // Set up webhook for real-time alerts
  await tpc.webhooks.create({
    url: 'https://myapp.com/webhook',
    events: ['attribution.cited']
  });

  console.log('Webhook registered - you\'ll get real-time alerts!');
}

main();
EOF

# 3. Run it
node index.js
```

**Output:**
```
Source registered: src_abc123
Recent attributions: [
  {
    timestamp: '2026-01-18T10:30:15Z',
    query: 'how to integrate myproduct API',
    model: 'openai/o4-mini',
    cited_url: 'https://myproduct.com/docs/api-integration',
    influence_score: 0.52,
    confidence: 0.95
  },
  ...
]
Webhook registered - you'll get real-time alerts!
```

**Time elapsed:** 2 minutes

That's the Brockman way. ✨

---

## Sources

### Greg Brockman Philosophy & Background
- [Greg Brockman: OpenAI's Co-Founder & President](https://digidai.github.io/2025/11/28/greg-brockman-openai-cofounder-president-builder-chief-deep-analysis/)
- [Meet the power broker of the AI age | Fortune](https://fortune.com/2025/11/05/openai-greg-brockman-ai-infrastructure-data-center-master-builder/)
- [Greg Brockman just wants more compute | TechCrunch](https://techcrunch.com/snippet/3080158/openai-co-founder-greg-brockman-just-wants-more-compute/)
- [My path to OpenAI • Greg Brockman](https://blog.gregbrockman.com/my-path-to-openai)

### Stripe CTO & Developer Tools Philosophy
- [#define CTO • Greg Brockman](https://blog.gregbrockman.com/figuring-out-the-cto-role-at-stripe)
- [How Stripe Builds Software | Airbrake Interview](https://blog.airbrake.io/blog/devops/how-stripe-builds-software-an-interview-with-cto-greg-brockman)
- [How Stripe Earned Nerd Cred | Fast Company](https://www.fastcompany.com/3031118/how-did-stripe-earn-so-much-nerd-cred-doing-payments)

### Product & API Strategy
- [OpenAI API 2026 Guide | Kanerika](https://kanerika.com/blogs/openai-api/)
- [OpenAI Platform Documentation](https://platform.openai.com/docs/overview)
- [OpenAI for Developers in 2025](https://developers.openai.com/blog/openai-for-developers-2025/)
- [Greg Brockman on TED: ChatGPT's astonishing potential](https://www.ted.com/talks/greg_brockman_the_inside_story_of_chatgpt_s_astonishing_potential)

---

**Document Version:** 1.0
**Created:** January 18, 2026
**Last Updated:** January 18, 2026
