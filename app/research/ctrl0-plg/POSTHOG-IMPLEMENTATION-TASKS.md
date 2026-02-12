# PostHog PLG Instrumentation - Linear Tasks Breakdown

**Epic:** Implement comprehensive PostHog analytics for product-led growth metrics

**Goal:** Instrument all critical PLG events to measure activation, engagement, retention, and monetization

---

## Hybrid Tracking Approach

> **Strategy:** Use autocapture + data attributes for UI events, custom tracking only for server-side events.

| Event Type | Method | Code Required |
|------------|--------|---------------|
| Button clicks, forms | Autocapture + `data-ph-capture-attribute-*` | Just add HTML attributes |
| Pageviews | Autocapture | None (automatic) |
| API route events | Custom `trackServerEvent()` | Yes |
| Worker/background jobs | Custom `trackWorkerEvent()` | Yes |
| Stripe webhooks | Custom `trackServerEvent()` | Yes |

### UI Events (No custom code needed)

```tsx
// Just add data attributes to existing elements
<Button
  data-ph-capture-attribute-action="onboarding_step_completed"
  data-ph-capture-attribute-step={currentStep}
  data-ph-capture-attribute-organization-id={orgId}
  onClick={handleNext}
>
  Continue
</Button>
```

### Server-Side Events (Custom tracking required)

```typescript
// API routes, workers, webhooks
import { trackServerEvent } from '@/lib/analytics/tracker';

trackServerEvent('conversation_query_created', {
  queryId: query.id,
  organizationId: session.activeOrganizationId,
  isFirstQuery: queryCount === 1,
});
```

> **Reference:** [PostHog Autocapture](https://posthog.com/docs/product-analytics/autocapture) | [Data Attributes](https://posthog.com/docs/product-analytics/autocapture#data-attributes)

---

## Phase 1: Foundation & Infrastructure

> **Note:** Task 1.1 (Enable PostHog SDK globally) has been completed using Next.js `instrumentation-client.ts` for client-side initialization. This is the recommended approach for Next.js 15+ applications. See `apps/client/src/instrumentation-client.ts`.

---

### Task 1.2: Create PostHog types and event constants
**Priority:** P0 (Critical)
**Estimate:** 3 points
**Dependencies:** Task 1.1
**Labels:** `infrastructure`, `analytics`, `types`

**Description:**
Create TypeScript types for all PostHog events and a centralized constants file to prevent typos and ensure type safety.

**Acceptance Criteria:**
- [ ] Create `apps/client/src/lib/analytics/types.ts` with event interfaces
- [ ] Create `apps/client/src/lib/analytics/events.ts` with event name constants
- [ ] Create `apps/client/src/lib/analytics/properties.ts` with shared property helpers
- [ ] All events have TypeScript interfaces with required properties
- [ ] Event names follow consistent naming convention: `entity_action` (snake_case)
- [ ] Export barrel file from `apps/client/src/lib/analytics/index.ts`

**Implementation Notes:**
```typescript
// apps/client/src/lib/analytics/types.ts
export interface OnboardingStepCompletedEvent {
  step: 'welcome' | 'domain_analysis' | 'product_setup' | 'prompt_selection' | 'subscription_selection' | 'complete';
  timeSpent: number; // seconds
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
}

// ... all other event types
```

```typescript
// apps/client/src/lib/analytics/events.ts
export const ANALYTICS_EVENTS = {
  // Onboarding
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_STEP_COMPLETED: 'onboarding_step_completed',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  ONBOARDING_ABANDONED: 'onboarding_abandoned',

  // Activation
  CONVERSATION_QUERY_CREATED: 'conversation_query_created',
  FIRST_QUERY_RUN_COMPLETED: 'first_query_run_completed',

  // ... all other events
} as const;
```

**Files to create:**
- `apps/client/src/lib/analytics/types.ts`
- `apps/client/src/lib/analytics/events.ts`
- `apps/client/src/lib/analytics/properties.ts`
- `apps/client/src/lib/analytics/index.ts`

---

### Task 1.3: Create PostHog tracking helper functions
**Priority:** P0 (Critical)
**Estimate:** 3 points
**Dependencies:** Task 1.2
**Labels:** `infrastructure`, `analytics`, `utilities`

**Description:**
Create wrapper functions around PostHog SDK for consistent tracking with error handling, type safety, and organization/user context injection.

**Acceptance Criteria:**
- [ ] Create `apps/client/src/lib/analytics/tracker.ts` with helper functions
- [ ] `trackEvent()` function automatically injects organizationId, userId, timestamp
- [ ] `identifyUser()` function sets user properties on auth
- [ ] `setOrganizationContext()` function updates organization properties
- [ ] All functions have error handling with silent failures in production
- [ ] Functions log to console in development for debugging
- [ ] Type-safe: accepts event types from Task 1.2
- [ ] Create React hook wrapper for use in components

**Implementation Notes:**

> **Reference:** [PostHog React hooks](https://posthog.com/docs/libraries/react)

**Important:** Use `usePostHog()` hook in React components, direct import in API routes/server code.

```typescript
// apps/client/src/lib/analytics/tracker.ts
import posthog from 'posthog-js';
import { ANALYTICS_EVENTS } from './events';
import type { OnboardingStepCompletedEvent } from './types';

// For use in API routes and server-side code
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
      environment: process.env.NODE_ENV
    };

    posthog.capture(eventName, enrichedProperties);

    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', eventName, enrichedProperties);
    }
  } catch (error) {
    console.error('[Analytics Error]', error);
  }
};

export const identifyUser = (session: Session, subscription?: Subscription) => {
  try {
    posthog.identify(session.userId, {
      email: session.user.email,
      name: session.user.name,
      organizationId: session.activeOrganizationId,
      plan: subscription?.plan,
      signupDate: session.user.createdAt,
      onboardingStatus: session.user.onboardingTourStatus
    });
  } catch (error) {
    console.error('[Analytics Error]', error);
  }
};

export const setOrganizationContext = (organization: Organization) => {
  try {
    posthog.group('organization', organization.id, {
      name: organization.name,
      slug: organization.slug,
      createdAt: organization.createdAt,
      memberCount: organization.members.length
    });
  } catch (error) {
    console.error('[Analytics Error]', error);
  }
};
```

```typescript
// apps/client/src/lib/analytics/useAnalytics.ts
// React hook wrapper for use in components
'use client'
import { usePostHog } from 'posthog-js/react';
import { useCallback } from 'react';
import { ANALYTICS_EVENTS } from './events';

export function useAnalytics(session?: Session) {
  const posthog = usePostHog();

  const trackEvent = useCallback(<T extends Record<string, any>>(
    eventName: string,
    properties: T
  ) => {
    try {
      const enrichedProperties = {
        ...properties,
        organizationId: session?.activeOrganizationId,
        userId: session?.userId,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      };

      posthog.capture(eventName, enrichedProperties);

      if (process.env.NODE_ENV === 'development') {
        console.log('[Analytics]', eventName, enrichedProperties);
      }
    } catch (error) {
      console.error('[Analytics Error]', error);
    }
  }, [posthog, session]);

  return { trackEvent, posthog };
}
```

**Usage in React components:**
```typescript
'use client'
import { useAnalytics } from '@/lib/analytics/useAnalytics';

function MyComponent() {
  const { trackEvent } = useAnalytics(session);

  const handleClick = () => {
    trackEvent(ANALYTICS_EVENTS.BUTTON_CLICKED, { buttonName: 'submit' });
  };

  return <button onClick={handleClick}>Submit</button>;
}
```

**Files to create:**
- `apps/client/src/lib/analytics/tracker.ts`
- `apps/client/src/lib/analytics/useAnalytics.ts`

---

### Task 1.4: Add user identification on authentication
**Priority:** P0 (Critical)
**Estimate:** 2 points
**Dependencies:** Task 1.3
**Labels:** `infrastructure`, `analytics`, `auth`

**Description:**
Call `identifyUser()` whenever a user authenticates to associate all subsequent events with the user profile.

**Acceptance Criteria:**
- [ ] Call `identifyUser()` in auth callback after successful login
- [ ] Call `setOrganizationContext()` when organization context is available
- [ ] Fetch subscription data to include plan in user properties
- [ ] Verify in PostHog dashboard that user profiles are being created
- [ ] Verify organizationId is set as group property

**Implementation Notes:**
```typescript
// apps/client/src/app/api/auth/[...auth]/route.ts (or wherever auth callback is)
import { identifyUser, setOrganizationContext } from '@/lib/analytics/tracker';

// After successful authentication
const session = await auth();
if (session) {
  const subscription = await prisma.subscription.findFirst({
    where: { organizationId: session.activeOrganizationId }
  });

  identifyUser(session, subscription);

  const organization = await prisma.organization.findUnique({
    where: { id: session.activeOrganizationId },
    include: { members: true }
  });

  if (organization) {
    setOrganizationContext(organization);
  }
}
```

**Files to modify:**
- Auth callback location (check Better Auth documentation)
- Possibly `apps/client/src/middleware.ts` if session refresh happens there

---

### Task 1.5: Add automatic page view tracking
**Priority:** P1 (High)
**Estimate:** 2 points
**Dependencies:** Task 1.1
**Labels:** `infrastructure`, `analytics`, `navigation`

**Description:**
Track page views automatically using Next.js App Router navigation events with page metadata.

**Acceptance Criteria:**
- [ ] Create dedicated `PostHogPageView` component
- [ ] Use `usePostHog()` hook instead of direct import
- [ ] Use `dynamic()` import with `ssr: false` to prevent hydration issues
- [ ] Page views tracked on route changes
- [ ] Properties include: pathname, referrer, organizationSlug, productSlug
- [ ] Extract orgSlug and productSlug from URL params
- [ ] Verify in PostHog dashboard that pageviews are captured
- [ ] No duplicate events on hydration/re-renders

**Implementation Notes:**

> **Reference:** [PostHog Next.js App Router docs](https://posthog.com/docs/libraries/next-js)

**Step 1: Create the PostHogPageView component**
```typescript
// apps/client/src/app/PostHogPageView.tsx
'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { usePostHog } from 'posthog-js/react'

export default function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthog = usePostHog()

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`
      }

      // Extract org and product slugs from URL if present
      const pathParts = pathname.split('/')
      const orgSlugIndex = pathParts.indexOf('') + 1 // After first empty string
      const productSlugIndex = pathParts.indexOf('p') + 1

      posthog.capture('$pageview', {
        $current_url: url,
        pathname: pathname,
        organizationSlug: pathParts[orgSlugIndex] || null,
        productSlug: pathParts[productSlugIndex] || null
      })
    }
  }, [pathname, searchParams, posthog])

  return null
}
```

**Step 2: Update layout.tsx with dynamic import**
```typescript
// apps/client/src/app/layout.tsx
import { PHProvider } from './providers'
import dynamic from 'next/dynamic'

