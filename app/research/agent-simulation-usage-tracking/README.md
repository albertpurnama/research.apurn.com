# Agent Simulation Usage Tracking

> **Goal:** Track token usage and costs for agent simulation runs using Tinybird, with data extracted from existing parsed logs.

## Token Types Explained

LLM providers charge for different token types:

| Token Type | What It Is | Pricing |
|------------|------------|---------|
| `input_tokens` | Regular input (prompt, context) | Base rate |
| `output_tokens` | Model-generated response | Higher rate (~3-5x input) |
| `cache_read_tokens` | Input loaded from cache | **90% discount** |
| `cache_creation_tokens` | Input written to cache | **25% premium** |

**Note:** There is no "cached output" - caching only applies to **input tokens**. Output is always generated fresh.

### How Caching Works

```
1st request:  [100k input] → Process → cache_creation_tokens (pay 1.25x)
2nd request:  [same input] → Load from cache → cache_read_tokens (pay 0.1x)
```

The model stores computed key-value pairs from input processing. Subsequent requests with identical input prefix skip recomputation.

---

## Overview

The agent simulation platform already captures and parses agent logs (Claude, Codex, OpenCode) into a unified format that includes token counts. This plan implements usage tracking by:

1. Enriching `run_completed` events with token stats from parsed logs
2. Using Tinybird materialized views for pre-aggregation
3. Exposing endpoints for dashboards and billing queries

```
┌─────────────────────────────────────────────────────────────┐
│                     CURRENT STATE                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Agent Execution → Log Capture → Parse Logs → Store in DB   │
│                                      │                      │
│                              UnifiedStats {                 │
│                                inputTokens ✅               │
│                                outputTokens ✅              │
│                                cacheReadTokens ✅           │
│                                cacheCreationTokens ✅       │
│                              }                              │
│                                      │                      │
│                                      ▼                      │
│                          run_completed event                │
│                          (missing token data) ❌            │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     TARGET STATE                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Agent Execution → Log Capture → Parse Logs → Store in DB   │
│                                      │                      │
│                              UnifiedStats                   │
│                                      │                      │
│                                      ▼                      │
│                          run_completed event                │
│                          {                                  │
│                            input_tokens ✅                  │
│                            output_tokens ✅                 │
│                            cache_read_tokens ✅             │
│                            cache_creation_tokens ✅         │
│                            pricing: { snapshot } ✅         │
│                            cost_breakdown: { ... } ✅       │
│                            cost_usd ✅                      │
│                          }                                  │
│                                      │                      │
│                                      ▼                      │
│                          Tinybird MV aggregates             │
│                                      │                      │
│                                      ▼                      │
│                          Endpoints for dashboards           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Cost Calculation Helper

**Objective:** Create a utility to calculate costs from token counts and model.

### Files to Create

#### `packages/common/src/agent-simulation/pricing.ts`

```typescript
import type { UnifiedStats } from "../agent-logs/types.js";

/**
 * Model pricing per 1M tokens (USD)
 * Source: Provider pricing pages as of Jan 2026
 */
export const MODEL_PRICING: Record<string, { 
  input: number; 
  output: number; 
  cacheRead?: number;
  cacheCreation?: number;
}> = {
  // Claude models
  "claude-sonnet-4-20250514": { input: 3, output: 15, cacheRead: 0.3, cacheCreation: 3.75 },
  "claude-sonnet-4-5-20250929": { input: 3, output: 15, cacheRead: 0.3, cacheCreation: 3.75 },
  "claude-opus-4-20250514": { input: 15, output: 75, cacheRead: 1.5, cacheCreation: 18.75 },
  
  // OpenAI models
  "o4-mini": { input: 1.1, output: 4.4 },
  "o3-mini": { input: 1.1, output: 4.4 },
  "gpt-4o": { input: 2.5, output: 10 },
  "gpt-4-turbo": { input: 10, output: 30 },
  "codex": { input: 2.5, output: 10 },
};

/**
 * Token usage stats (extends UnifiedStats)
 */
