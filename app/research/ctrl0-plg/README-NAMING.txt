IMPORTANT: Directory Naming Change
===================================

ISSUE: lib/analytics conflicts with existing Tinybird analytics

SOLUTION: Use lib/posthog instead

WHAT CHANGED:
- All references to "lib/analytics" → "lib/posthog"
- All imports "@/lib/analytics" → "@/lib/posthog"
- Worker imports "@ctrl0/common/analytics" → "@ctrl0/common/posthog"

FILES TO USE:
- NAMING-CHANGE.md - Full explanation of the change
- QUICK-START-CORRECTED.md - Implementation guide with correct paths

ORIGINAL TASK FILES:
- Still reference lib/analytics (need manual correction when implementing)
- Use QUICK-START-CORRECTED.md as source of truth for paths

NO OTHER CHANGES:
- Event names unchanged
- Event properties unchanged
- Implementation logic unchanged
- Task order unchanged
- Dependencies unchanged

DIRECTORY STRUCTURE:
apps/client/src/lib/
  ├── analytics/     ← KEEP (Tinybird)
  └── posthog/       ← NEW (PostHog)
      ├── types.ts
      ├── events.ts
      ├── properties.ts
      ├── tracker.ts
      └── index.ts

IMPORTS:
✅ import { trackEvent } from '@/lib/posthog'
❌ import { trackEvent } from '@/lib/analytics'

When implementing tasks, mentally replace:
- "lib/analytics" with "lib/posthog"
- Everything else stays the same!
