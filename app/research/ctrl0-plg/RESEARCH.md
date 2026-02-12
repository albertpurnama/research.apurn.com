# Ctrl0 Product-Led Growth: Technical Architecture & Metrics

**Research Date:** January 2026
**Repository:** [promptingcompany/ctrl0](https://github.com/promptingcompany/ctrl0)
**Focus:** Product-led growth implementation, metrics instrumentation, and analytics architecture

---

## Overview

Ctrl0 (The Prompting Company) is an AI-powered brand analytics platform that implements **product-led growth through sophisticated, multi-layered instrumentation**. The platform tracks brand mentions across AI systems (ChatGPT, Perplexity, Claude, etc.) and provides "Share of Voice" metrics, citation analysis, and content performance tracking.

**Key PLG Components:**
1. **Tinybird real-time analytics** - 40+ datasources, 20+ query endpoints for metrics
2. **7-step onboarding flow** - Redis-persisted state with AI-powered domain analysis
3. **Entitlement-based billing** - Hard/soft limits with Stripe integration
4. **Feature flag system** - Database-backed experimentation framework
5. **Engagement loops** - Weekly reports, daily prompts, email notifications
6. **Third-party integrations** - PostHog, GA4, Linear for expanded analytics

---

## 1. Analytics & Metrics Infrastructure

### 1.1 Tinybird Architecture

Ctrl0 uses **Tinybird** (real-time analytics database) to separate analytics queries from the main PostgreSQL database. This enables:
- **Real-time dashboards** without loading production database
- **Billions of events** stored with sub-second query times
- **Time-series aggregations** for trend analysis
- **Multi-tenant data isolation** via organization scoping

#### **Datasources (Event Collection)**

**Location:** `packages/tinybird/datasources/`

| Datasource                                               | Purpose                            | Key Fields                                   | PLG Metric            |
| -------------------------------------------------------- | ---------------------------------- | -------------------------------------------- | --------------------- |
| `source_citation_events`                                 | Tracks citations by AI engines     | url, hostname, answer_engine, timestamp      | Content effectiveness |
| `brand_mention_events`                                   | Tracks brand mentions in responses | conversation_query_id, mentioned_brand_id    | Share of Voice (SoV)  |
| `analytics_events`                                       | Generic custom event tracking      | session_id, action, payload, tenant_id       | User behavior         |
| `llm_events`                                             | LLM API usage tracking             | model, provider, tokens, cost, response_time | Usage-based billing   |
| `openai_inference_events` / `anthropic_inference_events` | Provider-specific tracking         | tokens, cost, cache_hit                      | Cost attribution      |
| `ai_bot_user_agents`                                     | AI crawler detection               | user_agent, bot_name, provider               | Traffic analysis      |

**Access Pattern:**
- **Write tokens**: "tracker", "llm_tracker" - APPEND-only
- **Read tokens**: Organization-scoped for multi-tenant isolation
- **Partitioning**: Monthly partitions sorted by timestamp for query performance

#### **Materializations (Aggregations)**

**Location:** `packages/tinybird/pipes/`

Real-time aggregations for faster queries:

```
feed_product_events_30d_totals_mv     → 30-day rolling window aggregations
feed_daily_rolling_mentions_mv        → Daily mention trends
feed_daily_chat_total_mv              → Daily conversation totals
feed_source_citation_events_with_view_id_mv → Citation data scoped to custom views
```

**Update Strategy**: Continuous incremental updates as new events arrive

#### **Query Endpoints (20+ Pipes)**

**Location:** `packages/tinybird/endpoints/`

| Endpoint | Purpose | Returns | API Route |
|----------|---------|---------|-----------|
| `citation_count` | Total citations per source | hostname, count | `/api/v1/sources/analytics` |
| `citation_rank` | Ranking by citation volume | rank, hostname, citations | Dashboard rankings |
| `get_sov_sma30` | 30-day moving average SoV | brand, percentage, trend | Share of Voice chart |
| `get_sov_sma30_by_engine` | SoV broken down by AI engine | engine, sov, mentions | Engine comparison |
| `ai_traffic_stats` | AI crawler traffic metrics | total_visits, unique_bots | Traffic dashboard |
| `llm_usage` | LLM cost and token tracking | provider, tokens, cost, errors | Billing dashboard |
| `citation_timeseries_batch` | Time-series citation data | date, citations, brand_mentioned | Trend visualization |
| `actions` | Custom analytics events | action, count, session_id | Behavior tracking |

**Implementation Example** (`citation_rank.pipe`):
```sql
SELECT
  hostname,
  COUNT(*) as citation_count,
  ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) as rank
FROM source_citation_events
WHERE organization_id = {{organization_id}}
  AND timestamp >= {{start_date}}
GROUP BY hostname
ORDER BY citation_count DESC
LIMIT 100
```

### 1.2 Database Analytics Models

**Location:** `packages/prisma/prisma/schema/schema.prisma`

#### **User Engagement Tracking**

**`DailyPromptGeneration`** - Measures prompt feature adoption:
```prisma
model DailyPromptGeneration {
  id              String   @id @default(cuid())
  brandId         String
  userId          String
  generatedAt     DateTime @default(now())
  promptIds       String[] // AI-generated prompts
  feedback        Feedback? // "helpful" | "not_helpful" | "dismissed"
  feedbackAt      DateTime?
  organizationId  String

  @@index([brandId, generatedAt])
  @@index([organizationId, generatedAt])
}
```

**PLG Signal**: Tracks daily feature usage + feedback loop for value perception

**`WeeklyReportSubscription`** - Email engagement tracking:
```prisma
model WeeklyReportSubscription {
  id         String   @id @default(cuid())
  brandId    String
  userId     String
  isEnabled  Boolean  @default(true)
  dayOfWeek  Int      // 0-6 (Sunday-Saturday)
  timeOfDay  String   // "09:00"
  timezone   String   // "America/New_York"
  lastSentAt DateTime?

  @@unique([brandId, userId])
}
```

**PLG Signal**: Measures activation (enabling reports) and retention (email opens)

**`ConversationSentiment`** - Feature adoption tracking:
```prisma
model ConversationSentiment {
  id                    String  @id @default(cuid())
  conversationQueryRunId String  @unique
  overallSentiment      String  // "positive" | "neutral" | "negative"
  confidenceScore       Float
  keyStatements         Json[]  // Extracted sentiment signals

  conversationQueryRun  ConversationQueryRun @relation(...)
}
```

**PLG Signal**: Advanced feature usage (sentiment analysis adoption)

**`View`** - Power user feature tracking:
```prisma
model View {
  id              String   @id @default(cuid())
  name            String
  description     String?
  brandId         String
  organizationId  String
  isDefault       Boolean  @default(false)

  viewConversations ViewConversation[]

  @@index([brandId])
  @@index([organizationId])
}
```

**PLG Signal**: Custom views indicate power-user engagement and advanced usage

#### **Activation & Value Realization**

**`Opportunity`** - Tracks business value delivered:
```prisma
model Opportunity {
  id            String   @id @default(cuid())
  queryRunType  String   // "conversation_query_run"
  queryRunId    String
  rationale     String   // AI explanation of opportunity
  status        String   // "pending" | "accepted" | "dismissed"
  brandId       String
  organizationId String
  createdAt     DateTime @default(now())

  opportunityTagMappings OpportunityTagMapping[]

  @@index([brandId])
  @@index([organizationId])
}
```

**PLG Signal**: Measures value realization (opportunities identified by platform)

### 1.3 API Analytics Endpoints

**Location:** `apps/client/src/app/api/v1/analytics/`

#### **LLM Usage Tracking**

**`GET /api/v1/analytics/llm-usage`**

Query parameters:
```typescript
{
  simulationOrganizationId?: string,
  simulationProductId?: string,
  environment?: string,  // "production" | "development"
  provider?: string,     // "openai" | "anthropic" | "perplexity"
  user?: string,
  start_date?: string,
  end_date?: string
}
```

Response (from Tinybird `llm_usage` pipe):
```typescript
{
  date: string,
  total_requests: number,
  total_tokens: number,
  total_cost: number,
  avg_response_time: number,
  error_rate: number,
  cache_hit_rate: number,
  provider: string,
  model: string
}[]
```

**Purpose**: Usage-based billing dashboard + cost attribution per organization/product

#### **Citation Analytics**

**`GET /api/v1/sources/analytics`**

Query parameters:
```typescript
{
  page?: number,
  pageSize?: number,
  contentType?: string,     // "blog" | "video" | "documentation"
  category?: string,
  answerEngine?: string,    // "chatgpt" | "perplexity" | "claude"
  search?: string,
  organizationId: string,
  viewId?: string
}
```

Response:
```typescript
{
  data: [{
    hostname: string,
    citation_count: number,
    rank: number,
    brand_mentioned: boolean,
    title: string,
    url: string,
    content_type: string
  }],
  pagination: {
    total: number,
    page: number,
    pageSize: number
  }
}
```

**Purpose**: Content effectiveness dashboard for tracking which sources get cited

---

## 2. Onboarding Flow (7-Step Activation)

**Location:** `apps/client/src/app/_components/first-time-onboarding/`

### 2.1 State Management

**`onboarding-store.ts`** - Zustand store with Redis persistence:

```typescript
interface OnboardingState {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  invitations: Invitation[];
  progressPercentage: number; // 0-100
  websiteDomain: string;
  domainAnalysis: DomainAnalysisResponse | null;

  // Actions
  setCurrentStep: (step: OnboardingStep) => void;
  completeStep: (step: OnboardingStep) => void;
  setWebsiteDomain: (domain: string) => void;
  setDomainAnalysis: (analysis: DomainAnalysisResponse) => void;
  reset: () => void;
}

type OnboardingStep =
  | "welcome"
  | "loading-steps"
  | "invite-selection"
  | "product-setup"
  | "prompt-selection"
  | "subscription-selection"
  | "complete";
```

**Storage Strategy** (`onboarding-store-storage.ts`):
- **Backend**: Redis with 24-hour TTL
- **API**: `POST /api/v1/onboarding/storage` for persistence
- **Hydration**: Loads from Redis on page refresh
- **Purpose**: Allows pause/resume of multi-step onboarding

### 2.2 Onboarding Steps

#### **Step 1: Welcome** (`welcome-step.tsx`)
- Introduction to platform value proposition
- Single CTA: "Get Started"
- Sets expectation of 7-step process

#### **Step 2: Loading Steps** (`loading-steps.tsx`)
**AI-Powered Domain Analysis**:

User enters website domain → API analyzes domain using AI:

**API**: `POST /api/v1/onboarding/analyze-domain`
**Request**: `{ domain: "example.com" }`
**Response** (`DomainAnalysisResponse`):
```typescript
{
  companyName: string,
  description: string,
  differentiators: string[],
  competitors: [{
    domain: string,
    reasoning: string,
    verified: boolean
  }],
  logo: string | null,
  metaDescription: string | null,
  detectedLanguage: string
}
```

**PLG Impact**: Reduces friction by auto-populating brand details from website

#### **Step 3: Invite Selection** (`invite-selection.tsx`)
- Shows pending organization invitations
- User accepts/declines invites
- **Conditional**: Skipped if no pending invitations
- **PLG Signal**: Team activation (multi-user engagement)

#### **Step 4: Product Setup** (`product-setup.tsx`)
Pre-populated from domain analysis:
```typescript
{
  brandName: string,        // from companyName
  description: string,      // from description
  differentiators: string[], // from differentiators
  domain: string,
  logo?: File
}
```

Creates `Brand` record in database → **Activation milestone**

#### **Step 5: Prompt Selection** (`prompt-selection.tsx`)
**API**: `POST /api/v1/onboarding/prompt-relevance`

User selects from AI-suggested monitoring prompts:
- Competitor mentions
- Product feature questions
- Industry-specific queries
- Custom prompts

Creates initial `ConversationQuery` records → **First value delivery**

#### **Step 6: Subscription Selection** (`subscription-selection.tsx`)
Shows plan tiers with entitlements:

| Plan | Price | Products | Answers | Citations | AI Pages |
|------|-------|----------|---------|-----------|----------|
| FREE | $0 | 1 | Unlimited | 10K | 10 |
| BASIC | TBD | 1 | 2,500 | 10K | TBD |
| PRO | $249/mo | 1 | 5,000 | 300K | TBD |
| ENTERPRISE | Custom | 100 | 100K | 1M | TBD |

Creates `Subscription` with `Entitlement` records → **Monetization**

#### **Step 7: Complete** (`complete-step.tsx`)
- Onboarding completion confirmation
- CTA: "Go to Dashboard"
- Updates `User.onboardingTourStatus = "COMPLETED"`

### 2.3 Progress Tracking

**`onboarding-checklist.tsx`** component tracks activation:

```typescript
{
  hasOrganization: boolean,
  hasConversationQueries: boolean,
  hasEnoughConversationQueries: boolean (>= 3),
  // hasSubscription temporarily removed
}
```

**Server Action**: `getOnboardingStatus()` validates completion state

**PLG Impact**: Multi-step activation ensures users experience core value before leaving

---

## 3. Entitlements & Usage-Based Billing

**Location:** `apps/client/src/lib/billing/constant.ts`

### 3.1 Entitlement Types

```typescript
enum EntitlementType {
  ANSWERS = "answers",       // API query volume (soft limit)
  PRODUCTS = "products",     // Number of brands (hard limit)
  CITATIONS = "citations",   // Citation tracking (soft limit)
  AI_PAGES = "aiPages"       // AI page analyses (soft limit)
}
```

**Hard Limits**: Block access when exceeded (e.g., can't create 2nd brand on FREE/BASIC/PRO)
**Soft Limits**: Allow overage with additional billing (answers, citations, AI pages)

### 3.2 Plan Structure

**Database Model** (`Subscription`):
```prisma
model Subscription {
  id                  String   @id @default(cuid())
  plan                Plan     // "basic" | "pro" | "enterprise"
  status              Status   // "incomplete" | "active" | "canceled"
  periodStart         DateTime
  periodEnd           DateTime
  trialStart          DateTime?
  trialEnd            DateTime?
  cancelAtPeriodEnd   Boolean  @default(false)
  cancelAt            DateTime?
  stripeCustomerId    String?
  stripeSubscriptionId String?

  entitlements        Entitlement[]
  organizationId      String
  organization        Organization @relation(...)

  @@index([organizationId])
  @@index([stripeCustomerId])
}
```

**`Entitlement` Model**:
```prisma
model Entitlement {
  id             String          @id @default(cuid())
  subscriptionId String
  type           EntitlementType
  limit          Int             // Max allowed
  limitType      LimitType       // "hard" | "soft"

  subscription   Subscription @relation(...)

  @@unique([subscriptionId, type])
}
```

### 3.3 Billing APIs

**Check Subscription Status**:
```
GET /api/v1/billing/check
Response: {
  subscription: Subscription,
  entitlements: Entitlement[],
  usage: {
    answers: number,
    products: number,
    citations: number,
    aiPages: number
  },
  limits: {
    answers: { limit: number, exceeded: boolean },
    products: { limit: number, exceeded: boolean },
    ...
  }
}
```

**Stripe Integration**:
- `POST /api/v1/billing/update-stripe-price` - Migrate pricing plans
- `GET /api/v1/billing/check-outdated-price` - Detect legacy pricing
- `POST /api/auth/stripe/webhook` - Stripe webhook handler

**PLG Impact**: Soft limits allow value demonstration before forcing upgrade

---

## 4. Feature Flags & Experimentation

**Location:** `packages/common/src/feature-flags/`, `apps/client/src/lib/feature-flags.ts`

### 4.1 Database Model

```prisma
model FeatureFlag {
  id            String   @id @default(cuid())
  referenceId   String   // userId or organizationId
  referenceType String   // "user" | "organization"
  flags         Json     // { "flag_name": boolean }
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  deletedAt     DateTime?

  @@unique([referenceId, referenceType])
  @@index([referenceId])
}
```

### 4.2 Flag Management Functions

**`isFeatureFlagEnabled(session, flagKey)`** - Check single flag:
```typescript
const isEnabled = await isFeatureFlagEnabled(session, "google_analytics_integration");
```

**Scope Resolution**:
1. Check user-level flags first
2. Fall back to organization-level flags
3. Fall back to default config value

**`getAllFeatureFlags(session)`** - Get merged flags:
```typescript
const flags = await getAllFeatureFlags(session);
// Returns: { flag_name: boolean, ... }
```

**`checkMultipleFeatureFlags(session, flagKeys)`** - Batch check:
```typescript
const results = await checkMultipleFeatureFlags(session, [
  "google_analytics_integration",
  "posthog_integration"
]);
// Returns: { google_analytics_integration: true, posthog_integration: false }
```

### 4.3 API Endpoints

**User Flags**:
```
GET /api/v1/feature-flags
Response: { flags: { flag_name: boolean } }

PUT /api/v1/feature-flags
Body: { flags: { flag_name: boolean } }
```

**Admin Management**:
```
GET /api/v1/admin/organizations/[orgId]/feature-flags
GET /api/v1/admin/users/[userId]/feature-flags
```

### 4.4 Known Feature Flags

**`google_analytics_integration`** - GA4 integration feature (beta)
**`posthog_integration`** - PostHog analytics (beta)

**PLG Use Cases**:
- Beta feature rollouts without code deployment
- A/B testing different onboarding flows
- Gradual rollout to user segments
- Per-organization feature access

---

## 5. Engagement Loops

### 5.1 Weekly Email Reports

**Worker:** `apps/worker/src/workers/weekly-report.ts`
**Email Template:** `apps/worker/src/lib/email/weekly-report.tsx`

**Trigger**: Temporal/BullMQ job runs every Sunday at configured time

**Report Content**:
```typescript
{
  brand: { id, name },
  sov: {
    current_week: number,     // Share of Voice percentage
    previous_week: number,
    trend: "up" | "down" | "stable",
    mentions: number
  },
  citations: [{
    hostname: string,
    count: number,
    change: number,           // vs. previous week
    status: "new" | "trending_up" | "stable"
  }],
  prompts: [{
    text: string,
    sov: number,
    mentions: number,
    rank: number
  }],
  aiTraffic: {
    total_visits: number,
    top_bots: [{ name, visits }],
    top_pages: [{ path, visits }]
  }
}
```

**Data Source**: Queries Tinybird endpoints for weekly aggregations

**PLG Impact**:
- **Retention**: Weekly touchpoint drives re-engagement
- **Value demonstration**: Shows tangible results (mentions, citations)
- **Viral potential**: Shareable metrics encourage team distribution

### 5.2 Daily Prompt Generation

**Model:** `DailyPromptGeneration`
**Workflow:**
1. AI generates relevant monitoring prompts daily
2. User receives notification (in-app or email)
3. User provides feedback: "helpful" | "not_helpful" | "dismissed"
4. Feedback loop improves future prompt relevance

**UI Location:** `apps/client/src/app/[orgSlug]/p/[productSlug]/prompts/`

**PLG Impact**:
- **Habit formation**: Daily engagement creates routine usage
- **Value delivery**: Fresh insights delivered automatically
- **Feedback loop**: Improves product quality via user input

### 5.3 Opportunity Notifications

**Trigger**: AI identifies opportunities in conversation runs
**Model:** `Opportunity` with status tracking

**Workflow:**
1. Conversation query runs detect opportunities
2. System creates `Opportunity` record with AI rationale
3. User notified via in-app notification or email
4. User accepts/dismisses opportunity
5. Acceptance creates actionable task (Linear integration)

**PLG Impact**: Demonstrates product value by surfacing actionable insights

---

## 6. Third-Party Integrations

### 6.1 PostHog (Product Analytics)

**Location:** `apps/client/src/lib/posthog-integration/`

**Integration Files**:
- `client.ts` - PostHog SDK wrapper
- `queries.ts` - Query builders for PostHog API
- `types.ts` - Type definitions

**API Endpoints**:
```
GET /api/v1/integrations/posthog
Response: { status: "connected" | "not_connected" }

POST /api/v1/integrations/posthog
Body: { apiKey: string, projectId: string }

DELETE /api/v1/integrations/posthog

GET /api/v1/integrations/posthog/report
Response: PostHogReport (funnels, retention, trends)

GET /api/v1/integrations/posthog/query
Body: { query: PostHogQuery }
```

**UI Component:** `apps/client/src/app/[orgSlug]/settings/integrations/_components/posthog-connection.tsx`

**PLG Use Cases**:
- Track user behavior within Ctrl0
- Measure activation funnels
- Analyze feature adoption
- Calculate retention cohorts

### 6.2 Google Analytics 4

**Location:** `apps/client/src/app/[orgSlug]/settings/admin/users/_components/connect-ga.tsx`

**Feature Flag:** `google_analytics_integration` (beta)

**OAuth Scope:** `https://www.googleapis.com/auth/analytics.readonly`

**API Endpoints**:
```
GET /api/v1/integrations/ga4
Response: { status, account, property }

GET /api/v1/integrations/ga4/report
Response: GA4AcquisitionReport
```

**Use Case**: Connect external website traffic data to AI citation metrics

**UI Component:** `apps/client/src/app/[orgSlug]/p/[productSlug]/metrics/_components/ga4/GA4AcquisitionSources.tsx`

**PLG Impact**: Shows correlation between AI mentions and website traffic

### 6.3 Linear (Issue Tracking)

**Location:** `apps/client/src/app/[orgSlug]/settings/integrations/_components/linear-integration-form.tsx`

**Capability**: Create Linear issues from identified opportunities

**PLG Impact**: Closes feedback loop between insights and action items

---

## 7. Conversion Funnel & Customer Journey

### Stages

**1. AWARENESS** → User discovers platform
- Marketing channels (not visible in codebase)

**2. SIGNUP** → Email verification + organization creation
- `User` model created
- Email verification via Better Auth
- Creates default `Organization`

**3. ACTIVATION** → Complete 7-step onboarding
- Domain analysis
- Brand/product setup
- Initial query configuration
- Subscription selection
- **Success Metric**: `User.onboardingTourStatus = "COMPLETED"`

**4. FEATURE ADOPTION** → Create first queries and get results
- First `ConversationQuery` created
- Query runs start generating results
- Citations and brand mentions tracked
- **Success Metric**: >= 3 `ConversationQuery` records

**5. VALUE REALIZATION** → See insights and opportunities
- View citation analytics dashboard
- Receive first weekly report email
- Opportunities identified by AI
- **Success Metrics**:
  - Weekly report email opened
  - `Opportunity` records created
  - Daily prompt feedback provided

**6. EXPANSION** → Advanced features + integrations
- Custom `View` creation (power users)
- GA4/PostHog integration
- Content tracking (`TrackedUrl`)
- Team member invitations
- **Success Metrics**:
  - `View` records created
  - Integration connections
  - Team size growth

**7. RETENTION** → Sustained usage
- Weekly email engagement
- Daily prompt interaction
- Regular dashboard visits
- **Success Metrics**:
  - Weekly report subscription active
  - Last activity date < 7 days
  - Query run frequency

**8. UPSELL** → Plan upgrade or seat expansion
- Usage approaching limits
- Soft limit overages
- Feature flag-gated features
- **Success Metric**: Plan upgrade from FREE → BASIC → PRO → ENTERPRISE

---

## 8. Key Performance Indicators (KPIs)

### Tracked in Codebase

**Activation**:
- `User.onboardingTourStatus = "COMPLETED"` percentage
- Time to complete onboarding (7 steps)
- `ConversationQuery` count per organization
- First query run completion

**Engagement**:
- `DailyPromptGeneration` records per user/week
- Feedback rate on daily prompts
- `WeeklyReportSubscription.isEnabled` rate
- Email open/click rates (external tracking)
- Dashboard session count (via PostHog)

**Adoption**:
- `View` creation rate (power users)
- `TrackedUrl` usage (advanced feature)
- Integration connections (GA4, PostHog, Linear)
- `ContentGapAnalysis` runs (advanced feature)
- `Opportunity` acceptance rate

**Usage** (via Tinybird):
- `llm_events` → API calls per organization
- Token consumption per product
- Cost per organization
- Error rates by provider
- Cache hit rates

**Expansion**:
- `Brand` count per organization
- Team size (`Member` count)
- Query runs per month
- Citation volume growth
- Entitlement usage % (approaching limits)

**Retention**:
- Weekly active users (WAU)
- Monthly active users (MAU)
- Last activity timestamp
- Churn indicators (subscription canceled)

**Revenue**:
- Subscription plan distribution
- Monthly recurring revenue (MRR)
- Average revenue per user (ARPU)
- Lifetime value (LTV)
- Soft limit overages

---

## 9. Technical Architecture Patterns

### 9.1 Multi-Tenant Data Isolation

All queries check `session.session.activeOrganizationId`:

```typescript
// Example from API route
const { session } = await auth();
if (!session?.activeOrganizationId) {
  return unauthorized();
}

const data = await prisma.brand.findMany({
  where: { organizationId: session.activeOrganizationId }
});
```

### 9.2 Analytics Separation

**Pattern**: PostgreSQL for transactional data, Tinybird for analytics

**Benefits**:
- Analytics queries don't slow down production database
- Billions of events without scaling PostgreSQL
- Sub-second query times for time-series data
- Independent scaling

### 9.3 Worker Queue Architecture

**BullMQ** (`apps/worker/`) for background jobs:
- Email sending (weekly reports)
- AI query processing
- Document scraping

**Temporal** (`apps/durable-worker/`) for long-running workflows:
- Multi-step conversation analysis
- Batch processing

### 9.4 Persistent Onboarding State

**Redis-backed Zustand store**:
- Survives browser refresh
- 24-hour TTL
- Enables pause/resume

### 9.5 Soft vs Hard Limits

**Hard Limits** (`products`):
```typescript
if (currentProductCount >= entitlement.limit) {
  throw new Error("Product limit reached. Upgrade to create more.");
}
```

**Soft Limits** (`answers`, `citations`):
```typescript
// Allow overage, track for billing
if (currentUsage >= entitlement.limit) {
  await trackOverage(organizationId, type, currentUsage - limit);
}
// Continue processing
```

---

## 10. File Reference Table

| File Path | Purpose |
|-----------|---------|
| **Analytics Infrastructure** |
| `packages/tinybird/datasources/source_citation_events.datasource` | Citation event collection |
| `packages/tinybird/datasources/brand_mention_events.datasource` | Brand mention tracking |
| `packages/tinybird/datasources/llm_events.datasource` | LLM usage tracking |
| `packages/tinybird/endpoints/citation_rank.pipe` | Citation ranking query |
| `packages/tinybird/endpoints/get_sov_sma30.pipe` | Share of Voice calculation |
| `packages/tinybird/endpoints/llm_usage.pipe` | Usage billing data |
| **Onboarding** |
| `apps/client/src/app/_components/first-time-onboarding/onboarding-store.ts` | State management |
| `apps/client/src/app/_components/first-time-onboarding/onboarding-store-storage.ts` | Redis persistence |
| `apps/client/src/app/_components/first-time-onboarding/steps/loading-steps.tsx` | Domain analysis step |
| `apps/client/src/app/_components/first-time-onboarding/steps/product-setup.tsx` | Brand setup |
| `apps/client/src/app/_components/first-time-onboarding/steps/prompt-selection.tsx` | Query setup |
| `apps/client/src/app/_components/first-time-onboarding/steps/subscription-selection.tsx` | Plan selection |
| **Database Schema** |
| `packages/prisma/prisma/schema/schema.prisma` | Complete database schema |
| **Billing** |
| `apps/client/src/lib/billing/constant.ts` | Plan tiers and entitlements |
| `apps/client/src/app/api/v1/billing/check/route.ts` | Subscription status API |
| **Feature Flags** |
| `packages/common/src/feature-flags/` | Feature flag system |
| `apps/client/src/lib/feature-flags.ts` | Flag management functions |
| `apps/client/src/app/api/v1/feature-flags/route.ts` | Feature flag API |
| **Engagement** |
| `apps/worker/src/workers/weekly-report.ts` | Weekly email worker |
| `apps/worker/src/lib/email/weekly-report.tsx` | Email template |
| **Integrations** |
| `apps/client/src/lib/posthog-integration/` | PostHog client |
| `apps/client/src/app/api/v1/integrations/ga4/route.ts` | GA4 integration API |
| `apps/client/src/app/api/v1/integrations/posthog/route.ts` | PostHog integration API |
