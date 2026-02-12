# Git Notes & Content Hashing: A Deep Dive

This document explores the core technical innovations in AgentBlame: using git notes for metadata storage and content hashing for attribution matching.

---

## Part 1: What is `content_hash`?

### The Core Idea

`content_hash` is a SHA256 hash of code content that serves as a **stable identifier** for attribution data. It's the key that allows AgentBlame to:

1. Match AI edits to committed code
2. Survive history rewrites (squash/rebase)
3. Re-associate attribution after merges

### How It's Computed

```typescript
// packages/cli/src/lib/util.ts:25-35

export function computeContentHash(content: string): string {
  return `sha256:${crypto.createHash("sha256").update(content).digest("hex")}`;
}

export function computeNormalizedHash(content: string): string {
  const normalized = content.replace(/\s+/g, "");
  return `sha256:${crypto.createHash("sha256").update(normalized).digest("hex")}`;
}
```

Two hashes are computed:
- **`content_hash`** - Exact hash of the content
- **`content_hash_normalized`** - Hash with all whitespace removed (formatter-tolerant)

### Where It's Used

**1. Capture Phase** - When AI edits are recorded

```typescript
// packages/cli/src/capture.ts:222-223
content_hash: computeHash(addedContent),
content_hash_normalized: computeNormalizedHash(addedContent),
```

**2. Database Storage** - Indexed for fast lookup

```sql
-- packages/cli/src/lib/database.ts:61-62,85
content_hash TEXT NOT NULL,
content_hash_normalized TEXT NOT NULL,

CREATE INDEX idx_edits_content_hash ON edits(content_hash);
```

**3. Diff Parsing** - When processing commits

```typescript
// packages/cli/src/lib/git/gitDiff.ts:103-104
content_hash: computeContentHash(content),
content_hash_normalized: computeNormalizedHash(content),
```

**4. Git Notes** - Stored with attribution for later matching

```typescript
// packages/cli/src/lib/git/gitNotes.ts:32
content_hash: a.content_hash,
```

**5. Note Transfer** - Used to match across squash/rebase

```typescript
// packages/cli/src/transfer-notes.ts:151-155
const hash = attr.content_hash;
if (!byHash.has(hash)) {
  byHash.set(hash, []);
}
byHash.get(hash)?.push(attr);
```

---

## Part 2: The Matching System

### The Four-Strategy Cascade

When a commit is processed, each line is matched against pending AI edits using a priority cascade:

```typescript
// packages/cli/src/lib/database.ts:451-470

export function findLineMatch(
  lineContent: string,
  lineHash: string,
  lineHashNormalized: string,
  filePath: string
): LineMatchResult | null {
  // Strategy 1: Exact hash
  let match = findByExactHash(lineHash, filePath);
  if (match) return match;

  // Strategy 2: Normalized hash
  match = findByNormalizedHash(lineHashNormalized, filePath);
  if (match) return match;

  // Strategy 3 & 4: Substring matching
  match = findBySubstring(lineContent, filePath);
  if (match) return match;

  return null;
}
```

| Strategy | Method | Confidence | Use Case |
|----------|--------|------------|----------|
| 1 | Exact hash | 1.0 | Identical code |
| 2 | Normalized hash | 0.95 | Formatter changed whitespace |
| 3 | Line in AI content | 0.9 | AI wrote larger block, human kept subset |
| 4 | AI in line | 0.85 | Human wrapped AI code in more code |

### Why Multiple Strategies?

Real-world scenarios where exact match fails:

1. **Formatter runs** - Prettier/ESLint changes indentation
2. **Partial acceptance** - Human accepts 5 of 10 suggested lines
3. **Minor edits** - Human tweaks AI suggestion before commit
4. **Code moves** - Refactoring moves AI code to new file

### Database Queries

**Strategy 1: Exact Hash** (O(log n) via index)

```sql
-- packages/cli/src/lib/database.ts:260-279
SELECT l.*, e.*
FROM lines l
JOIN edits e ON l.edit_id = e.id
WHERE l.hash = ?
  AND (e.file_path = ? OR e.file_path LIKE ? ...)
ORDER BY e.timestamp DESC
LIMIT 1
```

**Strategy 2: Normalized Hash** (O(log n) via index)

```sql
-- packages/cli/src/lib/database.ts:312-326
SELECT l.*, e.*
FROM lines l
JOIN edits e ON l.edit_id = e.id
WHERE l.hash_normalized = ?
  AND (e.file_path = ? OR ...)
ORDER BY e.timestamp DESC
LIMIT 1
```

