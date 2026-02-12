# PostHog PLG Analytics - Quick Start (Corrected Paths)

**⚠️ IMPORTANT: Use `lib/posthog` instead of `lib/analytics`**

To avoid conflicts with existing Tinybird analytics, all PostHog code goes in `lib/posthog/`.

---

## Phase 1: Foundation Setup

### Task 1.1: Enable PostHog SDK (No changes)
```typescript
// apps/client/src/app/layout.tsx
import posthog from 'posthog-js'

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug()
    },
    capture_pageview: false,
    capture_pageleave: true
  })
}
```

---

### Task 1.2: Create PostHog Types and Events

**✅ Create these files:**

#### `apps/client/src/lib/posthog/types.ts`
```typescript
// Event type definitions
export interface OnboardingStepCompletedEvent {
  step: 'welcome' | 'domain_analysis' | 'product_setup' | 'prompt_selection' | 'subscription_selection' | 'complete';
  timeSpent: number;
  organizationId: string;
  userId: string;
}

export interface ConversationQueryCreatedEvent {
  queryId: string;
  queryType: string;
  answerEngine: string;
  organizationId: string;
  userId: string;
  daysSinceSignup: number;
  isFirstQuery: boolean;
}

export interface EntitlementLimitWarningEvent {
  entitlementType: 'products' | 'answers' | 'citations' | 'aiPages';
  currentUsage: number;
  limit: number;
  percentage: number;
  limitType: 'hard' | 'soft';
  organizationId: string;
}

// ... add all other event types
```

#### `apps/client/src/lib/posthog/events.ts`
```typescript
// Event name constants
export const ANALYTICS_EVENTS = {
  // Onboarding
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_STEP_COMPLETED: 'onboarding_step_completed',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  ONBOARDING_ABANDONED: 'onboarding_abandoned',
  DOMAIN_ANALYSIS_COMPLETED: 'domain_analysis_completed',

  // Feature Adoption
  CONVERSATION_QUERY_CREATED: 'conversation_query_created',
  FEATURE_FIRST_USED: 'feature_first_used',
  CUSTOM_VIEW_CREATED: 'custom_view_created',
  TRACKED_URL_ADDED: 'tracked_url_added',

  // Engagement
  DAILY_PROMPT_VIEWED: 'daily_prompt_viewed',
  DAILY_PROMPT_FEEDBACK: 'daily_prompt_feedback',
  WEEKLY_REPORT_SUBSCRIPTION_ENABLED: 'weekly_report_subscription_enabled',
  WEEKLY_REPORT_EMAIL_SENT: 'weekly_report_email_sent',
  WEEKLY_REPORT_EMAIL_OPENED: 'weekly_report_email_opened',
  OPPORTUNITY_IDENTIFIED: 'opportunity_identified',
  OPPORTUNITY_STATUS_CHANGED: 'opportunity_status_changed',

  // Monetization
  ENTITLEMENT_LIMIT_WARNING: 'entitlement_limit_warning',
  ENTITLEMENT_LIMIT_REACHED: 'entitlement_limit_reached',
  ENTITLEMENT_LIMIT_EXCEEDED: 'entitlement_limit_exceeded',
  SUBSCRIPTION_PLAN_VIEWED: 'subscription_plan_viewed',
  SUBSCRIPTION_UPGRADED: 'subscription_upgraded',
  SUBSCRIPTION_DOWNGRADED: 'subscription_downgraded',
  SUBSCRIPTION_CANCELED: 'subscription_canceled',
  PREMIUM_FEATURE_BLOCKED: 'premium_feature_blocked',

  // Power Users
  INTEGRATION_CONNECTED: 'integration_connected',
  INTEGRATION_DISCONNECTED: 'integration_disconnected',
  TEAM_MEMBER_INVITED: 'team_member_invited',
  TEAM_MEMBER_JOINED: 'team_member_joined',
  DATA_EXPORTED: 'data_exported',

  // Retention
  SESSION_STARTED: 'session_started',
  USER_INACTIVE_7_DAYS: 'user_inactive_7_days',
  USER_INACTIVE_14_DAYS: 'user_inactive_14_days',
  USER_INACTIVE_30_DAYS: 'user_inactive_30_days',
  FEATURE_FLAG_EXPOSED: 'feature_flag_exposed',
} as const;

export type AnalyticsEventName = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS];
```

#### `apps/client/src/lib/posthog/properties.ts`
```typescript
// Shared property helpers
export function getDaysSinceSignup(userCreatedAt: Date): number {
  return Math.floor((Date.now() - userCreatedAt.getTime()) / (1000 * 60 * 60 * 24));
}

export function enrichWithContext<T extends Record<string, any>>(
  properties: T,
  session: Session
): T & { organizationId: string; userId: string; timestamp: string; environment: string } {
  return {
    ...properties,
    organizationId: session.activeOrganizationId,
    userId: session.userId,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
  };
}
```

#### `apps/client/src/lib/posthog/index.ts`
```typescript
// Barrel exports
export * from './types';
export * from './events';
export * from './properties';
export * from './tracker';
```

---

### Task 1.3: Create PostHog Tracking Helpers

