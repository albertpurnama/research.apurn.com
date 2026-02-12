# Strategic Comparison: Standard Approach vs. Brockman's Approach

**Date:** January 18, 2026
**Purpose:** Compare the traditional SaaS playbook with Greg Brockman's demonstrated product philosophy

## Executive Summary

This document compares two approaches to building The Prompting Company's attribution product:
1. **Standard SaaS Playbook** (from prompting-company-action-plan.md)
2. **Brockman's Infrastructure Playbook** (from brockman-product-spec.md)

Both are viable. The choice depends on your goals, resources, and philosophy.

---

## Side-by-Side Comparison

| Dimension | Standard SaaS Approach | Brockman's Infrastructure Approach |
|-----------|------------------------|-----------------------------------|
| **Core Product** | Attribution Analytics Dashboard | Attribution Infrastructure API |
| **Target Customer** | B2B SaaS companies (Rippling, Rho, Motion) | Developers at any company |
| **Go-to-Market** | Enterprise sales + marketing | Developer community + word-of-mouth |
| **Pricing Model** | Tiered subscriptions ($2k-$15k/month) | Usage-based pay-as-you-go ($0.01/100 events) |
| **MVP Timeline** | 8 weeks | 2 weeks (weekend hack + hardening) |
| **First Version** | Full-featured dashboard with analytics | Minimal API with 3 endpoints |
| **Sales Motion** | Sales reps call prospects | Developers discover via Hacker News/GitHub |
| **Revenue Model** | Predictable MRR | Variable based on usage |
| **Competitive Moat** | Data network effects + client relationships | Developer experience + ecosystem |
| **Scaling Path** | Add more enterprise customers | Platform enables infinite use cases |
| **Team Size (Year 1)** | 10-15 people (sales, eng, design, support) | 5-7 people (mostly engineers) |
| **First-Year Revenue Target** | $200k MRR (50 customers × $4k avg) | $200k MRR (2,000 developers × $100 avg) |
| **Capital Efficiency** | Moderate (sales team overhead) | High (mostly infrastructure costs) |
| **Market Size** | B2B SaaS companies doing GEO | Entire AI recommendation space |
| **Technical Complexity** | Moderate (dashboard + analytics engine) | High (API infrastructure at scale) |
| **Product Philosophy** | "Build what customers ask for" | "Build infrastructure, let them build" |

---

## Deep Dive: Key Strategic Differences

### 1. Product Vision

#### Standard SaaS Approach
```
Vision: "Be the Google Analytics for AI Recommendations"

Product:
┌─────────────────────────────────────────┐
│   THE PROMPTING COMPANY DASHBOARD       │
├─────────────────────────────────────────┤
│                                          │
│  📊 Attribution Analytics                │
│  • Citation volume charts                │
│  • Influence score trends                │
│  • Competitive benchmarking              │
│  • Source performance ranking            │
│  • GEO optimization recommendations      │
│                                          │
│  Pre-built, ready to use                 │
│  Clients log in and see insights         │
│                                          │
└─────────────────────────────────────────┘

Customer: "This solves my exact problem"
```

#### Brockman's Infrastructure Approach
```
Vision: "Be the Stripe for AI Attribution"

Product:
┌─────────────────────────────────────────┐
│   THE PROMPTING COMPANY API              │
├─────────────────────────────────────────┤
│                                          │
│  🔌 Attribution Infrastructure           │
│  • POST /v1/sources (register URLs)      │
│  • GET /v1/attributions (query data)     │
│  • WebSocket /v1/stream (real-time)      │
│  • Webhooks for alerts                   │
│                                          │
│  Primitive building blocks               │
│  Developers build their own dashboards   │
│                                          │
└─────────────────────────────────────────┘

Customer: "This lets me build what I need"
```

**Strategic Implication:**
- **SaaS:** Faster initial sales, narrower market
- **Infrastructure:** Slower initial sales, exponentially larger market

---

### 2. Customer Acquisition

#### Standard SaaS Approach

