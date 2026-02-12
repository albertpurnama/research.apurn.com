# Ctrl0 PLG Research - Codebase Documentation

This document tracks all repositories cloned for the Ctrl0 product-led growth research project.

**Location:** `.codebases/`

---

## Cloned Repositories

### 1. ctrl0

- **Repository URL:** https://github.com/promptingcompany/ctrl0
- **Clone Location:** `.codebases/ctrl0/`
- **Clone Date:** 2026-01-19
- **Purpose:** Technical analysis of product-led growth implementation, focusing on metrics, instrumentation, onboarding flows, and analytics infrastructure in The Prompting Company's AI-powered brand analytics platform.

#### **Key Files Referenced:**

**Analytics & Metrics Infrastructure:**
- `packages/tinybird/datasources/` - 40+ real-time analytics datasources (citation events, brand mentions, LLM usage)
- `packages/tinybird/endpoints/` - 20+ query pipes for analytics dashboards
- `apps/client/src/types/analytics.ts` - Event query schemas and types
- `apps/client/src/app/api/v1/analytics/` - Analytics API endpoints

**Onboarding System:**
- `apps/client/src/app/_components/first-time-onboarding/onboarding-store.ts` - State management with Redis persistence
- `apps/client/src/app/_components/first-time-onboarding/onboarding-store-storage.ts` - Redis storage adapter
- `apps/client/src/app/_components/first-time-onboarding/steps/` - 7-step onboarding flow components

**Database Schema (67+ models):**
- `packages/prisma/prisma/schema/schema.prisma` - Complete database schema with PLG tracking models
- Key models: User, Organization, Subscription, Entitlement, FeatureFlag, DailyPromptGeneration, WeeklyReportSubscription, ConversationQuery, Brand

**Billing & Entitlements:**
- `apps/client/src/lib/billing/constant.ts` - Subscription tiers and entitlement limits
- `apps/client/src/app/api/v1/billing/` - Billing API endpoints
- Stripe integration for payment processing

**Feature Flags:**
- `packages/common/src/feature-flags/` - Feature flag system
- `apps/client/src/lib/feature-flags.ts` - Flag management functions
- `apps/client/src/app/api/v1/feature-flags/` - Feature flag API

**Third-Party Integrations:**
- `apps/client/src/lib/posthog-integration/` - PostHog product analytics
- `apps/client/src/app/[orgSlug]/settings/admin/users/_components/connect-ga.tsx` - Google Analytics 4 integration
- `apps/client/src/app/[orgSlug]/settings/integrations/` - Integration management UI

**Worker Systems:**
- `apps/worker/src/workers/weekly-report.ts` - Automated email engagement
- `apps/worker/src/lib/email/weekly-report.tsx` - Email template
- `apps/durable-worker/` - Temporal-based long-running workflows

**Core Product Features:**
- `apps/client/src/app/[orgSlug]/p/[productSlug]/content-analytics/` - Content tracking
- `apps/client/src/app/api/v1/sources/analytics/` - Citation analytics endpoints
- `apps/client/src/app/api/v1/tracked-urls/metrics/` - URL performance tracking

---

## Directory Structure

```
ctrl0-plg/
├── README.md                    # Summary and reading order
├── RESEARCH.md                  # Main architecture and PLG analysis
├── CLAUDE.md                    # This file - codebase documentation
└── .codebases/
    └── ctrl0/                   # Cloned repository
        ├── apps/
        │   ├── client/          # Next.js main application
        │   ├── worker/          # BullMQ job workers
        │   ├── worker-document/ # Document processing
        │   ├── durable-worker/  # Temporal workflows
        │   ├── metric/          # Metrics dashboard
        │   └── queue-board/     # Queue monitoring
        └── packages/
            ├── prisma/          # Database schema & ORM
            ├── tinybird/        # Analytics infrastructure
            └── common/          # Shared utilities
```

---

## Notes

- **Tech Stack**: Next.js 16, React 19, PostgreSQL 17 + pgvector, Tinybird (real-time analytics), Redis, BullMQ/Temporal
- **Architecture**: Multi-tenant B2B SaaS with organization-scoped data isolation
- **PLG Focus**: Sophisticated analytics instrumentation, onboarding flows, entitlement-based billing, feature flags, and third-party integrations
- **Key Finding**: Tinybird-powered real-time analytics with 40+ datasources enables comprehensive PLG metrics without loading main database
