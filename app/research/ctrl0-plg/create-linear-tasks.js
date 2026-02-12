#!/usr/bin/env node

/**
 * PostHog PLG Analytics - Linear Task Creator
 *
 * This script creates all 41 tasks in Linear with proper dependencies,
 * labels, priorities, and assignments.
 *
 * Prerequisites:
 * - Linear MCP server configured
 * - Linear API key set in environment
 * - Team ID and Project ID (if using projects)
 *
 * Usage:
 *   node create-linear-tasks.js
 */

const LINEAR_CONFIG = {
  teamKey: 'TEAM', // Replace with your Linear team key (e.g., 'ENG')
  assigneeId: 'ALBERT_USER_ID', // Replace with Albert's Linear user ID
  projectId: null, // Optional: set to project ID if you want to add to a specific project
};

// Task definitions with all metadata
const TASKS = [
  // Phase 1: Foundation (5 tasks)
  {
    id: 'task-1.1',
    title: '[Foundation] Enable PostHog SDK globally',
    priority: 0, // 0 = No priority, 1 = Urgent, 2 = High, 3 = Normal, 4 = Low
    estimate: 2,
    labels: ['infrastructure', 'analytics', 'p0'],
    description: `Remove the posthog_integration feature flag gate and initialize PostHog SDK globally in the application.

**Acceptance Criteria:**
- [ ] PostHog SDK initialized in apps/client/src/app/layout.tsx
- [ ] Environment variables configured: NEXT_PUBLIC_POSTHOG_KEY, NEXT_PUBLIC_POSTHOG_HOST
- [ ] Debug mode enabled for development environment
- [ ] PostHog loads on all pages without errors
- [ ] Verify PostHog session recording is capturing (check PostHog dashboard)

**Files to modify:**
- apps/client/src/app/layout.tsx
- .env.production

**Implementation:**
\`\`\`typescript
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
\`\`\``,
    blockedBy: [],
  },
  {
    id: 'task-1.2',
    title: '[Foundation] Create PostHog types and event constants',
    priority: 0,
    estimate: 3,
    labels: ['infrastructure', 'analytics', 'types'],
    description: `Create TypeScript types for all PostHog events and a centralized constants file to prevent typos and ensure type safety.

**Acceptance Criteria:**
- [ ] Create apps/client/src/lib/analytics/types.ts with event interfaces
- [ ] Create apps/client/src/lib/analytics/events.ts with event name constants
- [ ] Create apps/client/src/lib/analytics/properties.ts with shared property helpers
- [ ] All events have TypeScript interfaces with required properties
- [ ] Event names follow consistent naming convention: entity_action (snake_case)
- [ ] Export barrel file from apps/client/src/lib/analytics/index.ts

**Files to create:**
- apps/client/src/lib/analytics/types.ts
- apps/client/src/lib/analytics/events.ts
- apps/client/src/lib/analytics/properties.ts
- apps/client/src/lib/analytics/index.ts

**Implementation:**
\`\`\`typescript
// types.ts
export interface OnboardingStepCompletedEvent {
  step: 'welcome' | 'domain_analysis' | 'product_setup' | 'prompt_selection' | 'subscription_selection' | 'complete';
  timeSpent: number;
  organizationId: string;
  userId: string;
}

// events.ts
export const ANALYTICS_EVENTS = {
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_STEP_COMPLETED: 'onboarding_step_completed',
  // ... all other events
} as const;
\`\`\``,
    blockedBy: ['task-1.1'],
  },
  {
    id: 'task-1.3',
    title: '[Foundation] Create PostHog tracking helper functions',
    priority: 0,
    estimate: 3,
    labels: ['infrastructure', 'analytics', 'utilities'],
    description: `Create wrapper functions around PostHog SDK for consistent tracking with error handling, type safety, and organization/user context injection.

**Acceptance Criteria:**
- [ ] Create apps/client/src/lib/analytics/tracker.ts with helper functions
- [ ] trackEvent() function automatically injects organizationId, userId, timestamp
- [ ] identifyUser() function sets user properties on auth
- [ ] setOrganizationContext() function updates organization properties
- [ ] All functions have error handling with silent failures in production
- [ ] Functions log to console in development for debugging
- [ ] Type-safe: accepts event types from Task 1.2

**Files to create:**
- apps/client/src/lib/analytics/tracker.ts

**Implementation:**
\`\`\`typescript
import posthog from 'posthog-js';

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
\`\`\``,
    blockedBy: ['task-1.2'],
  },
  {
    id: 'task-1.4',
    title: '[Foundation] Add user identification on authentication',
    priority: 0,
    estimate: 2,
    labels: ['infrastructure', 'analytics', 'auth'],
    description: `Call identifyUser() whenever a user authenticates to associate all subsequent events with the user profile.

**Acceptance Criteria:**
- [ ] Call identifyUser() in auth callback after successful login
- [ ] Call setOrganizationContext() when organization context is available
- [ ] Fetch subscription data to include plan in user properties
- [ ] Verify in PostHog dashboard that user profiles are being created
- [ ] Verify organizationId is set as group property

**Files to modify:**
- Auth callback location (check Better Auth documentation)
- Possibly apps/client/src/middleware.ts if session refresh happens there`,
    blockedBy: ['task-1.3'],
  },
  {
    id: 'task-1.5',
    title: '[Foundation] Add automatic page view tracking',
    priority: 2,
    estimate: 2,
    labels: ['infrastructure', 'analytics', 'navigation'],
    description: `Track page views automatically using Next.js App Router navigation events with page metadata.

**Acceptance Criteria:**
- [ ] Page views tracked on route changes
- [ ] Properties include: pathname, referrer, organizationSlug, productSlug
- [ ] Extract orgSlug and productSlug from URL params
- [ ] Verify in PostHog dashboard that pageviews are captured
- [ ] No duplicate events on hydration/re-renders

**Files to modify:**
- apps/client/src/app/layout.tsx`,
    blockedBy: ['task-1.1'],
  },

  // Phase 2: Onboarding (5 tasks)
  {
    id: 'task-2.1',
    title: '[Onboarding] Track onboarding started event',
    priority: 0,
    estimate: 1,
    labels: ['onboarding', 'analytics', 'activation'],
    description: `Fire onboarding_started event when user enters the onboarding flow for the first time.

**Acceptance Criteria:**
- [ ] Event fired when onboarding store initializes with currentStep === 'welcome'
- [ ] Event includes: organizationId, userId, timestamp
- [ ] Event only fires once per user (check if already completed)
- [ ] Verify event appears in PostHog

**Files to modify:**
- apps/client/src/app/_components/first-time-onboarding/onboarding-store.ts`,
    blockedBy: ['task-1.3'],
  },
  {
    id: 'task-2.2',
    title: '[Onboarding] Track onboarding step completion',
    priority: 0,
    estimate: 2,
    labels: ['onboarding', 'analytics', 'activation'],
    description: `Track when each onboarding step is completed with time spent on that step.

**Acceptance Criteria:**
- [ ] Track onboarding_step_completed when completeStep() is called
- [ ] Calculate timeSpent by storing step start timestamp
- [ ] Event properties: step name, timeSpent, organizationId, userId
- [ ] All 7 steps tracked: welcome, loading-steps, invite-selection, product-setup, prompt-selection, subscription-selection, complete
- [ ] Verify funnel in PostHog dashboard

**Files to modify:**
- apps/client/src/app/_components/first-time-onboarding/onboarding-store.ts`,
    blockedBy: ['task-2.1'],
  },
  {
    id: 'task-2.3',
    title: '[Onboarding] Track onboarding completion',
    priority: 0,
    estimate: 1,
    labels: ['onboarding', 'analytics', 'activation'],
    description: `Fire onboarding_completed event when user reaches the final complete step.

**Acceptance Criteria:**
- [ ] Event fired when step === 'complete'
- [ ] Calculate total onboarding time (from start to completion)
- [ ] Properties: totalTimeSpent (seconds), stepsCompleted (count), organizationId, userId
- [ ] Update user property: onboardingCompletedAt: timestamp
- [ ] Verify event in PostHog

**Files to modify:**
- apps/client/src/app/_components/first-time-onboarding/steps/complete-step.tsx`,
    blockedBy: ['task-2.2'],
  },
  {
    id: 'task-2.4',
    title: '[Onboarding] Track onboarding abandonment',
    priority: 2,
    estimate: 2,
    labels: ['onboarding', 'analytics', 'activation'],
    description: `Track when users abandon onboarding (navigate away before completing).

**Acceptance Criteria:**
- [ ] Detect when user navigates away from onboarding flow
- [ ] Event properties: lastStep, timeSpentTotal, stepsCompleted, organizationId, userId
- [ ] Don't fire if onboarding already completed
- [ ] Use beforeunload or Next.js navigation events to detect abandonment

**Files to modify:**
- Create wrapper component or modify existing onboarding container`,
    blockedBy: ['task-2.2'],
  },
  {
    id: 'task-2.5',
    title: '[Onboarding] Track domain analysis success/failure',
    priority: 2,
    estimate: 1,
    labels: ['onboarding', 'analytics', 'activation'],
    description: `Track whether AI-powered domain analysis succeeds or fails during onboarding.

**Acceptance Criteria:**
- [ ] Event: domain_analysis_completed with success/failure status
- [ ] Properties: domain, detectedLanguage, hasLogo, hasDescription, hasDifferentiators, timeToAnalyze
- [ ] Fire on API response in loading-steps component
- [ ] Verify in PostHog

**Files to modify:**
- apps/client/src/app/_components/first-time-onboarding/steps/loading-steps.tsx`,
    blockedBy: ['task-2.2'],
  },

  // Phase 3: Feature Adoption (4 tasks)
  {
    id: 'task-3.1',
    title: '[Feature Adoption] Track first conversation query created',
    priority: 0,
    estimate: 2,
    labels: ['activation', 'analytics', 'feature-adoption'],
    description: `Track when a user creates their first conversation query (key activation milestone).

**Acceptance Criteria:**
- [ ] Event: conversation_query_created with isFirstQuery: true flag
- [ ] Properties: queryId, queryType, answerEngine, organizationId, userId, daysSinceSignup
- [ ] Fire from API endpoint after query creation
- [ ] Check if this is user's first query and set flag accordingly
- [ ] Verify in PostHog

**Files to modify:**
- apps/client/src/app/api/v1/conversation-queries/route.ts`,
    blockedBy: ['task-1.3'],
  },
  {
    id: 'task-3.2',
    title: '[Feature Adoption] Track custom view creation',
    priority: 2,
    estimate: 1,
    labels: ['feature-adoption', 'analytics', 'power-users'],
    description: `Track when users create custom views (indicates power user behavior).

**Acceptance Criteria:**
- [ ] Event: custom_view_created
- [ ] Properties: viewId, viewName, isDefault, organizationId, userId
- [ ] Check if this is first view → fire feature_first_used with feature: 'custom_view'
- [ ] Track from API endpoint after view creation

**Files to modify:**
- apps/client/src/app/api/v1/views/route.ts`,
    blockedBy: ['task-3.1'],
  },
  {
    id: 'task-3.3',
    title: '[Feature Adoption] Track tracked URL additions',
    priority: 2,
    estimate: 1,
    labels: ['feature-adoption', 'analytics'],
    description: `Track when users add URLs to track (content analytics feature).

**Acceptance Criteria:**
- [ ] Event: tracked_url_added
- [ ] Properties: urlId, url, totalTrackedUrls, organizationId, userId
- [ ] Track first usage with feature_first_used
- [ ] Fire from API endpoint

**Files to modify:**
- apps/client/src/app/api/v1/tracked-urls/route.ts`,
    blockedBy: ['task-3.1'],
  },
  {
    id: 'task-3.4',
    title: '[Feature Adoption] Track content gap analysis runs',
    priority: 3,
    estimate: 1,
    labels: ['feature-adoption', 'analytics'],
    description: `Track when users run content gap analysis (advanced feature).

**Acceptance Criteria:**
- [ ] Event: content_gap_analysis_started
- [ ] Event: content_gap_analysis_completed with results metadata
- [ ] Properties: analysisId, conversationQueryId, contentGapType, organizationId
- [ ] Track first usage
- [ ] Fire from worker that processes analysis

**Files to modify:**
- Content gap analysis API route or worker`,
    blockedBy: ['task-3.1'],
  },

  // Phase 4: Engagement (5 tasks)
  {
    id: 'task-4.1',
    title: '[Engagement] Track daily prompt feedback',
    priority: 0,
    estimate: 2,
    labels: ['engagement', 'analytics', 'retention'],
    description: `Track when users provide feedback on daily generated prompts.

**Acceptance Criteria:**
- [ ] Event: daily_prompt_viewed when prompt is shown
- [ ] Event: daily_prompt_feedback when user clicks helpful/not helpful/dismissed
- [ ] Properties: promptId, feedback, brandId, organizationId, userId
- [ ] Fire from client-side component
- [ ] Update database DailyPromptGeneration record with feedback

**Files to modify:**
- Daily prompt component (need to find exact location)
- API endpoint for feedback submission`,
    blockedBy: ['task-1.3'],
  },
  {
    id: 'task-4.2',
    title: '[Engagement] Track weekly report subscription changes',
    priority: 0,
    estimate: 1,
    labels: ['engagement', 'analytics', 'retention'],
    description: `Track when users enable/disable weekly report email subscriptions.

**Acceptance Criteria:**
- [ ] Event: weekly_report_subscription_enabled
- [ ] Event: weekly_report_subscription_disabled with optional reason
- [ ] Properties: brandId, dayOfWeek, timeOfDay, timezone, organizationId, userId
- [ ] Fire from API endpoint when subscription is created/updated

**Files to modify:**
- Weekly report subscription API endpoint`,
    blockedBy: ['task-1.3'],
  },
  {
    id: 'task-4.3',
    title: '[Engagement] Track weekly report email sent',
    priority: 2,
    estimate: 2,
    labels: ['engagement', 'analytics', 'email'],
    description: `Track when weekly report emails are sent from the worker.

**Acceptance Criteria:**
- [ ] Event: weekly_report_email_sent
- [ ] Properties: brandId, organizationId, userId, reportData (summary)
- [ ] Fire from apps/worker/src/workers/weekly-report.ts after email sent
- [ ] Include email ID from Resend for correlation
- [ ] Track send failures with separate event

**Files to modify:**
- apps/worker/src/workers/weekly-report.ts
- Export analytics functions from common package`,
    blockedBy: ['task-4.2'],
  },
  {
    id: 'task-4.4',
    title: '[Engagement] Track weekly report email engagement',
    priority: 3,
    estimate: 3,
    labels: ['engagement', 'analytics', 'email'],
    description: `Track email opens and link clicks from weekly reports using Resend webhooks.

**Acceptance Criteria:**
- [ ] Set up Resend webhook endpoint to receive email events
- [ ] Event: weekly_report_email_opened
- [ ] Event: weekly_report_email_clicked with link target
- [ ] Correlate events with original email using emailId
- [ ] Verify events flow to PostHog

**Files to create:**
- apps/client/src/app/api/webhooks/resend/route.ts

**Files to modify:**
- apps/worker/src/workers/weekly-report.ts - add tags to email`,
    blockedBy: ['task-4.3'],
  },
  {
    id: 'task-4.5',
    title: '[Engagement] Track opportunity interactions',
    priority: 2,
    estimate: 2,
    labels: ['engagement', 'analytics', 'value-realization'],
    description: `Track when opportunities are created by AI and when users accept/dismiss them.

**Acceptance Criteria:**
- [ ] Event: opportunity_identified when AI creates opportunity
- [ ] Event: opportunity_status_changed when user accepts/dismisses
- [ ] Properties: opportunityId, queryRunType, rationale (truncated), status, brandId
- [ ] Fire from API endpoint or worker that creates opportunities

**Files to modify:**
- Opportunity creation logic (worker or API)
- apps/client/src/app/api/v1/opportunities/[opportunityId]/route.ts`,
    blockedBy: ['task-1.3'],
  },

  // Phase 5: Monetization (4 tasks)
  {
    id: 'task-5.1',
    title: '[Monetization] Track entitlement limit warnings',
    priority: 0,
    estimate: 2,
    labels: ['monetization', 'analytics', 'conversion'],
    description: `Track when users approach or hit entitlement limits (critical conversion signal).

**Acceptance Criteria:**
- [ ] Event: entitlement_limit_warning when usage reaches 80% of limit
- [ ] Event: entitlement_limit_reached when usage hits 100%
- [ ] Event: entitlement_limit_exceeded when soft limit is exceeded
- [ ] Properties: entitlementType, currentUsage, limit, percentage, organizationId
- [ ] Fire from billing check API or wherever limits are enforced

**Files to modify:**
- apps/client/src/app/api/v1/billing/check/route.ts`,
    blockedBy: ['task-1.3'],
  },
  {
    id: 'task-5.2',
    title: '[Monetization] Track subscription plan views',
    priority: 2,
    estimate: 1,
    labels: ['monetization', 'analytics', 'conversion'],
    description: `Track when users view pricing/subscription page (conversion intent signal).

**Acceptance Criteria:**
- [ ] Event: subscription_plan_viewed
- [ ] Properties: currentPlan, viewedPlan (if clicked specific plan), source (where they came from), organizationId
- [ ] Fire from pricing page component
- [ ] Track which plan cards are clicked

**Files to modify:**
- Subscription/pricing page component
- Plan selection component from onboarding (step 6)`,
    blockedBy: ['task-5.1'],
  },
  {
    id: 'task-5.3',
    title: '[Monetization] Track subscription upgrades/downgrades',
    priority: 0,
    estimate: 2,
    labels: ['monetization', 'analytics', 'conversion'],
    description: `Track successful plan changes (upgrade, downgrade, or cancellation).

**Acceptance Criteria:**
- [ ] Event: subscription_upgraded when moving to higher tier
- [ ] Event: subscription_downgraded when moving to lower tier
- [ ] Event: subscription_canceled when subscription is canceled
- [ ] Properties: fromPlan, toPlan, daysSinceSignup, trigger (user vs admin), organizationId
- [ ] Fire from Stripe webhook handler
- [ ] Update user properties in PostHog with new plan

**Files to modify:**
- apps/client/src/app/api/auth/stripe/webhook/route.ts`,
    blockedBy: ['task-5.2'],
  },
  {
    id: 'task-5.4',
    title: '[Monetization] Track feature access blocks',
    priority: 2,
    estimate: 1,
    labels: ['monetization', 'analytics', 'conversion'],
    description: `Track when users try to access premium features they don't have access to.

**Acceptance Criteria:**
- [ ] Event: premium_feature_blocked
- [ ] Properties: feature name, required plan, current plan, organizationId, userId
- [ ] Fire when hard limit blocks action
- [ ] Fire when feature flag check returns false for premium features

**Files to modify:**
- Add to feature flag check functions
- Add to entitlement enforcement points`,
    blockedBy: ['task-5.1'],
  },

  // Phase 6: Power Users (4 tasks)
  {
    id: 'task-6.1',
    title: '[Power Users] Track integration connections',
    priority: 2,
    estimate: 2,
    labels: ['integrations', 'analytics', 'power-users'],
    description: `Track when users connect third-party integrations (PostHog, GA4, Linear).

**Acceptance Criteria:**
- [ ] Event: integration_connected for each integration
- [ ] Event: integration_disconnected
- [ ] Properties: integrationType, organizationId, userId, daysSinceSignup
- [ ] Track first integration as feature_first_used
- [ ] Fire from integration API endpoints

**Files to modify:**
- apps/client/src/app/api/v1/integrations/ga4/route.ts
- apps/client/src/app/api/v1/integrations/posthog/route.ts
- apps/client/src/app/api/v1/integrations/linear/route.ts`,
    blockedBy: ['task-1.3'],
  },
  {
    id: 'task-6.2',
    title: '[Power Users] Track team member invitations',
    priority: 2,
    estimate: 1,
    labels: ['expansion', 'analytics', 'team-growth'],
    description: `Track when users invite team members (expansion signal).

**Acceptance Criteria:**
- [ ] Event: team_member_invited
- [ ] Event: team_member_joined when invitation is accepted
- [ ] Properties: inviteeEmail, inviteeRole, currentTeamSize, organizationId, inviterId
- [ ] Fire from invitation API endpoint

**Files to modify:**
- Invitation API endpoints (create and accept)`,
    blockedBy: ['task-1.3'],
  },
  {
    id: 'task-6.3',
    title: '[Power Users] Track dashboard page views',
    priority: 3,
    estimate: 1,
    labels: ['engagement', 'analytics'],
    description: `Track which dashboard pages users visit most frequently.

**Acceptance Criteria:**
- [ ] Leverage automatic pageview tracking from Task 1.5
- [ ] Add custom properties to pageviews: dashboardType (overview, citations, metrics, content-analytics)
- [ ] Extract organizationSlug and productSlug from URL
- [ ] Track time on page

**Files to modify:**
- Dashboard page components (if additional metadata needed beyond automatic tracking)`,
    blockedBy: ['task-1.5'],
  },
  {
    id: 'task-6.4',
    title: '[Power Users] Track export actions',
    priority: 3,
    estimate: 1,
    labels: ['power-users', 'analytics'],
    description: `Track when users export data (CSV, PDF, etc.) - indicates high engagement.

**Acceptance Criteria:**
- [ ] Event: data_exported
- [ ] Properties: dataType (citations, reports, analytics), format (csv, pdf), recordCount, organizationId
- [ ] Fire from export API endpoints or client-side export buttons

**Files to modify:**
- Export components/API endpoints (need to identify locations)`,
    blockedBy: ['task-1.3'],
  },

  // Phase 7: Retention (3 tasks)
  {
    id: 'task-7.1',
    title: '[Retention] Track session start and inactivity',
    priority: 2,
    estimate: 2,
    labels: ['retention', 'analytics', 'churn'],
    description: `Track when users start sessions and calculate days since last activity.

**Acceptance Criteria:**
- [ ] Event: session_started with daysSinceLastSession
- [ ] Fire on authentication (already handled by Task 1.4)
- [ ] Calculate and store lastActivityAt in database
- [ ] Update PostHog user property: lastActivityAt

**Files to modify:**
- Auth callback or middleware`,
    blockedBy: ['task-1.4'],
  },
  {
    id: 'task-7.2',
    title: '[Retention] Create scheduled job for inactive users',
    priority: 3,
    estimate: 3,
    labels: ['retention', 'analytics', 'churn', 'infrastructure'],
    description: `Create a daily scheduled job that identifies and tracks inactive users (no activity in 7/14/30 days).

**Acceptance Criteria:**
- [ ] BullMQ or Temporal job runs daily
- [ ] Query users with lastActivityAt > 7/14/30 days ago
- [ ] Event: user_inactive_7_days, user_inactive_14_days, user_inactive_30_days
- [ ] Properties: organizationId, userId, daysSinceLastActivity, lastActivityType
- [ ] Add user segment in PostHog: "At risk of churn"

**Files to create:**
- apps/worker/src/workers/inactivity-tracker.ts

**Database migration needed:**
- Add lastActivityAt to User model
- Add InactivityEvent model to track which users we've already notified`,
    blockedBy: ['task-7.1'],
  },
  {
    id: 'task-7.3',
    title: '[Retention] Track feature flag exposures',
    priority: 3,
    estimate: 2,
    labels: ['experimentation', 'analytics'],
    description: `Track when users are exposed to feature flags (for A/B test analysis).

**Acceptance Criteria:**
- [ ] Event: feature_flag_exposed
- [ ] Properties: flagName, flagValue (enabled/disabled), organizationId, userId
- [ ] Fire from feature flag check functions
- [ ] Don't track same exposure multiple times in same session

**Files to modify:**
- apps/client/src/lib/feature-flags.ts`,
    blockedBy: ['task-1.3'],
  },

  // Phase 8: Dashboards (5 tasks) - No code, PostHog config only
  {
    id: 'task-8.1',
    title: '[Dashboards] Create Activation Funnel dashboard',
    priority: 0,
    estimate: 3,
    labels: ['dashboard', 'analytics', 'activation'],
    description: `Build PostHog Insights dashboard showing onboarding funnel conversion rates.

**Acceptance Criteria:**
- [ ] Funnel insight: onboarding_started → onboarding_step_completed (each step) → onboarding_completed
- [ ] Show conversion rate at each step
- [ ] Time to convert trend chart
- [ ] Drop-off analysis: where users abandon
- [ ] Cohort comparison: by signup date, by source
- [ ] Set goal: >60% complete onboarding within 7 days

**Note:** No code changes needed - PostHog configuration only`,
    blockedBy: ['task-2.3'],
  },
  {
    id: 'task-8.2',
    title: '[Dashboards] Create Feature Adoption dashboard',
    priority: 0,
    estimate: 3,
    labels: ['dashboard', 'analytics', 'adoption'],
    description: `Build dashboard showing feature adoption rates and time-to-first-use for key features.

**Acceptance Criteria:**
- [ ] Adoption curve: % of users who've used each feature by day 7/14/30/90
- [ ] Time to first use: distribution chart for each feature
- [ ] Feature matrix: which features correlate with retention? (cohort analysis)
- [ ] Top features by MAU
- [ ] Stickiness: DAU/MAU per feature

**Note:** No code changes needed - PostHog configuration only`,
    blockedBy: ['task-3.4'],
  },
  {
    id: 'task-8.3',
    title: '[Dashboards] Create Engagement dashboard',
    priority: 2,
    estimate: 3,
    labels: ['dashboard', 'analytics', 'engagement'],
    description: `Build dashboard showing daily/weekly active users and engagement depth metrics.

**Acceptance Criteria:**
- [ ] DAU/WAU/MAU trend chart
- [ ] Stickiness ratio: DAU/MAU over time
- [ ] Sessions per user (distribution)
- [ ] Email engagement: weekly report open/click rates
- [ ] Daily prompt feedback rate
- [ ] Power user segmentation: top 10% by activity

**Note:** No code changes needed - PostHog configuration only`,
    blockedBy: ['task-4.5'],
  },
  {
    id: 'task-8.4',
    title: '[Dashboards] Create Monetization dashboard',
    priority: 0,
    estimate: 3,
    labels: ['dashboard', 'analytics', 'monetization'],
    description: `Build dashboard showing conversion funnel from free to paid and upsell indicators.

**Acceptance Criteria:**
- [ ] Conversion funnel: signup → limit warning → plan viewed → upgraded
- [ ] Time to upgrade distribution
- [ ] Limit hit frequency by entitlement type
- [ ] Premium feature block rate (paywall hits)
- [ ] MRR trend (if integrated with Stripe data)
- [ ] Churn rate by plan

**Note:** No code changes needed - PostHog configuration only`,
    blockedBy: ['task-5.4'],
  },
  {
    id: 'task-8.5',
    title: '[Dashboards] Create Retention & Churn dashboard',
    priority: 2,
    estimate: 3,
    labels: ['dashboard', 'analytics', 'retention'],
    description: `Build dashboard showing cohort retention and early churn indicators.

**Acceptance Criteria:**
- [ ] Cohort retention table: Day 1/7/30/90 retention by signup week
- [ ] Churn curve: % of users churned by days since signup
- [ ] Inactive user count: 7/14/30 day buckets
- [ ] Resurrection rate: % of inactive users who return
- [ ] Retention by plan tier

**Note:** No code changes needed - PostHog configuration only`,
    blockedBy: ['task-7.3'],
  },

  // Phase 9: Alerts (2 tasks) - No code, PostHog config only
  {
    id: 'task-9.1',
    title: '[Alerts] Set up critical metric alerts',
    priority: 2,
    estimate: 2,
    labels: ['monitoring', 'analytics', 'alerts'],
    description: `Configure PostHog or Slack alerts for critical metric changes.

**Acceptance Criteria:**
- [ ] Alert: Onboarding completion rate drops below 50%
- [ ] Alert: DAU drops by >20% week-over-week
- [ ] Alert: Churn spike (>5 cancellations in one day)
- [ ] Alert: Payment failures (if integrated with Stripe)
- [ ] Alerts sent to Slack channel: #plg-metrics

**Note:** No code changes needed - PostHog configuration only`,
    blockedBy: ['task-8.5'],
  },
  {
    id: 'task-9.2',
    title: '[Alerts] Create weekly PLG metrics report',
    priority: 3,
    estimate: 2,
    labels: ['reporting', 'analytics'],
    description: `Set up automated weekly summary report of key PLG metrics sent to team.

**Acceptance Criteria:**
- [ ] Report includes: activation rate, DAU/WAU, conversion rate, churn rate, top features
- [ ] Sent every Monday at 9am to Slack #plg-metrics
- [ ] Include week-over-week change indicators
- [ ] Link to PostHog dashboards for deep dive

**Note:** No code changes needed - PostHog configuration only`,
    blockedBy: ['task-9.1'],
  },

  // Phase 10: Documentation (3 tasks)
  {
    id: 'task-10.1',
    title: '[Documentation] Document all tracked events',
    priority: 2,
    estimate: 2,
    labels: ['documentation'],
    description: `Create comprehensive documentation of all PostHog events, properties, and when they fire.

**Acceptance Criteria:**
- [ ] Create ANALYTICS_EVENTS.md in repo documenting every event
- [ ] Include: event name, description, properties, when it fires, which component/file
- [ ] Create Notion page or wiki with same info for non-technical team
- [ ] Document dashboard URLs and what each shows

**Files to create:**
- docs/ANALYTICS_EVENTS.md
- docs/POSTHOG_DASHBOARDS.md`,
    blockedBy: ['task-9.2'],
  },
  {
    id: 'task-10.2',
    title: '[Documentation] Create analytics implementation guide',
    priority: 3,
    estimate: 2,
    labels: ['documentation'],
    description: `Write guide for engineers on how to add new analytics events going forward.

**Acceptance Criteria:**
- [ ] Document: how to add new event types
- [ ] Document: how to add new properties
- [ ] Document: testing analytics locally
- [ ] Document: verifying events in PostHog
- [ ] Include code examples

**Files to create:**
- docs/ANALYTICS_IMPLEMENTATION_GUIDE.md`,
    blockedBy: ['task-10.1'],
  },
  {
    id: 'task-10.3',
    title: '[Documentation] Train team on PostHog dashboards',
    priority: 2,
    estimate: 1,
    labels: ['training'],
    description: `Conduct training session with team on how to use PostHog dashboards and interpret metrics.

**Acceptance Criteria:**
- [ ] Schedule 1-hour training session
- [ ] Walk through each dashboard
- [ ] Explain key metrics and why they matter
- [ ] Show how to create custom insights
- [ ] Record session for future reference

**Deliverable:**
- Training session scheduled and completed
- Recording uploaded to shared drive`,
    blockedBy: ['task-8.5'],
  },
];

