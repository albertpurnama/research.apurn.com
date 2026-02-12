# PostHog PLG Analytics - Linear Tasks (Ready to Copy)

**Instructions:** Copy each task below directly into Linear. Each task is formatted for easy copy-paste.

---

## Hybrid Tracking Approach

> **Strategy:** Autocapture + data-attr for UI events, custom tracking only for server-side.

| Event Type | Method |
|------------|--------|
| Button clicks, forms | `data-ph-capture-attribute-*` |
| Pageviews | Autocapture (automatic) |
| API/Worker/Webhook events | Custom `trackServerEvent()` |

---

## Phase 1: Foundation (4 tasks, 10 points)

> **Note:** Task 1.1 completed via `instrumentation-client.ts`. Linear issue THE-467 canceled.

---

### Task 1.2 - Create PostHog types and event constants

**Title:** `[Foundation] Create PostHog types and event constants`

**Priority:** P0 (Critical)
**Estimate:** 3 points
**Labels:** `infrastructure`, `analytics`, `types`
**Assignee:** Albert
**Blocked by:** Task 1.1

**Description:**

Create TypeScript types for all PostHog events and a centralized constants file to prevent typos and ensure type safety.

**✅ Acceptance Criteria:**
- [ ] Create `apps/client/src/lib/analytics/types.ts` with event interfaces
- [ ] Create `apps/client/src/lib/analytics/events.ts` with event name constants
- [ ] Create `apps/client/src/lib/analytics/properties.ts` with shared property helpers
- [ ] All events have TypeScript interfaces with required properties
- [ ] Event names follow convention: `entity_action` (snake_case)
- [ ] Export barrel file from `apps/client/src/lib/analytics/index.ts`

**📁 Files to create:**
- `apps/client/src/lib/analytics/types.ts`
- `apps/client/src/lib/analytics/events.ts`
- `apps/client/src/lib/analytics/properties.ts`
- `apps/client/src/lib/analytics/index.ts`

---

### Task 1.3 - Create PostHog tracking helper functions

**Title:** `[Foundation] Create PostHog tracking helper functions`

**Priority:** P0 (Critical)
**Estimate:** 3 points
**Labels:** `infrastructure`, `analytics`, `utilities`
**Assignee:** Albert
**Blocked by:** Task 1.2

**Description:**

Create wrapper functions around PostHog SDK for consistent tracking with error handling, type safety, and automatic context injection. Create both direct import version (for API routes) and React hook version (for components).

