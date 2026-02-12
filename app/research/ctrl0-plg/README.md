# Ctrl0 Product-Led Growth Research

Research into [Ctrl0](https://github.com/promptingcompany/ctrl0) (The Prompting Company), an AI-powered brand analytics platform. This analysis focuses on **product-led growth implementation through sophisticated metrics instrumentation, onboarding flows, and analytics architecture**.

Ctrl0 demonstrates enterprise-grade PLG infrastructure with **Tinybird-powered real-time analytics** (40+ datasources), **7-step onboarding with AI-powered domain analysis**, **entitlement-based billing with hard/soft limits**, and **comprehensive engagement loops** (weekly reports, daily prompts, opportunity notifications). The platform tracks brand mentions across AI systems (ChatGPT, Perplexity, Claude) and provides "Share of Voice" metrics, citation analysis, and content performance tracking.

**Key Technical Finding**: Separating analytics from the main PostgreSQL database using Tinybird enables **billions of events with sub-second queries** without loading production infrastructure—a critical pattern for PLG metrics at scale.

---

## Research Files

| File | Description |
|------|-------------|
| [RESEARCH.md](./RESEARCH.md) | **Start here.** Comprehensive PLG architecture analysis covering analytics infrastructure, onboarding flows, billing, feature flags, engagement loops, and KPIs |
| [CLAUDE.md](./CLAUDE.md) | Codebase documentation with clone info and key file references |

---

## Quick Summary: PLG Implementation

### 1. **Analytics Infrastructure** (Tinybird)
- **40+ datasources**: Citation events, brand mentions, LLM usage, AI bot detection
- **20+ query endpoints**: Share of Voice, citation rankings, traffic analysis, usage billing
- **Materializations**: 30-day rolling windows, daily aggregations
- **Multi-tenant**: Token-based organization scoping

### 2. **Onboarding Flow** (7 Steps)
1. Welcome → Introduction
2. Domain Analysis → AI analyzes website to extract brand details
3. Invite Selection → Team activation (conditional)
4. Product Setup → Configure brand/product (pre-populated)
5. Prompt Selection → Choose monitoring queries
6. Subscription Selection → Pick plan tier
7. Complete → Dashboard redirect

**State**: Redis-persisted Zustand store (24hr TTL) enables pause/resume

### 3. **Entitlements & Billing**
- **FREE**: 1 product, unlimited answers, 10K citations
- **BASIC**: 1 product, 2.5K answers, 10K citations
- **PRO** ($249/mo): 1 product, 5K answers, 300K citations
- **ENTERPRISE**: 100 products, 100K answers, 1M citations

**Hard limits** (products): Block access when exceeded
**Soft limits** (answers, citations): Allow overage with additional billing

### 4. **Feature Flags**
- Database-backed (`FeatureFlag` model)
- User-level and organization-level scoping
- API for management + admin controls
- Use cases: Beta rollouts (GA4, PostHog), A/B testing

### 5. **Engagement Loops**
- **Weekly reports**: Email summaries of SoV, citations, opportunities
- **Daily prompts**: AI-generated monitoring suggestions with feedback
- **Opportunity notifications**: AI-identified business insights

### 6. **Third-Party Integrations**
- **PostHog**: Product analytics (funnels, retention, events)
- **Google Analytics 4**: Website traffic correlation with AI mentions
- **Linear**: Create tasks from opportunities
- **Stripe**: Payment processing (integration pending)

### 7. **Key Metrics Tracked**
- **Activation**: Onboarding completion, first query created
- **Engagement**: Daily prompt feedback, weekly report opens, dashboard sessions
- **Adoption**: Custom views, integrations, tracked URLs
- **Usage**: API calls, tokens, cost per organization (via Tinybird)
- **Expansion**: Products created, team size, query volume
- **Retention**: Weekly active users, last activity timestamp

---

## Tech Stack

- **Frontend**: Next.js 16, React 19
- **Backend**: Next.js API routes (Node.js)
- **Database**: PostgreSQL 17 + pgvector
- **Analytics**: Tinybird (real-time ClickHouse-based)
- **Cache**: Redis
- **Jobs**: BullMQ (background) + Temporal (durable workflows)
- **Auth**: Better Auth
- **ORM**: Prisma
- **Email**: Resend
- **Payments**: Stripe
- **LLM Providers**: OpenAI, Anthropic, Perplexity, Google, DeepSeek

---

## Architecture Highlights

### Multi-Tenant Isolation
All queries scoped to `session.activeOrganizationId` for data separation

### Analytics Separation Pattern
- **PostgreSQL**: Transactional data (users, subscriptions, brands)
- **Tinybird**: Analytics data (billions of events, time-series queries)
- **Benefit**: Analytics queries don't impact production database performance

### Worker Architecture
- **BullMQ**: Background jobs (emails, AI processing, scraping)
- **Temporal**: Long-running workflows (conversation analysis, batch jobs)

### Entitlement Enforcement
- **Hard limits**: Block feature access at quota
- **Soft limits**: Allow overage, track for billing

### Persistent Onboarding
- Redis-backed state survives browser refresh
- Enables pause/resume of multi-step activation

---

## PLG Lessons

1. **Separate analytics infrastructure** - Critical for real-time dashboards at scale
2. **AI-powered onboarding** - Domain analysis reduces friction and accelerates setup
3. **Soft limits enable value demonstration** - Users can exceed limits before forced upgrade
4. **Feature flags for gradual rollouts** - Beta features without code deployment
5. **Email as retention driver** - Weekly reports bring users back with value summary
6. **Opportunity notifications** - AI surfaces actionable insights to demonstrate value
7. **Comprehensive instrumentation** - 67+ database models + 40+ Tinybird datasources capture every interaction
8. **Multi-level feature flags** - User-level for experimentation, org-level for enterprise controls

---

## Missing PLG Elements (Opportunities)

Based on codebase analysis:

- **In-app messaging** (Chameleon, Appcues)
- **NPS/CSAT surveys** (limited feedback collection)
- **Usage dashboards for users** (exists for admins, not self-service)
- **Churn prediction models** (no ML-based churn detection)
- **Referral program** (no viral loops)
- **Interactive product tours** (onboarding is procedural, not guided)
- **Direct A/B testing UI** (flags exist but no built-in experimentation framework)
- **Automated usage-based billing** (entitlements manual, not auto-calculated from Tinybird)
- **Free trial period tracking** (subscription model doesn't explicitly track trials)
