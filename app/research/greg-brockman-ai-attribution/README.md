# How Would Greg Brockman Solve Attribution for AI Recommendations?

**Research Date:** January 18, 2026
**Context:** The Prompting Company & AI Recommendation Attribution
**Author:** Research on promptingcompany.com business model

## Executive Summary

As AI agents increasingly mediate product discovery and recommendations, attribution—crediting the sources that influenced an AI's recommendation—has become a critical challenge. This research explores how Greg Brockman, OpenAI's President and technical architect behind reasoning models like o1, o3, and o4-mini, might approach solving attribution for AI recommendations based on his demonstrated technical philosophy and OpenAI's implemented solutions.

## The Attribution Problem

### Current State (2026)

The attribution crisis in AI recommendations stems from several fundamental challenges:

1. **Invisible Influence**: When AI assistants recommend products, users often purchase without clicking trackable links or viewing tagged advertisements. The influence occurs invisibly to standard analytics. ([Brandlight AI](https://www.brandlight.ai/blog/attribution-is-dead-the-invisible-influence-of-ai-generated-brand-recommendations))

2. **Source Synthesis Complexity**: An AI's recommendation is typically synthesized from information gathered from multiple sources—reviews, product pages, articles, forum discussions. The fundamental challenge of attributing influence back to the original sources remains. ([Brandlight AI](https://www.brandlight.ai/blog/attribution-is-dead-the-invisible-influence-of-ai-generated-brand-recommendations))

3. **Lack of Standards**: Currently, there's no universal standard for AI platforms to signal referrals, and reliable, standardized AI source attribution is largely non-existent today. ([Brandlight AI](https://www.brandlight.ai/blog/attribution-is-dead-the-invisible-influence-of-ai-generated-brand-recommendations))

4. **Hidden Traffic**: Many AI clicks show up as organic or direct traffic, obscuring the true source in analytics tools. ([Birdeye](https://birdeye.com/blog/ai-search-attribution/))

## Greg Brockman's Technical Philosophy

### Core Principles from OpenAI's Reasoning Models

Greg Brockman's approach to building AI systems reveals several key principles:

1. **Transparency Through Chain of Thought**: Brockman emphasized that "faithful chains of thought make models interpretable by letting you 'read the model's mind' in plain English." ([OpenAI Community](https://community.openai.com/t/extract-source-citations-api/1119960))

2. **Reinforcement Learning for Reasoning**: o1 was "our first model trained with reinforcement learning to think hard about problems before answering." ([X/Twitter](https://x.com/gdb/status/1834295775674990676))

3. **Paradigm Shifts Over Incremental Improvements**: Brockman called o3 a "breakthrough" representing a "new paradigm with vast opportunity." ([Benzinga](https://www.benzinga.com/tech/24/12/42633947/chatgpt-maker-openai-drops-o3-reasoning-model-as-o1s-successor-greg-brockman-calls-it-a-breakthrough))

4. **Infrastructure-First Thinking**: Brockman focuses on compute as the key bottleneck, stating that "enterprise AI is going to be a huge theme of 2026." ([X/Twitter](https://x.com/gdb/status/1999416686446019049))

## How Brockman Would Solve AI Recommendation Attribution

### 1. Built-In Citation Architecture (Already Implemented)

OpenAI's o3 and o4-mini models demonstrate Brockman's approach to attribution:

**Technical Implementation:**
- **Inline Citations**: Citations are included by default in the model's response with `url_citation` annotation objects containing the URL, title, and location of the cited source. ([OpenAI Platform Docs](https://platform.openai.com/docs/guides/tools-web-search))

- **Complete Source Lists**: Unlike inline citations which show only the most relevant references, the sources field returns the complete list of URLs the model consulted when forming its response, with the number of sources often greater than the number of citations. ([OpenAI Platform Docs](https://platform.openai.com/docs/guides/tools-web-search))

- **Deep Research with Citation-Rich Reports**: The Deep Research API is designed to take a high-level query and return a structured, citation-rich report by leveraging an agentic model capable of decomposing tasks, performing web searches, and synthesizing results. ([OpenAI Platform Docs](https://platform.openai.com/docs/guides/deep-research))

**Key Insight**: Brockman's solution bakes attribution directly into the model architecture rather than treating it as a post-processing step.

### 2. Reinforcement Learning for Attribution Quality

Based on o1's training methodology:

**Approach:**
- Train models with reinforcement learning to prioritize attribution quality as part of the reasoning process
- Reward models that provide comprehensive, accurate source attribution
- Penalize hallucinated or incomplete attribution

**Expected Outcome:**
- Models that "think hard" about which sources actually influenced their recommendations
- Natural tendency toward over-attribution rather than under-attribution, erring on the side of transparency

### 3. Agentic Tool Use for Multi-Source Attribution

The o3 and o4-mini models can "agentically use and combine every tool within ChatGPT—including searching the web, analyzing uploaded files, and reasoning about visual inputs—and are trained to reason about when and how to use tools." ([OpenAI o3 System Card](https://cdn.openai.com/pdf/2221c875-02dc-4789-800b-e7758f3722c1/o3-and-o4-mini-system-card.pdf))

**Attribution Application:**
- Models decompose recommendation tasks into sub-queries
- Each sub-query maintains its own attribution chain
- Final recommendation aggregates all source attributions with weighted influence scores

### 4. Structured Prompting Framework for Attribution

Brockman's four-pillar prompting framework ([Inc.com](https://www.inc.com/jessica-stillman/how-to-write-the-perfect-ai-prompt-according-to-openai-president-greg-brockman/91150209)) adapted for attribution:

1. **Goal**: "Recommend a product and attribute all sources that influenced the recommendation"
2. **Return Format**: Structured JSON with recommendation + attribution metadata
3. **Warnings**: "Do not recommend without clear source attribution. If uncertain about influence, include the source with a confidence score."
4. **Context Dump**: User preferences, browsing history, previous interactions

### 5. Infrastructure for Attribution at Scale

Given Brockman's focus on compute and infrastructure:

**System Design:**
- Real-time attribution logging as a first-class infrastructure concern
- Distributed attribution graph that tracks information flow across model layers
- API-level attribution endpoints that developers must use for recommendations

## The Prompting Company Connection

### How This Applies to promptingcompany.com's Business Model

[The Prompting Company](https://promptingcompany.com/) raised $6.5M to help products get mentioned in ChatGPT through GEO (generative engine optimization). ([TechCrunch](https://techcrunch.com/2025/10/30/the-prompting-company-snags-6-5m-to-help-products-get-mentioned-in-chatgpt-and-other-ai-apps/))

**Brockman's Solution Would Benefit Their Model:**

1. **Measurable Attribution**: Clients like Rippling, Rho, Motion, and Vapi could track exact attribution when AI recommends their products
2. **Citation URLs**: Products could optimize for appearing in the citation/sources list
3. **Influence Scoring**: Understand relative influence vs. competitors in recommendation decisions
4. **Attribution APIs**: Build dashboards showing AI recommendation attribution over time

### The Attribution Gap They're Solving

Current problem: Companies optimize to be mentioned in ChatGPT responses but have no way to track:
- How often they're recommended
- What sources influenced the recommendation
- Attribution credit back to their content/documentation
- ROI on GEO optimization efforts

**Brockman's Approach Would Enable:**
- Transparent attribution APIs showing when and how products are recommended
- Citation tracking for companies to see which of their resources AI agents reference
- Attribution analytics comparable to traditional web analytics

## Academic Research on LLM Attribution

Recent research validates Brockman's approach:

### Attribution Definition
"Attribution refers to the capacity of a model, such as an LLM, to generate and provide evidence, often in the form of references or citations, that substantiates the claims or statements it produces." ([arXiv Survey](https://arxiv.org/html/2311.03731v2))

### Key Challenges Identified:

1. **Evaluation Problem**: Verifying whether the generated statement is fully supported by the cited reference remains an open problem. ([arXiv](https://arxiv.org/abs/2305.06311))

2. **Over-Attribution Risk**: If LLMs give credit too often, users might get overwhelmed with too much information, confusing them and making it difficult to tell what is important and relevant. ([arXiv Survey](https://arxiv.org/html/2311.03731v2))

3. **Multi-Agent Credit Assignment**: Credit assignment—the process of attributing credit or blame to individual agents for their contributions—remains a fundamental challenge in multi-agent reinforcement learning. ([arXiv](https://arxiv.org/abs/2502.16863))

## Proposed Solution: The Brockman Attribution Framework

Synthesizing his demonstrated approach:

### Phase 1: Model Architecture (Already Implemented in o3/o4-mini)
- Native citation support with `url_citation` objects
- Dual-layer attribution: inline citations + complete source lists
- Chain-of-thought reasoning that exposes attribution logic

### Phase 2: Reinforcement Learning for Attribution Quality
- Train models to optimize for attribution accuracy as a reward signal
- Multi-agent credit assignment using LLM-guided frameworks
- Penalize recommendations without proper source attribution

### Phase 3: Infrastructure & APIs
- Attribution endpoints as first-class API primitives
- Real-time attribution logging and analytics
- Standardized attribution metadata format (JSON schema)

### Phase 4: Developer Ecosystem
- Attribution analytics dashboards (like Google Analytics for AI recommendations)
- Citation optimization tools for content creators
- Attribution verification and auditing systems

## Implementation for The Prompting Company

If The Prompting Company adopted Brockman's framework:

### For Their Clients (B2B SaaS Products)

```json
{
  "recommendation": {
    "product": "Rippling",
    "confidence": 0.92,
    "reasoning": "Based on the query for payroll software for 50-employee startup...",
    "attribution": {
      "primary_sources": [
        {
          "url": "https://rippling.com/docs/payroll-api",
          "influence_score": 0.45,
          "citation_type": "product_documentation",
          "relevance": "API capabilities matched requirements"
        },
        {
          "url": "https://www.g2.com/products/rippling/reviews",
          "influence_score": 0.30,
          "citation_type": "user_reviews",
          "relevance": "Customer testimonials for similar company size"
        }
      ],
      "secondary_sources": [...],
      "total_sources_consulted": 15,
      "attribution_timestamp": "2026-01-18T10:30:00Z"
    }
  }
}
```

### Analytics Dashboard

Metrics The Prompting Company could provide:
- **Mention Volume**: Times product was recommended
- **Attribution Score**: Influence weight in recommendations
- **Source Performance**: Which content pieces drive recommendations
- **Competitive Attribution**: How often you're mentioned vs. competitors
- **Citation Quality**: Which sources provide strongest attribution

### Optimization Strategy

1. **Documentation Excellence**: Well-structured docs appear in primary_sources
2. **Citation-Optimized Content**: Content designed to be cited by AI
3. **Attribution Tracking**: Monitor which sources influence AI recommendations
4. **Feedback Loops**: Improve content based on attribution analytics

## Conclusion: The Brockman Approach

Greg Brockman would solve AI recommendation attribution through:

1. **Architecture-First**: Build attribution directly into model reasoning (already done with o3/o4-mini)
2. **Transparency**: Expose the full source list, not just top citations
3. **RL Optimization**: Train models to optimize for attribution quality
4. **Infrastructure**: Make attribution a first-class API concern
5. **Developer Tools**: Enable ecosystem to build on attribution primitives

**Key Differentiator**: Rather than treating attribution as an afterthought or separate tracking system, Brockman's approach makes it fundamental to how the model reasons about recommendations.

This aligns with his stated philosophy: models should "think hard about problems before answering" and provide "faithful chains of thought" that let you "read the model's mind."

For The Prompting Company, this means the future of GEO (generative engine optimization) isn't just about getting mentioned—it's about understanding and optimizing the attribution graph that connects content to recommendations.

## Future Research Directions

1. **Attribution Graph Analysis**: Map how influence flows through multi-source recommendations
2. **Competitive Attribution**: How products compete for attribution in the same recommendation
3. **Attribution Gaming**: How bad actors might manipulate attribution systems
4. **Privacy-Preserving Attribution**: Balancing transparency with user privacy
5. **Economic Models**: Should attributed sources receive compensation?

## Sources

### Greg Brockman & OpenAI Models
- [OpenAI's President Greg Brockman Reveals How to Write the Perfect Prompt | Fello AI](https://felloai.com/2025/02/openais-president-greg-brockman-reveals-how-to-write-the-perfect-prompt/)
- [How to Write the Perfect AI Prompt, According to OpenAI President Greg Brockman | Inc.com](https://www.inc.com/jessica-stillman/how-to-write-the-perfect-ai-prompt-according-to-openai-president-greg-brockman/91150209)
- [Greg Brockman on X: "enterprise AI is going to be a huge theme of 2026"](https://x.com/gdb/status/1999416686446019049)
- [Greg Brockman on X: "OpenAI o1 — our first model trained with reinforcement learning..."](https://x.com/gdb/status/1834295775674990676)
- [ChatGPT Maker OpenAI Drops o3 Reasoning Model | Benzinga](https://www.benzinga.com/tech/24/12/42633947/chatgpt-maker-openai-drops-o3-reasoning-model-as-o1s-successor-greg-brockman-calls-it-a-breakthrough)

### OpenAI Technical Documentation
- [Web search | OpenAI API](https://platform.openai.com/docs/guides/tools-web-search)
- [Deep research | OpenAI API](https://platform.openai.com/docs/guides/deep-research)
- [OpenAI o3 and o4-mini System Card](https://cdn.openai.com/pdf/2221c875-02dc-4789-800b-e7758f3722c1/o3-and-o4-mini-system-card.pdf)
- [Introducing OpenAI o3 and o4-mini](https://openai.com/index/introducing-o3-and-o4-mini/)
- [Extract source citations (API) - OpenAI Developer Community](https://community.openai.com/t/extract-source-citations-api/1119960)

### The Prompting Company
- [Be the product cited by LLMs | promptingcompany.com](https://promptingcompany.com/)
- [The Prompting Company snags $6.5M to help products get mentioned in ChatGPT | TechCrunch](https://techcrunch.com/2025/10/30/the-prompting-company-snags-6-5m-to-help-products-get-mentioned-in-chatgpt-and-other-ai-apps/)
- [The Prompting Company | Y Combinator](https://www.ycombinator.com/companies/the-prompting-company)

### Attribution Research
- [Attribution is Dead? The Invisible Influence of AI-Generated Brand Recommendations | Brandlight AI](https://www.brandlight.ai/blog/attribution-is-dead-the-invisible-influence-of-ai-generated-brand-recommendations)
- [AI search attribution: Tracking customer journey | Birdeye](https://birdeye.com/blog/ai-search-attribution/)
- [A Survey of Large Language Models Attribution | arXiv](https://arxiv.org/html/2311.03731v2)
- [Automatic Evaluation of Attribution by Large Language Models | arXiv](https://arxiv.org/abs/2305.06311)
- [Leveraging Large Language Models for Multi-Agent Credit Assignment | arXiv](https://arxiv.org/abs/2502.16863)
- [Speaking the Language of Teamwork: LLM-Guided Credit Assignment | arXiv](https://arxiv.org/abs/2502.03723)
- [GitHub - HITsz-TMG/awesome-llm-attributions](https://github.com/HITsz-TMG/awesome-llm-attributions)

---

**Research Note**: This analysis is based on Greg Brockman's publicly stated technical philosophy, OpenAI's implemented citation features in o3/o4-mini, and extrapolation of how these principles would apply to the AI recommendation attribution problem that The Prompting Company addresses.