interface TokenStats {
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens?: number;
  cacheCreationTokens?: number;
}

/**
 * Pricing snapshot for audit trail
 */
interface PricingSnapshot {
  model: string;
  input_per_1m: number;
  output_per_1m: number;
  cache_read_per_1m: number;
  cache_creation_per_1m: number;
  currency: "USD";
  captured_at: string;
}

/**
 * Cost calculation result with audit trail
 */
interface CostResult {
  cost_usd: number;
  pricing: PricingSnapshot;
  breakdown: {
    input_cost: number;
    output_cost: number;
    cache_read_cost: number;
    cache_creation_cost: number;
  };
}

/**
 * Calculate cost from token usage and model
 * Returns cost + pricing snapshot for audit trail
 */
export function calculateCost(
  model: string, 
  stats: TokenStats | null
): CostResult | null {
  if (!stats) return null;
  
  const pricing = MODEL_PRICING[model];
  if (!pricing) {
    console.warn(`Unknown model pricing: ${model}`);
    return null;
  }
  
  const breakdown = {
    input_cost: (stats.inputTokens / 1_000_000) * pricing.input,
    output_cost: (stats.outputTokens / 1_000_000) * pricing.output,
    cache_read_cost: ((stats.cacheReadTokens ?? 0) / 1_000_000) * (pricing.cacheRead ?? 0),
    cache_creation_cost: ((stats.cacheCreationTokens ?? 0) / 1_000_000) * (pricing.cacheCreation ?? 0),
  };
  
  const totalCost = Object.values(breakdown).reduce((a, b) => a + b, 0);
  
  return {
    cost_usd: Number(totalCost.toFixed(6)),
    pricing: {
      model,
      input_per_1m: pricing.input,
      output_per_1m: pricing.output,
      cache_read_per_1m: pricing.cacheRead ?? 0,
      cache_creation_per_1m: pricing.cacheCreation ?? 0,
      currency: "USD",
      captured_at: new Date().toISOString(),
    },
    breakdown,
  };
}

/**
 * Get pricing info for a model
 */
export function getModelPricing(model: string) {
  return MODEL_PRICING[model] ?? null;
}
```

### Tasks

- [ ] Create `pricing.ts` with model pricing table
- [ ] Export from `packages/common/src/agent-simulation/index.ts`
- [ ] Add tests for cost calculation

---

## Phase 2: Enrich run_completed Event

**Objective:** Add token stats and cost to the `run_completed` event payload.

### Files to Modify

#### `packages/temporal-activities/src/agent-simulation/evaluate-and-finalize.ts`

Find where `run_completed` is emitted and add stats:

```typescript
import { calculateCost } from "@ctrl0/common/agent-simulation/pricing";

// In the evaluateAndFinalize function, after parsing logs:

const stats = parsedLogs?.stats ?? null;
const costResult = calculateCost(agentConfig.model, stats);