**Funnel:**
```
1. Generate Leads
   ├─ Content marketing (SEO, blogs)
   ├─ Paid ads (Google, LinkedIn)
   ├─ Conference sponsorships
   └─ Partner referrals

2. Qualify Leads
   ├─ BDR team qualifies inbound leads
   ├─ SDR team does outbound cold outreach
   └─ Demo requests scheduled

3. Sales Process
   ├─ Discovery call (30 min)
   ├─ Product demo (45 min)
   ├─ Trial period (14 days)
   ├─ Follow-ups (3-5 touchpoints)
   └─ Close (negotiation, legal review)

4. Onboarding
   ├─ Kickoff call
   ├─ White-glove setup
   ├─ Training sessions
   └─ CSM assigned

Timeline: 2-3 months from lead to customer
Cost per Acquisition (CAC): $3,000-$8,000
```

**Team Required:**
- 2 BDRs (qualify inbound)
- 2 SDRs (cold outbound)
- 2 AEs (close deals)
- 1 Sales Engineer (technical demos)
- 2 CSMs (customer success)
- **Total: 9 people** (mostly sales)

**Metrics:**
- CAC payback: 12-18 months
- Customer lifetime value: $50k (typical B2B SaaS)
- Win rate: 20-25%

#### Brockman's Infrastructure Approach

**Funnel:**
```
1. Developers Discover
   ├─ Hacker News (#1 post)
   ├─ GitHub trending (open source SDKs)
   ├─ Product Hunt (#1 product of the day)
   ├─ Dev.to / HashNode articles
   └─ Word of mouth (dev community)

2. Self-Service Trial
   ├─ Sign up with GitHub (1 click)
   ├─ Get API key (instant)
   ├─ Copy-paste example code (30 seconds)
   ├─ See data flowing (2 minutes)
   └─ Free tier (10k events/month)

3. Natural Upgrade
   ├─ Developer sees value
   ├─ Usage grows beyond free tier
   ├─ Automatic upgrade to pay-as-you-go
   └─ No sales call needed

4. Expansion
   ├─ Developer shares with team
   ├─ Multiple teams adopt
   ├─ Company-wide usage
   └─ Enterprise contact (inbound)

Timeline: 1-7 days from discovery to paying
Cost per Acquisition (CAC): $50-$200
```

**Team Required:**
- 2 Developer Advocates (community, content)
- 1 Developer Relations (partnerships)
- 0 Sales reps (self-serve)
- **Total: 3 people** (mostly technical)

**Metrics:**
- CAC payback: 1-3 months
- Customer lifetime value: $5k-$50k (wide range)
- Conversion rate: 5-10% (free → paid)

**Strategic Implication:**
- **SaaS:** Higher CAC, predictable sales, longer sales cycles
- **Infrastructure:** Lower CAC, viral growth, instant activation

---

### 3. Revenue Model

#### Standard SaaS Approach

**Tiered Pricing:**
```
┌──────────────────────────────────────┐
│  ATTRIBUTION STARTER                  │
│  $2,000/month                         │
│  ────────────────────────────────────│
│  • Track up to 5 content sources      │
│  • Basic analytics dashboard          │
│  • Monthly reports                    │
│  • Email alerts                       │
│                                       │
│  Target: Small B2B SaaS (10-50 employees)
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  ATTRIBUTION PROFESSIONAL             │
│  $5,000/month                         │
│  ────────────────────────────────────│
│  • Track up to 25 content sources     │
│  • Advanced analytics + competitors   │
│  • GEO optimization recommendations   │
│  • Weekly reports + Slack integration │
│                                       │
│  Target: Mid-market B2B SaaS (50-200 employees)
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  ATTRIBUTION ENTERPRISE               │
│  $15,000/month                        │
│  ────────────────────────────────────│
│  • Unlimited content sources          │
│  • Real-time attribution API access   │
│  • Custom integrations                │
│  • Dedicated attribution analyst      │
│                                       │
│  Target: Enterprise (200+ employees)  │
└──────────────────────────────────────┘
```

**Revenue Math (Year 1):**
- 30 Starter customers × $2k = $60k MRR
- 15 Professional customers × $5k = $75k MRR
- 5 Enterprise customers × $15k = $75k MRR
- **Total: $210k MRR = $2.52M ARR**

**Characteristics:**
- ✅ Predictable revenue
- ✅ High gross margin (85%+)
- ✅ Upsell path (Starter → Pro → Enterprise)
- ❌ Seat-based limits feel arbitrary
- ❌ Requires sales team
- ❌ Hard to scale beyond enterprise market

#### Brockman's Infrastructure Approach

