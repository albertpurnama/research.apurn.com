# Research Index: How Would Greg Brockman Solve Attribution for AI Recommendations?

**Created:** January 18, 2026
**Research Question:** How would Greg Brockman approach solving the attribution problem for AI recommendations, specifically in context of The Prompting Company's business model?

## Overview

This research explores how Greg Brockman, OpenAI's President and architect behind the o1, o3, and o4-mini reasoning models, would solve the critical attribution crisis in AI recommendations. As AI agents increasingly mediate product discovery, companies have no way to track or measure the influence of their content on AI recommendations.

**Key Insight:** Brockman's solution is already partially implemented in OpenAI's o3/o4-mini models through native citation APIs, providing a foundation for building attribution analytics platforms.

## Research Documents

### 1. [README.md](./README.md) - Main Research Report
**Length:** 266 lines | **Read Time:** 15-20 minutes

**Purpose:** Comprehensive analysis of Greg Brockman's technical philosophy and how it applies to AI attribution

**Key Sections:**
- The Attribution Problem (current state in 2026)
- Greg Brockman's Technical Philosophy
- How Brockman Would Solve AI Recommendation Attribution
- The Prompting Company Connection
- Academic Research on LLM Attribution
- Proposed Solution: The Brockman Attribution Framework

**Best For:** Understanding the theoretical foundation and technical approach

---

### 2. [framework-diagram.md](./framework-diagram.md) - Visual Framework
**Length:** 375 lines | **Read Time:** 10-15 minutes

**Purpose:** Visual diagrams and architectural breakdowns of the attribution solution

**Key Sections:**
- Problem Statement (visual)
- Current Attribution Problems (flow diagram)
- The Brockman Solution: Multi-Layer Attribution
- Layer 1: Model Architecture (o3/o4-mini Implementation)
- Layer 2: Attribution API Response Structure
- Layer 3: Reinforcement Learning Training Loop
- Layer 4: The Prompting Company Integration
- End-to-End Attribution Flow
- Key Principles from Greg Brockman
- Comparison: Before vs After
- Implementation Timeline

**Best For:** Visual learners, technical architects, product designers

---

### 3. [prompting-company-action-plan.md](./prompting-company-action-plan.md) - Business Implementation
**Length:** 515 lines | **Read Time:** 20-25 minutes

**Purpose:** Actionable business plan for The Prompting Company to build an attribution analytics platform

**Key Sections:**
- Current State: The Attribution Gap
- Product Opportunity: Attribution Analytics Platform
- Implementation Roadmap (Phase 1-3)
- Pricing Strategy (3 tiers + add-ons)
- Competitive Moats
- Go-to-Market Strategy
- Success Metrics
- Risk Mitigation
- Technical Architecture

**Best For:** Business leaders, product managers, investors, entrepreneurs

---

### 4. [brockman-product-spec.md](./brockman-product-spec.md) - Complete Product Specification
**Length:** 1,200+ lines | **Read Time:** 45-60 minutes

**Purpose:** Detailed product specification showing exactly how Greg Brockman would build The Prompting Company's features based on his demonstrated philosophy at Stripe and OpenAI

**Key Sections:**
- The Brockman Philosophy Applied (Stripe CTO + OpenAI experience)
- Product Architecture - Platform over Verticals
- Feature Set - Launch Sequence (Weekend hack → 2-week MVP → Platform expansion)
- Developer Experience Features (Plain English errors, API versioning, copy-paste examples)
- Pricing Strategy (Pay-as-you-go, Stripe model)
- Go-to-Market Strategy (API-first developer community launch)
- Technical Implementation (2-week sprint breakdown)
- Full Working Code Examples

**Best For:** Product managers, engineers, founders building similar platforms, understanding execution strategy

---

### 5. [CLAUDE.md](./CLAUDE.md) - Project Documentation
**Length:** 71 lines | **Read Time:** 3-5 minutes

**Purpose:** Meta-documentation about the research project structure

**Best For:** Understanding research methodology and future directions

---

## Quick Start Guide

**If you have 5 minutes:**
Read the "Executive Summary" and "The Attribution Problem" sections in README.md

**If you have 15 minutes:**
Read framework-diagram.md for visual understanding of the solution

**If you have 30 minutes:**
Read README.md completely for full technical understanding

**If you have 1 hour:**
Read brockman-product-spec.md for complete execution strategy, or all three original documents for full context

**If you're building this (as Greg Brockman would):**
Start with brockman-product-spec.md → code the weekend hack → ship in 2 weeks

