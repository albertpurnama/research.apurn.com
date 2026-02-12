# CORRECTED: What Brockman Would Actually Build

**Date:** January 18, 2026
**Critical Insight:** Citations don't equal traffic. The product must measure business outcomes, not vanity metrics.

---

## The Problem with the Original Spec

### What I Got Wrong

**Original idea:** Build "Attribution Infrastructure API" to track when AI cites your content

**The fatal flaw:**
- Citations don't equal clicks
- Most users never click citation links
- Even with 567 citations, you might get <20 actual visits
- **Attribution without traffic = useless metric**

### Why It Happened

I fell into the trap of:
1. Assuming citations → traffic (they don't)
2. Building for the measurable, not the valuable
3. Solving the easy problem (tracking citations) instead of the hard problem (proving business impact)

---

## What Brockman Would ACTUALLY Build

### Product: AI Business Intelligence Platform

**Not:** "Track when AI cites your docs"
**But:** "Prove AI drives revenue and optimize for ROI"

### The Real Value Chain

```
┌──────────────────────────────────────────────────────────┐
│  WHAT BUSINESSES ACTUALLY CARE ABOUT                      │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  ❌ How many times did AI cite our docs?                 │
│     → Interesting but meaningless                        │
│                                                           │
│  ✅ How much traffic did AI drive?                       │
│     → Measures actual user action                        │
│                                                           │
│  ✅ How much revenue did AI generate?                    │
│     → Measures business impact                           │
│                                                           │
│  ✅ What's the ROI on AI optimization?                   │
│     → Measures whether to invest more                    │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

---

## The Corrected Product Architecture

### Three-Layer Platform

#### Layer 1: AI Monitoring (Input)
**Question:** What is AI saying about us?

**Features:**
- Track mentions across ChatGPT, Claude, Perplexity, Gemini
- Sentiment analysis (positive, neutral, negative)
- Competitive comparison (you vs. competitors)
- Context extraction (what queries trigger mentions)

**API:**
```javascript
GET /v1/mentions

Response:
{
  "product": "Rippling",
  "time_period": "last_30_days",
  "total_mentions": 567,
  "sentiment": {
    "positive": 523,
    "neutral": 38,
    "negative": 6
  },
  "vs_competitors": {
    "Rippling": 567,
    "Gusto": 412,
    "Justworks": 289
  },
  "top_contexts": [
    "startup payroll",
    "API integrations",
    "benefits administration"
  ]
}
```

**Value:** Brand monitoring, competitive intelligence
**Customer pays for:** Awareness

---

#### Layer 2: Traffic Attribution (Conversion)
**Question:** Is AI actually driving traffic?

**Features:**
- Branded search volume correlation
- Direct traffic spike detection
- Multi-touch attribution modeling
- Survey integration ("How did you hear about us?")
- Statistical correlation analysis

**API:**
```javascript
GET /v1/traffic/attribution

Response:
{
  "time_period": "last_30_days",
  "ai_mentions": 567,
  "traffic_impact": {
    "branded_search_lift": "+45%",      // Google Trends data
    "direct_traffic_lift": "+32%",      // GA data
    "survey_attributed": 89,             // "ChatGPT told me"
    "statistically_attributed": 234,     // Correlation model
    "total_ai_influenced": 323,
    "click_through_rate": 0.03           // 3% clicked citation links
  },
  "confidence_score": 0.87,
  "trend": "increasing"
}
```

**Value:** Prove AI drives traffic
**Customer pays for:** Traffic attribution

---

#### Layer 3: Revenue Intelligence (Outcome)
**Question:** How much revenue is AI generating?

**Features:**
- CRM integration (Salesforce, HubSpot)
- Conversion tracking from AI-attributed traffic
- Revenue attribution calculation
- CAC (Customer Acquisition Cost) breakdown
- ROI reporting

**API:**
```javascript
GET /v1/revenue/attribution

Response:
{
  "time_period": "last_30_days",
  "ai_influenced_traffic": 323,
  "conversions": {
    "demo_bookings": 28,
    "trial_signups": 45,
    "purchases": 12
  },
  "revenue": {
    "pipeline_created": "$890,000",
    "closed_won": "$340,000",
    "average_deal_size": "$28,333"
  },
  "attribution": {
    "ai_primary_touchpoint": 8,          // AI was first touch
    "ai_assisted": 4,                     // AI in journey, not first
    "ai_influenced": 12                   // Statistical model
  },
  "roi": {
    "content_creation_cost": "$15,000",
    "revenue_generated": "$340,000",
    "roi_multiple": "22.7x",
    "recommendation": "Increase content investment"
  }
}
```

**Value:** Prove AI drives revenue, calculate ROI
**Customer pays for:** Revenue intelligence

---

### The Real Differentiator: Closed-Loop Intelligence

```
┌─────────────────────────────────────────────────────────┐
│  THE INTELLIGENCE LOOP                                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. MONITOR                                             │
│     AI mentions your product 567 times                  │
│     ↓                                                    │
│                                                          │
│  2. CORRELATE                                           │
│     323 sessions attributed to AI influence             │
│     ↓                                                    │
│                                                          │
│  3. CONVERT                                             │
│     12 conversions, $340k revenue                       │
│     ↓                                                    │
│                                                          │
│  4. ANALYZE                                             │
│     Which content drove conversions?                    │
│     "50-100 employee payroll guide" → highest ROI       │
│     ↓                                                    │
│                                                          │
│  5. OPTIMIZE                                            │
│     Create more content like winning pieces             │
│     ↓                                                    │
│                                                          │
│  6. MEASURE                                             │
│     Did optimization improve performance?               │
│     ↓ (Loop back to 1)                                 │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## How to Actually Track Traffic from AI

### The Multi-Method Approach

Since AI citations rarely get clicked, use multiple signals:

#### Method 1: Branded Search Correlation
```javascript
// Detect if AI mentions correlate with branded search spikes
const correlation = await tpc.correlate({
  ai_mentions: [
    {date: '2026-01-01', count: 45},
    {date: '2026-01-02', count: 62},
    // ...
  ],
  branded_searches: [  // From Google Trends API
    {date: '2026-01-01', volume: 1200},
    {date: '2026-01-02', volume: 1580},
    // ...
  ]
});

// Output: correlation_coefficient: 0.84 (strong correlation)
```

#### Method 2: Direct Traffic Spike Detection
```javascript
// Detect unusual direct traffic that correlates with AI mentions
const spikes = await tpc.traffic.detectSpikes({
  google_analytics: 'UA-XXXXX',
  baseline_period: '90_days',
  detection_sensitivity: 'medium'
});

// Output:
// {
//   spike_detected: true,
//   timestamp: '2026-01-15T14:30:00Z',
//   traffic_increase: '+127%',
//   likely_cause: 'AI mention spike 2 hours prior'
// }
```

#### Method 3: Survey Attribution
```javascript
// Ask users how they found you
const surveys = await tpc.surveys.analyze({
  source: 'hubspot',
  question: 'How did you hear about us?',
  ai_keywords: [
    'ChatGPT', 'Claude', 'AI', 'AI recommended',
    'AI told me', 'asked ChatGPT'
  ]
});

// Output:
// {
//   total_responses: 145,
//   ai_attributed: 34,
//   percentage: 23.4%
// }
```

#### Method 4: UTM Tracking (for AI platforms that support it)
```javascript
// Perplexity includes clickable links, track with UTM
const utm_traffic = await tpc.utm.analyze({
  google_analytics: 'UA-XXXXX',
  utm_source: 'perplexity',
  utm_medium: 'ai_citation'
});

// Output:
// {
//   sessions: 89,
//   conversions: 4,
//   conversion_rate: 4.5%
// }
```

#### Method 5: Multi-Touch Attribution Model
```javascript
// Statistical model correlating AI mentions with downstream conversions
const attribution = await tpc.attribution.model({
  ai_mentions: mentions_timeseries,
  traffic: traffic_timeseries,
  conversions: conversion_timeseries,
  model: 'time_decay',  // Weight recent touches more
  window: '30_days'
});

// Output:
// {
//   ai_attribution: {
//     primary: 8,      // AI was first and only touch
//     assisted: 15,    // AI was in journey
//     influenced: 34   // Statistically likely
//   }
// }
```

---

## The Corrected Pricing Model

### Based on Business Outcomes, Not Data Volume

**Tier 1: AI Brand Monitor**
**$500/month**
- Track what AI says about you
- Competitive comparison
- Sentiment analysis
**Value:** Know your AI reputation

**Tier 2: Traffic Attribution**
**$2,000/month**
- Everything in Tier 1
- Branded search correlation
- Traffic spike detection
- Multi-method attribution
**Value:** Prove AI drives traffic

**Tier 3: Revenue Intelligence**
**$5,000/month**
- Everything in Tier 2
- CRM integration
- Conversion tracking
- Revenue attribution
- ROI calculation
**Value:** Prove AI drives revenue

**Tier 4: Optimization Platform**
**$10,000/month**
- Everything in Tier 3
- A/B testing framework
- Content recommendations
- ROI-driven prioritization
- Predictive modeling
**Value:** Maximize AI-driven revenue

---

## Why This is the Right Product

### It Solves the Real Problem

**Wrong problem:** "How many times did AI cite us?"
**Right problem:** "How much revenue is AI generating?"

**Wrong metric:** Citation count
**Right metric:** Revenue attribution

**Wrong value prop:** "Track AI citations"
**Right value prop:** "Prove AI ROI"

### It's What Customers Actually Pay For

**Customers don't care about citations.**
They care about:
- ✅ Traffic (visitors)
- ✅ Leads (conversions)
- ✅ Revenue (deals closed)
- ✅ ROI (is it worth it?)

### It's Defensible

**Attribution data alone:** Easy to replicate
**Traffic correlation:** Harder to replicate
**Revenue intelligence:** Requires deep integrations
**Optimization recommendations:** Requires sophisticated ML

---

## The Real Go-to-Market

### Phase 1: Prove AI Drives Revenue (Month 1-3)

**Target:** Existing Prompting Company customers (Rippling, Rho, Motion)

**Offer:** Free pilot
"We'll prove AI is driving revenue for you. If it's not, we'll help you fix it."

**Deliverable:**
- 30-day analysis
- Traffic attribution report
- Revenue impact calculation
- If positive: "AI drove $340k in revenue"
- If negative: "Here's why AI isn't working and how to fix it"

**Result:** Case studies proving AI drives revenue

---

### Phase 2: Scale to Similar Companies (Month 4-6)

**Target:** B2B SaaS companies investing in content

**Message:** "AI drove $340k revenue for Rippling. Here's how much it's driving for you."

**Channel:**
- Case study content marketing
- "State of AI Attribution" report (aggregate data)
- ROI calculator tool (viral growth)

**Conversion funnel:**
1. Free AI audit (lead gen)
2. Show them their current AI performance
3. Upsell to paid monitoring + optimization

---

### Phase 3: Enterprise Scale (Month 7-12)

**Target:** Companies with >$50M revenue

**Offer:** Revenue Intelligence Platform
- Full-funnel attribution
- Custom integrations
- Dedicated analyst
- Quarterly business reviews

**Pricing:** $15k-50k/month based on revenue impact

---

## Example: Real Customer Journey

### Rippling Case Study

**Week 1: Install Monitoring**
```
AI mentions detected: 567
Sentiment: 92% positive
Competitive position: #1 vs. Gusto, Justworks
```

**Week 2: Correlate with Traffic**
```
Branded searches: +45% (correlates with AI mentions)
Direct traffic: +32% (spike detected)
AI-attributed sessions: 323 (statistical model)
```

**Week 3: Track Conversions**
```
Demo bookings: 28 (from AI-attributed traffic)
Conversion rate: 8.7% (vs. 3.2% average)
Pipeline created: $890k
```

**Week 4: Calculate ROI**
```
Revenue closed: $340k
Content investment: $15k
ROI: 22.7x

Insight: "AI-influenced leads convert 2.7x better"
```

**Week 5: Optimize**
```
Analysis: "50-100 employee" content drives highest ROI
Recommendation: Create more content for this segment
Estimated impact: +$420k additional revenue
```

**Month 2: Measure Improvement**
```
With optimization:
AI mentions: 712 (+25%)
AI-attributed revenue: $510k (+50%)
Content ROI: 31.4x (+38%)
```

**Value delivered:** Proved AI drives revenue, optimized for higher ROI

---

## Technical Architecture (Revised)

### Data Sources

**1. AI Platforms**
- OpenAI (o3/o4-mini citations)
- Anthropic Claude (when citation API available)
- Perplexity (sources API)
- Google AI Overview
- Custom LLM monitoring

**2. Analytics Platforms**
- Google Analytics (traffic data)
- Google Trends (branded search volume)
- Adobe Analytics
- Mixpanel, Amplitude (product analytics)

**3. CRM/Marketing Automation**
- Salesforce (deals, revenue)
- HubSpot (leads, attribution)
- Marketo (campaign tracking)
- Segment (customer data platform)

**4. Survey Tools**
- Typeform, SurveyMonkey ("How did you hear about us?")
- On-site surveys (popup after demo booking)
- Email surveys (post-sale attribution)

### Processing Pipeline

```
┌────────────────────────────────────────────────────────┐
│  DATA INGESTION                                         │
├────────────────────────────────────────────────────────┤
│  • AI mention scrapers (Kafka)                         │
│  • Analytics webhooks (real-time)                      │
│  • CRM API polling (hourly)                            │
│  • Survey data imports (daily)                         │
└────────────────────────────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────┐
│  CORRELATION ENGINE                                     │
├────────────────────────────────────────────────────────┤
│  • Time-series correlation (AI mentions ↔ traffic)     │
│  • Spike detection algorithms                          │
│  • Multi-touch attribution models                      │
│  • Statistical significance testing                    │
└────────────────────────────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────┐
│  REVENUE ATTRIBUTION                                    │
├────────────────────────────────────────────────────────┤
│  • CRM deal matching                                   │
│  • Survey response parsing                             │
│  • Attribution weight calculation                      │
│  • ROI computation                                     │
└────────────────────────────────────────────────────────┘
                          ↓
┌────────────────────────────────────────────────────────┐
│  OPTIMIZATION RECOMMENDATIONS                           │
├────────────────────────────────────────────────────────┤
│  • Content performance ranking                         │
│  • Gap analysis (high queries, low attribution)       │
│  • ROI-based prioritization                            │
│  • A/B test suggestions                                │
└────────────────────────────────────────────────────────┘
```

---

## What Brockman Would Say

### On the Original Spec

> "Attribution tracking is interesting, but it's not the product. It's infrastructure for the product. The product is proving business impact."

### On API-First

> "Still build API-first, but the API should return business intelligence, not just citation counts. Revenue attribution, not data dumps."

### On Pricing

> "Don't charge for events or data volume. Charge for value delivered. If we prove you made $340k from AI, charging $5k/month is a no-brainer."

### On Go-to-Market

> "Start with proof. Show one customer AI drove real revenue. Then the product sells itself. 'AI drove $340k for Rippling' is better than any sales deck."

---

## Conclusion: The Corrected Vision

**Your question was right:**
> "If no one is searching for that exact query, why would citation count matter?"

**The answer:**
Citation count doesn't matter. What matters is:
1. **Traffic** - Do people actually visit your site?
2. **Conversions** - Do visitors become customers?
3. **Revenue** - How much money did AI generate?
4. **ROI** - Is it worth investing more?

**The corrected product:**
Not an attribution API, but a **Revenue Intelligence Platform** that answers these questions and proves AI's business impact.

**The real value proposition:**
"We prove AI drives revenue and show you how to maximize it."

---

## Updated Product Name

**Not:** The Prompting Company Attribution API

**But:** **The Prompting Company Revenue Intelligence Platform**

or simply:

**Prompting Intelligence** - *Prove AI drives revenue*

---

**This is what Brockman would actually build.**

And it's what actually matters to businesses.
