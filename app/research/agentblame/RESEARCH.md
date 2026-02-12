# AgentBlame: AI Code Attribution Tracking System

## Overview

AgentBlame is an open-source tool developed by [Mesa.dev](https://mesa.dev) that tracks AI-generated code in Git repositories. It answers the question: **"Which lines were written by AI, and which were written by humans?"**

The system consists of:
1. **CLI Tool** (`@mesadev/agentblame`) - Captures AI edits, processes commits, displays attribution
2. **Chrome Extension** - Shows AI attribution markers directly on GitHub PRs
3. **GitHub Actions Workflow** - Preserves attribution through squash/rebase merges

---

## Architecture

### High-Level Flow

**Capture → Store → Match → Display**

1. AI editor makes code changes
2. Hook captures edits → SQLite database
3. Git commit triggers matching
4. Attribution stored in git notes
5. CLI/Chrome extension displays markers

### Phase 1: Capture

**Trigger:** Editor hooks intercept AI edits

- Cursor: `.cursor/hooks.json` → `afterFileEdit`
- Claude: `.claude/settings.json` → `PostToolUse`

**Actions:**
- Extract only added lines (via diff)
- Compute SHA256 hash per line
- Store in `.agentblame/agentblame.db`

### Phase 2: Process

**Trigger:** `.git/hooks/post-commit`

**Matching strategies (by priority):**

| Strategy | Confidence |
|----------|------------|
| Exact hash match | 1.0 |
| Normalized (no whitespace) | 0.95 |
| Line contained in AI edit | 0.9 |
| AI edit contained in line | 0.85 |

**Output:** JSON note attached to commit

```json
{
  "path": "src/auth.ts",
  "start_line": 10,
  "end_line": 25,
  "provider": "cursor",
  "confidence": 1.0
}
```

### Phase 3: Visualization

**CLI:**
```
$ agentblame blame src/auth.ts
abc1234 ✨ Cursor │ 10 │ code...
AI: 45% | Human: 55%
```

**Chrome Extension:**
- Runs on GitHub PR "Files Changed"
- Fetches notes via GitHub API
- Injects ✨ markers on AI lines
- Shows % badge per file

### Phase 4: Preservation

**Trigger:** GitHub Actions on PR merge

**Problem:** Squash/rebase creates new commits, losing notes.

**Solution:**
- Detect merge type (squash vs rebase)
- Collect attributions from original commits
- Match content to new commit(s)
- Reattach notes with updated line numbers

---

## Deep Dive: Why Git Notes?

Git notes are the **key architectural decision** that makes AgentBlame work. Understanding why they chose this approach reveals elegant solutions to hard problems.

### The Problem

How do you attach metadata to commits **without changing them**?

Commits are immutable. Their SHA hash is computed from:
- Tree (file contents)
- Parent commit(s)
- Author/committer info
- Commit message

Change any of these → different SHA → breaks history.

### Why Not These Alternatives?

| Approach | Problem |
|----------|---------|
| Modify commit message | Changes SHA, breaks history |
| Trailer lines (`Co-authored-by:`) | Must be added at commit time |
| Separate database | Not portable, no git integration |
| Branch with metadata files | Clutters repo, merge conflicts |
| Git attributes | Per-file only, not per-line |

### How Git Notes Work

Notes are stored as a **separate ref** (`refs/notes/*`) that doesn't affect commit SHAs.

**Internal structure:**
```
refs/notes/agentblame
    └── commit (tree)
            └── ab/
                └── cdef1234... (blob) → your JSON data
```

The filename IS the commit SHA being annotated. Content is arbitrary (AgentBlame uses JSON).

**Key insight:** Notes are just another git object graph, completely decoupled from your main history.

### Why This Is Perfect for AgentBlame

1. **Non-destructive** - Add attribution anytime, even to old commits
2. **Portable** - Travels with repo via `git push/fetch`
3. **No merge conflicts** - Separate namespace from code
4. **Works with signed commits** - Doesn't invalidate signatures
5. **GitHub API accessible** - Chrome extension can read via REST API
6. **Survives rebase/amend** - Notes reference SHA, not position

### The Squash/Rebase Challenge

**Problem:** When you squash-merge a PR:
- Original commits (with notes) → deleted
- New squash commit (no notes) → created

**Solution:** GitHub Actions workflow:
1. Before merge: read notes from original commits
2. After merge: match content hashes to new commit
3. Reattach notes to new SHA

This is why AgentBlame stores `content_hash` in notes - it enables re-matching after history rewrites.

### How AgentBlame Uses Notes

**Writing (CLI):**
```bash
git notes --ref=refs/notes/agentblame add -f -m '{"attributions":[...]}' <sha>
```

**Reading (CLI):**
```bash
git notes --ref=refs/notes/agentblame show <sha>
```

**Reading (GitHub API):**
1. `GET /repos/:owner/:repo/git/refs/notes/agentblame` → get tree SHA
2. `GET /repos/:owner/:repo/git/trees/:sha?recursive=1` → list all note files
3. Find file named `ab/cdef...` (commit SHA with `/` after 2 chars)
4. `GET /repos/:owner/:repo/git/blobs/:sha` → get note content (base64)

**Syncing:**
```bash
# Push notes to remote
git push origin refs/notes/agentblame

# Fetch notes from remote
git fetch origin refs/notes/agentblame:refs/notes/agentblame
```

Notes are **not pushed/fetched by default** - requires explicit refspec.

### Custom Namespace

AgentBlame uses `refs/notes/agentblame` instead of the default `refs/notes/commits`.

Benefits:
- Doesn't conflict with other note systems
- Clear ownership/purpose
- Can have multiple note namespaces per repo

> **References:**
> - [Git Notes Documentation](https://git-scm.com/docs/git-notes)
> - [Git Notes Unraveled - DEV](https://dev.to/shrsv/git-notes-unraveled-history-mechanics-and-practical-uses-25i9)
> - [Tyler Cipriani - Git's Coolest Feature](https://tylercipriani.com/blog/2022/11/19/git-notes-gits-coolest-most-unloved-feature/)
> - AgentBlame implementation: `packages/cli/src/lib/git/gitNotes.ts`

---

## Key Technical Details

### 1. Hook Integration

**Cursor Editor** (`.cursor/hooks.json`):
```json
{
  "version": 1,
  "hooks": {
    "afterFileEdit": [
      { "command": "bunx @mesadev/agentblame capture --provider cursor --event afterFileEdit" }
    ]
  }
}
```

**Claude Code** (`.claude/settings.json`):
```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|Write|MultiEdit",
      "hooks": [{ "type": "command", "command": "bunx @mesadev/agentblame capture --provider claude" }]
    }]
  }
}
```

The hooks receive JSON payloads containing:
- `file_path` - The file being edited
- `old_string` / `new_string` - For Edit operations
- `content` - For Write operations (new files)
- `model` - The AI model used (when available)

> **Reference:** `packages/cli/src/lib/hooks.ts:27-164`

### 2. Line-Level Hashing Strategy

The capture system computes two hashes per line:
1. **Exact hash**: `sha256(line_content)` - for precise matching
2. **Normalized hash**: `sha256(line_content.replace(/\s+/g, ""))` - for whitespace-tolerant matching

When a commit is processed, the matching cascade:
| Strategy | Match Type | Confidence | Description |
|----------|-----------|------------|-------------|
| 1 | `exact_hash` | 1.0 | Line hash matches exactly |
| 2 | `normalized_hash` | 0.95 | Whitespace-normalized hash matches |
| 3 | `line_in_ai_content` | 0.9 | Committed line found within AI edit content |
| 4 | `ai_content_in_line` | 0.85 | AI edit content found within committed line |
| 5 | `move_detected` | 0.85 | Line moved from AI-attributed location |

> **Reference:** `packages/cli/src/lib/database.ts:451-470` and `packages/cli/src/capture.ts:69-138`

### 3. SQLite Database Schema

```sql
-- Main edits table (one row per AI edit operation)
CREATE TABLE edits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    provider TEXT NOT NULL,           -- 'cursor' | 'claude_code'
    file_path TEXT NOT NULL,
    model TEXT,                       -- e.g., 'claude-3.5-sonnet'
    content TEXT NOT NULL,
    content_hash TEXT NOT NULL,
    content_hash_normalized TEXT NOT NULL,
    edit_type TEXT NOT NULL,          -- 'addition' | 'modification' | 'replacement'
    old_content TEXT,
    status TEXT DEFAULT 'pending',    -- 'pending' | 'matched'
    matched_commit TEXT,
    matched_at TEXT
);

-- Lines table (one row per line in an edit)
CREATE TABLE lines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    edit_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    hash TEXT NOT NULL,
    hash_normalized TEXT NOT NULL,
    FOREIGN KEY (edit_id) REFERENCES edits(id) ON DELETE CASCADE
);

-- Indexes for O(log n) lookups
CREATE INDEX idx_lines_hash ON lines(hash);
CREATE INDEX idx_lines_hash_normalized ON lines(hash_normalized);
CREATE INDEX idx_edits_status ON edits(status);
CREATE INDEX idx_edits_file_path ON edits(file_path);
```

> **Reference:** `packages/cli/src/lib/database.ts:52-86`

### 4. Git Notes Storage Format

Attribution data is stored in `refs/notes/agentblame`:

```json
{
  "version": 1,
  "timestamp": "2025-01-19T12:00:00.000Z",
  "attributions": [
    {
      "path": "src/components/Button.tsx",
      "start_line": 15,
      "end_line": 42,
      "category": "ai_generated",
      "provider": "cursor",
      "model": "claude-3.5-sonnet",
      "confidence": 1.0,
      "match_type": "exact_hash",
      "content_hash": "sha256:abc123..."
    }
  ]
}
```

Git notes are stored separately from commit content and can be:
- Fetched: `git fetch origin refs/notes/agentblame:refs/notes/agentblame`
- Pushed: `git push origin refs/notes/agentblame`
- Read: `git notes --ref=refs/notes/agentblame show <commit-sha>`

> **Reference:** `packages/cli/src/lib/git/gitNotes.ts`

### 5. Squash/Rebase Merge Handling

When PRs are squash-merged or rebased, the original commits (with their notes) are replaced. The GitHub Actions workflow handles this:

1. **Detects merge type** by checking parent count:
   - 2+ parents = merge commit (notes survive)
   - 1 parent + PR reference in message = squash
   - 1 parent without PR reference = rebase

2. **For squash merges**:
   - Collects all attributions from original PR commits
   - Gets diff of the squash commit
   - Matches by content hash or containment
   - Calculates new line numbers based on position in hunk
   - Writes combined note to squash commit

3. **For rebase merges**:
   - Same collection process
   - Processes each new commit individually
   - Transfers matching attributions to corresponding new commits

> **Reference:** `packages/cli/src/transfer-notes.ts`

### 6. Chrome Extension Architecture

The extension uses a content script that runs on `github.com/*/pull/*`:

1. **Initialization**: Check for stored GitHub token
2. **Page Processing**:
   - Extract PR context from URL
   - Fetch PR commits via GitHub API
   - For each commit, fetch note blob from `refs/notes/agentblame`
   - Build attribution map keyed by `path:lineNumber`
3. **DOM Manipulation**:
   - Find diff containers on "Files Changed" tab
   - Inject sparkle markers (✨) on AI-generated lines
   - Add percentage badges per file
   - Show PR summary with total AI vs human lines
4. **MutationObserver**: Handles dynamic content loading and tab switches

> **Reference:** `packages/chrome/src/content/content.ts` and `packages/chrome/src/lib/github-api.ts`

---

## Interesting Implementation Details

### Tab Completion Filtering
The system explicitly **ignores tab completions** (`afterTabFileEdit` events) because they fire as fragments that cannot be reliably matched to commits. Only full edits from Composer/Agent mode are tracked.

> **Reference:** `packages/cli/src/capture.ts:188-191`

### Diff-Based Extraction
Instead of storing the entire new content, AgentBlame extracts only the **added lines** by computing a diff between old and new content. This ensures accurate attribution even when humans make minor modifications to AI suggestions.

> **Reference:** `packages/cli/src/capture.ts:81-101`

### Move Detection
When code is moved (not just added), the system uses git's move detection (`-M` flag) to track attribution through file reorganization.

> **Reference:** `packages/cli/src/process.ts:43-61`

### Empty Line Handling
Empty/whitespace-only lines are skipped in both hashing and counting to avoid false matches and inflated statistics.

> **Reference:** `packages/cli/src/capture.ts:126-128` and `packages/cli/src/blame.ts:172-173`

---

## CLI Commands

| Command | Description |
|---------|-------------|
| `agentblame init` | Set up hooks, database, and GitHub Actions workflow |
| `agentblame clean` | Remove all AgentBlame configuration |
| `agentblame blame <file>` | Show AI attribution for a file |
| `agentblame blame --summary` | Show summary statistics only |
| `agentblame blame --json` | Output attribution as JSON |
| `agentblame status` | Show pending AI edits in database |
| `agentblame sync` | Manually transfer notes after squash/rebase |
| `agentblame prune` | Remove old entries from database |

---

## Roadmap (from README)

- Support for other coding agents (Opencode, VSCode/Copilot, Antigravity)
- Multi-browser extension support (Firefox, Safari)
- Support for JJ VCS
- Capture and store prompts/chain-of-thought for each edit

---

## File References

| File | Purpose |
|------|---------|
| `packages/cli/src/index.ts` | CLI entry point, command routing |
| `packages/cli/src/capture.ts` | Hook payload processing, line hashing |
| `packages/cli/src/process.ts` | Commit matching, note attachment |
| `packages/cli/src/blame.ts` | Git blame integration, output formatting |
| `packages/cli/src/sync.ts` | Local squash/rebase note transfer |
| `packages/cli/src/transfer-notes.ts` | GitHub Actions note transfer |
| `packages/cli/src/lib/database.ts` | SQLite operations, matching queries |
| `packages/cli/src/lib/hooks.ts` | Editor hook installation |
| `packages/cli/src/lib/types.ts` | TypeScript type definitions |
| `packages/cli/src/lib/git/gitNotes.ts` | Git notes read/write |
| `packages/cli/src/lib/git/gitDiff.ts` | Diff parsing, hunk extraction |
| `packages/chrome/src/content/content.ts` | Chrome extension content script |
| `packages/chrome/src/lib/github-api.ts` | GitHub API client for notes |
| `packages/chrome/src/content/github-dom.ts` | DOM manipulation for markers |