#### `apps/client/src/lib/posthog/tracker.ts`
```typescript
import posthog from 'posthog-js';
import type { Session, Subscription, Organization } from '@ctrl0/database';

/**
 * Track an event with automatic context injection
 */
export const trackEvent = <T extends Record<string, any>>(
  eventName: string,
  properties: T,
  session?: Session
) => {
  try {
    const enrichedProperties = {
      ...properties,
      organizationId: session?.activeOrganizationId,
      userId: session?.userId,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
    };

    posthog.capture(eventName, enrichedProperties);

    if (process.env.NODE_ENV === 'development') {
      console.log('[PostHog]', eventName, enrichedProperties);
    }
  } catch (error) {
    console.error('[PostHog Error]', error);
    // Silent failure - don't break user experience
  }
};

/**
 * Identify user and set properties
 */
export const identifyUser = (session: Session, subscription?: Subscription) => {
  try {
    posthog.identify(session.userId, {
      email: session.user.email,
      name: session.user.name,
      organizationId: session.activeOrganizationId,
      plan: subscription?.plan,
      signupDate: session.user.createdAt,
      onboardingStatus: session.user.onboardingTourStatus,
    });
  } catch (error) {
    console.error('[PostHog Error]', error);
  }
};

/**
 * Set organization context (group analytics)
 */
export const setOrganizationContext = (organization: Organization) => {
  try {
    posthog.group('organization', organization.id, {
      name: organization.name,
      slug: organization.slug,
      createdAt: organization.createdAt,
      memberCount: organization.members?.length || 0,
    });
  } catch (error) {
    console.error('[PostHog Error]', error);
  }
};

/**
 * Reset PostHog on logout
 */
export const resetPostHog = () => {
  try {
    posthog.reset();
  } catch (error) {
    console.error('[PostHog Error]', error);
  }
};
```

---

## Usage Examples

### In Components
```typescript
// ✅ Correct import
import { trackEvent, ANALYTICS_EVENTS } from '@/lib/posthog';

// Track onboarding completion
trackEvent(ANALYTICS_EVENTS.ONBOARDING_COMPLETED, {
  totalTimeSpent: 300,
  stepsCompleted: 7,
}, session);
```

### In API Routes
```typescript
// ✅ Correct import
import { trackEvent, ANALYTICS_EVENTS } from '@/lib/posthog';

export async function POST(request: Request) {
  const newQuery = await prisma.conversationQuery.create({ /* ... */ });

  trackEvent(ANALYTICS_EVENTS.CONVERSATION_QUERY_CREATED, {
    queryId: newQuery.id,
    queryType: newQuery.type,
    answerEngine: newQuery.answerEngine,
    isFirstQuery: true,
  }, session);

  return Response.json(newQuery);
}
```

### In Workers
```typescript
// For worker usage, export from common package
// packages/common/src/posthog/index.ts

export { trackEvent, identifyUser, setOrganizationContext } from '../../../apps/client/src/lib/posthog/tracker';
export { ANALYTICS_EVENTS } from '../../../apps/client/src/lib/posthog/events';
export type * from '../../../apps/client/src/lib/posthog/types';
```

Then in worker:
```typescript
// ✅ Correct import for workers
import { trackEvent, ANALYTICS_EVENTS } from '@ctrl0/common/posthog';

// In weekly report worker
trackEvent(ANALYTICS_EVENTS.WEEKLY_REPORT_EMAIL_SENT, {
  brandId: subscription.brandId,
  organizationId: subscription.organizationId,
  userId: subscription.userId,
});
```

---

## Directory Structure Summary

```
apps/client/src/
├── lib/
│   ├── analytics/              # ✅ KEEP: Existing Tinybird analytics
│   │   └── (existing files)
│   └── posthog/                # ✅ NEW: PostHog product analytics
│       ├── types.ts
│       ├── events.ts
│       ├── properties.ts
│       ├── tracker.ts
│       └── index.ts
├── types/
│   └── analytics.ts            # ✅ KEEP: Existing Tinybird types
└── app/
    └── layout.tsx              # PostHog SDK initialization

packages/common/src/
└── posthog/                    # ✅ NEW: Shared PostHog utilities
    └── index.ts                # Re-exports from client
```

---

## Key Differences from Original Tasks

**All references changed from:**
- ❌ `lib/analytics` → ✅ `lib/posthog`
- ❌ `@/lib/analytics` → ✅ `@/lib/posthog`
- ❌ `@ctrl0/common/analytics` → ✅ `@ctrl0/common/posthog`

**Everything else remains the same:**
- Event names unchanged
- Event properties unchanged
- Implementation logic unchanged
- Task dependencies unchanged

---

## Next Steps

1. **Create directory**: `mkdir -p apps/client/src/lib/posthog`
2. **Create files**: Use code above for `types.ts`, `events.ts`, `properties.ts`, `tracker.ts`, `index.ts`
3. **Initialize PostHog**: Add SDK init to `layout.tsx`
4. **Start tracking**: Begin with Task 2.1 (onboarding tracking)

---

## Need Updated Task Files?

All task documentation will be updated with corrected paths. The core implementation remains identical—just the directory name changes from `analytics` to `posthog`.

**Use this guide as the source of truth for file paths!** ✅