// Dynamic import with ssr: false prevents hydration mismatch errors
const PostHogPageView = dynamic(() => import('./PostHogPageView'), {
  ssr: false,
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <PHProvider>
        <body>
          <PostHogPageView />
          {children}
        </body>
      </PHProvider>
    </html>
  )
}
```

**Files to create:**
- `apps/client/src/app/PostHogPageView.tsx`

**Files to modify:**
- `apps/client/src/app/layout.tsx`

---

## Phase 2: Onboarding Funnel Tracking

### Task 2.1: Track onboarding started event
**Priority:** P0 (Critical)
**Estimate:** 1 point
**Dependencies:** Task 1.3
**Labels:** `onboarding`, `analytics`, `activation`

**Description:**
Fire `onboarding_started` event when user enters the onboarding flow for the first time.

**Acceptance Criteria:**
- [ ] Event fired when onboarding store initializes with `currentStep === 'welcome'`
- [ ] Event includes: organizationId, userId, timestamp
- [ ] Event only fires once per user (check if already completed)
- [ ] Verify event appears in PostHog

**Implementation Notes:**
```typescript
// apps/client/src/app/_components/first-time-onboarding/onboarding-store.ts
import { trackEvent } from '@/lib/analytics/tracker';
import { ANALYTICS_EVENTS } from '@/lib/analytics/events';

// In the store initialization or welcome step mount
if (currentStep === 'welcome' && !hasStartedOnboarding) {
  trackEvent(ANALYTICS_EVENTS.ONBOARDING_STARTED, {
    step: 'welcome',
    organizationId: session.activeOrganizationId,
    userId: session.userId
  });
}
```

**Files to modify:**
- `apps/client/src/app/_components/first-time-onboarding/onboarding-store.ts`

**Blocked by:** None (depends on Task 1.3)

---

### Task 2.2: Track onboarding step completion
**Priority:** P0 (Critical)
**Estimate:** 2 points
**Dependencies:** Task 2.1
**Labels:** `onboarding`, `analytics`, `activation`

**Description:**
Track when each onboarding step is completed with time spent on that step.

**Acceptance Criteria:**
- [ ] Track `onboarding_step_completed` when `completeStep()` is called
- [ ] Calculate `timeSpent` by storing step start timestamp
- [ ] Event properties: step name, timeSpent, organizationId, userId
- [ ] All 7 steps tracked: welcome, loading-steps, invite-selection, product-setup, prompt-selection, subscription-selection, complete
- [ ] Verify funnel in PostHog dashboard

**Implementation Notes:**
```typescript
// apps/client/src/app/_components/first-time-onboarding/onboarding-store.ts
interface OnboardingState {
  currentStep: OnboardingStep;
  stepStartTime: number; // Add this
  // ... other fields
}

