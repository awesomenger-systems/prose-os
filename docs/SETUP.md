# 🚀 Prose OS — Setup Guide

Estimated setup time: **10–15 minutes**

This guide walks through setting up the lightweight Prose OS editorial pipeline using:

- Google Sheets
- Google Apps Script
- Gemini API
- Google Docs

No servers or infrastructure required.

---

# ✅ Prerequisites

Before starting, make sure you have:

- A Google account
- Access to Google Sheets
- A Gemini API key

Get your API key from:

```text
https://ai.google.dev
```

Free-tier usage is sufficient for lightweight workflows.

---

# 🧱 Phase 1 — Create the Spreadsheet

## 1. Create a New Google Sheet

Name it:

```text
Prose OS - Content Pipeline
```

---

## 2. Create Required Sheets

Add these tabs:

| Sheet Name | Purpose |
|---|---|
| Dashboard | Main orchestration queue |
| Idea Bank | Topic discovery + approvals |
| Memory | Semantic archive summaries |
| Published Links | Internal linking references |
| Pipeline Health | Runtime diagnostics |

---

## 3. Configure Dashboard Columns

In the `Dashboard` sheet, add these headers in **Row 1**:

```text
Topic
Status
Agent
Insight
Thesis
Hook
Section1
Section2
FinalEssay
Metadata
Notes
DocLink
SkipFactCheck
SkipVoice
UsageLog
PublishedDate
```

Recommended:

- Bold the header row
- Freeze Row 1
- Enable filters

---

# ⚙️ Phase 2 — Deploy the Pipeline Code

## 1. Open Apps Script

Go to:

```text
Extensions → Apps Script
```

---

## 2. Replace Default Code

Delete everything inside:

```text
Code.gs
```

Paste the contents of:

```text
scripts/pipeline.gs
```

---

## 3. Add Gemini API Key

Open:

```text
Project Settings → Script Properties
```

Add:

| Property | Value |
|---|---|
| `GEMINI_API_KEY` | Your Gemini API key |

Click:

```text
Save
```

---

# 🧠 Phase 3 — Customize Editorial Voice

At the top of `pipeline.gs`, customize:

```javascript
const STYLE_CORE = `...`;
const VOICE_CORE = `...`;
```

These control:

- Editorial structure
- Writing behavior
- Formatting rules
- Refinement logic
- Narrative constraints

---

## Recommended Starting Point

Use:

```text
docs/VOICE_PROFILE_EXAMPLE.md
```

as a baseline template.

Refine gradually over time instead of over-engineering the profile immediately.

---

## Recommended Default

```javascript
const RECOMMEND_SKIP_VOICE = true;
```

This significantly reduces API usage while preserving most output quality.

Enable Voice refinement later only if additional editorial polish is required.

---

# ▶️ Phase 4 — Run Your First Essay

## 1. Refresh the Spreadsheet

This loads the custom menu.

You should now see:

```text
Prose OS
```

in the top menu bar.

---

## 2. Add a Topic

In the `Dashboard` sheet:

- Add a topic in Row 2 under `Topic`

Example:

```text
Why long-form AI workflows outperform single prompts
```

---

## 3. Run the Pipeline

Use:

```text
Prose OS → ▶ Run Pipeline
```

---

## 4. Monitor Execution

Watch these columns:

| Column | Purpose |
|---|---|
| Status | Current execution state |
| Agent | Current pipeline stage |
| UsageLog | Runtime diagnostics |

---

## 5. Open Final Output

When the pipeline completes:

- A Google Doc link appears in `DocLink`
- Status changes to:

```text
Ready
```

---

# 💰 Cost Optimization Recommendations

## Recommended Default

```javascript
const RECOMMEND_SKIP_VOICE = true;
```

Benefits:

- Lower API cost
- Faster execution
- Better free-tier compatibility

---

## Additional Savings

| Strategy | Benefit |
|---|---|
| Skip Voice stage | Lower cost |
| Skip Fact Check | Faster execution |
| Use smaller models | Lower latency |
| Shorter prompts | Better stability |

---

# 🛠️ Troubleshooting

| Issue | Recovery |
|---|---|
| Menu not appearing | Refresh spreadsheet + wait 10–15 sec |
| Quota exceeded (429) | Wait → Resume Quota Wait |
| Truncated output | Reset Agent → Force Rerun |
| Weak voice consistency | Improve STYLE_CORE / VOICE_CORE |
| GEMINI_API_KEY missing | Verify Script Properties |
| Word Count Fail | Reset Agent → Writer Part 1 |

---

# 🔄 Manual Recovery Workflow

Because Prose OS is state-aware, you can manually intervene at any stage.

## Recovery Steps

1. Edit the failing content manually
2. Set the `Agent` column
3. Run `Force Rerun`

The pipeline will continue from that stage.

---

# 📊 Understanding Pipeline States

| State | Meaning |
|---|---|
| Pending | Ready for execution |
| Processing | Currently running |
| Ready | Completed successfully |
| Ready - Review | Requires manual review |
| Error | Stage execution failed |
| Quota Wait | Waiting for Gemini quota reset |
| Content Fail | Validation or duplicate failure |

---

# ⚙️ Execution Model

The system intentionally processes:

- One row
- One stage
- Per execution

Advantages include:

- Easier recovery
- Better quota handling
- Reduced failure propagation
- Improved long-form stability

This design is optimized around Apps Script execution limits.

---

# 🧠 Recommended Workflow

## For Best Results

- Start with focused topics
- Keep sections modular
- Avoid extremely broad prompts
- Refine STYLE_CORE gradually
- Archive completed content regularly

---

# 📚 Recommended Reading

| File | Purpose |
|---|---|
| `README.md` | Repository overview |
| `docs/ARCHITECTURE.md` | Pipeline breakdown |
| `docs/CUSTOMIZATION.md` | Voice + editorial tuning |
| `docs/ERROR_RECOVERY.md` | Troubleshooting guide |
| `docs/VOICE_PROFILE_EXAMPLE.md` | Editorial profile examples |
| `scripts/pipeline.gs` | Core orchestration engine |

---

# 🔒 Public vs Private Logic

The public repository intentionally exposes:

- Pipeline architecture
- Recovery systems
- State management
- Execution flow

while omitting:

- Proprietary prompts
- Editorial heuristics
- Voice systems
- Internal optimization logic

This keeps the framework extensible while protecting editorial IP.

---

# 🚀 You're Ready

Prose OS is designed to be:

- Resumable
- Observable
- Recoverable
- Cost-aware
- Spreadsheet-native

You can manually edit any intermediate stage and resume execution safely from that point forward.

---

Built by Mahesh Mali