await updateAndEmit({
  runId: input.runId,
  environmentId: input.environmentId,
  organizationId: input.organizationId,
  productId: input.productId,
  taskId: input.taskId,
  status: "completed",
  eventType: "run_completed",
  eventPayload: {
    status: "completed",
    passed: result.passed,
    overall_score: result.overallScore,
    duration_ms: Date.now() - input.startTime,
    
    // Token stats from parsed logs
    harness: agentConfig.harness,
    model: agentConfig.model,
    input_tokens: stats?.inputTokens ?? 0,
    output_tokens: stats?.outputTokens ?? 0,
    cache_read_tokens: stats?.cacheReadTokens ?? 0,
    cache_creation_tokens: stats?.cacheCreationTokens ?? 0,
    
    // Pricing snapshot for audit trail (verifiable)
    pricing: costResult?.pricing ?? null,
    
    // Cost breakdown (verifiable from tokens × pricing)
    cost_breakdown: costResult?.breakdown ?? null,
    
    // Total cost
    cost_usd: costResult?.cost_usd ?? 0,
  },
  // ... rest of params
});
```

### Tasks

- [ ] Import `calculateCost` in evaluate-and-finalize.ts
- [ ] Pass `agentConfig` to the finalize function (may need to thread through workflow)
- [ ] Add token stats fields to event payload
- [ ] Update event type definitions if needed

---

## Phase 3: Tinybird Datasources & Materialization

**Objective:** Create pre-aggregated datasource for fast usage queries.

### Files to Create

Already created in `packages/tinybird/`:

1. **`datasources/token_usage_daily_mv.datasource`** ✅
   - Pre-aggregated daily usage per org/product/harness/model
   - Uses AggregatingMergeTree for efficient rollups

2. **`materializations/feed_token_usage_daily.pipe`** ✅
   - Feeds the MV from `agent_simulation_events`
   - Extracts token fields from JSON payload

### Materialization Logic

```sql
SELECT
    toDate(timestamp) as date,
    organization_id,
    coalesce(product_id, '') as product_id,
    coalesce(JSONExtractString(payload, 'harness'), 'unknown') as harness,
    coalesce(JSONExtractString(payload, 'model'), 'unknown') as model,
    sumState(toInt64(JSONExtractInt(payload, 'input_tokens'))) as input_tokens,
    sumState(toInt64(JSONExtractInt(payload, 'output_tokens'))) as output_tokens,
    sumState(toInt64(JSONExtractInt(payload, 'cache_read_tokens'))) as cache_read_tokens,
    sumState(JSONExtractFloat(payload, 'cost_usd')) as cost_usd,
    uniqState(run_id) as run_count,
    -- ... more aggregations
FROM agent_simulation_events
WHERE event_type = 'run_completed'
GROUP BY date, organization_id, product_id, harness, model
```

### Tasks

- [ ] Review created datasource schema
- [ ] Review materialization pipe logic
- [ ] Test locally with `tb local`
- [ ] Deploy to Tinybird staging

---

## Phase 4: Tinybird Endpoints

**Objective:** Create API endpoints for querying usage data.

### Files Created

Already created in `packages/tinybird/endpoints/`:

| Endpoint | Purpose |
|----------|---------|
| `get_org_token_usage.pipe` | Summary totals for billing cards |
| `get_token_usage_timeseries.pipe` | Daily chart data |
| `get_token_usage_by_model.pipe` | Breakdown by harness/model |
| `get_token_usage_monthly.pipe` | Monthly billing cycles |

### Endpoint Parameters

All endpoints support:
- `organizationId` (required)
- `start` / `end` (date range)
- `productId` (optional filter)
- `harness` (optional filter)
- `model` (optional filter)

### Example Response: `get_org_token_usage`

```json
{
  "data": [{
    "total_input_tokens": 1542000,
    "total_output_tokens": 328000,
    "total_cache_read_tokens": 850000,
    "total_cost_usd": 23.45,
    "total_runs": 156,
    "passed_runs": 142,
    "failed_runs": 14,
    "success_rate": 91.0
  }]
}
```

### Tasks

- [ ] Review endpoint SQL logic
- [ ] Add any missing query parameters
- [ ] Test with sample data
- [ ] Deploy endpoints

---

## Phase 5: Frontend Integration

**Objective:** Add usage dashboard components to the simulation UI.

Following the existing pattern:
```
Tinybird Pipe → API Route → SWR Hook (analytics.ts) → Component
```

### Step 1: API Routes

Create API routes that call Tinybird pipes (following existing pattern in `analytics/stats/route.ts`):

#### `apps/client/src/app/api/v1/agent-simulation/analytics/token-usage/route.ts`

```typescript
import { subDays } from "date-fns";
import { headers } from "next/headers";
import { z } from "zod";
import type { ApiResult } from "@/lib/api";
import { auth } from "@/lib/auth";
import { tb } from "@/lib/tinybird";

const tokenUsageSchema = z.object({
  total_input_tokens: z.number(),
  total_output_tokens: z.number(),
  total_cache_read_tokens: z.number(),
  total_cache_creation_tokens: z.number(),
  total_cost_usd: z.number(),
  total_runs: z.number(),
  passed_runs: z.number(),
  failed_runs: z.number(),
  success_rate: z.number(),
  total_duration_s: z.number(),
  total_tokens: z.number(),
});