**Usage-Based Pricing:**
```
┌──────────────────────────────────────┐
│  FREE TIER                            │
│  $0/month                             │
│  ────────────────────────────────────│
│  • 10,000 attribution events/month    │
│  • 5 tracked sources                  │
│  • 7-day data retention               │
│  • Basic API access                   │
│                                       │
│  Target: Developers experimenting     │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  PAY-AS-YOU-GO                        │
│  Usage-based                          │
│  ────────────────────────────────────│
│  • $0.01 per 100 attribution events   │
│  • $10/month per tracked source       │
│  • Unlimited data retention           │
│  • Full API access + webhooks         │
│                                       │
│  Target: Growing companies            │
│                                       │
│  Example bills:                       │
│  • 100k events, 10 sources = $110/mo  │
│  • 500k events, 25 sources = $300/mo  │
│  • 5M events, 100 sources = $1,500/mo │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│  ENTERPRISE                           │
│  Custom                               │
│  ────────────────────────────────────│
│  • Volume discounts                   │
│  • Dedicated infrastructure           │
│  • SLA guarantees (99.95% uptime)     │
│  • Private deployment options         │
│                                       │
│  Target: High-volume usage            │
└──────────────────────────────────────┘
```

**Revenue Math (Year 1):**
- 1,500 free tier users (conversion funnel)
- 150 pay-as-you-go customers × $150 avg = $22.5k MRR
- 30 mid-tier customers × $500 avg = $15k MRR
- 5 enterprise customers × $3k avg = $15k MRR
- **Total: $52.5k MRR = $630k ARR**

Wait... that's less than SaaS approach?

**Year 2 (with network effects):**
- 10,000 free tier users
- 1,000 pay-as-you-go × $200 avg = $200k MRR
- 100 mid-tier × $800 avg = $80k MRR
- 20 enterprise × $5k avg = $100k MRR
- **Total: $380k MRR = $4.56M ARR**

**Year 3 (platform scale):**
- 50,000 free tier users
- 5,000 pay-as-you-go × $250 avg = $1.25M MRR
- 500 mid-tier × $1k avg = $500k MRR
- 50 enterprise × $10k avg = $500k MRR
- **Total: $2.25M MRR = $27M ARR**

**Characteristics:**
- ✅ Scales with customer value
- ✅ Natural product-led growth
- ✅ Lower CAC (self-serve)
- ✅ Larger addressable market
- ❌ Less predictable revenue (Year 1)
- ❌ Requires patience for network effects
- ❌ Complexity in usage tracking/billing

**Strategic Implication:**
- **SaaS:** Faster to $1M ARR, harder to reach $10M ARR
- **Infrastructure:** Slower to $1M ARR, easier to reach $50M ARR

---

### 4. Product Development

#### Standard SaaS Approach

**8-Week MVP Roadmap:**

**Week 1-2: Foundation**
- [ ] User authentication system
- [ ] Dashboard UI framework
- [ ] Database schema design
- [ ] OpenAI API integration

**Week 3-4: Core Analytics**
- [ ] Attribution tracking pipeline
- [ ] Data aggregation engine
- [ ] Citation counting logic
- [ ] Time-series storage

**Week 5-6: Dashboard Features**
- [ ] Citation volume charts
- [ ] Influence score visualization
- [ ] Competitive comparison view
- [ ] Source performance ranking
- [ ] Export reports (PDF, CSV)

**Week 7-8: Polish & Launch**
- [ ] Onboarding flow
- [ ] Help documentation
- [ ] Email notifications
- [ ] Billing integration
- [ ] Beta launch to 5 customers

**Team:**
- 2 Backend engineers
- 2 Frontend engineers
- 1 Product designer
- 1 Product manager
- **Total: 6 people**

**Tech Stack:**
- Frontend: React + Next.js
- Backend: Node.js + PostgreSQL
- Charts: Recharts/D3.js
- Hosting: Vercel

**Result:** Full-featured dashboard, ready for sales demos

#### Brockman's Infrastructure Approach

**2-Week MVP Roadmap:**

**Weekend Hack (Day 1-2):**
- [ ] Basic API server (Fastify)
- [ ] 3 endpoints: register sources, track events, query data
- [ ] PostgreSQL + TimescaleDB setup
- [ ] OpenAI webhook receiver
- [ ] Deploy to AWS
- [ ] Test with real data

