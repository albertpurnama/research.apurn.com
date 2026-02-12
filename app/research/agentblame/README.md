# AgentBlame Research

Research into [AgentBlame](https://github.com/mesa-dot-dev/agentblame), an open-source tool that tracks AI-generated code in Git repositories. It answers the question: **"Which lines were written by AI, and which were written by humans?"**

The system uses a clever combination of editor hooks, content hashing, and Git notes to capture AI edits at write-time, match them to commits, and display attribution in both CLI and browser. The most interesting technical decision is using Git notes (`refs/notes/agentblame`) as a metadata layer that doesn't modify commit history—enabling attribution to survive squash merges and rebases through content-hash matching.

---

## Research Files

| File | Description |
|------|-------------|
| [RESEARCH.md](./RESEARCH.md) | Start here. Architecture overview, high-level flow, and why Git notes were chosen |
| [GIT-NOTES-DEEP-DIVE.md](./GIT-NOTES-DEEP-DIVE.md) | Technical deep dive into content hashing, the 4-strategy matching system, and note transfer mechanics |
| [CLAUDE.md](./CLAUDE.md) | Codebase documentation with clone info and key file references |