const parametersSchema = z.object({
  organizationId: z.string(),
  start: z.string(),
  end: z.string(),
  productId: z.string().optional(),
  harness: z.string().optional(),
  model: z.string().optional(),
});

export type TokenUsageData = z.infer<typeof tokenUsageSchema>;

function formatDateForTinybird(date: Date): string {
  return date.toISOString().replace("T", " ").replace("Z", "");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // ... similar pattern to existing stats/route.ts
  
  const pipe = await tb.buildPipe({
    pipe: "get_org_token_usage",
    parameters: parametersSchema,
    data: tokenUsageSchema,
  });
  
  // ... auth, params, error handling
}
```

#### `apps/client/src/app/api/v1/agent-simulation/analytics/token-usage-timeseries/route.ts`

Similar structure, calls `get_token_usage_timeseries` pipe.

#### `apps/client/src/app/api/v1/agent-simulation/analytics/token-usage-by-model/route.ts`

Similar structure, calls `get_token_usage_by_model` pipe.

### Step 2: Analytics Hooks

Add to `apps/client/src/lib/simulation/analytics.ts`:

```typescript
// Types matching API response
export interface TokenUsageData {
  total_input_tokens: number;
  total_output_tokens: number;
  total_cache_read_tokens: number;
  total_cache_creation_tokens: number;
  total_cost_usd: number;
  total_runs: number;
  passed_runs: number;
  failed_runs: number;
  success_rate: number;
  total_duration_s: number;
  total_tokens: number;
}

export interface TokenUsageTimeseriesData {
  date: string;
  input_tokens: number;
  output_tokens: number;
  cache_read_tokens: number;
  cost_usd: number;
  runs: number;
  total_tokens: number;
}

export interface TokenUsageByModelData {
  harness: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  cost_usd: number;
  runs: number;
  success_rate: number;
  avg_cost_per_run: number;
}

/**
 * Fetch aggregated token usage for an organization
 */
export function useTokenUsage(dateRange: DateRange, productId?: string) {
  const params = buildDateParams(dateRange);
  if (productId) {
    params.set("productId", productId);
  }

  return useSWR<TokenUsageData, HttpError>(
    `/api/v1/agent-simulation/analytics/token-usage?${params.toString()}`,
    jsonFetcher,
  );
}

/**
 * Fetch daily token usage timeseries
 */
export function useTokenUsageTimeseries(dateRange: DateRange, productId?: string) {
  const params = buildDateParams(dateRange);
  if (productId) {
    params.set("productId", productId);
  }

  return useSWR<TokenUsageTimeseriesData[], HttpError>(
    `/api/v1/agent-simulation/analytics/token-usage-timeseries?${params.toString()}`,
    jsonFetcher,
  );
}

/**
 * Fetch token usage breakdown by harness/model
 */
export function useTokenUsageByModel(dateRange: DateRange, productId?: string) {
  const params = buildDateParams(dateRange);
  if (productId) {
    params.set("productId", productId);
  }

  return useSWR<TokenUsageByModelData[], HttpError>(
    `/api/v1/agent-simulation/analytics/token-usage-by-model?${params.toString()}`,
    jsonFetcher,
  );
}
```

### Step 3: Components

#### `apps/client/src/app/[orgSlug]/p/[productSlug]/simulation/_components/token-usage-stats.tsx`

```tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@ctrl0/ui/components/card";
import { Skeleton } from "@ctrl0/ui/components/skeleton";
import { Coins, Zap, Database } from "lucide-react";
import { type DateRange, useTokenUsage } from "@/lib/simulation/analytics";

interface TokenUsageStatsProps {
  dateRange: DateRange;
  productId: string;
}

