# Greg Brockman AI Attribution Research - Codebase Documentation

**Research Project:** How Would Greg Brockman Solve Attribution for AI Recommendations?
**Created:** January 18, 2026
**Location:** `/research/greg-brockman-ai-attribution/`

## Purpose

This research explores how Greg Brockman, OpenAI's President and technical architect behind reasoning models like o1, o3, and o4-mini, would approach solving the attribution problem for AI recommendations. The research is particularly relevant to The Prompting Company's business model of helping products get mentioned in ChatGPT through Generative Engine Optimization (GEO).

## Research Scope

### Key Questions
1. How does Greg Brockman's technical philosophy inform attribution design?
2. What attribution features are already implemented in OpenAI's o3/o4-mini models?
3. How would Brockman's approach solve the attribution crisis in AI recommendations?
4. How does this apply to The Prompting Company's business model?

### Methodology
- Web research on Greg Brockman's public statements and technical approaches
- Analysis of OpenAI's citation/attribution features in latest models
- Review of academic research on LLM attribution
- Synthesis of how these principles apply to commercial AI recommendation attribution

## Cloned Repositories

Currently, this research does not require cloned repositories. All research is based on:
- Public web sources
- OpenAI technical documentation
- Academic papers on arXiv
- News articles and interviews

If future deep technical analysis is needed, potential repositories to clone into `.codebases/`:
- OpenAI API examples (if publicly available)
- LLM attribution research implementations
- The Prompting Company related tools (if open source)

## Key Findings

1. **Native Attribution Architecture**: OpenAI's o3/o4-mini models have built-in `url_citation` objects and dual-layer attribution (inline citations + complete source lists)

2. **Reinforcement Learning Approach**: Models trained with RL to "think hard" about problems, which naturally extends to thinking about attribution

3. **Infrastructure-First**: Brockman's focus on compute and infrastructure suggests attribution should be a first-class API concern, not an afterthought

4. **Application to GEO**: The Prompting Company could leverage native attribution APIs to provide clients with attribution analytics for AI recommendations

## Files Structure

```
greg-brockman-ai-attribution/
├── CLAUDE.md (this file)
├── README.md (main research document)
└── .codebases/ (reserved for future repository clones)
```

## Future Research Directions

1. **Technical Implementation**: Deep dive into o3/o4-mini attribution API implementation
2. **Attribution Graph Mapping**: Visualize how influence flows through multi-source recommendations
3. **Competitive Analysis**: How products compete for attribution in the same recommendation
4. **Economic Models**: Should attributed sources receive compensation?
5. **Privacy Considerations**: Balancing attribution transparency with user privacy

## Related Research

This research complements:
- **chatgpt-ads**: Research on advertising models in ChatGPT
- **ucp-ap2-acp-x402**: Research on payment and commerce protocols

The attribution problem is fundamental to monetizing AI recommendations, making this research relevant to both advertising models and payment systems for AI-mediated commerce.