**If you're analyzing the approach:**
Start with prompting-company-action-plan.md → framework-diagram.md → README.md (reverse order)

## Key Findings Summary

### 1. Attribution is Already Built Into o3/o4-mini
OpenAI's latest models have native `url_citation` objects and complete source lists—the infrastructure for attribution already exists.

### 2. Brockman's Philosophy: Architecture-First
Rather than treating attribution as a post-processing step, Brockman builds it into the model's reasoning process through reinforcement learning.

### 3. The Prompting Company Has a Platform Opportunity
By building attribution analytics on top of OpenAI's citation APIs, TPC can transform from "getting mentioned" to "proving ROI."

### 4. First-Mover Advantage Window is Narrow
o3/o4-mini's citation APIs are brand new. Competitors will catch on quickly. 8-week MVP timeline recommended.

### 5. Data Network Effects Create Moat
More clients → better benchmarks → better competitive intelligence → more valuable for all clients.

## Citation-Rich Sources

All research is based on publicly available information:

### Primary Sources
- OpenAI technical documentation (o3/o4-mini system cards, API docs)
- Greg Brockman's public statements (X/Twitter, interviews)
- The Prompting Company public information (TechCrunch, YC profile)

### Secondary Sources
- Academic papers on LLM attribution (arXiv)
- Industry analysis on AI attribution crisis (Brandlight AI, Birdeye)
- Attribution research surveys (HITsz-TMG GitHub)

**Full bibliography:** See "Sources" section in README.md

## Research Methodology

1. **Web Research:** Comprehensive search on Greg Brockman's technical philosophy and OpenAI's attribution features
2. **Technical Analysis:** Deep dive into o3/o4-mini citation API documentation
3. **Academic Review:** Survey of recent LLM attribution research papers
4. **Business Synthesis:** Application to The Prompting Company's business model
5. **Framework Development:** Creation of actionable implementation plan

**No repositories cloned** - all research based on public web sources. See CLAUDE.md for potential future technical deep-dives.

## Related Research

This research complements other projects in the research directory:

- **chatgpt-ads:** How advertising might work in ChatGPT (attribution enables ad measurement)
- **ucp-ap2-acp-x402:** Commerce and payment protocols (attribution enables AI-driven commerce tracking)

## Future Research Directions

1. **Technical Implementation:** Hands-on prototype of attribution tracking system
2. **Attribution Graph Mapping:** Visual network analysis of source influence
3. **Economic Models:** Should attributed sources receive compensation?
4. **Privacy Analysis:** Balancing attribution transparency with user privacy
5. **Multi-Model Support:** Extending beyond OpenAI to Claude, Gemini, Perplexity

## Contact & Collaboration

This research was created for **The Prompting Company** (promptingcompany.com), founded by:
- Kevin Chandra
- Michelle Marcelline
- Albert Purnama

**Funding:** $6.5M seed round
**Customers:** Rippling, Rho, Motion, Vapi, Fondo, Kernel, Traceloop

---

## Document Change Log

- **2026-01-18:** Initial research creation
  - README.md: Main research document
  - framework-diagram.md: Visual framework
  - prompting-company-action-plan.md: Business implementation plan
  - CLAUDE.md: Project documentation
  - INDEX.md: This file

---

**Total Research Output:** 1,227 lines across 4 documents
**Research Time:** ~3 hours
**Sources Consulted:** 40+ web sources, 5+ academic papers, 10+ technical docs

---

## How to Use This Research

### For Technical Teams
1. Start with framework-diagram.md to understand the architecture
2. Read README.md for Brockman's technical philosophy
3. Reference OpenAI API docs linked in sources
4. Use technical architecture section in action plan for implementation

### For Business Teams
1. Start with prompting-company-action-plan.md executive summary
2. Review pricing strategy and go-to-market sections
3. Use framework-diagram.md to explain to stakeholders
4. Reference success metrics for goal setting

### For Investors
1. Read action plan's "Product Opportunity" section
2. Review competitive moats and risk mitigation
3. Check success metrics and financial projections
4. Use README.md for technical validation

### For Competitors
You're reading this because you're smart. The ideas are here. Execution is what matters.

We have:
- ✅ First-mover advantage (you're reading public research)
- ✅ Existing customer base (Rippling, Rho, Motion, etc.)
- ✅ $6.5M in funding
- ✅ Deep technical expertise
- ✅ 8-week head start

But the market is big enough for multiple players. Build something great.

---

**End of Index**
