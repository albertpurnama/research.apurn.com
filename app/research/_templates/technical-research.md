# Technical Research Template

Instructions for conducting deep technical research on open-source repositories and codebases.

---

## Setup

### 1. Create Research Folder

```bash
mkdir -p /research/<project-name>/.codebases
```

### 2. Clone Repository

```bash
cd /research/<project-name>/.codebases
git clone <repo-url> <repo-name>
```

### 3. Create Initial Files

Create these files in the research folder:

- `README.md` - Summary and reading order
- `RESEARCH.md` - Architecture overview
- `CLAUDE.md` - Codebase documentation

---

## File Structure

```
<project-name>/
├── README.md              # Summary + reading order
├── RESEARCH.md            # Architecture overview (start here)
├── <DEEP-DIVE>.md         # Optional deep dives on specific topics
├── CLAUDE.md              # Codebase docs, clone info, file refs
└── .codebases/
    └── <repo-name>/       # Cloned repository
```

---

## README.md Template

```markdown
# <Project> Research

<1-2 paragraph summary of what the project does and the key technical insight>

---

## Research Files

| File | Description |
|------|-------------|
| [RESEARCH.md](./RESEARCH.md) | Start here. Architecture overview |
| [<DEEP-DIVE>.md](./<DEEP-DIVE>.md) | Deep dive on <topic> |
| [CLAUDE.md](./CLAUDE.md) | Codebase documentation |
```

---

## RESEARCH.md Template

Structure the main research document as follows:

### 1. Overview
- What the project does (1-2 sentences)
- Key components (numbered list)

### 2. Architecture
- High-level flow (simple text, avoid complex ASCII diagrams)
- Break into phases if applicable
- Use tables for structured comparisons

### 3. Key Technical Decisions
- Why they chose this approach
- Alternatives considered and why rejected
- Trade-offs made

### 4. Implementation Details
- Code snippets with file references
- Database schemas if applicable
- API flows

### 5. File References
- Table mapping files to their purpose

---

## CLAUDE.md Template

```markdown
# <Project> Research - Codebase Documentation

## Cloned Repositories

### 1. <repo-name>
- **Repository URL:** <url>
- **Original Repository:** <url> (if forked)
- **Clone Location:** `.codebases/<repo-name>/`
- **Clone Date:** YYYY-MM-DD
- **Purpose:** <why this repo is relevant>
- **Key Files Referenced:**
  - `path/to/file.ts` - Description
  - `path/to/another.ts` - Description

## Directory Structure

<tree structure of research folder>
```

---

## Deep Dive Documents

Create separate `<TOPIC>-DEEP-DIVE.md` files for:

- Complex subsystems that need detailed explanation
- Interesting algorithms or data structures
- Integration patterns worth documenting

Structure:
1. **The Problem** - What challenge does this solve?
2. **The Solution** - How does it work?
3. **Implementation** - Code walkthrough with file references
4. **Data Flow** - Step-by-step flow diagram (text-based)
5. **Key Insights** - Non-obvious learnings

---

## Best Practices

### Diagrams
- Prefer simple text flows over ASCII box art
- ASCII diagrams break on mobile - use sparingly
- Good: `Capture → Store → Match → Display`
- Bad: Complex nested boxes with Unicode borders

### Code References
- Always include file path and line numbers
- Format: `packages/cli/src/lib/util.ts:25-35`
- Use code blocks with syntax highlighting

### Tables
- Use for comparisons, strategies, file references
- Keep columns narrow for mobile readability

### File Reference Tables
- Include at end of each document
- Map file paths to their purpose
- Order by reading importance, not alphabetically

---

## Checklist

- [ ] README.md with summary and reading order
- [ ] RESEARCH.md with architecture overview
- [ ] CLAUDE.md with clone info and file refs
- [ ] Deep dive docs for complex topics
- [ ] All diagrams render on mobile
- [ ] Code references include file paths
- [ ] File reference tables in each doc
- [ ] Root CLAUDE.md updated with new project
