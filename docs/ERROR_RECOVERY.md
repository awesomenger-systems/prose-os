# 🛠️ Error Recovery — Troubleshooting Guide

Prose OS is designed to fail gracefully.

When a stage fails, the pipeline:

- Stops safely
- Preserves execution state
- Logs the failure reason
- Allows resumable recovery

Most issues are recoverable without restarting the entire workflow.

---

# 🚨 Common Errors

---

## ❌ Quota Exceeded (429)

### What It Means

Gemini quota or rate limits were reached.

### Typical Cause

- Free-tier API exhaustion
- Burst execution
- Temporary provider throttling

### Recovery

1. Wait for quota reset
2. Run:

```text
Resume Quota Wait
```

3. Run the pipeline again

### Pipeline Behavior

Rows automatically move into:

```text
Quota Wait
```

instead of failing permanently.

---

## ❌ Duplicate Warning

### What It Means

The topic overlaps with previously generated or archived content.

### Current Detection Method

- Lightweight keyword overlap
- Memory sheet comparison

### Recovery Options

| Option | Action |
|---|---|
| Recommended | Change the topic angle |
| Override | Set `Agent` → `Insight Generator` and rerun |

### Recommended Upgrade

Future versions can replace this with:

- Semantic similarity
- Embedding search
- Vector memory systems

---

## ❌ Truncation / Incomplete Section

### What It Means

The model stopped before completing the section.

### Typical Causes

- Token exhaustion
- Long prompt instability
- Temporary API degradation

### Recovery

1. Set `Agent` back to the failed stage
2. Run `Force Rerun`

Most truncation issues resolve after a retry.

---

# 🖋️ Content & Formatting Failures

| Error | Cause | Recovery |
|---|---|---|
| Missing insights | Malformed API response | Rerun Insight Generator |
| No headings produced | Weak formatting output | Rerun formatter or edit manually |
| Marker missing | Continuation token removed | Reinsert marker + rerun |
| Weak structure | Topic too broad | Narrow the topic scope |
| Repetitive writing | Prompt drift | Improve structure guidance |

---

# ⚙️ Configuration Errors

---

## ❌ GEMINI_API_KEY Missing

### Recovery

Go to:

```text
Extensions → Apps Script → Project Settings → Script Properties
```

Add:

```text
GEMINI_API_KEY
```

with your Gemini API key.

---

## ❌ Dashboard Sheet Missing

### Recovery

Ensure the sheet is named exactly:

```text
Dashboard
```

Case-sensitive.

---

## ❌ Missing Required Column

### Recovery

Verify all required headers exist.

Common required columns include:

- Topic
- Status
- Agent
- Section1
- Section2
- FinalEssay
- Metadata
- UsageLog

---

# 🔄 Manual Recovery Workflow

Because Prose OS is state-aware, failed stages can be resumed manually.

## Recovery Process

1. Open the failing row
2. Review the `Usage Log`
3. Fix or replace the problematic content
4. Set `Agent` to the next valid stage
5. Run `Force Rerun`

The pipeline will continue from that stage forward.

---

# 🧠 Manual Intervention Strategy

You can manually replace any intermediate stage.

Examples:

- Rewrite the Hook manually
- Replace a weak outline
- Add missing headings
- Improve draft sections
- Insert corrected facts

The next stage will treat your edits as the source of truth.

---

# ⚠️ Long-Form Stability Tips

LLMs perform better when:

- Topics are specific
- Structure is constrained
- Sections are modular
- Context windows stay manageable

Avoid:

- Extremely broad prompts
- Multi-topic essays
- Overly abstract framing

---

# 💰 Cost Optimization Tips

## Recommended Defaults

```javascript
const RECOMMEND_SKIP_VOICE = true;
```

This significantly reduces API usage.

---

## Additional Savings

| Strategy | Benefit |
|---|---|
| Skip Voice stage | Lower cost |
| Skip Fact Check | Faster execution |
| Use smaller models | Lower latency |
| Shorter prompts | Better stability |

---

# 📊 Understanding Pipeline States

| State | Meaning |
|---|---|
| Pending | Waiting for execution |
| Processing | Currently running |
| Quota Wait | Delayed due to API limits |
| Error | Stage execution failed |
| Ready | Pipeline completed |
| Ready - Review | Manual review recommended |
| Content Fail | Validation or duplicate failure |

---

# 🔒 Why the Pipeline Stops Instead of Continuing

Prose OS intentionally fails fast.

This prevents:

- Corrupted downstream stages
- Invalid merges
- Broken formatting propagation
- Silent quality degradation

Recoverable failures are safer than hidden failures.

---

# ⚙️ Sequential Execution Recovery

The pipeline intentionally executes:

- One row
- One stage
- Per execution

Advantages:

- Easier debugging
- Better quota recovery
- Safer retries
- Lower failure propagation

This design is optimized around Apps Script execution limits.

---

# 🚀 Recommended Workflow

## For Best Stability

1. Start with focused topics
2. Keep Voice refinement disabled initially
3. Validate structure quality early
4. Archive finished content regularly
5. Monitor the Usage Log column

---

# 📁 Maintenance Recommendations

## Archive Finished Content

Regularly archive completed articles to keep:

- Duplicate checks cleaner
- Dashboard performance faster
- State management simpler

---

## Monitor Usage Logs

The `Usage Log` column is the primary debugging surface.

Most recoverable issues can be diagnosed directly from log output.

---

# 🔒 Public vs Private Logic

The public repository intentionally exposes:

- Recovery architecture
- Pipeline states
- Execution model
- Validation systems

while omitting:

- Proprietary prompts
- Editorial heuristics
- Voice refinement systems
- Internal optimization logic

---

# 🧠 Key Takeaway

Prose OS treats long-form generation as a recoverable orchestration workflow rather than a fragile single-prompt interaction.

The system prioritizes:

- Explicit state management
- Recoverable failures
- Observable execution
- Deterministic progression
- Cost-aware generation

over instant one-shot generation.

---

# 📚 Recommended Reading

- `README.md`
- `docs/ARCHITECTURE.md`
- `docs/CUSTOMIZATION.md`
- `docs/VOICE_PROFILE_EXAMPLE.md`
- `scripts/pipeline.gs`

---

# 📌 Next Step

See:

```text
docs/ARCHITECTURE.md
```

for a detailed breakdown of pipeline stages, execution flow, and orchestration design.