**Strategy 3-4: Substring** (O(n) - only if hashes fail)

```typescript
// packages/cli/src/lib/database.ts:404-419
for (const edit of edits) {
  if (edit.content.includes(normalizedLine)) {
    return { matchType: "line_in_ai_content", confidence: 0.9 };
  }
}
```

---

## Part 3: Git Notes Architecture

### Why Git Notes?

| Requirement | Solution |
|-------------|----------|
| Don't change commit SHAs | Notes are separate refs |
| Portable across machines | Stored in git, push/fetch |
| Accessible via GitHub API | Yes, through refs/blobs endpoints |
| Don't conflict with code | Separate namespace |
| Work with signed commits | Notes don't invalidate signatures |

### Internal Structure

```
.git/
├── refs/
│   ├── heads/
│   │   └── main           → commit SHA
│   └── notes/
│       └── agentblame     → commit SHA (notes commit)

# The notes commit contains a tree:
notes-commit
└── tree
    ├── ab/
    │   └── cdef1234...    → blob (JSON attribution)
    └── 12/
        └── 3456789a...    → blob (JSON attribution)
```

The **filename** is the commit SHA being annotated (split as `ab/cdef...` for performance).

### The Notes Lifecycle

**1. Creation** (post-commit hook)

```typescript
// packages/cli/src/lib/git/gitNotes.ts:15-45
export async function attachNote(
  repoRoot: string,
  sha: string,
  attributions: RangeAttribution[]
): Promise<boolean> {
  const note: GitNotesAttribution = {
    version: 1,
    timestamp: new Date().toISOString(),
    attributions: attributions.map((a) => ({
      path: a.path,
      start_line: a.start_line,
      end_line: a.end_line,
      category: "ai_generated",
      provider: a.provider,
      model: a.model,
      confidence: a.confidence,
      match_type: a.match_type,
      content_hash: a.content_hash,  // ← Critical for transfers
    })),
  };

  const noteJson = JSON.stringify(note);

  // Git command: notes --ref=refs/notes/agentblame add -f -m <json> <sha>
  const result = await runGit(repoRoot, [
    "notes", `--ref=${NOTES_REF}`, "add", "-f", "-m", noteJson, sha
  ]);

  return result.exitCode === 0;
}
```

**2. Reading** (CLI blame command)

```typescript
// packages/cli/src/lib/git/gitNotes.ts:50-67
export async function readNote(
  repoRoot: string,
  sha: string
): Promise<GitNotesAttribution | null> {
  const result = await runGit(repoRoot, [
    "notes", `--ref=${NOTES_REF}`, "show", sha
  ]);

  if (result.exitCode !== 0) return null;

  return JSON.parse(result.stdout.trim());
}
```

**3. Syncing** (push/fetch)

```typescript
// packages/cli/src/lib/git/gitNotes.ts:72-93
export async function pushNotes(repoRoot, remote = "origin") {
  return runGit(repoRoot, ["push", remote, NOTES_REF]);
}

export async function fetchNotes(repoRoot, remote = "origin") {
  return runGit(repoRoot, [
    "fetch", remote, `${NOTES_REF}:${NOTES_REF}`
  ]);
}
```

**Key insight:** Notes don't push/fetch automatically. AgentBlame's post-commit hook does:
```bash
git push origin refs/notes/agentblame:refs/notes/agentblame
```

---

## Part 4: Surviving Squash/Rebase

### The Problem

```
Feature Branch:          main after squash:
A ← B ← C                A ← S (squash commit)
│   │   │                    │
note note note               no notes!
```

When you squash-merge:
- Original commits A, B, C are **deleted**
- New commit S is created with combined changes
- Notes attached to A, B, C are **orphaned**

### The Solution: Content Hash Matching

**Step 1: Collect attributions from PR commits**

```typescript
// packages/cli/src/transfer-notes.ts:132-166
function collectPRAttributions(prCommits: string[]): {
  byHash: Map<string, NoteAttribution[]>;
  withContent: AttributionWithContent[];
} {
  const byHash = new Map<string, NoteAttribution[]>();

  for (const sha of prCommits) {
    const note = readNote(sha);
    if (!note?.attributions) continue;

    for (const attr of note.attributions) {
      const hash = attr.content_hash;  // ← The stable identifier
      if (!byHash.has(hash)) {
        byHash.set(hash, []);
      }
      byHash.get(hash)?.push(attr);
    }
  }

  return { byHash, withContent };
}
```