const completeStep = (step: OnboardingStep) => {
  const timeSpent = Date.now() - get().stepStartTime;

  trackEvent(ANALYTICS_EVENTS.ONBOARDING_STEP_COMPLETED, {
    step,
    timeSpent: Math.floor(timeSpent / 1000), // seconds
    organizationId: session.activeOrganizationId,
    userId: session.userId
  });

  set({
    completedSteps: [...get().completedSteps, step],
    stepStartTime: Date.now() // Reset for next step
  });
};
```

**Files to modify:**
- `apps/client/src/app/_components/first-time-onboarding/onboarding-store.ts`

**Blocked by:** Task 2.1

---

### Task 2.3: Track onboarding completion
**Priority:** P0 (Critical)
**Estimate:** 1 point
**Dependencies:** Task 2.2
**Labels:** `onboarding`, `analytics`, `activation`

**Description:**
Fire `onboarding_completed` event when user reaches the final "complete" step.

**Acceptance Criteria:**
- [ ] Event fired when step === 'complete'
- [ ] Calculate total onboarding time (from start to completion)
- [ ] Properties: totalTimeSpent (seconds), stepsCompleted (count), organizationId, userId
- [ ] Update user property: `onboardingCompletedAt: timestamp`
- [ ] Verify event in PostHog

**Implementation Notes:**
```typescript
// apps/client/src/app/_components/first-time-onboarding/steps/complete-step.tsx
useEffect(() => {
  const totalTimeSpent = Date.now() - onboardingStartTime;

  trackEvent(ANALYTICS_EVENTS.ONBOARDING_COMPLETED, {
    totalTimeSpent: Math.floor(totalTimeSpent / 1000),
    stepsCompleted: completedSteps.length,
    organizationId: session.activeOrganizationId,
    userId: session.userId
  });

  posthog.setPersonProperties({
    onboardingCompletedAt: new Date().toISOString()
  });
}, []);
```

**Files to modify:**
- `apps/client/src/app/_components/first-time-onboarding/steps/complete-step.tsx`

**Blocked by:** Task 2.2

---

### Task 2.4: Track onboarding abandonment
**Priority:** P1 (High)
**Estimate:** 2 points
**Dependencies:** Task 2.2
**Labels:** `onboarding`, `analytics`, `activation`

**Description:**
Track when users abandon onboarding (navigate away before completing).

**Acceptance Criteria:**
- [ ] Detect when user navigates away from onboarding flow
- [ ] Event properties: lastStep, timeSpentTotal, stepsCompleted, organizationId, userId
- [ ] Don't fire if onboarding already completed
- [ ] Use `beforeunload` or Next.js navigation events to detect abandonment

**Implementation Notes:**
```typescript
// apps/client/src/app/_components/first-time-onboarding/onboarding-wrapper.tsx
useEffect(() => {
  const handleBeforeUnload = () => {
    if (!isOnboardingCompleted && currentStep !== 'complete') {
      trackEvent(ANALYTICS_EVENTS.ONBOARDING_ABANDONED, {
        lastStep: currentStep,
        timeSpentTotal: Math.floor((Date.now() - startTime) / 1000),
        stepsCompleted: completedSteps.length,
        organizationId: session.activeOrganizationId,
        userId: session.userId
      });
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [currentStep, isOnboardingCompleted]);
```

**Files to modify:**
- Create wrapper component or modify existing onboarding container

**Blocked by:** Task 2.2

---

### Task 2.5: Track domain analysis success/failure
**Priority:** P1 (High)
**Estimate:** 1 point
**Dependencies:** Task 2.2
**Labels:** `onboarding`, `analytics`, `activation`

**Description:**
Track whether AI-powered domain analysis succeeds or fails during onboarding.

**Acceptance Criteria:**
- [ ] Event: `domain_analysis_completed` with success/failure status
- [ ] Properties: domain, detectedLanguage, hasLogo, hasDescription, hasDifferentiators, timeToAnalyze
- [ ] Fire on API response in loading-steps component
- [ ] Verify in PostHog

**Implementation Notes:**
```typescript
// apps/client/src/app/_components/first-time-onboarding/steps/loading-steps.tsx
const analyzeDomain = async (domain: string) => {
  const startTime = Date.now();
  try {
    const response = await fetch('/api/v1/onboarding/analyze-domain', {
      method: 'POST',
      body: JSON.stringify({ domain })
    });
    const data = await response.json();
    const timeToAnalyze = Date.now() - startTime;

    trackEvent(ANALYTICS_EVENTS.DOMAIN_ANALYSIS_COMPLETED, {
      domain,
      success: true,
      detectedLanguage: data.detectedLanguage,
      hasLogo: !!data.logo,
      hasDescription: !!data.description,
      hasDifferentiators: data.differentiators?.length > 0,
      timeToAnalyze: Math.floor(timeToAnalyze / 1000),
      organizationId: session.activeOrganizationId
    });

    return data;
  } catch (error) {
    trackEvent(ANALYTICS_EVENTS.DOMAIN_ANALYSIS_COMPLETED, {
      domain,
      success: false,
      error: error.message,
      organizationId: session.activeOrganizationId
    });
    throw error;
  }
};
```

**Files to modify:**
- `apps/client/src/app/_components/first-time-onboarding/steps/loading-steps.tsx`

**Blocked by:** Task 2.2

---

## Phase 3: Feature Adoption Tracking

### Task 3.1: Track first conversation query created
**Priority:** P0 (Critical)
**Estimate:** 2 points
**Dependencies:** Task 1.3
**Labels:** `activation`, `analytics`, `feature-adoption`

**Description:**
Track when a user creates their first conversation query (key activation milestone).

**Acceptance Criteria:**
- [ ] Event: `conversation_query_created` with `isFirstQuery: true` flag
- [ ] Properties: queryId, queryType, answerEngine, organizationId, userId, daysSinceSignup
- [ ] Fire from API endpoint after query creation
- [ ] Check if this is user's first query and set flag accordingly
- [ ] Verify in PostHog

**Implementation Notes:**
```typescript
// apps/client/src/app/api/v1/conversation-queries/route.ts
export async function POST(request: Request) {
  // ... existing query creation logic

  const newQuery = await prisma.conversationQuery.create({ /* ... */ });

  // Check if this is the first query for this organization
  const queryCount = await prisma.conversationQuery.count({
    where: { organizationId: session.activeOrganizationId }
  });

  const user = await prisma.user.findUnique({
    where: { id: session.userId }
  });

  const daysSinceSignup = Math.floor(
    (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24)
  );

  trackEvent(ANALYTICS_EVENTS.CONVERSATION_QUERY_CREATED, {
    queryId: newQuery.id,
    queryType: newQuery.type,
    answerEngine: newQuery.answerEngine,
    organizationId: session.activeOrganizationId,
    userId: session.userId,
    daysSinceSignup,
    isFirstQuery: queryCount === 1
  });

  // If first query, also track feature_first_used
  if (queryCount === 1) {
    trackEvent(ANALYTICS_EVENTS.FEATURE_FIRST_USED, {
      feature: 'conversation_query',
      organizationId: session.activeOrganizationId,
      userId: session.userId,
      daysSinceSignup
    });
  }

  return Response.json(newQuery);
}
```

**Files to modify:**
- `apps/client/src/app/api/v1/conversation-queries/route.ts`

**Blocked by:** Task 1.3

---

### Task 3.2: Track custom view creation
**Priority:** P1 (High)
**Estimate:** 1 point
**Dependencies:** Task 3.1
**Labels:** `feature-adoption`, `analytics`, `power-users`

**Description:**
Track when users create custom views (indicates power user behavior).

**Acceptance Criteria:**
- [ ] Event: `custom_view_created`
- [ ] Properties: viewId, viewName, isDefault, organizationId, userId
- [ ] Check if this is first view → fire `feature_first_used` with `feature: 'custom_view'`
- [ ] Track from API endpoint after view creation

**Implementation Notes:**
```typescript
// apps/client/src/app/api/v1/views/route.ts
export async function POST(request: Request) {
  const newView = await prisma.view.create({ /* ... */ });

  const viewCount = await prisma.view.count({
    where: { organizationId: session.activeOrganizationId }
  });

  trackEvent(ANALYTICS_EVENTS.CUSTOM_VIEW_CREATED, {
    viewId: newView.id,
    viewName: newView.name,
    isDefault: newView.isDefault,
    organizationId: session.activeOrganizationId,
    userId: session.userId,
    isFirstView: viewCount === 1
  });

  if (viewCount === 1) {
    trackEvent(ANALYTICS_EVENTS.FEATURE_FIRST_USED, {
      feature: 'custom_view',
      organizationId: session.activeOrganizationId,
      userId: session.userId
    });
  }

  return Response.json(newView);
}
```

**Files to modify:**
- `apps/client/src/app/api/v1/views/route.ts` (verify this path exists)

**Blocked by:** Task 3.1

---

### Task 3.3: Track tracked URL additions
**Priority:** P1 (High)
**Estimate:** 1 point
**Dependencies:** Task 3.1
**Labels:** `feature-adoption`, `analytics`

**Description:**
Track when users add URLs to track (content analytics feature).

**Acceptance Criteria:**
- [ ] Event: `tracked_url_added`
- [ ] Properties: urlId, url, totalTrackedUrls, organizationId, userId
- [ ] Track first usage with `feature_first_used`
- [ ] Fire from API endpoint

**Implementation Notes:**
```typescript
// apps/client/src/app/api/v1/tracked-urls/route.ts
export async function POST(request: Request) {
  const trackedUrl = await prisma.trackedUrl.create({ /* ... */ });

  const trackedUrlCount = await prisma.trackedUrl.count({
    where: { organizationId: session.activeOrganizationId }
  });

  trackEvent(ANALYTICS_EVENTS.TRACKED_URL_ADDED, {
    urlId: trackedUrl.id,
    url: trackedUrl.url,
    totalTrackedUrls: trackedUrlCount,
    organizationId: session.activeOrganizationId,
    userId: session.userId,
    isFirstTrackedUrl: trackedUrlCount === 1
  });

  if (trackedUrlCount === 1) {
    trackEvent(ANALYTICS_EVENTS.FEATURE_FIRST_USED, {
      feature: 'tracked_url',
      organizationId: session.activeOrganizationId,
      userId: session.userId
    });
  }

  return Response.json(trackedUrl);
}
```

**Files to modify:**
- `apps/client/src/app/api/v1/tracked-urls/route.ts`

**Blocked by:** Task 3.1

---

### Task 3.4: Track content gap analysis runs
**Priority:** P2 (Medium)
**Estimate:** 1 point
**Dependencies:** Task 3.1
**Labels:** `feature-adoption`, `analytics`

**Description:**
Track when users run content gap analysis (advanced feature).

**Acceptance Criteria:**
- [ ] Event: `content_gap_analysis_started`
- [ ] Event: `content_gap_analysis_completed` with results metadata
- [ ] Properties: analysisId, conversationQueryId, contentGapType, organizationId
- [ ] Track first usage
- [ ] Fire from worker that processes analysis

**Implementation Notes:**
```typescript
// Wherever content gap analysis is triggered
trackEvent(ANALYTICS_EVENTS.CONTENT_GAP_ANALYSIS_STARTED, {
  analysisId: analysis.id,
  conversationQueryId: analysis.conversationQueryId,
  organizationId: session.activeOrganizationId
});

// When completed
trackEvent(ANALYTICS_EVENTS.CONTENT_GAP_ANALYSIS_COMPLETED, {
  analysisId: analysis.id,
  contentGapType: analysis.contentGapType,
  hasContentOutline: !!analysis.contentOutline,
  hasFaqList: analysis.faqList?.length > 0,
  organizationId: session.activeOrganizationId
});
```

**Files to modify:**
- Content gap analysis API route or worker

**Blocked by:** Task 3.1

---

## Phase 4: Engagement Loop Tracking

### Task 4.1: Track daily prompt feedback
**Priority:** P0 (Critical)
**Estimate:** 2 points
**Dependencies:** Task 1.3
**Labels:** `engagement`, `analytics`, `retention`

**Description:**
Track when users provide feedback on daily generated prompts.

**Acceptance Criteria:**
- [ ] Event: `daily_prompt_viewed` when prompt is shown
- [ ] Event: `daily_prompt_feedback` when user clicks helpful/not helpful/dismissed
- [ ] Properties: promptId, feedback, brandId, organizationId, userId
- [ ] Fire from client-side component
- [ ] Update database `DailyPromptGeneration` record with feedback

**Implementation Notes:**
```typescript
// Component that displays daily prompts
const handleFeedback = async (feedback: 'helpful' | 'not_helpful' | 'dismissed') => {
  trackEvent(ANALYTICS_EVENTS.DAILY_PROMPT_FEEDBACK, {
    promptId: prompt.id,
    feedback,
    brandId: prompt.brandId,
    organizationId: session.activeOrganizationId,
    userId: session.userId
  });

  // Update database
  await fetch('/api/v1/daily-prompts/feedback', {
    method: 'POST',
    body: JSON.stringify({ promptId: prompt.id, feedback })
  });
};
```

**Files to modify:**
- Daily prompt component (need to find exact location)
- API endpoint for feedback submission

**Blocked by:** Task 1.3

---

### Task 4.2: Track weekly report subscription changes
**Priority:** P0 (Critical)
**Estimate:** 1 point
**Dependencies:** Task 1.3
**Labels:** `engagement`, `analytics`, `retention`

**Description:**
Track when users enable/disable weekly report email subscriptions.

**Acceptance Criteria:**
- [ ] Event: `weekly_report_subscription_enabled`
- [ ] Event: `weekly_report_subscription_disabled` with optional reason
- [ ] Properties: brandId, dayOfWeek, timeOfDay, timezone, organizationId, userId
- [ ] Fire from API endpoint when subscription is created/updated

**Implementation Notes:**
```typescript
// apps/client/src/app/api/v1/weekly-reports/route.ts (or similar)
export async function POST(request: Request) {
  const { isEnabled, dayOfWeek, timeOfDay, timezone } = await request.json();

  const subscription = await prisma.weeklyReportSubscription.upsert({
    where: { brandId_userId: { brandId, userId } },
    create: { /* ... */ },
    update: { isEnabled, dayOfWeek, timeOfDay, timezone }
  });

  trackEvent(
    isEnabled
      ? ANALYTICS_EVENTS.WEEKLY_REPORT_SUBSCRIPTION_ENABLED
      : ANALYTICS_EVENTS.WEEKLY_REPORT_SUBSCRIPTION_DISABLED,
    {
      brandId,
      dayOfWeek,
      timeOfDay,
      timezone,
      organizationId: session.activeOrganizationId,
      userId: session.userId
    }
  );

  return Response.json(subscription);
}
```

**Files to modify:**
- Weekly report subscription API endpoint

**Blocked by:** Task 1.3

---

### Task 4.3: Track weekly report email sent
**Priority:** P1 (High)
**Estimate:** 2 points
**Dependencies:** Task 4.2
**Labels:** `engagement`, `analytics`, `email`

**Description:**
Track when weekly report emails are sent from the worker.

**Acceptance Criteria:**
- [ ] Event: `weekly_report_email_sent`
- [ ] Properties: brandId, organizationId, userId, reportData (summary)
- [ ] Fire from `apps/worker/src/workers/weekly-report.ts` after email sent
- [ ] Include email ID from Resend for correlation
- [ ] Track send failures with separate event

**Implementation Notes:**
```typescript
// apps/worker/src/workers/weekly-report.ts
import { trackEvent } from '@ctrl0/common/analytics'; // Need to export from common package

const sendWeeklyReport = async (subscription: WeeklyReportSubscription) => {
  try {
    const reportData = await generateReportData(subscription);

    const emailResult = await resend.emails.send({
      from: 'reports@promptingco.com',
      to: subscription.user.email,
      subject: `Weekly Report: ${subscription.brand.name}`,
      react: WeeklyReportEmail({ reportData })
    });

    trackEvent(ANALYTICS_EVENTS.WEEKLY_REPORT_EMAIL_SENT, {
      brandId: subscription.brandId,
      organizationId: subscription.organizationId,
      userId: subscription.userId,
      emailId: emailResult.id,
      sovChange: reportData.sov.trend,
      citationCount: reportData.citations.length
    });
  } catch (error) {
    trackEvent(ANALYTICS_EVENTS.WEEKLY_REPORT_EMAIL_FAILED, {
      brandId: subscription.brandId,
      error: error.message
    });
  }
};
```

**Files to modify:**
- `apps/worker/src/workers/weekly-report.ts`
- Export analytics functions from common package

**Blocked by:** Task 4.2

---

### Task 4.4: Track weekly report email engagement (opens/clicks)
**Priority:** P2 (Medium)
**Estimate:** 3 points
**Dependencies:** Task 4.3
**Labels:** `engagement`, `analytics`, `email`

**Description:**
Track email opens and link clicks from weekly reports using Resend webhooks or tracking pixels.

**Acceptance Criteria:**
- [ ] Set up Resend webhook endpoint to receive email events
- [ ] Event: `weekly_report_email_opened`
- [ ] Event: `weekly_report_email_clicked` with link target
- [ ] Correlate events with original email using emailId
- [ ] Verify events flow to PostHog

**Implementation Notes:**
```typescript
// apps/client/src/app/api/webhooks/resend/route.ts
export async function POST(request: Request) {
  const event = await request.json();

  switch (event.type) {
    case 'email.opened':
      trackEvent(ANALYTICS_EVENTS.WEEKLY_REPORT_EMAIL_OPENED, {
        emailId: event.data.email_id,
        organizationId: event.data.tags.organizationId, // Pass as tag
        userId: event.data.tags.userId,
        brandId: event.data.tags.brandId
      });
      break;

    case 'email.clicked':
      trackEvent(ANALYTICS_EVENTS.WEEKLY_REPORT_EMAIL_CLICKED, {
        emailId: event.data.email_id,
        link: event.data.link,
        organizationId: event.data.tags.organizationId,
        userId: event.data.tags.userId,
        brandId: event.data.tags.brandId
      });
      break;
  }

  return Response.json({ received: true });
}
```

**Files to create:**
- `apps/client/src/app/api/webhooks/resend/route.ts`

**Files to modify:**
- `apps/worker/src/workers/weekly-report.ts` - add tags to email

**Blocked by:** Task 4.3

---

### Task 4.5: Track opportunity interactions
**Priority:** P1 (High)
**Estimate:** 2 points
**Dependencies:** Task 1.3
**Labels:** `engagement`, `analytics`, `value-realization`

**Description:**
Track when opportunities are created by AI and when users accept/dismiss them.

**Acceptance Criteria:**
- [ ] Event: `opportunity_identified` when AI creates opportunity
- [ ] Event: `opportunity_status_changed` when user accepts/dismisses
- [ ] Properties: opportunityId, queryRunType, rationale (truncated), status, brandId
- [ ] Fire from API endpoint or worker that creates opportunities

**Implementation Notes:**
```typescript
// When opportunity is created (API or worker)
trackEvent(ANALYTICS_EVENTS.OPPORTUNITY_IDENTIFIED, {
  opportunityId: opportunity.id,
  queryRunType: opportunity.queryRunType,
  rationale: opportunity.rationale.substring(0, 100), // Truncate
  brandId: opportunity.brandId,
  organizationId: opportunity.organizationId
});

// When user updates status (API endpoint)
// apps/client/src/app/api/v1/opportunities/[opportunityId]/route.ts
export async function PATCH(request: Request) {
  const { status } = await request.json();

  const updated = await prisma.opportunity.update({
    where: { id: params.opportunityId },
    data: { status }
  });

  trackEvent(ANALYTICS_EVENTS.OPPORTUNITY_STATUS_CHANGED, {
    opportunityId: updated.id,
    status,
    brandId: updated.brandId,
    organizationId: session.activeOrganizationId,
    userId: session.userId
  });

  return Response.json(updated);
}
```

**Files to modify:**
- Opportunity creation logic (worker or API)
- `apps/client/src/app/api/v1/opportunities/[opportunityId]/route.ts`

**Blocked by:** Task 1.3

---

## Phase 5: Monetization & Conversion Tracking

### Task 5.1: Track entitlement limit warnings
**Priority:** P0 (Critical)
**Estimate:** 2 points
**Dependencies:** Task 1.3
**Labels:** `monetization`, `analytics`, `conversion`

**Description:**
Track when users approach or hit entitlement limits (critical conversion signal).

**Acceptance Criteria:**
- [ ] Event: `entitlement_limit_warning` when usage reaches 80% of limit
- [ ] Event: `entitlement_limit_reached` when usage hits 100%
- [ ] Event: `entitlement_limit_exceeded` when soft limit is exceeded
- [ ] Properties: entitlementType, currentUsage, limit, percentage, organizationId
- [ ] Fire from billing check API or wherever limits are enforced

**Implementation Notes:**
```typescript
// apps/client/src/app/api/v1/billing/check/route.ts (or wherever limits are checked)
export async function GET(request: Request) {
  const subscription = await getSubscription(session.activeOrganizationId);
  const entitlements = await getEntitlements(subscription.id);
  const usage = await getCurrentUsage(session.activeOrganizationId);

  entitlements.forEach(entitlement => {
    const currentUsage = usage[entitlement.type];
    const percentage = (currentUsage / entitlement.limit) * 100;

    // Warning at 80%
    if (percentage >= 80 && percentage < 100) {
      trackEvent(ANALYTICS_EVENTS.ENTITLEMENT_LIMIT_WARNING, {
        entitlementType: entitlement.type,
        currentUsage,
        limit: entitlement.limit,
        percentage: Math.round(percentage),
        limitType: entitlement.limitType,
        organizationId: session.activeOrganizationId
      });
    }

    // Reached at 100%
    if (percentage >= 100 && entitlement.limitType === 'hard') {
      trackEvent(ANALYTICS_EVENTS.ENTITLEMENT_LIMIT_REACHED, {
        entitlementType: entitlement.type,
        currentUsage,
        limit: entitlement.limit,
        limitType: 'hard',
        organizationId: session.activeOrganizationId
      });
    }

    // Exceeded (soft limits only)
    if (percentage > 100 && entitlement.limitType === 'soft') {
      trackEvent(ANALYTICS_EVENTS.ENTITLEMENT_LIMIT_EXCEEDED, {
        entitlementType: entitlement.type,
        currentUsage,
        limit: entitlement.limit,
        overage: currentUsage - entitlement.limit,
        limitType: 'soft',
        organizationId: session.activeOrganizationId
      });
    }
  });

  return Response.json({ subscription, entitlements, usage });
}
```

**Files to modify:**
- `apps/client/src/app/api/v1/billing/check/route.ts`

**Blocked by:** Task 1.3

---

### Task 5.2: Track subscription plan views
**Priority:** P1 (High)
**Estimate:** 1 point
**Dependencies:** Task 5.1
**Labels:** `monetization`, `analytics`, `conversion`

**Description:**
Track when users view pricing/subscription page (conversion intent signal).

**Acceptance Criteria:**
- [ ] Event: `subscription_plan_viewed`
- [ ] Properties: currentPlan, viewedPlan (if clicked specific plan), source (where they came from), organizationId
- [ ] Fire from pricing page component
- [ ] Track which plan cards are clicked

**Implementation Notes:**
```typescript
// Pricing/subscription page component
useEffect(() => {
  trackEvent(ANALYTICS_EVENTS.SUBSCRIPTION_PLAN_VIEWED, {
    currentPlan: subscription.plan,
    source: router.query.ref || 'direct', // Track referrer
    organizationId: session.activeOrganizationId,
    userId: session.userId
  });
}, []);

// When user clicks on specific plan
const handlePlanClick = (planName: string) => {
  trackEvent(ANALYTICS_EVENTS.SUBSCRIPTION_PLAN_CLICKED, {
    currentPlan: subscription.plan,
    clickedPlan: planName,
    organizationId: session.activeOrganizationId,
    userId: session.userId
  });
};
```

**Files to modify:**
- Subscription/pricing page component
- Plan selection component from onboarding (step 6)

**Blocked by:** Task 5.1

---

### Task 5.3: Track subscription upgrades/downgrades
**Priority:** P0 (Critical)
**Estimate:** 2 points
**Dependencies:** Task 5.2
**Labels:** `monetization`, `analytics`, `conversion`

**Description:**
Track successful plan changes (upgrade, downgrade, or cancellation).

**Acceptance Criteria:**
- [ ] Event: `subscription_upgraded` when moving to higher tier
- [ ] Event: `subscription_downgraded` when moving to lower tier
- [ ] Event: `subscription_canceled` when subscription is canceled
- [ ] Properties: fromPlan, toPlan, daysSinceSignup, trigger (user vs admin), organizationId
- [ ] Fire from Stripe webhook handler
- [ ] Update user properties in PostHog with new plan

**Implementation Notes:**
```typescript
// apps/client/src/app/api/auth/stripe/webhook/route.ts
import { trackEvent } from '@/lib/analytics/tracker';

export async function POST(request: Request) {
  const event = await stripe.webhooks.constructEvent(/* ... */);

  switch (event.type) {
    case 'customer.subscription.updated': {
      const subscription = event.data.object;
      const previous = event.data.previous_attributes;

      const orgSubscription = await prisma.subscription.findFirst({
        where: { stripeSubscriptionId: subscription.id },
        include: { organization: { include: { members: true } } }
      });

      if (previous?.plan && previous.plan.id !== subscription.plan.id) {
        const fromPlan = mapStripePlanToAppPlan(previous.plan.id);
        const toPlan = mapStripePlanToAppPlan(subscription.plan.id);

        const planTiers = ['free', 'basic', 'pro', 'enterprise'];
        const isUpgrade = planTiers.indexOf(toPlan) > planTiers.indexOf(fromPlan);

        trackEvent(
          isUpgrade
            ? ANALYTICS_EVENTS.SUBSCRIPTION_UPGRADED
            : ANALYTICS_EVENTS.SUBSCRIPTION_DOWNGRADED,
          {
            fromPlan,
            toPlan,
            organizationId: orgSubscription.organizationId,
            // Get first member as representative user
            userId: orgSubscription.organization.members[0].userId,
            daysSinceSignup: Math.floor(
              (Date.now() - orgSubscription.createdAt.getTime()) / (1000 * 60 * 60 * 24)
            )
          }
        );

        // Update all org members' PostHog profiles
        orgSubscription.organization.members.forEach(member => {
          posthog.identify(member.userId, { plan: toPlan });
        });
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const orgSubscription = await prisma.subscription.findFirst({
        where: { stripeSubscriptionId: subscription.id }
      });

      trackEvent(ANALYTICS_EVENTS.SUBSCRIPTION_CANCELED, {
        plan: orgSubscription.plan,
        organizationId: orgSubscription.organizationId,
        cancellationReason: subscription.cancellation_details?.reason,
        daysSinceSignup: Math.floor(
          (Date.now() - orgSubscription.createdAt.getTime()) / (1000 * 60 * 60 * 24)
        )
      });
      break;
    }
  }

  return Response.json({ received: true });
}
```

**Files to modify:**
- `apps/client/src/app/api/auth/stripe/webhook/route.ts`

**Blocked by:** Task 5.2

---

### Task 5.4: Track feature access blocks (paywall hits)
**Priority:** P1 (High)
**Estimate:** 1 point
**Dependencies:** Task 5.1
**Labels:** `monetization`, `analytics`, `conversion`

**Description:**
Track when users try to access premium features they don't have access to.

**Acceptance Criteria:**
- [ ] Event: `premium_feature_blocked`
- [ ] Properties: feature name, required plan, current plan, organizationId, userId
- [ ] Fire when hard limit blocks action
- [ ] Fire when feature flag check returns false for premium features

**Implementation Notes:**
```typescript
// Wherever feature access is checked
if (!hasAccess) {
  trackEvent(ANALYTICS_EVENTS.PREMIUM_FEATURE_BLOCKED, {
    feature: 'ga4_integration', // or other feature name
    requiredPlan: 'pro',
    currentPlan: subscription.plan,
    organizationId: session.activeOrganizationId,
    userId: session.userId
  });

  // Show upgrade modal
  return showUpgradeModal();
}
```

**Files to modify:**
- Add to feature flag check functions
- Add to entitlement enforcement points

**Blocked by:** Task 5.1

---

## Phase 6: Integration & Power User Tracking

### Task 6.1: Track integration connections
**Priority:** P1 (High)
**Estimate:** 2 points
**Dependencies:** Task 1.3
**Labels:** `integrations`, `analytics`, `power-users`

**Description:**
Track when users connect third-party integrations (PostHog, GA4, Linear).

**Acceptance Criteria:**
- [ ] Event: `integration_connected` for each integration
- [ ] Event: `integration_disconnected`
- [ ] Properties: integrationType, organizationId, userId, daysSinceSignup
- [ ] Track first integration as `feature_first_used`
- [ ] Fire from integration API endpoints

**Implementation Notes:**
```typescript
// apps/client/src/app/api/v1/integrations/[type]/route.ts
export async function POST(request: Request) {
  const { type } = params; // 'ga4' | 'posthog' | 'linear'

  // Save integration credentials
  const integration = await saveIntegration(type, credentials);

  const integrationCount = await countIntegrations(session.activeOrganizationId);

  trackEvent(ANALYTICS_EVENTS.INTEGRATION_CONNECTED, {
    integrationType: type,
    organizationId: session.activeOrganizationId,
    userId: session.userId,
    daysSinceSignup: getDaysSinceSignup(session.userId),
    isFirstIntegration: integrationCount === 1
  });

  if (integrationCount === 1) {
    trackEvent(ANALYTICS_EVENTS.FEATURE_FIRST_USED, {
      feature: 'integration',
      organizationId: session.activeOrganizationId,
      userId: session.userId
    });
  }

  return Response.json(integration);
}

export async function DELETE(request: Request) {
  trackEvent(ANALYTICS_EVENTS.INTEGRATION_DISCONNECTED, {
    integrationType: params.type,
    organizationId: session.activeOrganizationId,
    userId: session.userId
  });

  // Delete integration
  await deleteIntegration(params.type, session.activeOrganizationId);

  return Response.json({ success: true });
}
```

**Files to modify:**
- `apps/client/src/app/api/v1/integrations/ga4/route.ts`
- `apps/client/src/app/api/v1/integrations/posthog/route.ts`
- `apps/client/src/app/api/v1/integrations/linear/route.ts`

**Blocked by:** Task 1.3

---

### Task 6.2: Track team member invitations
**Priority:** P1 (High)
**Estimate:** 1 point
**Dependencies:** Task 1.3
**Labels:** `expansion`, `analytics`, `team-growth`

**Description:**
Track when users invite team members (expansion signal).

**Acceptance Criteria:**
- [ ] Event: `team_member_invited`
- [ ] Event: `team_member_joined` when invitation is accepted
- [ ] Properties: inviteeEmail, inviteeRole, currentTeamSize, organizationId, inviterId
- [ ] Fire from invitation API endpoint

**Implementation Notes:**
```typescript
// apps/client/src/app/api/v1/invitations/route.ts
export async function POST(request: Request) {
  const { email, role } = await request.json();

  const invitation = await prisma.invitation.create({
    data: { email, role, organizationId: session.activeOrganizationId }
  });

  const teamSize = await prisma.member.count({
    where: { organizationId: session.activeOrganizationId }
  });

  trackEvent(ANALYTICS_EVENTS.TEAM_MEMBER_INVITED, {
    inviteeEmail: email,
    inviteeRole: role,
    currentTeamSize: teamSize,
    organizationId: session.activeOrganizationId,
    inviterId: session.userId
  });

  return Response.json(invitation);
}

// When invitation is accepted
export async function PATCH(request: Request) {
  // ... accept invitation logic

  trackEvent(ANALYTICS_EVENTS.TEAM_MEMBER_JOINED, {
    newMemberEmail: invitation.email,
    newMemberRole: invitation.role,
    newTeamSize: teamSize + 1,
    organizationId: invitation.organizationId,
    inviterId: invitation.invitedBy
  });

  return Response.json(member);
}
```

**Files to modify:**
- Invitation API endpoints (create and accept)

**Blocked by:** Task 1.3

---

### Task 6.3: Track dashboard page views
**Priority:** P2 (Medium)
**Estimate:** 1 point
**Dependencies:** Task 1.5
**Labels:** `engagement`, `analytics`

**Description:**
Track which dashboard pages users visit most frequently.

**Acceptance Criteria:**
- [ ] Leverage automatic pageview tracking from Task 1.5
- [ ] Add custom properties to pageviews: dashboardType (overview, citations, metrics, content-analytics)
- [ ] Extract organizationSlug and productSlug from URL
- [ ] Track time on page

**Implementation Notes:**
```typescript
// This can leverage Task 1.5's automatic pageview tracking
// Just ensure we're extracting relevant metadata from the URL

// apps/client/src/app/[orgSlug]/p/[productSlug]/[page]/page.tsx
useEffect(() => {
  const pageType = pathname.split('/').pop(); // 'citations', 'metrics', etc.

  posthog.capture('dashboard_page_viewed', {
    dashboardType: pageType,
    organizationSlug: params.orgSlug,
    productSlug: params.productSlug,
    organizationId: session.activeOrganizationId
  });
}, [pathname]);
```

**Files to modify:**
- Dashboard page components (if additional metadata needed beyond automatic tracking)

**Blocked by:** Task 1.5

---

### Task 6.4: Track export actions
**Priority:** P2 (Medium)
**Estimate:** 1 point
**Dependencies:** Task 1.3
**Labels:** `power-users`, `analytics`

**Description:**
Track when users export data (CSV, PDF, etc.) - indicates high engagement.

**Acceptance Criteria:**
- [ ] Event: `data_exported`
- [ ] Properties: dataType (citations, reports, analytics), format (csv, pdf), recordCount, organizationId
- [ ] Fire from export API endpoints or client-side export buttons

**Implementation Notes:**
```typescript
// Export button component or API endpoint
const handleExport = async (format: 'csv' | 'pdf') => {
  trackEvent(ANALYTICS_EVENTS.DATA_EXPORTED, {
    dataType: 'citations', // or 'reports', 'analytics'
    format,
    recordCount: data.length,
    organizationId: session.activeOrganizationId,
    userId: session.userId
  });

  // Perform export
  await exportData(data, format);
};
```

**Files to modify:**
- Export components/API endpoints (need to identify locations)

**Blocked by:** Task 1.3

---

## Phase 7: Retention & Churn Signals

### Task 7.1: Track session start and inactivity
**Priority:** P1 (High)
**Estimate:** 2 points
**Dependencies:** Task 1.4
**Labels:** `retention`, `analytics`, `churn`

**Description:**
Track when users start sessions and calculate days since last activity.

**Acceptance Criteria:**
- [ ] Event: `session_started` with daysSinceLastSession
- [ ] Fire on authentication (already handled by Task 1.4)
- [ ] Calculate and store lastActivityAt in database
- [ ] Update PostHog user property: `lastActivityAt`

**Implementation Notes:**
```typescript
// In auth callback or middleware
const lastSession = await prisma.session.findFirst({
  where: { userId: session.userId },
  orderBy: { createdAt: 'desc' },
  skip: 1 // Skip current session
});

const daysSinceLastSession = lastSession
  ? Math.floor((Date.now() - lastSession.createdAt.getTime()) / (1000 * 60 * 60 * 24))
  : null;

trackEvent(ANALYTICS_EVENTS.SESSION_STARTED, {
  organizationId: session.activeOrganizationId,
  userId: session.userId,
  daysSinceLastSession,
  isReturningUser: !!lastSession
});

// Update user property
posthog.setPersonProperties({
  lastActivityAt: new Date().toISOString()
});
```

**Files to modify:**
- Auth callback or middleware

**Blocked by:** Task 1.4

---

### Task 7.2: Create scheduled job to track inactive users
**Priority:** P2 (Medium)
**Estimate:** 3 points
**Dependencies:** Task 7.1
**Labels:** `retention`, `analytics`, `churn`, `infrastructure`

**Description:**
Create a daily scheduled job that identifies and tracks inactive users (no activity in 7/14/30 days).

**Acceptance Criteria:**
- [ ] BullMQ or Temporal job runs daily
- [ ] Query users with lastActivityAt > 7/14/30 days ago
- [ ] Event: `user_inactive_7_days`, `user_inactive_14_days`, `user_inactive_30_days`
- [ ] Properties: organizationId, userId, daysSinceLastActivity, lastActivityType
- [ ] Add user segment in PostHog: "At risk of churn"

**Implementation Notes:**
```typescript
// apps/worker/src/workers/inactivity-tracker.ts
import { Queue } from 'bullmq';
import { prisma } from '@ctrl0/database';
import { trackEvent } from '@ctrl0/common/analytics';

export const inactivityTrackerQueue = new Queue('inactivity-tracker');

export async function trackInactiveUsers() {
  const thresholds = [7, 14, 30];

  for (const days of thresholds) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const inactiveUsers = await prisma.user.findMany({
      where: {
        lastActivityAt: { lt: cutoffDate },
        // Don't track if already tracked for this threshold recently
        NOT: {
          inactivityEvents: {
            some: {
              days,
              trackedAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
            }
          }
        }
      },
      include: { members: true }
    });

    for (const user of inactiveUsers) {
      const daysSinceLastActivity = Math.floor(
        (Date.now() - user.lastActivityAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      trackEvent(`user_inactive_${days}_days`, {
        organizationId: user.members[0]?.organizationId,
        userId: user.id,
        daysSinceLastActivity,
        lastActivityType: 'unknown' // Could track this separately
      });

      // Record that we tracked this
      await prisma.inactivityEvent.create({
        data: { userId: user.id, days, trackedAt: new Date() }
      });
    }
  }
}

// Schedule daily at 9am UTC
inactivityTrackerQueue.add(
  'track-inactive-users',
  {},
  { repeat: { pattern: '0 9 * * *' } }
);
```

**Files to create:**
- `apps/worker/src/workers/inactivity-tracker.ts`

**Database migration needed:**
- Add `lastActivityAt` to User model
- Add `InactivityEvent` model to track which users we've already notified

**Blocked by:** Task 7.1

---

### Task 7.3: Track feature flag exposures
**Priority:** P2 (Medium)
**Estimate:** 2 points
**Dependencies:** Task 1.3
**Labels:** `experimentation`, `analytics`

**Description:**
Track when users are exposed to feature flags (for A/B test analysis).

**Acceptance Criteria:**
- [ ] Event: `feature_flag_exposed`
- [ ] Properties: flagName, flagValue (enabled/disabled), organizationId, userId
- [ ] Fire from feature flag check functions
- [ ] Don't track same exposure multiple times in same session

**Implementation Notes:**
```typescript
// apps/client/src/lib/feature-flags.ts
import { trackEvent } from '@/lib/analytics/tracker';

const exposedFlagsThisSession = new Set<string>();

export const isFeatureFlagEnabled = async (session: Session, flagKey: string) => {
  const flags = await getAllFeatureFlags(session);
  const isEnabled = flags[flagKey] ?? false;

  // Track exposure (once per session)
  const exposureKey = `${session.userId}-${flagKey}`;
  if (!exposedFlagsThisSession.has(exposureKey)) {
    trackEvent(ANALYTICS_EVENTS.FEATURE_FLAG_EXPOSED, {
      flagName: flagKey,
      flagValue: isEnabled,
      organizationId: session.activeOrganizationId,
      userId: session.userId
    });
    exposedFlagsThisSession.add(exposureKey);
  }

  return isEnabled;
};
```

**Files to modify:**
- `apps/client/src/lib/feature-flags.ts`

**Blocked by:** Task 1.3

---

## Phase 8: PostHog Dashboards & Analysis

### Task 8.1: Create Activation Funnel dashboard
**Priority:** P0 (Critical)
**Estimate:** 3 points
**Dependencies:** Tasks 2.1-2.5
**Labels:** `dashboard`, `analytics`, `activation`

**Description:**
Build PostHog Insights dashboard showing onboarding funnel conversion rates.

**Acceptance Criteria:**
- [ ] Funnel insight: `onboarding_started` → `onboarding_step_completed` (each step) → `onboarding_completed`
- [ ] Show conversion rate at each step
- [ ] Time to convert trend chart
- [ ] Drop-off analysis: where users abandon
- [ ] Cohort comparison: by signup date, by source
- [ ] Set goal: >60% complete onboarding within 7 days

**Implementation:**
1. Go to PostHog Insights
2. Create Funnel:
   - Step 1: `onboarding_started`
   - Step 2: `onboarding_step_completed` where `step = welcome`
   - Step 3: `onboarding_step_completed` where `step = domain_analysis`
   - ... (all steps)
   - Step 8: `onboarding_completed`
3. Set time window: 7 days
4. Add breakdown by `organizationId` to identify stuck orgs
5. Save to "PLG - Activation" dashboard

**No code changes needed - this is PostHog configuration**

**Blocked by:** Tasks 2.1-2.5

---

### Task 8.2: Create Feature Adoption dashboard
**Priority:** P0 (Critical)
**Estimate:** 3 points
**Dependencies:** Tasks 3.1-3.4
**Labels:** `dashboard`, `analytics`, `adoption`

**Description:**
Build dashboard showing feature adoption rates and time-to-first-use for key features.

**Acceptance Criteria:**
- [ ] Adoption curve: % of users who've used each feature by day 7/14/30/90
- [ ] Time to first use: distribution chart for each feature
- [ ] Feature matrix: which features correlate with retention? (cohort analysis)
- [ ] Top features by MAU
- [ ] Stickiness: DAU/MAU per feature

**Insights to create:**
1. **Adoption Trend** (line chart):
   - Y-axis: % of cohort that used feature
   - X-axis: Days since signup
   - Series: conversation_query, custom_view, tracked_url, integrations

2. **Time to First Use** (histogram):
   - Event: `feature_first_used`
   - Property: `daysSinceSignup`
   - Breakdown by: `feature`

3. **Feature Correlation** (retention table):
   - Cohort: Users who used feature X in first 7 days
   - Retention: Day 30 retention rate
   - Compare: conversation_query vs custom_view vs tracked_url

**No code changes needed - PostHog configuration**

**Blocked by:** Tasks 3.1-3.4

---

### Task 8.3: Create Engagement dashboard
**Priority:** P1 (High)
**Estimate:** 3 points
**Dependencies:** Phase 4 (Tasks 4.1-4.5)
**Labels:** `dashboard`, `analytics`, `engagement`

**Description:**
Build dashboard showing daily/weekly active users and engagement depth metrics.

**Acceptance Criteria:**
- [ ] DAU/WAU/MAU trend chart
- [ ] Stickiness ratio: DAU/MAU over time
- [ ] Sessions per user (distribution)
- [ ] Email engagement: weekly report open/click rates
- [ ] Daily prompt feedback rate
- [ ] Power user segmentation: top 10% by activity

**Insights to create:**
1. **Active Users** (line chart):
   - Unique users with any event, grouped by day/week/month

2. **Stickiness** (line chart):
   - Formula: DAU / MAU
   - Goal: >20%

3. **Email Performance** (table):
   - `weekly_report_email_sent` count
   - `weekly_report_email_opened` count
   - Open rate calculation
   - `weekly_report_email_clicked` count
   - Click-through rate

4. **Prompt Engagement** (bar chart):
   - `daily_prompt_feedback` events
   - Breakdown by `feedback` type (helpful/not helpful/dismissed)
   - Feedback rate: events / prompts sent

**No code changes needed - PostHog configuration**

**Blocked by:** Phase 4

---

### Task 8.4: Create Monetization dashboard
**Priority:** P0 (Critical)
**Estimate:** 3 points
**Dependencies:** Phase 5 (Tasks 5.1-5.4)
**Labels:** `dashboard`, `analytics`, `monetization`

**Description:**
Build dashboard showing conversion funnel from free to paid and upsell indicators.

**Acceptance Criteria:**
- [ ] Conversion funnel: signup → limit warning → plan viewed → upgraded
- [ ] Time to upgrade distribution
- [ ] Limit hit frequency by entitlement type
- [ ] Premium feature block rate (paywall hits)
- [ ] MRR trend (if integrated with Stripe data)
- [ ] Churn rate by plan

**Insights to create:**
1. **Conversion Funnel** (funnel):
   - User signup (from `onboarding_completed`)
   - Hit limit (`entitlement_limit_warning`)
   - View pricing (`subscription_plan_viewed`)
   - Upgrade (`subscription_upgraded`)

2. **Time to Upgrade** (histogram):
   - Event: `subscription_upgraded`
   - Property: `daysSinceSignup`
   - Breakdown by: `toPlan`

3. **Limit Warnings** (bar chart):
   - Event: `entitlement_limit_reached`
   - Group by: `entitlementType`
   - Shows which limits drive upgrades

4. **Paywall Hits** (line chart):
   - Event: `premium_feature_blocked`
   - Group by: `feature`
   - Shows which premium features have demand

**No code changes needed - PostHog configuration**

**Blocked by:** Phase 5

---

### Task 8.5: Create Retention & Churn dashboard
**Priority:** P1 (High)
**Estimate:** 3 points
**Dependencies:** Phase 7 (Tasks 7.1-7.3)
**Labels:** `dashboard`, `analytics`, `retention`

**Description:**
Build dashboard showing cohort retention and early churn indicators.

**Acceptance Criteria:**
- [ ] Cohort retention table: Day 1/7/30/90 retention by signup week
- [ ] Churn curve: % of users churned by days since signup
- [ ] Inactive user count: 7/14/30 day buckets
- [ ] Resurrection rate: % of inactive users who return
- [ ] Retention by plan tier

**Insights to create:**
1. **Retention Table** (retention insight):
   - Cohort by: signup week
   - Return event: any activity event
   - Intervals: Day 1, 7, 14, 30, 60, 90

2. **Churn Analysis** (line chart):
   - Event: `subscription_canceled`
   - Property: `daysSinceSignup`
   - Breakdown by: `plan`

3. **Inactive Users** (bar chart):
   - Events: `user_inactive_7_days`, `user_inactive_14_days`, `user_inactive_30_days`
   - Count by event type
   - Alert if spike

4. **Resurrection** (funnel):
   - Step 1: `user_inactive_7_days`
   - Step 2: `session_started` (within 7 days after inactive event)
   - Shows % who come back

**No code changes needed - PostHog configuration**

**Blocked by:** Phase 7

---

## Phase 9: Alerts & Monitoring

### Task 9.1: Set up critical metric alerts
**Priority:** P1 (High)
**Estimate:** 2 points
**Dependencies:** Tasks 8.1-8.5
**Labels:** `monitoring`, `analytics`, `alerts`

**Description:**
Configure PostHog or Slack alerts for critical metric changes.

**Acceptance Criteria:**
- [ ] Alert: Onboarding completion rate drops below 50%
- [ ] Alert: DAU drops by >20% week-over-week
- [ ] Alert: Churn spike (>5 cancellations in one day)
- [ ] Alert: Payment failures (if integrated with Stripe)
- [ ] Alerts sent to Slack channel: #plg-metrics

**Implementation:**
1. In PostHog, go to each critical insight
2. Click "Subscriptions" → "New subscription"
3. Configure:
   - Frequency: Daily for most, Real-time for critical
   - Channel: Slack webhook
   - Threshold: Set based on acceptance criteria
4. Test each alert

**No code changes needed - PostHog configuration**

**Blocked by:** Dashboard tasks (8.1-8.5)

---

### Task 9.2: Create weekly PLG metrics report
**Priority:** P2 (Medium)
**Estimate:** 2 points
**Dependencies:** Task 9.1
**Labels:** `reporting`, `analytics`

**Description:**
Set up automated weekly summary report of key PLG metrics sent to team.

**Acceptance Criteria:**
- [ ] Report includes: activation rate, DAU/WAU, conversion rate, churn rate, top features
- [ ] Sent every Monday at 9am to Slack #plg-metrics
- [ ] Include week-over-week change indicators
- [ ] Link to PostHog dashboards for deep dive

**Implementation:**
1. In PostHog, create "Weekly PLG Summary" dashboard
2. Add key metric insights (numbers, not full charts)
3. Subscribe team to dashboard
4. Configure: Weekly, Monday 9am, Slack

**No code changes needed - PostHog configuration**

**Blocked by:** Task 9.1

---

## Phase 10: Documentation & Handoff

### Task 10.1: Document all tracked events
**Priority:** P1 (High)
**Estimate:** 2 points
**Dependencies:** All implementation tasks
**Labels:** `documentation`

**Description:**
Create comprehensive documentation of all PostHog events, properties, and when they fire.

**Acceptance Criteria:**
- [ ] Create `ANALYTICS_EVENTS.md` in repo documenting every event
- [ ] Include: event name, description, properties, when it fires, which component/file
- [ ] Create Notion page or wiki with same info for non-technical team
- [ ] Document dashboard URLs and what each shows

**Files to create:**
- `docs/ANALYTICS_EVENTS.md`
- `docs/POSTHOG_DASHBOARDS.md`

**Blocked by:** All implementation tasks

---

### Task 10.2: Create analytics implementation guide
**Priority:** P2 (Medium)
**Estimate:** 2 points
**Dependencies:** Task 10.1
**Labels:** `documentation`

**Description:**
Write guide for engineers on how to add new analytics events going forward.

**Acceptance Criteria:**
- [ ] Document: how to add new event types
- [ ] Document: how to add new properties
- [ ] Document: testing analytics locally
- [ ] Document: verifying events in PostHog
- [ ] Include code examples

**Files to create:**
- `docs/ANALYTICS_IMPLEMENTATION_GUIDE.md`

**Blocked by:** Task 10.1

---

### Task 10.3: Train team on PostHog dashboards
**Priority:** P1 (High)
**Estimate:** 1 point
**Dependencies:** Phase 8 (Tasks 8.1-8.5)
**Labels:** `training`

**Description:**
Conduct training session with team on how to use PostHog dashboards and interpret metrics.

**Acceptance Criteria:**
- [ ] Schedule 1-hour training session
- [ ] Walk through each dashboard
- [ ] Explain key metrics and why they matter
- [ ] Show how to create custom insights
- [ ] Record session for future reference

**Deliverable:**
- Training session scheduled and completed
- Recording uploaded to shared drive

**Blocked by:** Phase 8

---

## Summary Statistics

**Total Tasks:** 51
**Total Story Points:** 85

**By Phase:**
- Phase 1 (Foundation): 5 tasks, 12 points
- Phase 2 (Onboarding): 5 tasks, 7 points
- Phase 3 (Feature Adoption): 4 tasks, 5 points
- Phase 4 (Engagement): 5 tasks, 10 points
- Phase 5 (Monetization): 4 tasks, 6 points
- Phase 6 (Power Users): 4 tasks, 6 points
- Phase 7 (Retention): 3 tasks, 7 points
- Phase 8 (Dashboards): 5 tasks, 15 points
- Phase 9 (Alerts): 2 tasks, 4 points
- Phase 10 (Documentation): 3 tasks, 5 points

**By Priority:**
- P0 (Critical): 15 tasks - Must complete for basic PLG tracking
- P1 (High): 19 tasks - Important for comprehensive PLG analysis
- P2 (Medium): 8 tasks - Nice-to-have enhancements

**Estimated Timeline:**
- Sprint 1 (2 weeks): Phase 1 + Phase 2 (Foundation + Onboarding)
- Sprint 2 (2 weeks): Phase 3 + Phase 4 + Phase 5 (Feature tracking)
- Sprint 3 (2 weeks): Phase 6 + Phase 7 + Phase 8 (Power users + Dashboards)
- Sprint 4 (1 week): Phase 9 + Phase 10 (Alerts + Documentation)

**Total Duration:** ~7 weeks with 1-2 engineers

---

## Critical Path (Minimum Viable Analytics)

If you need to launch quickly, complete these tasks first:

1. **Week 1:**
   - Task 1.1: Enable PostHog SDK
   - Task 1.2: Create event types
   - Task 1.3: Create tracking helpers
   - Task 1.4: User identification
   - Task 2.1-2.3: Onboarding tracking (start, steps, complete)

2. **Week 2:**
   - Task 3.1: First query created
   - Task 4.1: Daily prompt feedback
   - Task 5.1: Entitlement limits
   - Task 5.3: Subscription changes
   - Task 8.1: Activation funnel dashboard

3. **Week 3:**
   - Task 8.4: Monetization dashboard
   - Task 9.1: Critical alerts
   - Task 10.1: Documentation

This gets you **activation tracking + monetization signals + critical alerts** in 3 weeks.
