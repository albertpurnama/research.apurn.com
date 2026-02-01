---
title: LLM Prompting Techniques
---

# LLM Prompting Techniques

A comprehensive guide to effective prompting strategies for large language models.

## Basic Principles

> "The quality of your output is directly proportional to the quality of your input."

### Clarity
Be specific and unambiguous in your instructions. Avoid vague language that could be interpreted multiple ways.

### Context
Provide relevant background information that helps the model understand the task.

### Examples
Show, don't just tell. Few-shot examples dramatically improve output quality.

## Prompting Strategies

### 1. Zero-Shot Prompting
Direct instruction without examples:
```
Classify the following text as positive, negative, or neutral:
"The product exceeded my expectations!"
```

### 2. Few-Shot Prompting
Include examples to guide the response:
```
Classify sentiment:
"I love this!" -> Positive
"Terrible experience" -> Negative
"It's okay" -> Neutral
"The product exceeded my expectations!" -> ?
```

### 3. Chain-of-Thought (CoT)
Encourage step-by-step reasoning:
```
Solve this problem step by step:
If a train travels 120 miles in 2 hours, what is its average speed?

Let's think through this:
1. We need to find speed
2. Speed = Distance / Time
3. Distance = 120 miles
4. Time = 2 hours
5. Speed = 120 / 2 = 60 mph
```

### 4. Role Prompting
Assign a persona or expertise:
```
You are an expert data scientist with 20 years of experience.
Review this SQL query and suggest optimizations...
```

## Advanced Techniques

### Tree of Thoughts
Explore multiple reasoning paths simultaneously and evaluate which leads to better solutions.

### Self-Consistency
Generate multiple responses and select the most common answer for improved reliability.

### Prompt Chaining
Break complex tasks into smaller prompts, using the output of one as input to the next.

## Common Pitfalls

- ❌ Being too vague
- ❌ Assuming context that isn't provided
- ❌ Asking multiple unrelated questions at once
- ❌ Not specifying the desired output format

## Best Practices Checklist

- [ ] Clear objective stated upfront
- [ ] Relevant context provided
- [ ] Output format specified
- [ ] Examples included when helpful
- [ ] Constraints clearly defined

---

*References: OpenAI Cookbook, Anthropic Prompt Engineering Guide*