**Week 1 (Day 3-7):**
- [ ] Rate limiting (Redis)
- [ ] API versioning
- [ ] Error handling (plain English)
- [ ] Basic SDKs (Python, JavaScript)
- [ ] API documentation site
- [ ] Usage tracking + billing
- [ ] Load testing

**Week 2 (Day 8-14):**
- [ ] Interactive API explorer
- [ ] Code generation tool
- [ ] Webhook testing dashboard
- [ ] Example apps (3-5 working examples)
- [ ] Video tutorials
- [ ] Status page
- [ ] Launch on Hacker News

**Team:**
- Greg Brockman (hacks together first version)
- 2 Backend engineers (production hardening)
- 1 DevOps engineer (infrastructure)
- 1 Developer advocate (docs, examples, community)
- **Total: 5 people** (including Brockman)

**Tech Stack:**
- Backend: Node.js + Fastify
- Database: PostgreSQL + TimescaleDB + Redis
- Event Processing: Kafka + Flink
- Hosting: AWS + Kubernetes
- CDN: CloudFlare

**Result:** Production API, minimal dashboard, developer community excited

**Strategic Implication:**
- **SaaS:** More features, better for demos, appeals to buyers
- **Infrastructure:** Fewer features, better for developers, enables ecosystem

---

### 5. Competitive Positioning

#### Standard SaaS Approach

**Category:** Attribution Analytics for AI
**Positioning:** "Google Analytics for AI Recommendations"

**Competitive Landscape:**
```
Direct Competitors:
• None yet (new category)

Indirect Competitors:
• Google Analytics (traditional web analytics)
• Mixpanel (product analytics)
• Amplitude (behavioral analytics)

Competitive Advantages:
✅ First-mover in AI attribution
✅ Integrated with The Prompting Company's GEO services
✅ Built-in competitive intelligence
✅ GEO optimization recommendations

Competitive Disadvantages:
❌ Limited to AI attribution (not full analytics stack)
❌ Dependent on LLM citation APIs
❌ Small addressable market (B2B SaaS doing GEO)
```

**Moat:**
- Data network effects (aggregate benchmarks)
- Customer relationships (enterprise sales)
- Integration depth (custom reporting, CSM support)

**Exit Strategy:**
- Acquisition by analytics company (Mixpanel, Amplitude)
- Acquisition by AI platform (OpenAI, Anthropic)
- Standalone business ($10-50M ARR)

#### Brockman's Infrastructure Approach

**Category:** Attribution Infrastructure
**Positioning:** "The Stripe for AI Attribution"

**Competitive Landscape:**
```
Direct Competitors:
• None yet (new category)

Indirect Competitors:
• Attribution API wrapper companies (if they emerge)
• Analytics platforms adding AI features

Competitive Advantages:
✅ Developer experience (Stripe-level polish)
✅ Platform play (any vertical, any use case)
✅ Open source ecosystem (community SDKs)
✅ Multi-model support (not locked to OpenAI)
✅ Network effects (more devs = better attribution data)

Competitive Disadvantages:
❌ Requires developer adoption (slower initial growth)
❌ Complex infrastructure (high technical bar)
❌ Commoditization risk (if LLMs build this natively)
```

**Moat:**
- Developer love (word-of-mouth growth)
- Ecosystem (community-built integrations)
- Switching costs (integrated into codebases)
- Technical depth (infrastructure expertise)

**Exit Strategy:**
- Acquisition by AI platform (OpenAI, Anthropic, Google)
- Acquisition by developer platform (Vercel, Netlify, Supabase)
- IPO ($500M+ ARR, infrastructure scale)

**Strategic Implication:**
- **SaaS:** $10-50M exit, analytics play
- **Infrastructure:** $500M+ exit, platform play

---

## Which Approach is Right?

### Choose Standard SaaS Approach If:

✅ You want **predictable revenue** from day 1
✅ You have **enterprise sales experience** on the team
✅ You're comfortable with **slower, linear growth**
✅ Your goal is **$10-50M exit** in 3-5 years
✅ You prefer **product-market fit via customer interviews**
✅ You want to **serve a specific vertical** (B2B SaaS)
✅ You have **$6.5M in funding** for a sales team
✅ You're **risk-averse** (dashboard = tangible product to sell)

**Outcome:** Successful SaaS business, $20-50M ARR in 5 years, acquisition by analytics company

### Choose Brockman's Infrastructure Approach If:

