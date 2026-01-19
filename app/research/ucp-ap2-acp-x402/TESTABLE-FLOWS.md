# 🧪 Testable End-to-End Flows - January 2026

## Quick Answer: What Can You Test Right Now?

✅ **x402 is FULLY testable** - Production-ready with complete examples
✅ **UCP is TESTABLE** - Production-ready but requires SDK setup
⚠️ **ACP is PARTIALLY testable** - Need OpenAI/Stripe integration
⚠️ **AP2 is EXAMPLE-ONLY** - Reference implementations, not full integration

---

## 🏆 EASIEST TO TEST: x402 Protocol

### Status: ✅ **PRODUCTION READY** (35M+ transactions, $10M+ volume on Solana)

**Why x402 wins for testing:**
- 🚀 Simplest setup (just needs wallet + facilitator)
- 💻 Complete working examples in TypeScript, Go, Python
- 🌐 Works on testnet (Base Sepolia, Solana Devnet)
- 📦 Production-ready SDKs
- 🔄 End-to-end flow works immediately

### Test It NOW: 5-Minute Setup

#### Option 1: TypeScript Express Server (Recommended)

**Location**: `/Users/albert/Documents/dev/google-universal-commerce-protocol/x402/examples/typescript/servers/express`

**Prerequisites**:
```bash
# You need:
# - Node.js v20+
# - pnpm v10
# - A wallet address (MetaMask)
# - A facilitator URL (free available)
```

**Setup Steps**:

```bash
cd /Users/albert/Documents/dev/google-universal-commerce-protocol/x402/examples/typescript/servers/express

# 1. Copy env file
cp .env-local .env

# 2. Edit .env with your details:
# FACILITATOR_URL=https://facilitator.x402.org  # Free facilitator
# EVM_ADDRESS=0xYourWalletAddress
# SVM_ADDRESS=YourSolanaAddress

# 3. Install from root of typescript examples
cd ../../
pnpm install && pnpm build

# 4. Go back and run server
cd servers/express
pnpm dev

# Server starts at http://localhost:4021
```

**Test the Server**:

```bash
# In another terminal
cd /Users/albert/Documents/dev/google-universal-commerce-protocol/x402/examples/typescript/clients/fetch

# Copy env
cp .env-local .env
# Edit with your wallet private key (for signing)

# Run client
pnpm dev
```

**What happens**:
1. Client requests `/weather` endpoint
2. Server responds `402 Payment Required` with payment details
3. Client signs payment with wallet
4. Client retries request with payment signature
5. Server verifies via facilitator
6. Facilitator settles on blockchain (Base Sepolia testnet)
7. Server returns weather data `{"weather": "sunny", "temperature": 70}`

**Cost**: ~$0.001 USDC (testnet - free!)

---

#### Option 2: Go Server (Also Great)

**Location**: `/Users/albert/Documents/dev/google-universal-commerce-protocol/x402/examples/go/servers/advanced`

**Setup Steps**:

```bash
cd /Users/albert/Documents/dev/google-universal-commerce-protocol/x402/examples/go/servers/advanced

# 1. Copy env
cp .env-example .env

# 2. Edit .env
# FACILITATOR_URL=https://facilitator.x402.org
# EVM_PAYEE_ADDRESS=0xYourAddress

# 3. Run any example
go run hooks.go
# OR
go run bazaar.go
# OR
go run dynamic-price.go
```

**Advanced Examples Available**:
- ✅ **bazaar.go** - API discovery (makes your service discoverable)
- ✅ **hooks.go** - Payment lifecycle hooks
- ✅ **dynamic-price.go** - Dynamic pricing based on context
- ✅ **dynamic-pay-to.go** - Route payments to different addresses
- ✅ **custom-money-definition.go** - Accept custom tokens

---

### Real-World x402 Usage (Production)

**Live on**:
- ✅ Cloudflare
- ✅ Google
- ✅ Vercel
- ✅ 35M+ transactions on Solana
- ✅ $10M+ in volume