**Step 2: Get hunks from squash commit**

```typescript
// packages/cli/src/transfer-notes.ts:369-370
const hunks = getCommitHunks(MERGE_SHA);
```

**Step 3: Match by content hash**

```typescript
// packages/cli/src/transfer-notes.ts:376-403
for (const hunk of hunks) {
  // Try exact hash match first
  const attrs = byHash.get(hunk.contentHash);
  if (attrs && attrs.length > 0) {
    newAttributions.push({
      ...attrs[0],
      path: hunk.path,
      start_line: hunk.startLine,
      end_line: hunk.endLine,
    });
    continue;
  }

  // Fallback: containment matching
  const containedMatches = findContainedAttributions(hunk, unmatchedAttrs);
  for (const match of containedMatches) {
    newAttributions.push(match);
  }
}
```

**Step 4: Write new note to squash commit**

```typescript
// packages/cli/src/transfer-notes.ts:412-421
const note: GitNotesAttribution = {
  version: 1,
  timestamp: new Date().toISOString(),
  attributions: newAttributions,
};

writeNote(MERGE_SHA, note);
```

### Containment Matching

When exact hash fails (code was modified), check if AI content is **contained within** the larger hunk:

```typescript
// packages/cli/src/transfer-notes.ts:296-347
function findContainedAttributions(
  hunk: { path: string; startLine: number; content: string },
  attributions: AttributionWithContent[],
): NoteAttribution[] {
  const results: NoteAttribution[] = [];

  for (const attr of attributions) {
    // Check if AI content is contained in the hunk
    const aiContent = attr.originalContent.trim();
    const hunkContent = hunk.content;

    if (!hunkContent.includes(aiContent)) continue;

    // Calculate precise line numbers
    const offset = hunkContent.indexOf(aiContent);
    let startLine = hunk.startLine;

    if (offset > 0) {
      const contentBeforeAI = hunkContent.slice(0, offset);
      const linesBeforeAI = contentBeforeAI.split("\n").length - 1;
      startLine = hunk.startLine + linesBeforeAI;
    }

    const aiLineCount = aiContent.split("\n").length;
    const endLine = startLine + aiLineCount - 1;

    results.push({
      ...attr,
      path: hunk.path,
      start_line: startLine,
      end_line: endLine,
    });
  }

  return results;
}
```

---

## Part 5: Reading Notes via GitHub API

The Chrome extension can't run `git` commands, so it reads notes via GitHub's REST API:

```typescript
// packages/chrome/src/lib/github-api.ts:111-135

// Step 1: Get the notes ref
private async getNotesTreeSha(owner, repo): Promise<string | null> {
  const ref = await this.fetch<GitRef>(
    `/repos/${owner}/${repo}/git/refs/notes/agentblame`
  );

  // The ref points to a commit, we need its tree
  if (ref.object.type === "commit") {
    const commit = await this.fetch(
      `/repos/${owner}/${repo}/git/commits/${ref.object.sha}`
    );
    return commit?.tree.sha;
  }

  return ref.object.sha;
}
```

```typescript
// Step 2: Get the tree (list of all notes)
// packages/chrome/src/lib/github-api.ts:140-148
private async getNotesTree(owner, repo, treeSha) {
  return this.fetch<GitTree>(
    `/repos/${owner}/${repo}/git/trees/${treeSha}?recursive=1`
  );
}
```

```typescript
// Step 3: Find note for specific commit
// packages/chrome/src/lib/github-api.ts:188-207
private findNoteBlobSha(tree: GitTree, commitSha: string): string | null {
  // Try full SHA as path
  let entry = tree.tree.find((e) => e.path === commitSha);
  if (entry) return entry.sha;

  // Try split format (first 2 chars / rest)
  const splitPath = `${commitSha.slice(0, 2)}/${commitSha.slice(2)}`;
  entry = tree.tree.find((e) => e.path === splitPath);
  if (entry) return entry.sha;

  return null;
}
```

```typescript
// Step 4: Get blob content (base64 encoded)
// packages/chrome/src/lib/github-api.ts:153-170
private async getBlob(owner, repo, blobSha): Promise<string | null> {
  const blob = await this.fetch<GitBlob>(
    `/repos/${owner}/${repo}/git/blobs/${blobSha}`
  );

  // Decode base64 content
  if (blob.encoding === "base64") {
    return atob(blob.content.replace(/\n/g, ""));
  }

  return blob.content;
}
```