✅ You want **exponential, platform-scale growth**
✅ You have **deep technical expertise** (Stripe/OpenAI level)
✅ You're comfortable with **slower Year 1, explosive Year 2-3**
✅ Your goal is **$100M+ exit** or **IPO** in 5-7 years
✅ You prefer **product-led growth** via developer love
✅ You want to **enable any vertical** (entire AI space)
✅ You're **capital efficient** (mostly eng team, no sales)
✅ You're **technically ambitious** (like Greg Brockman)

**Outcome:** Infrastructure platform, $100M+ ARR in 5-7 years, IPO or strategic mega-acquisition

---

## Hybrid Approach: Best of Both Worlds?

### Is There a Middle Ground?

**Phase 1 (Year 1): Start with Infrastructure**
- Build API-first (Brockman's approach)
- Launch to developers
- Get early adoption + feedback
- Low CAC, fast iteration

**Phase 2 (Year 2): Add SaaS Layer**
- Build dashboard on top of your own API
- Target enterprise customers who want "done for you"
- Hire sales team
- Offer white-glove service

**Phase 3 (Year 3+): Platform + SaaS**
- API for developers (self-serve)
- Dashboard for enterprises (sales-led)
- Best of both worlds

**Companies That Did This:**
- **Stripe:** Started with API, added Atlas/Billing/etc.
- **Twilio:** Started with API, added Segment
- **AWS:** Started with infrastructure, added managed services

**Risk:**
- Splitting focus between two business models
- Different sales motions compete for resources
- "Jack of all trades, master of none"

**Brockman Would Say:**
> "Don't try to do both. Pick infrastructure. If enterprises want a dashboard, they'll build it themselves or someone else will build it on your API. That's the ecosystem working."

---

## Final Recommendation

### If The Prompting Company Already Exists with $6.5M Funding:

**Keep doing Standard SaaS Approach (prompting-company-action-plan.md)**

**Why?**
- You already have GEO consulting revenue
- You have enterprise customers (Rippling, Rho, Motion)
- You have a sales motion that works
- Attribution dashboard is a natural upsell
- Lower risk path to product-market fit

**But adopt these Brockman principles:**
- API-first architecture (even if dashboard is main product)
- Developer-quality documentation
- Free tier for developers to experiment
- Open source SDKs

---

### If You're Starting From Scratch (New Company):

**Go with Brockman's Infrastructure Approach (brockman-product-spec.md)**

**Why?**
- Lower capital requirements ($2M seed vs. $6.5M)
- Higher ceiling ($100M+ vs. $50M)
- More defensible moat (developer ecosystem)
- Riding the platform wave (like Stripe in payments)

**But be prepared for:**
- Slower Year 1 revenue
- Need exceptional engineering team
- Marathon, not sprint
- Requires patience from investors

---

## Conclusion

Both approaches can build a successful business. The choice is **philosophical**, not just tactical.

**Standard SaaS:** Build what customers ask for
**Brockman Infrastructure:** Build what developers can build on

Both are right. **Choose based on who you are**, not just market opportunity.

If you're Greg Brockman:
- Hack together API over Christmas
- Ship in 2 weeks
- Developer community launch
- Let them build the ecosystem

If you're The Prompting Company:
- Sell to your existing customers first
- Build dashboard they want
- Prove ROI on GEO services
- Grow predictably

**The market is big enough for both approaches to succeed.**

---

## Appendix: Greg Brockman in His Own Words

### On Building Products

> "The majority of design decisions could be made with domain-agnostic software engineering intuitions."
> — Greg Brockman on building GPT-3 API

### On Developer Experience

> "Take the BS out of small interactions by using plain English error messages—instead of just 'Error: Could not process request,' you get a message more like 'Error: You're using this in test mode'"
> — Greg Brockman at Stripe

### On Platform vs. Verticals

> Building specific vertical applications was "tunnel vision" and "exactly backwards the way you're supposed to build a startup"
> — Greg Brockman on why OpenAI built an API instead of vertical apps

### On Shipping Fast

> "He basically hacked together the first API one weekend, I think over Christmas"
> — Former OpenAI engineer on Greg Brockman's work ethic

### On Infrastructure

> "Compute is one of the key bottlenecks for AI adoption"
> — Greg Brockman on infrastructure-first thinking

**The Brockman Way: Platform. Speed. Infrastructure. Developers.**

---

**Document Version:** 1.0
**Created:** January 18, 2026
