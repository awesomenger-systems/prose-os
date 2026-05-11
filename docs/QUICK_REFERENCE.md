# ⚡ Prose OS — Quick Reference Cheat Sheet

High-level operational guide for daily workflow management, troubleshooting, and pipeline execution.

Bookmark this document for quick access.

---

# 🚀 60-Second Setup

## 1. Copy the Google Sheet Template

Duplicate the provided template spreadsheet.

---

## 2. Open Apps Script

Go to:

```text
Extensions → Apps Script
```

Delete the default code and paste:

```text
scripts/pipeline.gs
```

---

## 3. Add Your Gemini API Key

Go to:

```text
Project Settings → Script Properties
```

Add:

| Property | Value |
|---|---|
| `GEMINI_API_KEY` | Your Gemini API key |

Get your API key from:

```text
https://ai.google.dev
```

---

## 4. Customize Editorial Voice

Edit:

```javascript
STYLE_CORE
VOICE_CORE
```

These control:

- Editorial structure
- Writing style
- Formatting behavior
- Refinement logic

---

## 5. Add a Topic

Open the `Dashboard` sheet and add a topic.

Example:

```text
Why long-form AI pipelines outperform single prompts
```

---

## 6. Run the Pipeline

From the menu:

```text
Prose OS → ▶ Run Pipeline
```

---

# 🏗️ Current Pipeline Flow

```text
① Duplicate Check
    ↓
② Insight Generator
    ↓
③ Structure Planner
    ↓
④ Hook Writer
    ↓
⑤ Writer Part 1
    ↓
⑥ Writer Part 2
    ↓
⑦ Fact Checker
    ↓
⑧ Voice Architect (Optional)
    ↓
⑨ SEO Generator
    ↓
⑩ Final Editor
    ↓
Publication-Ready Google Doc
```

Each stage executes independently and advances the pipeline state forward.

---

# 🚦 Pipeline Status Meanings

| Status | Meaning |
|---|---|
| Pending | Ready to start |
| Processing | Currently running |
| Ready | Completed successfully |
| Ready - Review | Completed but requires manual review |
| Error | Stage execution failed |
| Quota Wait | Gemini quota exhausted |
| Content Fail | Validation or duplicate failure |

---

# ⚙️ Essential Menu Commands

| Command | Purpose |
|---|---|
| Run Pipeline | Execute next eligible stage |
| Force Rerun | Retry failed or stalled rows |
| Resume Quota Wait | Reactivate paused rows |
| Color Code Dashboard | Apply visual status colors |
| Install Trigger | Enable scheduled execution |

---

# 💰 API Cost & Optimization

| Configuration | API Calls | Est. Time | Recommended For |
|---|---|---|---|
| Full Pipeline | 9–10 | 2–3 min | Highest quality |
| Skip Voice (Default) | 8–9 | ~2 min | Best balance |
| Skip Fact + Voice | 6–7 | 75–100 sec | Fast drafting |

## Recommended Default

```javascript
const RECOMMEND_SKIP_VOICE = true;
```

This significantly reduces API usage while preserving most output quality.

---

# 🛠️ Common Errors & Fast Recovery

| Error | Cause | Recovery |
|---|---|---|
| Quota exceeded (429) | Gemini rate limits | Wait → Resume Quota Wait |
| Duplicate warning | Similar archived topic | Change angle or override |
| Truncation | Output stopped early | Reset Agent → Force Rerun |
| Missing API key | Script property missing | Add `GEMINI_API_KEY` |
| Word count fail | Sections too short | Reset to Writer Part 1 |

---

# 🔄 Manual Recovery Workflow

Because Prose OS is state-aware, you can manually intervene at any stage.

## Recovery Steps

1. Edit the relevant column manually
2. Set the `Agent` column to the desired resume stage
3. Run `Force Rerun`

---

## Common Resume Points

| Edited Column | Resume Agent |
|---|---|
| Insight | Structure Planner |
| Hook | Writer Part 1 |
| Section 1 | Writer Part 2 |
| Final Essay | SEO Generator |

---

# 📊 Core Sheets

| Sheet | Purpose |
|---|---|
| Dashboard | Main orchestration queue |
| Idea Bank | Topic discovery + approvals |
| Memory | Semantic archive summaries |
| Published Links | Internal linking references |
| Pipeline Health | Runtime diagnostics |

---

# ⚠️ Stability Tips

## Recommended

- Use focused, specific topics
- Keep `STYLE_CORE` detailed
- Keep `VOICE_CORE` modular
- Let the default sequential execution run normally

---

## Avoid

- Extremely broad topics
- Multi-topic essays
- Excessively long prompts
- Running without API configuration

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

# 📚 Documentation Index

| File | Purpose |
|---|---|
| `README.md` | Repository overview |
| `ARCHITECTURE.md` | Pipeline breakdown |
| `SETUP.md` | Installation guide |
| `CUSTOMIZATION.md` | Voice and editorial tuning |
| `ERROR_RECOVERY.md` | Troubleshooting guide |
| `scripts/pipeline.gs` | Core orchestration engine |

---

# 🧠 Most Important Principle

The orchestration system is the engine.

```javascript
STYLE_CORE
VOICE_CORE
```

are the editorial intelligence layer.

The pipeline amplifies the quality of your editorial configuration.

---

# 🚀 Next Step

Read:

```text
ARCHITECTURE.md
```

for a detailed explanation of pipeline stages, state management, and orchestration design.

---

Built by Mahesh Mali