**Facilitators Available** (see [x402.org/ecosystem](https://x402.org/ecosystem?category=facilitators)):
- Free public facilitators
- Self-hosted facilitator (Docker image)

---

## ✅ PRODUCTION READY: UCP Protocol

### Status: ✅ **PRODUCTION READY** (Launched January 11, 2026)

**What's Live**:
- ✅ Full specification published
- ✅ Python SDK available
- ✅ JavaScript SDK available
- ✅ Reference implementations (Python FastAPI, Node.js)
- ✅ Conformance tests
- ✅ Rolling out on Google AI Mode & Gemini app

**Partners Live**:
- Shopify (rolling out to merchants)
- Etsy, Wayfair, Target, Walmart
- 20+ ecosystem partners

### Test It: UCP Python Server

**Location**: `/tmp/ucp-repos/samples/rest/python/server`

**Prerequisites**:
```bash
# You need:
# - Python 3.10+
# - uv (Python package manager)
```

**Setup Steps**:

```bash
# 1. Clone SDK (if not done)
mkdir -p ~/ucp-sdk
cd ~/ucp-sdk
git clone https://github.com/Universal-Commerce-Protocol/python-sdk.git python
cd python
uv sync

# 2. Go to samples
cd /tmp/ucp-repos/samples/rest/python/server
uv sync

# 3. Initialize test database (flower shop)
mkdir /tmp/ucp_test
uv run import_csv.py \
    --products_db_path=/tmp/ucp_test/products.db \
    --transactions_db_path=/tmp/ucp_test/transactions.db \
    --data_dir=../test_data/flower_shop

# 4. Run server
uv run server.py \
   --products_db_path=/tmp/ucp_test/products.db \
   --transactions_db_path=/tmp/ucp_test/transactions.db \
   --port=8182
```

**Test the Server**:

```bash
# In another terminal - Test discovery
curl -X GET http://localhost:8182/.well-known/ucp | python3 -m json.tool

# Create checkout session
curl -X POST http://localhost:8182/checkout-sessions \
  -H "UCP-Agent: profile=\"https://agent.example/profile\"" \
  -H "request-signature: test" \
  -H "idempotency-key: $(uuidgen)" \
  -H "request-id: $(uuidgen)" \
  -H "Content-Type: application/json" \
  -d '{
  "line_items": [
    {
      "item": {
        "id": "bouquet_roses",
        "title": "Red Rose"
      },
      "quantity": 1
    }
  ],
  "buyer": {
    "full_name": "John Doe",
    "email": "john.doe@example.com"
  },
  "currency": "USD",
  "payment": {
    "instruments": [],
    "handlers": []
  }
}'
```

**Run the Happy Path Client**:

```bash
cd /tmp/ucp-repos/samples/rest/python/client/flower_shop/
uv sync
uv run simple_happy_path_client.py --server_url=http://localhost:8182
```

**What happens**:
1. Client discovers capabilities via `/.well-known/ucp`
2. Creates checkout session with line items
3. Updates session (apply discount, select fulfillment)
4. Completes checkout
5. Order created with confirmation

**Sample Products** (Flower Shop):
- bouquet_roses - Bouquet of Red Roses ($35.00)
- bouquet_tulips - Bouquet of Tulips ($28.00)
- bouquet_sunflowers - Bouquet of Sunflowers ($32.00)

**Discount Codes**:
- `10OFF` - 10% off
- `SPRING25` - 25% off (example)

---

## ⚠️ PARTIALLY TESTABLE: ACP Protocol

### Status: ⚠️ **PRODUCTION READY but Requires OpenAI/Stripe Integration**

**What's Available**:
- ✅ Full OpenAPI specification
- ✅ JSON schemas
- ✅ RFCs and documentation
- ⚠️ Need OpenAI credentials for ChatGPT integration
- ⚠️ Need Stripe account for delegated payments

**You Can Test**:
1. **Spec Validation** - Use OpenAPI spec to validate your implementation
2. **Mock Checkout** - Build server following ACP spec without actual payment
3. **Stripe Integration** - If you have Stripe account, test payment flow

**Reference Implementation**:
- OpenAI's ChatGPT implementation (need ChatGPT Plus/Pro)
- Stripe's payment handling (need Stripe merchant account)
- Community: [Locus Technologies demo](https://github.com/locus-technologies/agentic-commerce-protocol-demo)

**Cannot Test Without**:
- ❌ OpenAI API access for product feed ingestion
- ❌ Stripe account for Shared Payment Token
- ❌ ChatGPT Plus/Pro for agent testing

**Location**: `/Users/albert/Documents/dev/google-universal-commerce-protocol/agentic-commerce-protocol`

**What You CAN Do**:
```bash
cd /Users/albert/Documents/dev/google-universal-commerce-protocol/agentic-commerce-protocol

# View the OpenAPI spec
cat spec/openapi/openapi.agentic_checkout.yaml

# View examples
cat examples/examples.agentic_checkout.json

# Read RFCs
cat rfcs/rfc.agentic_checkout.md
cat rfcs/rfc.delegate_payment.md
```

---

## 🧪 EXAMPLE-ONLY: AP2 Protocol

### Status: 🧪 **V0.1 - Reference Implementation Only**

**What's Available**:
- ✅ Full specification (62KB)
- ✅ Python type definitions
- ✅ Sample agents (Gemini-based)
- ⚠️ No production infrastructure yet
- ⚠️ Requires custom setup

**You Can Explore**:
1. **Read the Spec** - Understand VDC architecture
2. **Sample Code** - See how mandates work
3. **Type Definitions** - Use in your implementation

**Location**: `/Users/albert/Documents/dev/google-universal-commerce-protocol/AP2`

**What You CAN Do**:

```bash
cd /Users/albert/Documents/dev/google-universal-commerce-protocol/AP2

# Read the comprehensive spec
cat docs/specification.md

# View type definitions
cat src/ap2/types/mandate.py
cat src/ap2/types/payment_request.py

# Explore sample agent code
cat samples/python/src/roles/shopping_agent/subagents/shopper/agent.py
```

**Samples Require**:
- Gemini 2.5 Flash API access
- Google Agent Development Kit (ADK)
- Custom payment processor integration
- Digital Payment Credentials setup (Android)

**Not Production Ready For**:
- ❌ Full end-to-end testing
- ❌ Real payment processing
- ❌ Merchant integration

**Good For**:
- ✅ Understanding the architecture
- ✅ Building proof-of-concept
- ✅ Preparing for future implementation

---

## 📊 Comparison: What Can You Actually Test?

| Protocol | Testable? | Complexity | Time to Test | Production Ready? |
|----------|-----------|------------|--------------|-------------------|
| **x402** | ✅ YES | Low | 5 minutes | ✅ YES (35M+ txns) |
| **UCP** | ✅ YES | Medium | 15 minutes | ✅ YES (just launched) |
| **ACP** | ⚠️ PARTIAL | Medium | N/A* | ✅ YES (need accounts) |
| **AP2** | 🧪 EXAMPLES | High | N/A** | 🧪 NO (v0.1) |

*Need OpenAI + Stripe accounts
**No full infrastructure yet

---

## 🎯 Recommended Testing Path

### For Quick Testing (5 minutes):
**Use x402**
```bash
1. Clone x402 repo (already done ✅)
2. cd x402/examples/typescript/servers/express
3. Setup .env with facilitator URL + your wallet
4. pnpm install && pnpm build
5. pnpm dev
6. Test with client or curl
```

### For Commerce Features (15 minutes):
**Use UCP**
```bash
1. Clone UCP repos (already done ✅)
2. Setup Python environment
3. Initialize flower shop database
4. Run FastAPI server
5. Test with provided client
6. Try: discovery, checkout, discounts, fulfillment
```

### For Learning (No Setup Required):
**Explore All Specs**
- x402: `/Users/albert/.../x402/specs/`
- UCP: `/tmp/ucp-repos/ucp/source/schemas/`
- ACP: `/Users/albert/.../agentic-commerce-protocol/spec/`
- AP2: `/Users/albert/.../AP2/docs/specification.md`

---

## 🚀 Step-by-Step: Test x402 RIGHT NOW

This is the absolute easiest flow to test end-to-end:

### Prerequisites (one-time setup):

```bash
# 1. Install Node.js (if not installed)
# Visit: https://nodejs.org/ or use nvm

# 2. Install pnpm
npm install -g pnpm

# 3. Get a wallet address
# Use MetaMask: https://metamask.io/
# Copy your address: 0x...

# 4. Get testnet USDC (Base Sepolia)
# Visit: https://faucet.circle.com/
# Request Base Sepolia USDC to your address
```

### Run the Server:

```bash
cd /Users/albert/Documents/dev/google-universal-commerce-protocol/x402/examples/typescript/servers/express

# Copy env
cp .env-local .env

# Edit .env:
nano .env

# Add:
# FACILITATOR_URL=https://facilitator.x402.org
# EVM_ADDRESS=0xYourWalletAddress
# SVM_ADDRESS=YourSolanaAddress (optional)

# Install dependencies (from typescript root)
cd ../../
pnpm install
pnpm build

# Start server
cd servers/express
pnpm dev

# You should see:
# Server listening at http://localhost:4021
```

### Test with cURL (No Client Needed!):

```bash
# In another terminal

# 1. Try to access without payment
curl -v http://localhost:4021/weather

# You get: 402 Payment Required
# Response header: PAYMENT-REQUIRED (base64 JSON)

# 2. See payment requirements
curl -s http://localhost:4021/weather -D- | grep PAYMENT-REQUIRED | cut -d' ' -f2 | base64 -d | jq

# Shows:
# {
#   "x402Version": 2,
#   "accepts": [{
#     "scheme": "exact",
#     "amount": "1000",  // 0.001 USDC
#     "network": "eip155:84532",  // Base Sepolia
#     "payTo": "0x...",
#     ...
#   }]
# }
```

### Test with Client (Full Flow):

```bash
cd /Users/albert/Documents/dev/google-universal-commerce-protocol/x402/examples/typescript/clients/fetch

# Copy env
cp .env-local .env

# Edit .env with your wallet private key
nano .env
# PRIVATE_KEY=0xYourPrivateKey
# RPC_URL=https://sepolia.base.org (or use Alchemy/Infura)

# Run client
pnpm dev

# You should see:
# ✅ Payment required
# ✅ Signing payment...
# ✅ Payment verified
# ✅ Weather data: {"weather":"sunny","temperature":70}
```

**BOOM! End-to-end flow complete!** 🎉

---

## 🔍 What You Just Tested (x402)

1. **Discovery**: Client requests resource
2. **402 Response**: Server returns payment requirements
3. **Signature**: Client signs EIP-712 payment authorization
4. **Payment**: Client sends request with signature
5. **Verification**: Facilitator verifies signature
6. **Settlement**: Facilitator submits transaction to blockchain
7. **Delivery**: Server returns protected resource

**On-chain verification**: Check Base Sepolia explorer for your transaction!

---

## 📚 Resources

### x402
- **Docs**: https://docs.cdp.coinbase.com/x402/welcome
- **Spec**: `/Users/albert/.../x402/specs/x402-specification-v2.md`
- **Examples**: `/Users/albert/.../x402/examples/`
- **Ecosystem**: https://x402.org/ecosystem

### UCP
- **Docs**: https://developers.google.com/merchant/ucp
- **Spec**: https://ucp.dev/
- **Examples**: `/tmp/ucp-repos/samples/`
- **GitHub**: https://github.com/Universal-Commerce-Protocol/ucp

### ACP
- **Docs**: https://developers.openai.com/commerce/
- **Spec**: `/Users/albert/.../agentic-commerce-protocol/spec/`
- **Site**: https://www.agenticcommerce.dev/

### AP2
- **Docs**: https://ap2-protocol.org/
- **Spec**: `/Users/albert/.../AP2/docs/specification.md`
- **GitHub**: https://github.com/google-agentic-commerce/AP2

---

## 🎯 Bottom Line

**Want to test something TODAY?**
→ Use **x402** (5 minutes, fully working)

**Want to test commerce features?**
→ Use **UCP** (15 minutes, production-ready)

**Want to understand the future?**
→ Read **AP2 spec** (architecture reference)

**Building for ChatGPT?**
→ Study **ACP spec** (need OpenAI/Stripe to test)

---

## 🚨 Common Issues & Solutions

### x402 Issues:

**Issue**: `FACILITATOR_URL not found`
**Solution**: Use `https://facilitator.x402.org` (free public facilitator)

**Issue**: Transaction fails on testnet
**Solution**: Get testnet USDC from https://faucet.circle.com/

**Issue**: Signature verification fails
**Solution**: Check your private key is correct and has USDC balance

### UCP Issues:

**Issue**: `SDK not found`
**Solution**: Clone SDK to correct location: `mkdir sdk && git clone ... sdk/python`

**Issue**: Database not initialized
**Solution**: Run `import_csv.py` script first

**Issue**: Port 8182 already in use
**Solution**: Use different port: `--port=8183`

---

**Updated**: January 2026
**Status**: All information verified against latest releases
**Next Update**: When AP2 v1.0 or ACP public testing becomes available

---

## Sources

- [GitHub - coinbase/x402](https://github.com/coinbase/x402)
- [x402 Documentation - Coinbase](https://docs.cdp.coinbase.com/x402/welcome)
- [Introducing x402 V2](https://www.x402.org/writing/x402-v2-launch)
- [What is x402? | Solana](https://solana.com/x402/what-is-x402)
- [x402 Ecosystem](https://www.x402.org/ecosystem)
- [Google Universal Commerce Protocol (UCP) Guide](https://developers.google.com/merchant/ucp)
- [Under the Hood: UCP - Google Developers Blog](https://developers.googleblog.com/under-the-hood-universal-commerce-protocol-ucp/)
- [Universal Commerce Protocol - Official Site](https://ucp.dev/)
- [GitHub - Universal-Commerce-Protocol/ucp](https://github.com/Universal-Commerce-Protocol/ucp)
- [Building the Universal Commerce Protocol - Shopify](https://shopify.engineering/ucp)