> **Reference:** [PostHog React hooks](https://posthog.com/docs/libraries/react)

**✅ Acceptance Criteria:**
- [ ] Create `apps/client/src/lib/analytics/tracker.ts` (for API routes/server code)
- [ ] Create `apps/client/src/lib/analytics/useAnalytics.ts` (React hook for components)
- [ ] `trackEvent()` auto-injects organizationId, userId, timestamp
- [ ] `identifyUser()` sets user properties on auth
- [ ] `setOrganizationContext()` updates organization properties
- [ ] All functions have error handling with silent failures in production
- [ ] Functions log to console in development for debugging
- [ ] Type-safe: accepts event types from Task 1.2
- [ ] React hook uses `usePostHog()` from `posthog-js/react`

**📁 Files to create:**
- `apps/client/src/lib/analytics/tracker.ts`
- `apps/client/src/lib/analytics/useAnalytics.ts`

---

### Task 1.4 - Add user identification on authentication

**Title:** `[Foundation] Add user identification on authentication`

**Priority:** P0 (Critical)
**Estimate:** 2 points
**Labels:** `infrastructure`, `analytics`, `auth`
**Assignee:** Albert
**Blocked by:** Task 1.3

**Description:**

Call `identifyUser()` whenever a user authenticates to associate all subsequent events with the user profile.

**✅ Acceptance Criteria:**
- [ ] Call `identifyUser()` in auth callback after successful login
- [ ] Call `setOrganizationContext()` when organization context available
- [ ] Fetch subscription data to include plan in user properties
- [ ] Verify in PostHog dashboard that user profiles are being created
- [ ] Verify organizationId is set as group property

**📁 Files to modify:**
- Auth callback location (check Better Auth docs)
- Possibly `apps/client/src/middleware.ts`

---

### Task 1.5 - Add automatic page view tracking

**Title:** `[Foundation] Add automatic page view tracking`

**Priority:** P1 (High)
**Estimate:** 2 points
**Labels:** `infrastructure`, `analytics`, `navigation`
**Assignee:** Albert
**Blocked by:** Task 1.1

**Description:**

Track page views automatically using Next.js App Router navigation events with page metadata. Use idiomatic patterns: `usePostHog()` hook and dynamic import with `ssr: false`.

> **Reference:** [PostHog Next.js App Router docs](https://posthog.com/docs/libraries/next-js)

**✅ Acceptance Criteria:**
- [ ] Create dedicated `PostHogPageView` component
- [ ] Use `usePostHog()` hook instead of direct import
- [ ] Use `dynamic()` import with `ssr: false` to prevent hydration issues
- [ ] Page views tracked on route changes
- [ ] Properties include: pathname, referrer, organizationSlug, productSlug
- [ ] Extract orgSlug and productSlug from URL params
- [ ] Verify in PostHog dashboard that pageviews are captured
- [ ] No duplicate events on hydration/re-renders

**📁 Files to create:**
- `apps/client/src/app/PostHogPageView.tsx`

**📁 Files to modify:**
- `apps/client/src/app/layout.tsx`

---

## Phase 2: Onboarding Funnel (5 tasks, 7 points)

### Task 2.1 - Track onboarding started event

**Title:** `[Onboarding] Track onboarding started event`

**Priority:** P0 (Critical)
**Estimate:** 1 point
**Labels:** `onboarding`, `analytics`, `activation`
**Assignee:** Albert
**Blocked by:** Task 1.3

**Description:**

Fire `onboarding_started` event when user enters the onboarding flow for the first time.

**✅ Acceptance Criteria:**
- [ ] Event fired when onboarding store initializes with `currentStep === 'welcome'`
- [ ] Event includes: organizationId, userId, timestamp
- [ ] Event only fires once per user (check if already completed)
- [ ] Verify event appears in PostHog

**📁 Files to modify:**
- `apps/client/src/app/_components/first-time-onboarding/onboarding-store.ts`

---

### Task 2.2 - Track onboarding step completion

**Title:** `[Onboarding] Track onboarding step completion`

**Priority:** P0 (Critical)
**Estimate:** 2 points
**Labels:** `onboarding`, `analytics`, `activation`
**Assignee:** Albert
**Blocked by:** Task 2.1

**Description:**

Track when each onboarding step is completed with time spent on that step.

**✅ Acceptance Criteria:**
- [ ] Track `onboarding_step_completed` when `completeStep()` is called
- [ ] Calculate `timeSpent` by storing step start timestamp
- [ ] Event properties: step name, timeSpent, organizationId, userId
- [ ] All 7 steps tracked: welcome, loading-steps, invite-selection, product-setup, prompt-selection, subscription-selection, complete
- [ ] Verify funnel in PostHog dashboard

**📁 Files to modify:**
- `apps/client/src/app/_components/first-time-onboarding/onboarding-store.ts`

---

### Task 2.3 - Track onboarding completion

**Title:** `[Onboarding] Track onboarding completion`

**Priority:** P0 (Critical)
**Estimate:** 1 point
**Labels:** `onboarding`, `analytics`, `activation`
**Assignee:** Albert
**Blocked by:** Task 2.2

**Description:**

Fire `onboarding_completed` event when user reaches the final complete step.

**✅ Acceptance Criteria:**
- [ ] Event fired when `step === 'complete'`
- [ ] Calculate total onboarding time (from start to completion)
- [ ] Properties: totalTimeSpent (seconds), stepsCompleted (count), organizationId, userId
- [ ] Update user property: `onboardingCompletedAt: timestamp`
- [ ] Verify event in PostHog

**📁 Files to modify:**
- `apps/client/src/app/_components/first-time-onboarding/steps/complete-step.tsx`

---

### Task 2.4 - Track onboarding abandonment

**Title:** `[Onboarding] Track onboarding abandonment`

**Priority:** P1 (High)
**Estimate:** 2 points
**Labels:** `onboarding`, `analytics`, `activation`
**Assignee:** Albert
**Blocked by:** Task 2.2

**Description:**

Track when users abandon onboarding (navigate away before completing).

**✅ Acceptance Criteria:**
- [ ] Detect when user navigates away from onboarding flow
- [ ] Event properties: lastStep, timeSpentTotal, stepsCompleted, organizationId, userId
- [ ] Don't fire if onboarding already completed
- [ ] Use `beforeunload` or Next.js navigation events

**📁 Files to modify:**
- Create wrapper component or modify existing onboarding container

---

### Task 2.5 - Track domain analysis success/failure

**Title:** `[Onboarding] Track domain analysis success/failure`

**Priority:** P1 (High)
**Estimate:** 1 point
**Labels:** `onboarding`, `analytics`, `activation`
**Assignee:** Albert
**Blocked by:** Task 2.2

**Description:**

Track whether AI-powered domain analysis succeeds or fails during onboarding.

**✅ Acceptance Criteria:**
- [ ] Event: `domain_analysis_completed` with success/failure status
- [ ] Properties: domain, detectedLanguage, hasLogo, hasDescription, hasDifferentiators, timeToAnalyze
- [ ] Fire on API response in loading-steps component
- [ ] Verify in PostHog

**📁 Files to modify:**
- `apps/client/src/app/_components/first-time-onboarding/steps/loading-steps.tsx`

---

## Phase 3: Feature Adoption (4 tasks, 5 points)

### Task 3.1 - Track first conversation query created

**Title:** `[Feature Adoption] Track first conversation query created`

**Priority:** P0 (Critical)
**Estimate:** 2 points
**Labels:** `activation`, `analytics`, `feature-adoption`
**Assignee:** Albert
**Blocked by:** Task 1.3

**Description:**

Track when a user creates their first conversation query (key activation milestone).

**✅ Acceptance Criteria:**
- [ ] Event: `conversation_query_created` with `isFirstQuery: true` flag
- [ ] Properties: queryId, queryType, answerEngine, organizationId, userId, daysSinceSignup
- [ ] Fire from API endpoint after query creation
- [ ] Check if this is user's first query and set flag accordingly
- [ ] Verify in PostHog

**📁 Files to modify:**
- `apps/client/src/app/api/v1/conversation-queries/route.ts`

---

### Task 3.2 - Track custom view creation

**Title:** `[Feature Adoption] Track custom view creation`

**Priority:** P1 (High)
**Estimate:** 1 point
**Labels:** `feature-adoption`, `analytics`, `power-users`
**Assignee:** Albert
**Blocked by:** Task 3.1

**Description:**

Track when users create custom views (indicates power user behavior).

**✅ Acceptance Criteria:**
- [ ] Event: `custom_view_created`
- [ ] Properties: viewId, viewName, isDefault, organizationId, userId
- [ ] Check if first view → fire `feature_first_used` with `feature: 'custom_view'`
- [ ] Track from API endpoint after view creation

**📁 Files to modify:**
- `apps/client/src/app/api/v1/views/route.ts`

---

### Task 3.3 - Track tracked URL additions

**Title:** `[Feature Adoption] Track tracked URL additions`

**Priority:** P1 (High)
**Estimate:** 1 point
**Labels:** `feature-adoption`, `analytics`
**Assignee:** Albert
**Blocked by:** Task 3.1

**Description:**

Track when users add URLs to track (content analytics feature).

**✅ Acceptance Criteria:**
- [ ] Event: `tracked_url_added`
- [ ] Properties: urlId, url, totalTrackedUrls, organizationId, userId
- [ ] Track first usage with `feature_first_used`
- [ ] Fire from API endpoint

**📁 Files to modify:**
- `apps/client/src/app/api/v1/tracked-urls/route.ts`

---

### Task 3.4 - Track content gap analysis runs

**Title:** `[Feature Adoption] Track content gap analysis runs`

**Priority:** P2 (Medium)
**Estimate:** 1 point
**Labels:** `feature-adoption`, `analytics`
**Assignee:** Albert
**Blocked by:** Task 3.1

**Description:**

Track when users run content gap analysis (advanced feature).

**✅ Acceptance Criteria:**
- [ ] Event: `content_gap_analysis_started`
- [ ] Event: `content_gap_analysis_completed` with results metadata
- [ ] Properties: analysisId, conversationQueryId, contentGapType, organizationId
- [ ] Track first usage
- [ ] Fire from worker that processes analysis

**📁 Files to modify:**
- Content gap analysis API route or worker

---

## Phase 4: Engagement Loops (5 tasks, 10 points)

### Task 4.1 - Track daily prompt feedback

**Title:** `[Engagement] Track daily prompt feedback`

**Priority:** P0 (Critical)
**Estimate:** 2 points
**Labels:** `engagement`, `analytics`, `retention`
**Assignee:** Albert
**Blocked by:** Task 1.3

**Description:**

Track when users provide feedback on daily generated prompts.

**✅ Acceptance Criteria:**
- [ ] Event: `daily_prompt_viewed` when prompt is shown
- [ ] Event: `daily_prompt_feedback` when user clicks helpful/not helpful/dismissed
- [ ] Properties: promptId, feedback, brandId, organizationId, userId
- [ ] Fire from client-side component
- [ ] Update database `DailyPromptGeneration` record with feedback

**📁 Files to modify:**
- Daily prompt component
- API endpoint for feedback submission

---

### Task 4.2 - Track weekly report subscription changes

**Title:** `[Engagement] Track weekly report subscription changes`

**Priority:** P0 (Critical)
**Estimate:** 1 point
**Labels:** `engagement`, `analytics`, `retention`
**Assignee:** Albert
**Blocked by:** Task 1.3

**Description:**

Track when users enable/disable weekly report email subscriptions.

**✅ Acceptance Criteria:**
- [ ] Event: `weekly_report_subscription_enabled`
- [ ] Event: `weekly_report_subscription_disabled` with optional reason
- [ ] Properties: brandId, dayOfWeek, timeOfDay, timezone, organizationId, userId
- [ ] Fire from API endpoint when subscription is created/updated

**📁 Files to modify:**
- Weekly report subscription API endpoint

---

### Task 4.3 - Track weekly report email sent

**Title:** `[Engagement] Track weekly report email sent`

**Priority:** P1 (High)
**Estimate:** 2 points
**Labels:** `engagement`, `analytics`, `email`
**Assignee:** Albert
**Blocked by:** Task 4.2

**Description:**

Track when weekly report emails are sent from the worker.

**✅ Acceptance Criteria:**
- [ ] Event: `weekly_report_email_sent`
- [ ] Properties: brandId, organizationId, userId, reportData (summary)
- [ ] Fire from `apps/worker/src/workers/weekly-report.ts` after email sent
- [ ] Include email ID from Resend for correlation
- [ ] Track send failures with separate event

**📁 Files to modify:**
- `apps/worker/src/workers/weekly-report.ts`
- Export analytics functions from common package

---

### Task 4.4 - Track weekly report email engagement

**Title:** `[Engagement] Track weekly report email engagement`

**Priority:** P2 (Medium)
**Estimate:** 3 points
**Labels:** `engagement`, `analytics`, `email`
**Assignee:** Albert
**Blocked by:** Task 4.3

**Description:**

Track email opens and link clicks from weekly reports using Resend webhooks.

**✅ Acceptance Criteria:**
- [ ] Set up Resend webhook endpoint to receive email events
- [ ] Event: `weekly_report_email_opened`
- [ ] Event: `weekly_report_email_clicked` with link target
- [ ] Correlate events with original email using emailId
- [ ] Verify events flow to PostHog

**📁 Files to create:**
- `apps/client/src/app/api/webhooks/resend/route.ts`

**📁 Files to modify:**
- `apps/worker/src/workers/weekly-report.ts` - add tags to email

---

### Task 4.5 - Track opportunity interactions

**Title:** `[Engagement] Track opportunity interactions`

**Priority:** P1 (High)
**Estimate:** 2 points
**Labels:** `engagement`, `analytics`, `value-realization`
**Assignee:** Albert
**Blocked by:** Task 1.3

**Description:**

Track when opportunities are created by AI and when users accept/dismiss them.

**✅ Acceptance Criteria:**
- [ ] Event: `opportunity_identified` when AI creates opportunity
- [ ] Event: `opportunity_status_changed` when user accepts/dismisses
- [ ] Properties: opportunityId, queryRunType, rationale (truncated), status, brandId
- [ ] Fire from API endpoint or worker that creates opportunities

**📁 Files to modify:**
- Opportunity creation logic (worker or API)
- `apps/client/src/app/api/v1/opportunities/[opportunityId]/route.ts`

---

## Phase 5: Monetization (4 tasks, 6 points)

### Task 5.1 - Track entitlement limit warnings

**Title:** `[Monetization] Track entitlement limit warnings`

**Priority:** P0 (Critical)
**Estimate:** 2 points
**Labels:** `monetization`, `analytics`, `conversion`
**Assignee:** Albert
**Blocked by:** Task 1.3

**Description:**

Track when users approach or hit entitlement limits (critical conversion signal).

**✅ Acceptance Criteria:**
- [ ] Event: `entitlement_limit_warning` when usage reaches 80% of limit
- [ ] Event: `entitlement_limit_reached` when usage hits 100%
- [ ] Event: `entitlement_limit_exceeded` when soft limit is exceeded
- [ ] Properties: entitlementType, currentUsage, limit, percentage, organizationId
- [ ] Fire from billing check API or wherever limits are enforced

**📁 Files to modify:**
- `apps/client/src/app/api/v1/billing/check/route.ts`

---

### Task 5.2 - Track subscription plan views

**Title:** `[Monetization] Track subscription plan views`

**Priority:** P1 (High)
**Estimate:** 1 point
**Labels:** `monetization`, `analytics`, `conversion`
**Assignee:** Albert
**Blocked by:** Task 5.1

**Description:**

Track when users view pricing/subscription page (conversion intent signal).

**✅ Acceptance Criteria:**
- [ ] Event: `subscription_plan_viewed`
- [ ] Properties: currentPlan, viewedPlan (if clicked specific plan), source, organizationId
- [ ] Fire from pricing page component
- [ ] Track which plan cards are clicked

**📁 Files to modify:**
- Subscription/pricing page component
- Plan selection component from onboarding (step 6)

---

### Task 5.3 - Track subscription upgrades/downgrades

**Title:** `[Monetization] Track subscription upgrades/downgrades`

**Priority:** P0 (Critical)
**Estimate:** 2 points
**Labels:** `monetization`, `analytics`, `conversion`
**Assignee:** Albert
**Blocked by:** Task 5.2

**Description:**

Track successful plan changes (upgrade, downgrade, or cancellation).

**✅ Acceptance Criteria:**
- [ ] Event: `subscription_upgraded` when moving to higher tier
- [ ] Event: `subscription_downgraded` when moving to lower tier
- [ ] Event: `subscription_canceled` when subscription is canceled
- [ ] Properties: fromPlan, toPlan, daysSinceSignup, trigger, organizationId
- [ ] Fire from Stripe webhook handler
- [ ] Update user properties in PostHog with new plan

**📁 Files to modify:**
- `apps/client/src/app/api/auth/stripe/webhook/route.ts`

---

### Task 5.4 - Track feature access blocks

**Title:** `[Monetization] Track feature access blocks`

**Priority:** P1 (High)
**Estimate:** 1 point
**Labels:** `monetization`, `analytics`, `conversion`
**Assignee:** Albert
**Blocked by:** Task 5.1

**Description:**

Track when users try to access premium features they don't have access to.

**✅ Acceptance Criteria:**
- [ ] Event: `premium_feature_blocked`
- [ ] Properties: feature name, required plan, current plan, organizationId, userId
- [ ] Fire when hard limit blocks action
- [ ] Fire when feature flag check returns false for premium features

**📁 Files to modify:**
- Add to feature flag check functions
- Add to entitlement enforcement points

---

## Phase 6: Power Users (4 tasks, 6 points)

### Task 6.1 - Track integration connections

**Title:** `[Power Users] Track integration connections`

**Priority:** P1 (High)
**Estimate:** 2 points
**Labels:** `integrations`, `analytics`, `power-users`
**Assignee:** Albert
**Blocked by:** Task 1.3

**Description:**

Track when users connect third-party integrations (PostHog, GA4, Linear).

**✅ Acceptance Criteria:**
- [ ] Event: `integration_connected` for each integration
- [ ] Event: `integration_disconnected`
- [ ] Properties: integrationType, organizationId, userId, daysSinceSignup
- [ ] Track first integration as `feature_first_used`
- [ ] Fire from integration API endpoints

**📁 Files to modify:**
- `apps/client/src/app/api/v1/integrations/ga4/route.ts`
- `apps/client/src/app/api/v1/integrations/posthog/route.ts`
- `apps/client/src/app/api/v1/integrations/linear/route.ts`

---

### Task 6.2 - Track team member invitations

**Title:** `[Power Users] Track team member invitations`

**Priority:** P1 (High)
**Estimate:** 1 point
**Labels:** `expansion`, `analytics`, `team-growth`
**Assignee:** Albert
**Blocked by:** Task 1.3

**Description:**

Track when users invite team members (expansion signal).

**✅ Acceptance Criteria:**
- [ ] Event: `team_member_invited`
- [ ] Event: `team_member_joined` when invitation is accepted
- [ ] Properties: inviteeEmail, inviteeRole, currentTeamSize, organizationId, inviterId
- [ ] Fire from invitation API endpoint

**📁 Files to modify:**
- Invitation API endpoints (create and accept)

---

### Task 6.3 - Track dashboard page views

**Title:** `[Power Users] Track dashboard page views`

**Priority:** P2 (Medium)
**Estimate:** 1 point
**Labels:** `engagement`, `analytics`
**Assignee:** Albert
**Blocked by:** Task 1.5

**Description:**

Track which dashboard pages users visit most frequently.

**✅ Acceptance Criteria:**
- [ ] Leverage automatic pageview tracking
- [ ] Add custom properties: dashboardType (overview, citations, metrics, content-analytics)
- [ ] Extract organizationSlug and productSlug from URL
- [ ] Track time on page

**📁 Files to modify:**
- Dashboard page components (if additional metadata needed)

---

### Task 6.4 - Track export actions

**Title:** `[Power Users] Track export actions`

**Priority:** P2 (Medium)
**Estimate:** 1 point
**Labels:** `power-users`, `analytics`
**Assignee:** Albert
**Blocked by:** Task 1.3

**Description:**

Track when users export data (CSV, PDF, etc.) - indicates high engagement.

**✅ Acceptance Criteria:**
- [ ] Event: `data_exported`
- [ ] Properties: dataType (citations, reports, analytics), format (csv, pdf), recordCount, organizationId
- [ ] Fire from export API endpoints or client-side export buttons

**📁 Files to modify:**
- Export components/API endpoints

---

## Phase 7: Retention (3 tasks, 7 points)

### Task 7.1 - Track session start and inactivity

**Title:** `[Retention] Track session start and inactivity`

**Priority:** P1 (High)
**Estimate:** 2 points
**Labels:** `retention`, `analytics`, `churn`
**Assignee:** Albert
**Blocked by:** Task 1.4

**Description:**

Track when users start sessions and calculate days since last activity.

**✅ Acceptance Criteria:**
- [ ] Event: `session_started` with daysSinceLastSession
- [ ] Fire on authentication
- [ ] Calculate and store lastActivityAt in database
- [ ] Update PostHog user property: `lastActivityAt`

**📁 Files to modify:**
- Auth callback or middleware

---

### Task 7.2 - Create scheduled job for inactive users

**Title:** `[Retention] Create scheduled job for inactive users`

**Priority:** P2 (Medium)
**Estimate:** 3 points
**Labels:** `retention`, `analytics`, `churn`, `infrastructure`
**Assignee:** Albert
**Blocked by:** Task 7.1

**Description:**

Create a daily scheduled job that identifies and tracks inactive users (no activity in 7/14/30 days).

**✅ Acceptance Criteria:**
- [ ] BullMQ or Temporal job runs daily
- [ ] Query users with lastActivityAt > 7/14/30 days ago
- [ ] Event: `user_inactive_7_days`, `user_inactive_14_days`, `user_inactive_30_days`
- [ ] Properties: organizationId, userId, daysSinceLastActivity, lastActivityType
- [ ] Add user segment in PostHog: "At risk of churn"

**📁 Files to create:**
- `apps/worker/src/workers/inactivity-tracker.ts`

**📊 Database migration needed:**
- Add `lastActivityAt` to User model
- Add `InactivityEvent` model

---

### Task 7.3 - Track feature flag exposures

**Title:** `[Retention] Track feature flag exposures`

**Priority:** P2 (Medium)
**Estimate:** 2 points
**Labels:** `experimentation`, `analytics`
**Assignee:** Albert
**Blocked by:** Task 1.3

**Description:**

Track when users are exposed to feature flags (for A/B test analysis).

**✅ Acceptance Criteria:**
- [ ] Event: `feature_flag_exposed`
- [ ] Properties: flagName, flagValue (enabled/disabled), organizationId, userId
- [ ] Fire from feature flag check functions
- [ ] Don't track same exposure multiple times in same session

**📁 Files to modify:**
- `apps/client/src/lib/feature-flags.ts`

---

## Phase 8: Dashboards (5 tasks, 15 points)

### Task 8.1 - Create Activation Funnel dashboard

**Title:** `[Dashboards] Create Activation Funnel dashboard`

**Priority:** P0 (Critical)
**Estimate:** 3 points
**Labels:** `dashboard`, `analytics`, `activation`
**Assignee:** Albert
**Blocked by:** Task 2.3

**Description:**

Build PostHog Insights dashboard showing onboarding funnel conversion rates.

**✅ Acceptance Criteria:**
- [ ] Funnel insight: `onboarding_started` → each step → `onboarding_completed`
- [ ] Show conversion rate at each step
- [ ] Time to convert trend chart
- [ ] Drop-off analysis: where users abandon
- [ ] Cohort comparison: by signup date, by source
- [ ] Set goal: >60% complete onboarding within 7 days

**Note:** No code changes - PostHog configuration only

---

### Task 8.2 - Create Feature Adoption dashboard

**Title:** `[Dashboards] Create Feature Adoption dashboard`

**Priority:** P0 (Critical)
**Estimate:** 3 points
**Labels:** `dashboard`, `analytics`, `adoption`
**Assignee:** Albert
**Blocked by:** Task 3.4

**Description:**

Build dashboard showing feature adoption rates and time-to-first-use.

**✅ Acceptance Criteria:**
- [ ] Adoption curve: % of users who've used each feature by day 7/14/30/90
- [ ] Time to first use: distribution chart for each feature
- [ ] Feature matrix: which features correlate with retention
- [ ] Top features by MAU
- [ ] Stickiness: DAU/MAU per feature

**Note:** No code changes - PostHog configuration only

---

### Task 8.3 - Create Engagement dashboard

**Title:** `[Dashboards] Create Engagement dashboard`

**Priority:** P1 (High)
**Estimate:** 3 points
**Labels:** `dashboard`, `analytics`, `engagement`
**Assignee:** Albert
**Blocked by:** Task 4.5

**Description:**

Build dashboard showing daily/weekly active users and engagement depth metrics.

**✅ Acceptance Criteria:**
- [ ] DAU/WAU/MAU trend chart
- [ ] Stickiness ratio: DAU/MAU over time
- [ ] Sessions per user (distribution)
- [ ] Email engagement: weekly report open/click rates
- [ ] Daily prompt feedback rate
- [ ] Power user segmentation: top 10% by activity

**Note:** No code changes - PostHog configuration only

---

### Task 8.4 - Create Monetization dashboard

**Title:** `[Dashboards] Create Monetization dashboard`

**Priority:** P0 (Critical)
**Estimate:** 3 points
**Labels:** `dashboard`, `analytics`, `monetization`
**Assignee:** Albert
**Blocked by:** Task 5.4

**Description:**

Build dashboard showing conversion funnel from free to paid and upsell indicators.

**✅ Acceptance Criteria:**
- [ ] Conversion funnel: signup → limit warning → plan viewed → upgraded
- [ ] Time to upgrade distribution
- [ ] Limit hit frequency by entitlement type
- [ ] Premium feature block rate (paywall hits)
- [ ] MRR trend (if integrated with Stripe)
- [ ] Churn rate by plan

**Note:** No code changes - PostHog configuration only

---

### Task 8.5 - Create Retention & Churn dashboard

**Title:** `[Dashboards] Create Retention & Churn dashboard`

**Priority:** P1 (High)
**Estimate:** 3 points
**Labels:** `dashboard`, `analytics`, `retention`
**Assignee:** Albert
**Blocked by:** Task 7.3

**Description:**

Build dashboard showing cohort retention and early churn indicators.

**✅ Acceptance Criteria:**
- [ ] Cohort retention table: Day 1/7/30/90 by signup week
- [ ] Churn curve: % of users churned by days since signup
- [ ] Inactive user count: 7/14/30 day buckets
- [ ] Resurrection rate: % of inactive users who return
- [ ] Retention by plan tier

**Note:** No code changes - PostHog configuration only

---

## Phase 9: Alerts (2 tasks, 4 points)

### Task 9.1 - Set up critical metric alerts

**Title:** `[Alerts] Set up critical metric alerts`

**Priority:** P1 (High)
**Estimate:** 2 points
**Labels:** `monitoring`, `analytics`, `alerts`
**Assignee:** Albert
**Blocked by:** Task 8.5

**Description:**

Configure PostHog or Slack alerts for critical metric changes.

**✅ Acceptance Criteria:**
- [ ] Alert: Onboarding completion rate drops below 50%
- [ ] Alert: DAU drops by >20% week-over-week
- [ ] Alert: Churn spike (>5 cancellations in one day)
- [ ] Alert: Payment failures (if integrated with Stripe)
- [ ] Alerts sent to Slack channel: #plg-metrics

**Note:** No code changes - PostHog configuration only

---

### Task 9.2 - Create weekly PLG metrics report

**Title:** `[Alerts] Create weekly PLG metrics report`

**Priority:** P2 (Medium)
**Estimate:** 2 points
**Labels:** `reporting`, `analytics`
**Assignee:** Albert
**Blocked by:** Task 9.1

**Description:**

Set up automated weekly summary report of key PLG metrics sent to team.

**✅ Acceptance Criteria:**
- [ ] Report includes: activation rate, DAU/WAU, conversion rate, churn rate, top features
- [ ] Sent every Monday at 9am to Slack #plg-metrics
- [ ] Include week-over-week change indicators
- [ ] Link to PostHog dashboards for deep dive

**Note:** No code changes - PostHog configuration only

---

## Phase 10: Documentation (3 tasks, 5 points)

### Task 10.1 - Document all tracked events

**Title:** `[Documentation] Document all tracked events`

**Priority:** P1 (High)
**Estimate:** 2 points
**Labels:** `documentation`
**Assignee:** Albert
**Blocked by:** Task 9.2

**Description:**

Create comprehensive documentation of all PostHog events, properties, and when they fire.

**✅ Acceptance Criteria:**
- [ ] Create `ANALYTICS_EVENTS.md` documenting every event
- [ ] Include: event name, description, properties, when it fires, which component/file
- [ ] Create Notion page or wiki for non-technical team
- [ ] Document dashboard URLs and what each shows

**📁 Files to create:**
- `docs/ANALYTICS_EVENTS.md`
- `docs/POSTHOG_DASHBOARDS.md`

---

### Task 10.2 - Create analytics implementation guide

**Title:** `[Documentation] Create analytics implementation guide`

**Priority:** P2 (Medium)
**Estimate:** 2 points
**Labels:** `documentation`
**Assignee:** Albert
**Blocked by:** Task 10.1

**Description:**

Write guide for engineers on how to add new analytics events going forward.

**✅ Acceptance Criteria:**
- [ ] Document: how to add new event types
- [ ] Document: how to add new properties
- [ ] Document: testing analytics locally
- [ ] Document: verifying events in PostHog
- [ ] Include code examples

**📁 Files to create:**
- `docs/ANALYTICS_IMPLEMENTATION_GUIDE.md`

---

### Task 10.3 - Train team on PostHog dashboards

**Title:** `[Documentation] Train team on PostHog dashboards`

**Priority:** P1 (High)
**Estimate:** 1 point
**Labels:** `training`
**Assignee:** Albert
**Blocked by:** Task 8.5

**Description:**

Conduct training session with team on how to use PostHog dashboards and interpret metrics.

**✅ Acceptance Criteria:**
- [ ] Schedule 1-hour training session
- [ ] Walk through each dashboard
- [ ] Explain key metrics and why they matter
- [ ] Show how to create custom insights
- [ ] Record session for future reference

**📊 Deliverable:**
- Training session scheduled and completed
- Recording uploaded to shared drive

---

## Summary

**Total:** 40 tasks, 83 story points across 10 phases

**Timeline:** ~7 weeks with 1-2 engineers

**Critical Path (MVP - 3 weeks):**
- Week 1: Tasks 1.2-1.5, 2.1-2.3 (Foundation + Onboarding core) - Note: 1.1 already done via `instrumentation-client.ts`
- Week 2: Tasks 3.1, 4.1, 5.1, 5.3, 8.1 (Activation + Monetization tracking)
- Week 3: Tasks 8.4, 9.1, 10.1 (Monetization dashboard + Alerts + Docs)
