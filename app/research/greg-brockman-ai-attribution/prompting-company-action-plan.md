# The Prompting Company: Actionable Attribution Strategy

**Based on Greg Brockman's Attribution Framework**
**Date:** January 18, 2026

## Executive Summary

The Prompting Company has raised $6.5M to help products get mentioned in ChatGPT through Generative Engine Optimization (GEO). However, the current state of AI attribution creates a critical gap: **clients can't measure ROI on their GEO investments.**

Greg Brockman's attribution framework—already implemented in OpenAI's o3/o4-mini models—provides the technical foundation to solve this. This document outlines how The Prompting Company can leverage native attribution APIs to transform from "getting mentioned" to "proving impact."

## Current State: The Attribution Gap

### What Clients Need to Know

```
❓ How often is our product recommended by AI?
❓ Which of our content sources influenced the recommendation?
❓ How do we compare to competitors in AI recommendations?
❓ What's the ROI on our GEO optimization spend?
❓ Which documentation should we prioritize updating?
```

### What's Available Today

```
✅ OpenAI o3/o4-mini models have native citation support
✅ Complete source lists with URLs
✅ Inline citations in responses
❌ No aggregated analytics across recommendations
❌ No influence scoring visibility
❌ No competitive benchmarking
❌ No ROI measurement tools
```

## Product Opportunity: Attribution Analytics Platform

### Core Product: AI Attribution Dashboard

Transform The Prompting Company from a service to a platform that provides:

#### 1. Attribution Tracking API

```javascript
// Example: Track when your product is recommended
const tpc = new PromptingCompanySDK({
  apiKey: 'your-api-key',
  product: 'Rippling'
});

// Listen for AI recommendations
tpc.attribution.track({
  sources: [
    'rippling.com/docs/*',
    'g2.com/products/rippling/*',
    'reddit.com/*/rippling'
  ],
  competitors: ['Gusto', 'Justworks', 'BambooHR'],
  queries: {
    include: ['payroll', 'HR software', 'benefits'],
    exclude: ['enterprise 1000+']
  }
});

// Get analytics
const analytics = await tpc.attribution.getAnalytics({
  timeRange: 'last_30_days',
  metrics: [
    'recommendation_volume',
    'attribution_rate',
    'influence_score',
    'competitive_share'
  ]
});
```

#### 2. Source Performance Dashboard

**Metrics to Track:**

```
┌─────────────────────────────────────────────────────────┐
│  SOURCE PERFORMANCE SCORECARD                            │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  rippling.com/docs/payroll-api                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Citation Count:        567                             │
│  Avg Influence Score:   0.45 (45%)                      │
│  Avg Confidence:        0.95 (95%)                      │
│  Trend:                 ↗ +23% vs last month            │
│  Primary Citations:     432 (76%)                       │
│  Secondary Citations:   135 (24%)                       │
│                                                          │
│  Top Query Categories:                                  │
│  • "startup payroll" → 234 citations                    │
│  • "API integration" → 156 citations                    │
│  • "small business HR" → 89 citations                   │
│                                                          │
│  Optimization Opportunities:                            │
│  🎯 Add more "50-100 employee" examples                 │
│  🎯 Improve API code snippets for Python                │
│  🎯 Create pricing comparison section                   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

#### 3. Competitive Attribution Analysis

```
┌─────────────────────────────────────────────────────────┐
│  COMPETITIVE ATTRIBUTION LANDSCAPE                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Query: "payroll software for 50-person startup"        │
│                                                          │
│  Rippling        ████████████░░░░ 65%                   │
│  Gusto           ██████░░░░░░░░░░ 35%                   │
│  Justworks       ████░░░░░░░░░░░░ 22%                   │
│  BambooHR        ███░░░░░░░░░░░░░ 18%                   │
│                                                          │
│  Attribution Share = (Your Influence Score) /           │
│                      (Sum of All Competitors)            │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │  INSIGHTS                                         │  │
│  ├──────────────────────────────────────────────────┤  │
│  │  • Leading in API-focused queries (78% share)    │  │
│  │  • Losing to Gusto on "ease of use" (42% share)  │  │
│  │  • Opportunity: "benefits administration" gap    │  │
│  │    (only 31% share, high query volume)           │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

