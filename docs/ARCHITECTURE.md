# 🏗️ Architecture — How Prose OS Pipeline Works

Prose OS is a state-machine-driven editorial pipeline that turns raw topics into polished, publication-ready long-form essays using Google Sheets as a lightweight orchestration runtime.

By decomposing long-form writing into deterministic editorial stages, the system achieves significantly better consistency, recoverability, and structural control than single-prompt workflows.

---

# 🗺️ Current Pipeline Architecture

```text
TOPIC INPUT
    ↓
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
PUBLICATION-READY GOOGLE DOC + METADATA
```

Each stage executes independently and advances the pipeline state forward.

---

# ⚙️ Execution Model

- One row processed per execution
- One stage executed at a time
- State persisted in Google Sheets
- Recoverable after failures or quota interruptions
- Optimized around Apps Script execution limits

This architecture prioritizes:

- Reliability
- Recoverability
- Cost control
- Long-form stability
- Workflow transparency

over raw generation speed.

---

# 🧠 Stage-by-Stage Breakdown

---

## ① Duplicate Check

### Purpose

Prevent creating content too similar to previously published work.

### Method

Simple keyword overlap check against the `Memory` sheet.

Can later be upgraded to:

- Semantic similarity
- Embedding search
- Vector memory systems

### API Cost

`0 API calls`

### Outcome

| Result | Behavior |
|---|---|
| Pass | Continue pipeline |
| Fail | Move row to `Content Fail` |

---

## ② Insight Generator

### Purpose

Extract non-obvious ideas and patterns before drafting begins.

### Typical Outputs

- Foundational insights
- Behavioral patterns
- Contrasting perspectives
- Editorial angles

### Why It Exists

This stage improves originality and prevents generic long-form output.

### API Cost

`1 API call`

---

## ③ Structure Planner

### Purpose

Create logical flow and editorial framing before generation.

### Typical Outputs

- Section structure
- Narrative progression
- Editorial flow
- Structural guidance

### Why It Exists

Separating structure from drafting improves long-form coherence and reduces prompt drift.

### API Cost

`1 API call`

---

## ④ Hook Writer

### Purpose

Craft a strong opening that captures attention immediately.

### Typical Goals

- Reader curiosity
- Narrative tension
- Clear framing
- Strong opening momentum

### API Cost

`1 API call`

---

## ⑤ Writer Part 1

### Purpose

Generate the first half of the article.

### Output

~800–1000 words ending with:

```text
===CONTINUE_WRITING===
```

### API Cost

`1 API call`

---

## ⑥ Writer Part 2

### Purpose

Continue and complete the article.

### Output

Continuation + conclusion ending with:

```text
===ESSAY_COMPLETE===
```

### Why Split Long-Form Generation?

Splitting long-form generation into multiple stages improves:

- Continuity
- Recoverability
- Token efficiency
- Output stability

### API Cost

`1 API call`

---

## ⑦ Fact Checker

### Purpose

Review the merged article for factual risks and logical inconsistencies.

### Behavior

Advisory-only review intended to preserve:

- Editorial structure
- Narrative flow
- Authorial voice

while identifying:

- Unsupported claims
- Factual issues
- Contradictions

### API Cost

`1 API call`

### Optional?

Yes. Can be skipped for lower-cost workflows.

---

## ⑧ Voice Architect (Optional)

### Purpose

Editorial refinement layer focused on prose quality.

### Focus Areas

- Clarity
- Rhythm
- Precision
- Readability
- Structural cleanup

### Recommendation

Keep:

```javascript
RECOMMEND_SKIP_VOICE = true;
```

initially to reduce API cost.

Enable refinement only when additional editorial polish is required.

### API Cost

`1 API call`

---

## ⑨ SEO Generator

### Purpose

Generate search- and AI-engine-friendly metadata.

### Typical Outputs

- SEO title
- Meta description
- Slug
- FAQs
- AEO metadata

