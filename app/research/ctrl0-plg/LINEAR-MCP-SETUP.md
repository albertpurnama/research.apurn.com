# Linear MCP Setup Instructions

This guide explains how to configure the Linear MCP server and use it to create all 41 PostHog PLG analytics tasks.

---

## Prerequisites

1. **Linear Account**: You need a Linear account with admin access
2. **Linear API Key**: Generate from Linear Settings → API → Personal API keys
3. **Team Information**: Know your Linear team key (e.g., 'ENG', 'PRODUCT')

---

## Step 1: Configure Linear MCP Server

### Option A: Using Claude Desktop Config

Add Linear MCP server to your Claude Desktop config:

**Location:** `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS)

```json
{
  "mcpServers": {
    "linear": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-linear"
      ],
      "env": {
        "LINEAR_API_KEY": "lin_api_YOUR_API_KEY_HERE"
      }
    }
  }
}
```

### Option B: Using Environment Variable

Set your Linear API key as an environment variable:

```bash
export LINEAR_API_KEY="lin_api_YOUR_API_KEY_HERE"
```

---

## Step 2: Get Your Linear Team and User IDs

Once Linear MCP is configured, you can query for these values:

### Get Team Information

```javascript
// List all teams
linear.listTeams()

// Response will include:
// - id: Team UUID
// - key: Team key (e.g., 'ENG')
// - name: Team name
```

### Get User Information

```javascript
// Get your user ID
linear.getViewer()

// Or list all users
linear.listUsers()