### API Call Sequence

```
1. GET /repos/:owner/:repo/git/refs/notes/agentblame
   → { ref: "refs/notes/agentblame", object: { sha: "abc123", type: "commit" } }

2. GET /repos/:owner/:repo/git/commits/abc123
   → { tree: { sha: "def456" } }

3. GET /repos/:owner/:repo/git/trees/def456?recursive=1
   → { tree: [
        { path: "ab/cdef1234...", sha: "ghi789", type: "blob" },
        { path: "12/3456789a...", sha: "jkl012", type: "blob" },
        ...
      ] }

4. GET /repos/:owner/:repo/git/blobs/ghi789
   → { content: "eyJ2ZXJzaW9uIjox...", encoding: "base64" }

5. atob(content) → '{"version":1,"attributions":[...]}'
```

---

## Part 6: The Complete Data Flow

```
┌──────────────────────────────────────────────────────────────┐
│                      CAPTURE                                  │
│                                                               │
│  AI Edit → capture.ts → computeHash() → SQLite               │
│                           │                                   │
│                    content_hash: "sha256:abc..."             │
│                    content_hash_normalized: "sha256:def..."  │
└──────────────────────────────────────────────────────────────┘
                              │
                        git commit
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                      PROCESS                                  │
│                                                               │
│  Commit → gitDiff.ts → parseDiff() → process.ts              │
│              │                           │                    │
│        computeContentHash()        findLineMatch()           │
│              │                           │                    │
│         hunk.content_hash    ←→   SQLite lookup by hash      │
│                                          │                    │
│                                    Match found?              │
│                                    ├─ Yes: LineAttribution   │
│                                    └─ No: Try next strategy  │
└──────────────────────────────────────────────────────────────┘
                              │
                        attachNote()
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    GIT NOTES                                  │
│                                                               │
│  refs/notes/agentblame                                       │
│  └── ab/cdef1234...                                          │
│      └── {                                                   │
│            "version": 1,                                     │
│            "attributions": [{                                │
│              "path": "src/auth.ts",                         │
│              "start_line": 10,                              │
│              "end_line": 25,                                │
│              "content_hash": "sha256:abc..."  ← STABLE ID   │
│            }]                                                │
│          }                                                   │
└──────────────────────────────────────────────────────────────┘
                              │
                    PR squash/rebase merge
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    TRANSFER                                   │
│                                                               │
│  Old commits → collectPRAttributions() → byHash Map          │
│                       │                                       │
│              content_hash as key                             │
│                       │                                       │
│  New commit → getCommitHunks() → compute content_hash        │
│                       │                                       │
│              Match by hash or containment                    │
│                       │                                       │
│  writeNote(MERGE_SHA, newAttributions)                       │
└──────────────────────────────────────────────────────────────┘
                              │
                    CLI / Chrome Extension
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    DISPLAY                                    │
│                                                               │
│  CLI: git notes show <sha> → JSON → format output           │
│                                                               │
│  Chrome: GitHub API → refs/notes → tree → blob → JSON       │
│          → inject markers into DOM                           │
└──────────────────────────────────────────────────────────────┘
```

---

## Key Insights

1. **Content hash is the universal key** - It identifies code across commits, merges, and rebases

2. **Two-hash strategy handles formatters** - Exact for precision, normalized for tolerance

3. **Notes separate concerns** - Code history and attribution metadata are completely decoupled

4. **GitHub API enables web UI** - The same notes readable via REST enable the Chrome extension

5. **Containment matching is the safety net** - When hashes fail, substring matching catches partial matches

6. **Custom namespace prevents conflicts** - `refs/notes/agentblame` won't clash with other tools

---

## File Reference Index

| File | Purpose |
|------|---------|
| `lib/util.ts:25-35` | Hash computation functions |
| `lib/database.ts:61-85` | Schema with hash columns and indexes |
| `lib/database.ts:260-470` | Four-strategy matching cascade |
| `lib/git/gitDiff.ts:78-170` | Diff parsing with hash computation |
| `lib/git/gitNotes.ts` | Note CRUD operations |
| `capture.ts:222-223` | Hash computation on capture |
| `process.ts:99,160,180` | Hash stored in LineAttribution |
| `transfer-notes.ts:151-166` | Hash-based note collection |
| `transfer-notes.ts:376-403` | Hash-based matching after merge |
| `chrome/lib/github-api.ts:111-207` | API-based note reading |