### Why It Exists

Writing and distribution formatting are intentionally separated.

### API Cost

`1 API call`

---

## ⑩ Final Editor

### Purpose

Assemble all outputs into a clean, formatted Google Document.

### Outputs

- Publication-ready Google Doc
- Structured headings
- SEO metadata section
- Formatted long-form draft

### API Cost

`0 API calls`

---

# 💰 Cost & Performance Summary

| Configuration | API Calls | Est. Duration | Recommended For |
|---|---|---|---|
| Full Pipeline | 9–10 | 2–3 min | Highest quality |
| Skip Voice (Default) | 8–9 | ~2 min | Best balance |
| Skip Fact + Voice | 6–7 | 75–100 sec | Fast drafting |

---

# ✅ Quality Gates (Zero API Cost)

Several stages intentionally use pure logic instead of API calls.

## Validation Layers

- Word Count Gate
- Marker Validation
- Merge Integrity Checks
- Final Formatting Validation

### Why They Exist

These gates:

- Prevent malformed output
- Improve recoverability
- Reduce wasted API calls
- Stop broken drafts from progressing downstream

---

# 🔄 Error Recovery

If a stage fails:

1. Read the `Usage Log` column
2. Review the failing stage
3. Reset the `Agent` column if needed
4. Run `Force Rerun`

Most failures are transient and recoverable.

---

# ⚠️ Common Recovery Strategies

## Quota Errors

- Wait for Gemini quota reset
- Run `Resume Quota Wait`

---

## Weak Outputs

- Sharpen the topic
- Reduce ambiguity
- Improve structure guidance

---

## Long-Form Instability

- Reduce prompt size
- Shorten topic scope
- Split sections more aggressively

---

# 📊 Core Sheets

| Sheet | Purpose |
|---|---|
| Dashboard | Active orchestration queue |
| Idea Bank | Topic discovery queue |
| Memory | Semantic archive summaries |
| Published Links | Internal linking references |
| Pipeline Health | Runtime diagnostics |

---

# ☁️ Why Google Apps Script?

Prose OS intentionally uses Apps Script and Google Sheets because they provide:

- Native Google Sheets integration
- Native Google Docs formatting
- Built-in persistence
- Collaborative editing
- Zero infrastructure management
- Low operational overhead

This allows sophisticated editorial workflows to run without maintaining backend infrastructure.

---

# ⚠️ Known Constraints

Apps Script introduces practical limitations:

- ~6 minute execution windows
- Sequential execution
- Limited parallelism

The architecture is intentionally designed around those constraints rather than attempting to bypass them.

---

# 🔒 Public vs Private Logic

The public repository intentionally exposes:

- Orchestration architecture
- Pipeline sequencing
- Recovery systems
- State management
- Execution design

while omitting:

- Proprietary prompts
- Editorial heuristics
- Voice systems
- Internal optimization logic
- Refinement strategies

This keeps the framework extensible while protecting editorial IP.

---

# 🚀 Extension Opportunities

Potential future improvements include:

- Embedding-based semantic search
- Vector memory systems
- WordPress publishing
- Notion integration
- Queue prioritization
- Distributed execution
- Multi-provider model routing
- Advanced analytics dashboards

---

# 🧠 Design Philosophy

- Single responsibility per stage
- Resumable execution
- Observable workflow state
- Fail fast + recover easily
- Cost-aware generation
- Spreadsheet-native orchestration

The pipeline treats long-form generation as an orchestration problem rather than a prompting problem.

---

# 📚 Recommended Reading

- `README.md`
- `scripts/pipeline.gs`
- `docs/CUSTOMIZATION.md`
- `docs/ERROR_RECOVERY.md`
- `docs/VOICE_PROFILE_EXAMPLE.md`

---

# 📌 Next Step

See:

```text
docs/VOICE_PROFILE_EXAMPLE.md
```

for guidance on customizing your editorial voice and refinement behavior.