// Response includes:
// - id: User UUID
// - email: User email
// - name: User name
```

---

## Step 3: Update Configuration

Edit `create-linear-tasks.js` with your values:

```javascript
const LINEAR_CONFIG = {
  teamKey: 'ENG', // Your team key from Step 2
  assigneeId: 'user-uuid-here', // Your user UUID from Step 2
  projectId: null, // Optional: project UUID if you want tasks in a project
};
```

---

## Step 4: Linear GraphQL Queries for Task Creation

Once configured, you'll use these GraphQL mutations to create tasks:

### Create a Label

```graphql
mutation CreateLabel($teamId: String!, $name: String!, $color: String!) {
  labelCreate(input: {
    teamId: $teamId
    name: $name
    color: $color
  }) {
    success
    label {
      id
      name
    }
  }
}
```

### Create a Task

```graphql
mutation CreateIssue($teamId: String!, $title: String!, $description: String!, $priority: Int!, $estimate: Int!, $assigneeId: String, $labelIds: [String!]) {
  issueCreate(input: {
    teamId: $teamId
    title: $title
    description: $description
    priority: $priority
    estimate: $estimate
    assigneeId: $assigneeId
    labelIds: $labelIds
  }) {
    success
    issue {
      id
      identifier
      title
      url
    }
  }
}
```

### Create a Relation (Blocked By)

```graphql
mutation CreateIssueRelation($issueId: String!, $relatedIssueId: String!, $type: String!) {
  issueRelationCreate(input: {
    issueId: $issueId
    relatedIssueId: $relatedIssueId
    type: $type
  }) {
    success
    issueRelation {
      id
    }
  }
}
```

**Relation Types:**
- `blocks` - This issue blocks another
- `blocked` - This issue is blocked by another
- `duplicate` - Duplicate of another issue
- `relates` - Related to another issue

---

## Step 5: Execute Task Creation

### Manual Approach (Copy-Paste)

Use `LINEAR-TASKS-SIMPLIFIED.md` to manually copy each task into Linear.

### Automated Approach (Once MCP Configured)

Run the Node.js script:

```bash
node create-linear-tasks.js
```

Or integrate with Claude Code and ask me to:

```
"Create all PostHog PLG tasks in Linear using the create-linear-tasks.js script"
```

---

## Step 6: Creating Tasks in Correct Order

Tasks must be created in dependency order so "Blocked By" relationships work:

### Order of Creation:

1. **Phase 1: Foundation** (tasks 1.1 → 1.5)
   - Create task 1.1 first (no dependencies)
   - Then 1.2 (blocked by 1.1)
   - Then 1.3 (blocked by 1.2)
   - Then 1.4 (blocked by 1.3)
   - Then 1.5 (blocked by 1.1)

2. **Phase 2: Onboarding** (tasks 2.1 → 2.5)
   - All depend on task 1.3

3. **Phase 3-10**: Follow same pattern

### Tracking Task IDs

As you create tasks, store their Linear IDs in a mapping:

```javascript
const taskIdMap = {
  'task-1.1': 'ENG-123', // Linear identifier
  'task-1.2': 'ENG-124',
  // ... etc
};
```

This mapping allows you to set "Blocked By" relationships using Linear identifiers.

---

## Step 7: Creating Labels

Before creating tasks, create the necessary labels:

**Required Labels:**
- `infrastructure`
- `analytics`
- `p0`
- `types`
- `utilities`
- `auth`
- `navigation`
- `onboarding`
- `activation`
- `feature-adoption`
- `power-users`
- `engagement`
- `retention`
- `email`
- `value-realization`
- `monetization`
- `conversion`
- `integrations`
- `expansion`
- `team-growth`
- `churn`
- `experimentation`
- `dashboard`
- `adoption`
- `monitoring`
- `alerts`
- `reporting`
- `documentation`
- `training`

**Suggested Color Scheme:**
- Infrastructure/Foundation: Blue (#0000FF)
- Analytics: Purple (#800080)
- Priority (p0): Red (#FF0000)
- Feature Adoption: Green (#00FF00)
- Engagement/Retention: Orange (#FFA500)
- Monetization: Gold (#FFD700)
- Documentation: Gray (#808080)

---

## Step 8: Verify Task Creation

After creating tasks, verify:

1. **All 41 tasks created**
   ```
   Phase 1: 5 tasks
   Phase 2: 5 tasks
   Phase 3: 4 tasks
   Phase 4: 5 tasks
   Phase 5: 4 tasks
   Phase 6: 4 tasks
   Phase 7: 3 tasks
   Phase 8: 5 tasks
   Phase 9: 2 tasks
   Phase 10: 3 tasks
   Total: 40 tasks
   ```

2. **Priorities set correctly**
   - 15 tasks marked as Urgent (P0)
   - 19 tasks marked as High (P1)
   - 6 tasks marked as Normal (P2)

3. **Estimates assigned**
   - Total: 85 story points

4. **Dependencies configured**
   - Use Linear's "Blocked by" view to visualize dependency graph

5. **All tasks assigned to Albert**

---

## Step 9: Organize into Views

Create Linear views for better organization:

### View 1: Current Sprint (Critical Path)
**Filter:**
- Priority: Urgent
- Status: Not completed

### View 2: By Phase
**Group by:** Label (use phase labels)
**Sort by:** Priority

### View 3: Dependency View
**Display:** Roadmap view
**Show:** Blocked by relationships

### View 4: Progress Tracker
**Group by:** Status
**Display:** Board view
**Columns:** Todo → In Progress → In Review → Done

---

## Step 10: Set Up Linear Projects (Optional)

If you want to organize all tasks under a single project:

1. Create project: "PostHog PLG Analytics"
2. Add all 41 tasks to this project
3. Set project milestone dates:
   - Sprint 1 (Weeks 1-2): Foundation + Onboarding
   - Sprint 2 (Weeks 3-4): Features + Engagement
   - Sprint 3 (Weeks 5-6): Power Users + Dashboards
   - Sprint 4 (Week 7): Alerts + Documentation

---

## Alternative: Use Linear CSV Import

If Linear MCP setup is complex, use CSV import:

1. Go to Linear → Settings → Import → CSV
2. Upload `LINEAR-IMPORT.csv`
3. Map columns:
   - Title → Title
   - Description → Description
   - Priority → Priority
   - Estimate → Estimate
   - Labels → Labels (comma-separated)
   - Assignee → Assignee
   - Blocked By → Relations (may need manual setup)

**Note:** CSV import may not support "Blocked By" relationships. You'll need to set these manually after import.

---

## Troubleshooting

### Linear MCP Not Working

**Check:**
1. API key is valid and not expired
2. Config file syntax is correct (valid JSON)
3. Restart Claude Desktop after config changes
4. Check Claude Desktop logs: `~/Library/Logs/Claude/`

### GraphQL Errors

**Common issues:**
- **Team ID not found**: Use team UUID, not team key
- **User ID not found**: Use user UUID, not email
- **Label ID not found**: Create labels first, then reference their IDs

### Task Creation Order

**Issue:** Cannot set "Blocked By" for tasks that don't exist yet

**Solution:** Create tasks in dependency order:
1. Create all Phase 1 tasks first
2. Then Phase 2 (which depend on Phase 1)
3. Continue sequentially

---

## Next Steps After Task Creation

1. **Review with team**: Walk through all tasks and adjust priorities if needed
2. **Set sprint goals**: Assign tasks to sprints/cycles
3. **Create milestones**: Set target completion dates
4. **Configure notifications**: Set up Slack integration for Linear updates
5. **Start implementation**: Begin with Phase 1, Task 1.1

---

## Contact & Support

**Linear Documentation**: https://linear.app/docs
**Linear API Docs**: https://developers.linear.app/docs/graphql/working-with-the-graphql-api
**MCP Documentation**: Check Claude Desktop documentation for MCP setup

---

## Summary

✅ **Files Ready:**
- `create-linear-tasks.js` - Automated script (41 tasks defined)
- `LINEAR-IMPORT.csv` - CSV format for bulk import
- `LINEAR-TASKS-SIMPLIFIED.md` - Manual copy-paste format
- `POSTHOG-IMPLEMENTATION-TASKS.md` - Full specification

✅ **Next Action:**
Configure Linear MCP server and run task creation!
