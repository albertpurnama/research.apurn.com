# 🤖 How UCP is Used in Major AI Chat Providers

**Focus**: Engineering & Product-Market Fit Analysis
**Date**: January 2026
**Status**: Early rollout phase

---

## 📋 Table of Contents

1. [Current State Summary](#current-state-summary)
2. [Gemini & Google AI Mode](#gemini--google-ai-mode-ucp)
3. [ChatGPT (OpenAI)](#chatgpt-openai-acp-not-ucp)
4. [Claude (Anthropic)](#claude-anthropic-mcp-infrastructure)
5. [Perplexity](#perplexity-proprietary-shopping)
6. [Protocol Comparison Matrix](#protocol-comparison-matrix)
7. [How to Try UCP Today](#how-to-try-ucp-today)
8. [Technical Integration Patterns](#technical-integration-patterns)
9. [Product-Market Fit Analysis](#product-market-fit-analysis)

---

## Current State Summary

### **Reality Check** (January 2026)

| AI Platform | Shopping Protocol | Status | Availability |
|-------------|------------------|--------|--------------|
| **Gemini** | UCP | 🟡 Rolling out | Limited (US, eligible retailers) |
| **AI Mode (Search)** | UCP | 🟡 Rolling out | Limited (US, eligible retailers) |
| **ChatGPT** | ACP (not UCP) | ✅ Live | US, select merchants |
| **Claude** | MCP (infrastructure only) | 🔴 No shopping yet | N/A |
| **Perplexity** | Proprietary | ✅ Live | US, 5000+ merchants |

**Key Finding**: Only **Gemini/AI Mode** use UCP. Others use different protocols or proprietary systems.

---

## Gemini & Google AI Mode (UCP)

### **Technical Implementation**

**Architecture**:
```
User Query → Gemini/AI Mode
              ↓
         UCP Discovery
         (/.well-known/ucp)
              ↓
    Merchant Capabilities
              ↓
    Create Checkout Session
         (POST /checkout-sessions)
              ↓
    Update Session (discounts, fulfillment)
         (PUT /checkout-sessions/{id})
              ↓
    Complete via Google Pay
         (POST /checkout-sessions/{id}/complete)
              ↓
         Order Created
```

### **User Experience Flow**

**Step 1: Discovery**
```
User: "I need comfortable gym wear"

Gemini: *searches products using UCP-enabled merchants*
        *displays options from Target, Walmart, etc.*

[Product Card]
- Nike Dri-FIT Shirt - $45
- Available at Target
- [Buy Now] button
```

**Step 2: Checkout (UCP Flow)**
```
User: Clicks "Buy Now"

Gemini: *creates UCP checkout session*
        POST /.well-known/ucp/checkout-sessions
        {
          line_items: [{ id: "nike_dri_fit", quantity: 1 }],
          buyer: { email: "user@gmail.com" }
        }

Merchant: Returns session with status: "incomplete"
          (needs shipping address)

Gemini: "Where should we ship this?"
User: "123 Main St, San Francisco"

Gemini: *updates session with fulfillment*
        PUT /checkout-sessions/{id}
        { fulfillment: { address: {...} } }

Merchant: Returns status: "ready_for_complete"
```

**Step 3: Payment**
```
Gemini: Shows total + shipping
        "Total: $52.45 (includes $7.45 shipping)"
        [Pay with Google Pay]

User: Confirms

Gemini: *completes checkout*
        POST /checkout-sessions/{id}/complete
        { payment: { instrument: <google_pay_token> } }

Merchant: Creates order
          Returns order_id + confirmation

Gemini: "✅ Order #12345 confirmed!
         Arriving Tuesday, Jan 23"
```

### **Merchant Integration (Technical)**

**Discovery Manifest**:
```json
// GET https://target.com/.well-known/ucp
{
  "ucp": {
    "version": "2026-01-11",
    "services": {
      "dev.ucp.shopping": {
        "rest": {
          "endpoint": "https://target.com/api/ucp"
        }
      }
    },
    "capabilities": [
      {
        "name": "dev.ucp.shopping.checkout",
        "version": "2026-01-11"
      },
      {
        "name": "dev.ucp.shopping.fulfillment",
        "extends": "dev.ucp.shopping.checkout"
      }
    ]
  },
  "payment": {
    "handlers": [
      {
        "id": "google_pay",
        "name": "google.pay",
        "config": {
          "merchant_id": "BCR2DN4T...",
          "allowed_card_networks": ["VISA", "MASTERCARD"]
        }
      }
    ]
  }
}
```

### **Current Availability**

**Where UCP Works in Gemini**:
- ✅ **Gemini app** (mobile iOS/Android, web)
- ✅ **AI Mode in Google Search** (web, mobile)

**Merchants Live** (confirmed):
- ✅ Target
- ✅ Walmart
- ✅ Shopify merchants (rolling out)
- 🟡 Etsy (partner, rollout timing unknown)
- 🟡 Wayfair (partner, rollout timing unknown)

**Geographic Availability**:
- ✅ United States only (as of Jan 2026)
- 🔜 International "soon thereafter"

### **How to Try It**

**Prerequisites**:
1. Google account
2. Located in US
3. Google Pay set up (required for checkout)

**Steps**:
```
1. Open Gemini app or AI Mode in Google Search
   (gemini.google.com or google.com/search with AI Mode enabled)

2. Search for products from eligible merchants:
   "Nike running shoes from Target"
   "Wireless headphones from Walmart"
   "Shopify merchant product name"

3. Look for [Buy] or [Checkout] button in results

4. If available:
   - Click buy
   - Confirm shipping address
   - Pay with Google Pay
   - Order confirmed!

5. If NOT available:
   - Merchant not yet UCP-enabled
   - Or product not eligible
   - You'll see regular product links instead
```

**Current Limitations**:
- ❌ Not all merchants live yet
- ❌ Not all products eligible (merchant controls this)
- ❌ US only
- ❌ Requires Google Pay

---

## ChatGPT (OpenAI) - ACP, Not UCP

### **Different Protocol!**

**ChatGPT uses ACP** (Agentic Commerce Protocol), **NOT UCP**.

**Key Differences**:

| Aspect | UCP (Gemini) | ACP (ChatGPT) |
|--------|--------------|---------------|
| **Scope** | Full lifecycle | Checkout-focused |
| **Discovery** | `/.well-known/ucp` | Product feed (TSV/CSV) |
| **Payment** | Handler-based | Stripe Shared Payment Token |
| **Transport** | REST, A2A, MCP | REST only |
| **Sessions** | Stateful checkout | Stateful checkout |
| **Post-purchase** | Built-in | Limited |

### **Technical Implementation (ACP)**

**Architecture**:
```
User Query → ChatGPT
              ↓
    OpenAI Product Index
    (merchant feeds ingested)
              ↓
    Create Checkout Session
    (POST /checkout_sessions)
              ↓
    Update Session
    (POST /checkout_sessions/{id})
              ↓
    Complete via Stripe Token
    (POST /checkout_sessions/{id}/complete)
              ↓
         Order Created
```

### **Merchant Integration (ACP)**

**Product Feed** (not UCP discovery):
```xml
<!-- Merchant uploads product feed to OpenAI -->
<?xml version="1.0"?>
<rss version="2.0">
  <channel>
    <item>
      <g:id>nike_dri_fit_123</g:id>
      <g:title>Nike Dri-FIT Training Shirt</g:title>
      <g:price>45.00 USD</g:price>
      <g:availability>in stock</g:availability>
      <g:image_link>https://...</g:image_link>
    </item>
  </channel>
</rss>
```

**Checkout API** (ACP, not UCP):
```typescript
// Different schema than UCP!
interface ACPCheckoutSession {
  id: string;
  status: 'incomplete' | 'awaiting_confirmation' | 'processing' | 'completed';
  items: Array<{
    id: string;
    quantity: number;
  }>;
  buyer_details?: BuyerDetails;
  fulfillment_details?: FulfillmentDetails;
  selected_fulfillment_options?: FulfillmentOption[];
  totals: {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  };
  payment_status: 'unpaid' | 'authorized' | 'paid';
}
```

### **Current Availability**

**Where It Works**:
- ✅ ChatGPT web (chat.openai.com)
- ✅ ChatGPT mobile apps
- ✅ ChatGPT Plus/Pro/Team/Enterprise

**Merchants Live**:
- ✅ Etsy (1M+ listings)
- ✅ Shopify merchants (1M+ stores)
- ✅ Target (recent partnership)
- ✅ Instacart
- ✅ DoorDash

**Geographic**:
- ✅ United States

### **How to Try It**

**Prerequisites**:
1. ChatGPT account (Plus/Pro recommended)
2. Located in US
3. Payment method set up

**Steps**:
```
1. Open ChatGPT (chat.openai.com)

2. Ask about products:
   "Find me handmade mugs on Etsy under $30"
   "Show me running shoes from Target"
   "Find groceries from Instacart for pasta dinner"

3. ChatGPT will show product options with [Buy] buttons

4. Click buy → follow checkout flow:
   - Confirm items
   - Enter shipping address
   - Authorize Stripe payment token
   - Complete order

5. Confirmation shown in chat
```

**Key Difference from UCP**:
- Payment via **Stripe Shared Payment Token** (not Google Pay)
- Product discovery via **OpenAI's index** (not real-time UCP discovery)
- **ACP API spec**, not UCP API spec

---

## Claude (Anthropic) - MCP Infrastructure

### **No Native Shopping Yet**

**Current State**:
- ❌ No shopping integration
- ✅ MCP (Model Context Protocol) infrastructure ready
- ✅ Can connect to external tools/services

### **MCP vs UCP vs ACP**

**MCP is NOT a commerce protocol**:

| Protocol | Purpose | Commerce? |
|----------|---------|-----------|
| **MCP** | Connect LLMs to tools/data | ❌ No (infrastructure) |
| **UCP** | End-to-end commerce | ✅ Yes |
| **ACP** | Checkout-focused commerce | ✅ Yes |

**MCP = Infrastructure**, UCP/ACP = Application

### **How MCP Could Support Shopping**

**Theoretical Architecture**:
```
Claude Desktop
    ↓
MCP Server (merchant's)
    ↓
UCP or ACP endpoint
    ↓
Merchant backend
```

**Example MCP Server for UCP**:
```typescript
// Theoretical: UCP connector via MCP
const ucpMcpServer = new Server({
  name: "ucp-merchant",
  version: "1.0.0"
}, {
  capabilities: {
    tools: {}
  }
});

ucpMcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search_products",
        description: "Search for products via UCP",
        inputSchema: {
          type: "object",
          properties: {
            query: { type: "string" },
            merchant: { type: "string" }
          }
        }
      },
      {
        name: "create_checkout",
        description: "Create UCP checkout session",
        inputSchema: {
          type: "object",
          properties: {
            items: { type: "array" }
          }
        }
      }
    ]
  };
});
```

### **Current Use Cases (Not Shopping)**

What Claude MCP **does** support:
- ✅ File system access
- ✅ Database queries
- ✅ API integrations (Slack, GitHub, etc.)
- ✅ Web scraping
- ❌ Native shopping (yet)

### **How to Try MCP (General)**

**Not for shopping, but to understand infrastructure**:

```bash
# 1. Install Claude Desktop
# Download from anthropic.com

# 2. Create MCP server config
# Edit: ~/Library/Application Support/Claude/claude_desktop_config.json

{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/files"]
    }
  }
}

# 3. Restart Claude Desktop

# 4. Ask Claude to access files
"Read the file at /path/to/file.txt"
```

**For Shopping**: Anthropic would need to build or partner for commerce integration.

### **Potential UCP Integration**

**How Anthropic Could Add UCP**:

**Option 1**: Direct integration (like Gemini)
```
Claude → UCP Discovery → Merchant → Checkout
```

**Option 2**: Via MCP server
```
Claude → MCP Server → UCP Gateway (yours!) → Merchant
```

**Option 3**: Wait for merchant MCP servers
```
Claude → Merchant's MCP Server (with UCP) → Checkout
```

**Current Status**: None implemented yet (as of Jan 2026)

---

## Perplexity (Proprietary Shopping)

### **Not UCP, Not ACP - Custom Solution**

**Perplexity built their own shopping system**.

### **Technical Architecture** (Inferred)

```
User Query → Perplexity Search
              ↓
    Product Database (5000+ merchants)
              ↓
    Display Results
              ↓
    Checkout via PayPal
              ↓
    Merchant API (direct)
              ↓
         Order Created
```

**Key Points**:
- ❌ Does NOT use UCP
- ❌ Does NOT use ACP
- ✅ Uses proprietary merchant integrations
- ✅ PayPal for payment processing
- ✅ Merchant stays merchant of record

### **Current Availability**

**Status**: ✅ Live (launched Nov 2024, expanded Nov 2025)

**Where**:
- ✅ Perplexity web (perplexity.ai)
- ✅ Perplexity mobile apps

**Features**:
- ✅ Free for all US users
- ✅ "Buy with Pro" (free shipping for Pro users)
- ✅ 5000+ merchants
- ✅ PayPal integration

### **How to Try It**

**Steps**:
```
1. Go to perplexity.ai

2. Search for products:
   "Best wireless earbuds under $100"
   "Organic coffee beans"

3. Perplexity shows product cards with:
   - Product details
   - Price comparisons
   - [Buy] button (if available)

4. Click buy:
   - Redirects to checkout
   - Enter shipping info
   - Pay via PayPal
   - Confirmation

5. Order placed directly with merchant
```

**Merchant Partnerships**:
- Direct integrations with 5000+ merchants
- Not via open protocol (UCP/ACP)
- Custom API deals

---

## Protocol Comparison Matrix

### **Technical Comparison**

| Feature | UCP (Gemini) | ACP (ChatGPT) | MCP (Claude) | Perplexity |
|---------|--------------|---------------|--------------|------------|
| **Discovery** | `/.well-known/ucp` | Product feeds | N/A | Proprietary index |
| **API Spec** | OpenAPI (REST) | OpenAPI (REST) | RPC | Proprietary |
| **Transport** | REST, A2A, MCP | REST | MCP protocol | REST (custom) |
| **Session State** | Stateful | Stateful | N/A | Unknown |
| **Payment** | Handler-based | Stripe token | N/A | PayPal |
| **Extensions** | Modular (discount, fulfillment) | Limited | N/A | N/A |
| **Post-purchase** | Orders, tracking | Limited | N/A | Unknown |
| **Open Standard** | ✅ Yes (Apache 2.0) | ✅ Yes (Apache 2.0) | ✅ Yes | ❌ No |

### **Integration Effort** (For Merchants)

| Protocol | Effort | Why |
|----------|--------|-----|
| **UCP** | High | Full lifecycle, multiple capabilities |
| **ACP** | Medium | Checkout-focused, simpler scope |
| **MCP** | Low | Infrastructure only (if shopping added) |
| **Perplexity** | Unknown | Proprietary deals |

### **Merchant Coverage**

| Platform | Estimated Merchants | Status |
|----------|---------------------|--------|
| **Gemini (UCP)** | Hundreds (growing) | Early rollout |
| **ChatGPT (ACP)** | 1M+ (Shopify + Etsy) | Established |
| **Claude (MCP)** | 0 (no shopping) | N/A |
| **Perplexity** | 5000+ | Established |

---

## How to Try UCP Today

### **Option 1: As a Shopper (Limited)**

**Gemini/AI Mode**:
```
Prerequisites:
✅ US location
✅ Google account
✅ Google Pay set up

Steps:
1. Go to gemini.google.com or enable AI Mode in Search
2. Search for products from Target, Walmart, or Shopify merchants
3. Look for [Buy] button
4. Complete checkout if available

Reality Check:
⚠️ Very limited availability
⚠️ Not all products eligible
⚠️ Merchant must be UCP-enabled
```

### **Option 2: As a Merchant (Build Integration)**

**Implement UCP on Your Store**:

```typescript
// 1. Setup discovery endpoint
app.get('/.well-known/ucp', (req, res) => {
  res.json({
    ucp: {
      version: "2026-01-11",
      services: {
        "dev.ucp.shopping": {
          rest: {
            endpoint: "https://yourstore.com/api/ucp"
          }
        }
      },
      capabilities: [
        { name: "dev.ucp.shopping.checkout" }
      ]
    },
    payment: {
      handlers: [
        { id: "google_pay", name: "google.pay", config: {...} }
      ]
    }
  });
});

// 2. Implement checkout endpoints
app.post('/api/ucp/checkout-sessions', createCheckout);
app.put('/api/ucp/checkout-sessions/:id', updateCheckout);
app.post('/api/ucp/checkout-sessions/:id/complete', completeCheckout);
```

**Then**:
```
1. Register with Google Merchant Center
2. Enable native_commerce attribute
3. Fill merchant interest form
4. Wait for Google approval
5. Test in Gemini
```

### **Option 3: Use UCP Gateway (Your Product!)**

**If you build the gateway**:

```
Merchant → UCP Gateway (you) → Gemini/AI Mode
```

**Value Proposition**:
- Merchant doesn't implement UCP
- You handle translation
- Merchant gets UCP compatibility

**Test Flow**:
```
1. Merchant signs up for your gateway
2. You generate their /.well-known/ucp
3. You proxy checkout endpoints
4. You sync with their platform (Shopify, WooCommerce)
5. They appear in Gemini search results
```

### **Option 4: Build MCP Server (Claude)**

**For Claude integration**:

```typescript
// Create MCP server that speaks UCP
const mcpServer = new Server({
  name: "ucp-bridge",
  version: "1.0.0"
});

// Expose UCP merchants as MCP tools
mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "browse_products",
        description: "Browse products from UCP merchants",
        inputSchema: { /* ... */ }
      },
      {
        name: "checkout",
        description: "Complete UCP checkout",
        inputSchema: { /* ... */ }
      }
    ]
  };
});

// Implement tool handlers that call UCP endpoints
mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "browse_products") {
    // Call merchant's UCP discovery
    const discovery = await fetch('https://merchant.com/.well-known/ucp');
    // Return products
  }
});
```

**Current Limitation**: Claude doesn't have UI for checkout completion yet.

---

## Technical Integration Patterns

### **Pattern 1: Direct UCP (Gemini)**

```
┌─────────────┐
│   Gemini    │
└──────┬──────┘
       │ UCP Protocol
       ▼
┌─────────────┐
│  Merchant   │
│ (UCP native)│
└─────────────┘
```

**Pros**: Direct, no middleman
**Cons**: Merchant must implement UCP

### **Pattern 2: UCP Gateway (Your Product)**

```
┌─────────────┐
│   Gemini    │
└──────┬──────┘
       │ UCP Protocol
       ▼
┌─────────────┐
│ UCP Gateway │ ← Your product
└──────┬──────┘
       │ Platform API
       ▼
┌─────────────┐
│  Merchant   │
│  (Shopify)  │
└─────────────┘
```

**Pros**: Easy for merchant
**Cons**: You're the bottleneck

### **Pattern 3: Hybrid (Shopify Native)**

```
┌─────────────┐
│   Gemini    │
└──────┬──────┘
       │ UCP Protocol
       ▼
┌─────────────┐
│   Shopify   │ ← Platform handles UCP
└──────┬──────┘
       │ Internal
       ▼
┌─────────────┐
│  Merchant   │
│   (store)   │
└─────────────┘
```

**Pros**: Automatic for merchant
**Cons**: Platform-dependent

### **Pattern 4: MCP Bridge (Future Claude)**

```
┌─────────────┐
│   Claude    │
└──────┬──────┘
       │ MCP Protocol
       ▼
┌─────────────┐
│ MCP Server  │ ← Bridge to UCP
└──────┬──────┘
       │ UCP Protocol
       ▼
┌─────────────┐
│  Merchant   │
└─────────────┘
```

**Pros**: Flexible, extensible
**Cons**: More layers

---

## Product-Market Fit Analysis

### **User Perspective**

**What Works Today**:

| Platform | PMF Signal | Evidence |
|----------|-----------|----------|
| **ChatGPT** | 🟢 Strong | 1M+ Shopify merchants, active usage |
| **Perplexity** | 🟢 Good | 5000+ merchants, free tier |
| **Gemini** | 🟡 Early | Just launched, limited availability |
| **Claude** | 🔴 None | No shopping integration |

**User Pain Points Solved**:

✅ **Friction reduction**: No leaving chat to checkout
✅ **Discovery**: Find products in conversation
✅ **Comparison**: AI compares options naturally
✅ **Context**: AI remembers preferences

**Remaining Friction**:

❌ **Trust**: Will AI buy the right thing?
❌ **Returns**: What if I want to return?
❌ **Browsing**: Sometimes I want to browse, not buy
❌ **Complexity**: For complex purchases (furniture, etc.)

### **Merchant Perspective**

**Why Merchants Integrate**:

1. **New channel**: Reach users where they are (AI chat)
2. **High intent**: Users in chat are often ready to buy
3. **Competitive**: Others are doing it
4. **Future-proof**: Agentic commerce is coming

**Merchant Concerns**:

❌ **Integration cost**: Building UCP/ACP is expensive
❌ **Margin pressure**: Competing on AI platforms
❌ **Data loss**: Less direct customer relationship
❌ **Standards battle**: UCP vs ACP vs others

**Your Gateway Solution**:

✅ **Solves integration cost**: No dev work for merchant
✅ **Fast time to market**: 5-minute setup
✅ **Multi-protocol**: Support UCP, ACP, future protocols
✅ **Data ownership**: Merchant stays merchant of record

### **Market Timing**

**Current State** (Jan 2026):

```
Adoption Curve:
│
│     ┌─ Innovators (now)
│    ╱
│   ╱   ┌─ Early Adopters (6 months)
│  ╱   ╱
│ ╱   ╱    ┌─ Early Majority (12-18 months)
│╱   ╱    ╱
├───────────────────────────
│  Now   6mo   12mo   18mo
```

**Your Window**:
- 🟢 **Now - 6 months**: Build MVP, get early adopters
- 🟢 **6-12 months**: Scale before platforms catch up
- 🟡 **12-18 months**: Compete with native integrations
- 🔴 **18+ months**: Market commoditized

### **Technical Feasibility**

**UCP Gateway Complexity**:

| Component | Complexity | Time (with x402 exp) |
|-----------|------------|---------------------|
| Core UCP endpoints | 🟢 Low | 2 weeks |
| Session management | 🟡 Medium | 2 weeks |
| Platform adapter (Shopify) | 🟡 Medium | 2 weeks |
| Platform adapter (WooCommerce) | 🟡 Medium | 2 weeks |
| Payment handlers | 🟢 Low | 1 week |
| Production hardening | 🟠 High | 4 weeks |

**Total**: ~12 weeks to production-ready with one test customer

### **Competitive Moats**

**What Protects Your Gateway**:

1. **Network effects**: More merchants → better for AI platforms
2. **Technical depth**: Deep UCP knowledge barrier
3. **Platform relationships**: Direct partnerships with Shopify, etc.
4. **Speed**: First mover advantage
5. **Multi-protocol**: Support UCP + ACP + future

**Threats**:

1. **Shopify native**: Platform builds it themselves
2. **Big players**: Stripe/Adyen build gateways
3. **Commoditization**: UCP becomes too easy
4. **Protocol death**: UCP doesn't win

---

## Key Insights for Gateway Product

### **What You Need to Build**

**Minimum Viable Product**:

```
✅ UCP discovery generation (/.well-known/ucp)
✅ Checkout session CRUD (create, read, update, complete)
✅ One platform adapter (start with WooCommerce - easier than Shopify)
✅ State machine (checkout status transitions)
✅ Google Pay handler integration
✅ Basic dashboard for merchants

❌ NOT needed for MVP:
❌ Multiple platforms (add after validation)
❌ All payment handlers (start with Google Pay)
❌ Advanced features (discounts, etc.)
❌ Mobile apps
❌ Complex analytics
```

**Engineering Focus**:

1. **Reliability** (checkout must work 100%)
2. **Latency** (AI agents timeout quickly)
3. **Idempotency** (prevent duplicate orders)
4. **Error handling** (clear messages to AI)
5. **State sync** (keep platform in sync)

### **Go-to-Market Strategy**

**Phase 1: Validate (Week 1-4)**
```
Target: 10 conversations with WooCommerce merchants
Goal: Validate pain point exists
Ask: "Would you pay for instant UCP support?"
```

**Phase 2: Build (Week 5-12)**
```
Build: MVP with WooCommerce adapter
Test: With 2-3 design partners
Iterate: Based on real usage
```

**Phase 3: Launch (Week 13-16)**
```
Public launch: Limited beta
Metrics: Checkout completion rate, merchant satisfaction
Target: 10 paying customers
```

**Phase 4: Scale (Week 17+)**
```
Add: More platform adapters
Optimize: Performance, reliability
Grow: Marketing, partnerships
```

### **Success Metrics**

**Technical KPIs**:
- Checkout success rate: >95%
- Latency (create session): <200ms
- Uptime: 99.9%
- Order accuracy: 100%

**Product KPIs**:
- Time to first checkout: <5 minutes (merchant onboarding)
- Integration setup time: <10 minutes
- Merchant retention: >80% monthly
- Orders per merchant per month: >10

**Market KPIs**:
- Merchants using gateway: Track growth
- Total GMV through gateway: Track scale
- AI platform coverage: Gemini ✅, ChatGPT (via ACP), Claude (when ready)

---

## Bottom Line

### **Current Reality**

1. **Only Gemini uses UCP** (rolling out in US)
2. **ChatGPT uses ACP** (different protocol, 1M+ merchants)
3. **Claude has no shopping** (MCP is infrastructure only)
4. **Perplexity is proprietary** (not open protocol)

### **To Try UCP Today**

**As Shopper**:
- Use Gemini/AI Mode in US
- Search for Target/Walmart products
- Look for buy button (limited availability)

**As Builder**:
- Build UCP gateway (your product idea)
- Test with WooCommerce merchants
- Get them into Gemini search results
- Expand to ACP for ChatGPT coverage

### **Your Opportunity**

**Window**: 6-12 months before platforms build native support

**Advantage**: x402 experience = 60% of knowledge needed

**Focus**: Build for WooCommerce first (easier, bigger TAM than Shopify)

**Moat**: Speed to market + multi-protocol support (UCP + ACP)

---

## Sources

- [New tech and tools for retailers - Google Blog](https://blog.google/products/ads-commerce/agentic-commerce-ai-tools-protocol-retailers-platforms/)
- [Gemini app and AI Mode adding product checkout - 9to5Google](https://9to5google.com/2026/01/11/gemini-ai-mode-checkout/)
- [Under the Hood: Universal Commerce Protocol - Google Developers Blog](https://developers.googleblog.com/under-the-hood-universal-commerce-protocol-ucp/)
- [OpenAI's ACP and Google's UCP: What's the difference? - Checkout.com](https://www.checkout.com/blog/openai-acp-google-ucp-difference)
- [Agentic Commerce - OpenAI](https://developers.openai.com/commerce/)
- [Model Context Protocol (MCP) - Claude Docs](https://docs.anthropic.com/en/docs/build-with-claude/mcp)
- [Shop like a Pro - Perplexity Blog](https://www.perplexity.ai/hub/blog/shop-like-a-pro)
- [Why the AI shopping agent wars will heat up in 2026 - Modern Retail](https://www.modernretail.co/technology/why-the-ai-shopping-agent-wars-will-heat-up-in-2026/)
- [About Target's new frictionless checkout in Google Gemini](https://corporate.target.com/press/fact-sheet/2026/01/google-gemini-2026)
- [Google Universal Commerce Protocol (UCP) Guide](https://developers.google.com/merchant/ucp)

---

**Last Updated**: January 18, 2026
**Status**: Early rollout phase - market forming
**Your Action**: Build the gateway, capture the early market