export function TokenUsageStats({ dateRange, productId }: TokenUsageStatsProps) {
  const { data, isLoading, error } = useTokenUsage(dateRange, productId);

  if (error) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Tokens
          </CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="py-4">
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <div className="text-2xl font-bold">
              {data?.total_tokens?.toLocaleString() ?? 0}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Cost
          </CardTitle>
          <Coins className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="py-4">
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">
              ${data?.total_cost_usd?.toFixed(2) ?? "0.00"}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Cache Savings
          </CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="py-4">
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">
              {/* Calculate savings: cache_read_tokens * 0.9 * input_rate */}
              {data?.total_cache_read_tokens 
                ? `${((data.total_cache_read_tokens / (data.total_input_tokens + data.total_cache_read_tokens)) * 100).toFixed(0)}%`
                : "0%"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

### Tasks

- [ ] Create API route: `analytics/token-usage/route.ts`
- [ ] Create API route: `analytics/token-usage-timeseries/route.ts`
- [ ] Create API route: `analytics/token-usage-by-model/route.ts`
- [ ] Add types and hooks to `lib/simulation/analytics.ts`
- [ ] Create `TokenUsageStats` component
- [ ] Create `TokenUsageChart` component (recharts)
- [ ] Create `TokenUsageByModelTable` component
- [ ] Add usage section to simulation dashboard

---

## Phase 6: Testing & Deployment

### Testing Plan

1. **Unit tests**
   - [ ] `calculateCost()` with various models
   - [ ] Edge cases (unknown model, null stats)

2. **Integration tests**
   - [ ] Run a simulation, verify token data in event
   - [ ] Query Tinybird, verify aggregation

3. **E2E tests**
   - [ ] Dashboard displays correct usage data
   - [ ] Filtering by date/product/model works

### Deployment Steps

```bash
# 1. Deploy Tinybird changes
cd packages/tinybird
tb push datasources/token_usage_daily_mv.datasource
tb push materializations/feed_token_usage_daily.pipe
tb push endpoints/get_org_token_usage.pipe
tb push endpoints/get_token_usage_timeseries.pipe
tb push endpoints/get_token_usage_by_model.pipe
tb push endpoints/get_token_usage_monthly.pipe

# 2. Deploy backend changes
# (included in normal deploy pipeline)

# 3. Backfill existing data (optional)
# Run a one-time script to re-emit events for historical runs
```

### Backfill Strategy

For existing runs that don't have token data in events:

```typescript
// scripts/backfill-token-usage.ts
const runs = await prisma.agentSimulationRun.findMany({
  where: { 
    status: 'completed',
    agentOutput: { not: null }
  }
});

for (const run of runs) {
  const agentOutput = run.agentOutput as UnifiedSessionDetail;
  const stats = agentOutput?.stats;
  
  if (stats) {
    await emitBackfillEvent({
      runId: run.id,
      // ... extract and emit
    });
  }
}
```

### Tasks

- [ ] Write unit tests
- [ ] Write integration tests
- [ ] Create backfill script
- [ ] Deploy to staging
- [ ] Test in staging
- [ ] Deploy to production
- [ ] Run backfill (if needed)
- [ ] Verify dashboards

---

## Summary

| Phase | Scope | Effort |
|-------|-------|--------|
| 1 | Cost calculation helper | 2 hours |
| 2 | Enrich run_completed event | 3 hours |
| 3 | Tinybird datasources (done) | ✅ |
| 4 | Tinybird endpoints (done) | ✅ |
| 5 | Frontend components | 1 day |
| 6 | Testing & deployment | 1 day |

**Total estimate:** 2-3 days

---

## Open Questions

1. **Backfill scope:** How far back should we backfill? All historical runs or just recent?

2. **Cost display:** Should we show costs to end users, or only internal dashboards?

3. **Alerts:** Do we want usage alerts (e.g., "80% of monthly budget used")?

4. **Stripe sync:** When do we want to report usage to Stripe for billing?

---

## References

- [[agent-simulation-architecture]] - Full platform architecture
- Tinybird docs: https://www.tinybird.co/docs
- Existing event types: `packages/common/src/agent-simulation.ts`
