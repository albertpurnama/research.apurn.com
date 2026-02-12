# Agent Payment Systems Research

## Purpose
Research into AI agent payment protocols: x402 (Coinbase), UCP (Google/Shopify), and ACP (OpenAI/Stripe). Analyzing core similarities, moving parts, third-party opportunities, and implications for the agentic commerce future.

## Cloned Repositories

### 1. x402 (Coinbase)
- **URL**: https://github.com/coinbase/x402
- **Location**: `.codebases/x402/`
- **Clone Date**: January 29, 2026
- **Purpose**: HTTP 402-based micropayment protocol for APIs and resources
- **Key Files**:
  - `/specs/x402-specification-v2.md` - Protocol specification
  - `/typescript/packages/core/src/` - Core implementation
  - `/specs/schemes/exact/` - Payment scheme specs
  - `/specs/transports-v2/` - Transport bindings (HTTP, MCP, A2A)

### 2. UCP - Universal Commerce Protocol (Google/Shopify Consortium)
- **URL**: https://github.com/Universal-Commerce-Protocol/ucp
- **Location**: `.codebases/ucp/`
- **Clone Date**: January 29, 2026
- **Purpose**: Full e-commerce lifecycle protocol for AI agents
- **Key Files**:
  - `/docs/specification/overview.md` - Complete protocol spec
  - `/docs/documentation/core-concepts.md` - Architecture overview
  - `/docs/specification/checkout.md` - Checkout capability
  - `/docs/specification/payment-handler-guide.md` - Payment integration

### 3. ACP - Agentic Commerce Protocol (OpenAI/Stripe)
- **URL**: https://github.com/agentic-commerce-protocol/agentic-commerce-protocol
- **Location**: `.codebases/acp/`
- **Clone Date**: January 29, 2026
- **Purpose**: Checkout automation protocol for AI agents
- **Key Files**:
  - Main specification and API definitions
  - Delegate Payment API spec
  - Webhook specifications

## Research Outputs

- `analysis.md` - Comprehensive analysis covering:
  - Protocol comparison matrix
  - Core similarities and shared abstractions
  - Moving parts analysis
  - Third-party opportunities
  - Future architecture implications
  - Orthogonal.sh relevance analysis

## Key Findings

1. **All three protocols share**: Separation of payment authorization from execution, constrained delegation, merchant sovereignty, transport agnosticism

2. **Different layers**: x402 (micropayments/API), UCP/ACP (full commerce)

3. **Different rails**: x402 (crypto), UCP/ACP (traditional PSPs)

4. **Third-party opportunities**: Facilitators (x402), gateways (UCP), policy engines (all)

5. **Orthogonal-like services**: Evolving from API aggregation to agent commerce infrastructure