#### 4. GEO Optimization Recommendations Engine

**AI-Powered Content Gaps:**

```
┌─────────────────────────────────────────────────────────┐
│  GEO OPPORTUNITIES (Prioritized by Impact)               │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  #1 HIGH IMPACT: "50-100 employee payroll guide"        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Query Volume:      1,247/month                         │
│  Current Attribution: 23% (BELOW COMPETITOR AVG: 67%)   │
│  Potential Citations: +892/month                        │
│  Estimated Impact:  +$127k ARR                          │
│                                                          │
│  Action Items:                                          │
│  ✓ Create dedicated landing page                        │
│  ✓ Add 3-5 case studies from 50-person companies        │
│  ✓ Include pricing calculator for this segment          │
│  ✓ Optimize for queries: "startup payroll", "small      │
│    business HR", "team of 50 payroll software"          │
│                                                          │
│  ────────────────────────────────────────────────────   │
│                                                          │
│  #2 MEDIUM IMPACT: API documentation completeness       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Query Volume:      634/month                           │
│  Current Attribution: 45% (GOOD)                        │
│  Confidence Score:  0.72 (LOW - opportunity!)           │
│  Potential Impact:  +0.15 confidence → +234 citations   │
│                                                          │
│  Action Items:                                          │
│  ✓ Add Python code examples (most requested)            │
│  ✓ Include error handling documentation                 │
│  ✓ Add video walkthroughs for common integrations       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Implementation Roadmap

### Phase 1: MVP (8 weeks)

**Week 1-2: OpenAI API Integration**
- Connect to OpenAI's o3/o4-mini citation APIs
- Parse `url_citation` objects and source lists
- Store attribution data in time-series database

**Week 3-4: Source Tracking**
- Allow clients to register their URLs for tracking
- Build URL pattern matching (wildcards, regex)
- Create competitor tracking lists

**Week 5-6: Analytics Engine**
- Calculate core metrics:
  - Recommendation volume
  - Attribution rate (% of recommendations with citations)
  - Average influence score
  - Competitive share
- Build aggregation pipelines for time-series data

**Week 7-8: Dashboard MVP**
- Simple dashboard showing:
  - Total recommendations this month
  - Top cited sources
  - Trend graphs
  - Basic competitive comparison

**Launch with:** 5-10 pilot clients from existing customer base

### Phase 2: Advanced Analytics (12 weeks)

**Week 9-12: Query Analysis**
- Categorize queries by intent
- Identify query patterns that lead to recommendations
- Map queries to source performance

**Week 13-16: GEO Recommendation Engine**
- Identify content gaps based on query volume vs. attribution
- Suggest content creation priorities
- Competitor gap analysis

**Week 17-20: Attribution Quality Scoring**
- Track influence scores over time
- Correlate content changes with attribution improvements
- Build ROI calculator (attribution → conversions)

### Phase 3: Platform Scale (16 weeks)

**Week 21-28: Self-Service Platform**
- API for developers to integrate attribution tracking
- Webhooks for real-time attribution events
- Custom report builder

**Week 29-36: Advanced Features**
- Attribution fraud detection
- Multi-model support (Claude, Gemini, etc.)
- Attribution A/B testing for content variations

## Pricing Strategy

### Tier 1: Attribution Starter ($2,000/month)
- Track up to 5 content sources
- Basic analytics dashboard
- Monthly attribution reports
- Email alerts for significant changes

### Tier 2: Attribution Professional ($5,000/month)
- Track up to 25 content sources
- Advanced analytics with competitor tracking
- GEO optimization recommendations
- Weekly reports + Slack integration
- Priority support

### Tier 3: Attribution Enterprise ($15,000/month)
- Unlimited content sources
- Real-time attribution API access
- Custom integrations
- Dedicated attribution analyst
- Quarterly strategy sessions

### Add-Ons
- **Attribution API**: $1,000/month (10k requests/day)
- **Competitive Intelligence**: $2,000/month (track 5 competitors)
- **ROI Calculator**: $500/month (conversion tracking integration)

## Competitive Moats

### 1. First-Mover Advantage
- OpenAI's o3/o4-mini citation APIs are brand new
- Most companies don't know they exist
- Attribution analytics for AI is an unsolved problem

### 2. Data Network Effects
- More clients → better benchmarks
- Aggregate data shows industry attribution trends
- Competitive intelligence improves with scale

### 3. Vertical Integration
- Only company doing both GEO optimization AND attribution tracking
- Can prove ROI on your own services
- Flywheel: better attribution → better optimization → better attribution

### 4. Technical Expertise
- Deep knowledge of OpenAI's reasoning models
- Understanding of citation architecture
- Relationships with OpenAI (potential partnership?)

## Go-to-Market Strategy

### Target Customers (Order of Priority)

**1. Existing Clients (Rippling, Rho, Motion, Vapi, Fondo, Kernel, Traceloop)**
- Already paying for GEO optimization
- Need to prove ROI to renew
- Can charge as add-on to existing service

**Pitch:** "You're paying us to get mentioned in ChatGPT. Now see exactly when it's working."

**2. B2B SaaS with Developer Tools**
- High query volume for technical documentation
- Attribution = API doc effectiveness measurement
- Examples: Stripe, Twilio, Vercel, Supabase

**Pitch:** "Your docs are being read by AI agents. Track which sections drive the most recommendations."

**3. E-commerce & DTC Brands**
- AI shopping assistants are coming
- Product recommendations = new marketing channel
- Need attribution for AI-driven sales

**Pitch:** "When ChatGPT recommends your product, you'll know which reviews, features, or content influenced it."

### Launch Strategy

**Month 1-2: Closed Beta**
- 5 existing clients
- Prove attribution tracking works
- Gather testimonials and case studies

**Month 3: Public Launch**
- Blog post: "Introducing AI Attribution Analytics"
- Target: Product Hunt, Hacker News, AI newsletters
- PR pitch: "The Google Analytics for AI Recommendations"

**Month 4-6: Content Marketing**
- Weekly blog posts on attribution insights
- "State of AI Attribution" report (aggregate data from clients)
- Podcast tour: talk about GEO + attribution

**Month 7-12: Sales Scale**
- Hire 2 sales reps focused on B2B SaaS
- Partner with content marketing agencies
- Integration partnerships (Segment, Mixpanel, etc.)

## Success Metrics

### Year 1 Goals

**Revenue:**
- 50 paying clients (avg $4,000/month)
- $200k MRR by month 12
- 85% gross margin

**Product:**
- Track 1M+ AI recommendations
- 500+ unique domains monitored
- 99.5% API uptime

**Market:**
- #1 result for "AI attribution analytics"
- 10+ case studies published
- Partnership with OpenAI or major AI platform

## Risk Mitigation

### Risk 1: OpenAI Changes Citation APIs
**Mitigation:**
- Build for multi-model support from day 1
- Integrate with Claude, Gemini, Perplexity
- Focus on attribution methodology, not just API calls

### Risk 2: Low Demand for Attribution
**Mitigation:**
- Start with existing clients (proven demand for GEO)
- Free tier to drive adoption
- Education-first content strategy

### Risk 3: Attribution Data Privacy Concerns
**Mitigation:**
- Transparent privacy policy
- Aggregate data by default
- Client controls what data is shared
- SOC 2 compliance from day 1

### Risk 4: Competitors Copy the Idea
**Mitigation:**
- Speed to market (8-week MVP)
- Data moat (more clients = better benchmarks)
- Vertical integration (GEO + attribution in one platform)
- Technical depth (hire ex-OpenAI/Anthropic engineers)

## Technical Architecture

### High-Level System Design

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT APPLICATIONS                   │
│         (Rippling, Rho, Motion, etc.)                   │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│           PROMPTING COMPANY ATTRIBUTION API              │
│  ┌──────────────────────────────────────────────────┐  │
│  │  REST API / GraphQL                               │  │
│  │  • Register sources                               │  │
│  │  • Get analytics                                  │  │
│  │  • Webhooks for real-time alerts                 │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│              ATTRIBUTION TRACKING SERVICE                │
│  ┌──────────────────────────────────────────────────┐  │
│  │  • Poll OpenAI API for public responses          │  │
│  │  • Parse citation objects                        │  │
│  │  • Match URLs to client sources                  │  │
│  │  • Calculate influence scores                    │  │
│  │  • Store in time-series DB                       │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│                   ANALYTICS ENGINE                       │
│  ┌──────────────────────────────────────────────────┐  │
│  │  • Aggregate metrics                              │  │
│  │  • Trend analysis                                 │  │
│  │  • Competitive benchmarking                       │  │
│  │  • GEO recommendations                            │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│                DATA STORAGE LAYER                        │
│  ┌────────────────────┐  ┌─────────────────────────┐   │
│  │ PostgreSQL         │  │ TimescaleDB             │   │
│  │ • Client data      │  │ • Attribution events    │   │
│  │ • Source configs   │  │ • Metrics time-series   │   │
│  │ • User accounts    │  │ • Citation history      │   │
│  └────────────────────┘  └─────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Tech Stack Recommendation

**Backend:**
- Node.js + TypeScript (fast iteration)
- NestJS framework (scalable architecture)
- PostgreSQL (relational data)
- TimescaleDB (time-series metrics)
- Redis (caching, rate limiting)

**Frontend:**
- Next.js + React (dashboard)
- TailwindCSS + shadcn/ui (components)
- Recharts (data visualization)
- Vercel (hosting)

**Infrastructure:**
- AWS (primary cloud)
- CloudFlare (CDN, DDoS protection)
- Datadog (monitoring, alerting)
- Sentry (error tracking)

**AI/ML:**
- OpenAI API (o3/o4-mini citations)
- Anthropic Claude API (multi-model support)
- Pinecone (vector search for query categorization)

## Conclusion: The Attribution Opportunity

Greg Brockman's attribution framework—embedded in OpenAI's o3/o4-mini models—creates a once-in-a-decade platform opportunity.

**The Prompting Company is uniquely positioned to capture it:**

✅ **Existing customer base** paying for GEO optimization
✅ **Technical expertise** in AI recommendation systems
✅ **First-mover advantage** in AI attribution analytics
✅ **Proven business model** with $6.5M in funding

**The next evolution of The Prompting Company:**

```
From: "Get mentioned in ChatGPT"
To:   "Prove ROI on every AI recommendation"
```

**Timeline to Market Leadership:**
- 8 weeks to MVP
- 6 months to product-market fit
- 18 months to category leadership

**The market is ready. The technology exists. The opportunity is now.**

---

## Next Steps

### Week 1: Validation
1. Interview 5 existing clients about attribution needs
2. Build API prototype connecting to OpenAI citations
3. Create mockups of attribution dashboard

### Week 2: Decision
1. Present findings to leadership team
2. Decide: build in-house vs. partner vs. acquire
3. Allocate engineering resources (2-3 engineers for MVP)

### Week 3-4: Planning
1. Finalize product requirements
2. Set up development environment
3. Design database schema
4. Plan pilot program with 5 beta clients

### Week 5+: Build
Execute the 8-week MVP roadmap outlined above.

---

**Contact for questions or collaboration:**
Albert Purnama, Co-Founder, The Prompting Company

*Research based on publicly available information about OpenAI's o3/o4-mini models and Greg Brockman's stated technical philosophy.*