// Helper function to map priority number to Linear priority value
function mapPriority(priority) {
  const priorityMap = {
    0: 1, // P0 → Urgent
    2: 2, // P1 → High
    3: 3, // P2 → Normal
  };
  return priorityMap[priority] || 3;
}

// Main execution function
async function createLinearTasks() {
  console.log('🚀 PostHog PLG Analytics - Linear Task Creator\n');
  console.log(`Total tasks to create: ${TASKS.length}`);
  console.log(`Assignee: ${LINEAR_CONFIG.assigneeId}`);
  console.log(`Team: ${LINEAR_CONFIG.teamKey}\n`);

  // This will be implemented once Linear MCP is configured
  // For now, this script documents the structure

  console.log('📋 Task Summary:\n');

  const phases = [
    { name: 'Phase 1: Foundation', range: [0, 5] },
    { name: 'Phase 2: Onboarding', range: [5, 10] },
    { name: 'Phase 3: Feature Adoption', range: [10, 14] },
    { name: 'Phase 4: Engagement', range: [14, 19] },
    { name: 'Phase 5: Monetization', range: [19, 23] },
    { name: 'Phase 6: Power Users', range: [23, 27] },
    { name: 'Phase 7: Retention', range: [27, 30] },
    { name: 'Phase 8: Dashboards', range: [30, 35] },
    { name: 'Phase 9: Alerts', range: [35, 37] },
    { name: 'Phase 10: Documentation', range: [37, 40] },
  ];

  phases.forEach(phase => {
    const phaseTasks = TASKS.slice(phase.range[0], phase.range[1]);
    const totalPoints = phaseTasks.reduce((sum, t) => sum + t.estimate, 0);
    console.log(`${phase.name}: ${phaseTasks.length} tasks, ${totalPoints} points`);
  });

  console.log('\n✅ Script ready. Configure Linear MCP to execute.\n');
  console.log('Next steps:');
  console.log('1. Set up Linear MCP server');
  console.log('2. Update LINEAR_CONFIG with your team key and user IDs');
  console.log('3. Run this script to create all tasks');

  return TASKS;
}

// Export for use as module or run directly
if (require.main === module) {
  createLinearTasks();
}

module.exports = { TASKS, createLinearTasks, LINEAR_CONFIG };
