# PostHog Directory Naming Change

## Issue
`lib/analytics` conflicts with existing Tinybird analytics infrastructure in the codebase.

## Solution
Rename to `lib/posthog` to clearly distinguish PostHog product analytics from Tinybird usage analytics.

---

## Directory Structure Changes

### ❌ Old (Conflicts with Tinybird)
```
apps/client/src/lib/analytics/
├── types.ts
├── events.ts
├── properties.ts
├── tracker.ts
└── index.ts
```

### ✅ New (PostHog-specific)
```
apps/client/src/lib/posthog/
├── types.ts       # Event type definitions
├── events.ts      # Event name constants
├── properties.ts  # Shared property helpers
├── tracker.ts     # PostHog wrapper functions
└── index.ts       # Barrel exports
```

**Rationale:**
- `posthog/` clearly indicates this is for PostHog product analytics
- Keeps existing `analytics/` for Tinybird usage tracking
- No naming conflicts or confusion

---

## Alternative Option: `lib/product-analytics`

If you prefer a more generic name:

```
apps/client/src/lib/product-analytics/
├── types.ts
├── events.ts
├── properties.ts
├── tracker.ts
└── index.ts
```

**Rationale:**
- Generic enough to swap PostHog with another tool later
- Semantically distinguishes "product analytics" from "usage analytics"
- Still avoids conflict with Tinybird

---

## Recommended: Use `lib/posthog`

**Advantages:**
- ✅ Explicit about what it does (PostHog tracking)
- ✅ Easy to search codebase (`import from '@/lib/posthog'`)
- ✅ No confusion with Tinybird analytics
- ✅ Consistent with existing PostHog integration location

**Import Examples:**
```typescript
// Clear and explicit
import { trackEvent } from '@/lib/posthog/tracker'
import { ANALYTICS_EVENTS } from '@/lib/posthog/events'
import type { OnboardingStepCompletedEvent } from '@/lib/posthog/types'
```

vs.

```typescript
// Could be confused with Tinybird
import { trackEvent } from '@/lib/analytics/tracker' // ❌ Which analytics?
```

---

## Find & Replace Required

### In All Task Files

**Files to update:**
- `create-linear-tasks.js`
- `LINEAR-TASKS-SIMPLIFIED.md`
- `LINEAR-IMPORT.csv`
- `POSTHOG-IMPLEMENTATION-TASKS.md`
- `IMPLEMENTATION-SUMMARY.md`

**Replace:**
- `apps/client/src/lib/analytics/` → `apps/client/src/lib/posthog/`
- `@/lib/analytics` → `@/lib/posthog`
- `from '@/lib/analytics/tracker'` → `from '@/lib/posthog/tracker'`
- `from '@/lib/analytics/events'` → `from '@/lib/posthog/events'`
- `from '@/lib/analytics/types'` → `from '@/lib/posthog/types'`

---

## Updated File Paths

### Task 1.2: Create PostHog types and event constants

**Files to create:**
- ❌ ~~`apps/client/src/lib/analytics/types.ts`~~
- ❌ ~~`apps/client/src/lib/analytics/events.ts`~~
- ❌ ~~`apps/client/src/lib/analytics/properties.ts`~~
- ❌ ~~`apps/client/src/lib/analytics/index.ts`~~

**✅ Correct paths:**
- `apps/client/src/lib/posthog/types.ts`
- `apps/client/src/lib/posthog/events.ts`
- `apps/client/src/lib/posthog/properties.ts`
- `apps/client/src/lib/posthog/index.ts`

### Task 1.3: Create PostHog tracking helper functions

**Files to create:**
- ❌ ~~`apps/client/src/lib/analytics/tracker.ts`~~

**✅ Correct path:**
- `apps/client/src/lib/posthog/tracker.ts`

---

## Updated Import Examples

### Before (Conflicts)
```typescript
import { trackEvent } from '@/lib/analytics/tracker';
import { ANALYTICS_EVENTS } from '@/lib/analytics/events';
import type { OnboardingStepCompletedEvent } from '@/lib/analytics/types';
```

### After (PostHog-specific)
```typescript
import { trackEvent } from '@/lib/posthog/tracker';
import { ANALYTICS_EVENTS } from '@/lib/posthog/events';
import type { OnboardingStepCompletedEvent } from '@/lib/posthog/types';
```

---

## Updated Common Package Exports

For worker usage (Task 4.3):

### Before
```typescript
// Export from common package
import { trackEvent } from '@ctrl0/common/analytics';
```

### After
```typescript
// Export from common package
import { trackEvent } from '@ctrl0/common/posthog';
```

**Package structure:**
```
packages/common/src/posthog/
├── tracker.ts    # Re-export from client
└── index.ts      # Barrel export
```

---

## Coexistence with Tinybird

Your codebase will now have clear separation:

### Tinybird (Usage Analytics)
```
apps/client/src/lib/analytics/          # Existing Tinybird code
apps/client/src/types/analytics.ts      # Existing Tinybird types
packages/tinybird/                      # Tinybird datasources/pipes
```

### PostHog (Product Analytics)
```
apps/client/src/lib/posthog/            # NEW: PostHog tracking
  ├── types.ts                          # Event definitions
  ├── events.ts                         # Event constants
  ├── tracker.ts                        # PostHog wrappers
  └── index.ts                          # Exports
```

**No conflicts!** ✅

---

## Implementation Checklist

When implementing:

- [ ] Create `apps/client/src/lib/posthog/` directory (not `analytics`)
- [ ] Create files: `types.ts`, `events.ts`, `properties.ts`, `tracker.ts`, `index.ts`
- [ ] Import using `@/lib/posthog/*` in all components
- [ ] For workers, export from `packages/common/src/posthog/`
- [ ] Update all task documentation if needed

---

## Status

✅ **Naming change documented**
⏳ **Task files will be updated** with corrected paths
📝 **Use `lib/posthog` in all implementations**
