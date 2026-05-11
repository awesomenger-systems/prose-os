# 🎨 Voice Profile — How to Customize Your Writing Voice

**This is the most important customization in Prose OS.**

While the pipeline handles orchestration and structure, `STYLE_CORE` and `VOICE_CORE` determine the actual editorial quality and distinctiveness of your output.

Most improvements in output quality come from iteratively refining these two constants.

---

# 🧠 Understanding the Two Profiles

| Profile | Used In | Controls |
|---|---|---|
| `STYLE_CORE` | Writer Part 1 & 2 | Drafting behavior, tone, perspective, structure |
| `VOICE_CORE` | Voice Architect | Editing, sharpening, refinement, polishing |

---

## STYLE_CORE = The Writer

This profile controls:

- Narrative structure
- Tone
- Framing
- Formatting behavior
- Editorial perspective
- Writing rhythm

Think of this as:

> The writer.

---

## VOICE_CORE = The Editor

This profile controls:

- Clarity
- Precision
- Flow
- Cleanup behavior
- Sentence refinement
- Structural polishing

Think of this as:

> The editor.

---

# 🚀 Recommended Workflow

Do not try to perfect your voice profile immediately.

The best workflow is iterative:

1. Start with a simple, clear profile
2. Generate 5–10 essays
3. Observe what is working and what is not
4. Add specific rules and constraints
5. Repeat

Strong voices evolve gradually through iteration.

---

# 🧩 Starter Templates

## STYLE_CORE Template

```javascript
const STYLE_CORE = `
You are writing as [Your Name / Persona] — [one-line descriptor].

CORE INTENT:
[What should the reader understand or feel after reading?]

VOICE:
[Describe tone, energy, and worldview]

STYLE DNA:
- [Influential writer]&#58; [specific quality you admire]
- [Influential writer]&#58; [specific quality you admire]

FORBIDDEN:
- List patterns, tones, or phrases you never want

STRUCTURAL PREFERENCES:
- Paragraph length
- Heading usage
- Transition style
- Narrative flow

SENTENCE RULES:
- Preferred rhythm
- Sentence length
- Cadence preferences
`;
```

---

## VOICE_CORE Template

```javascript
const VOICE_CORE = `
You are an editor working in the voice of [Your Name].

PRIMARY GOAL:
Sharpen clarity, rhythm, precision, and impact while preserving original meaning.

CRITICAL EDITS:
- Remove redundancy and repetition
- Strengthen weak sentences
- Improve flow and cadence

FORBIDDEN IN EDITS:
- Adding new ideas or examples
- Changing core argument
- Adding headings or lists
- Adding motivational language

OUTPUT RULES:
Return only clean prose.
No commentary.
No markdown.
`;
```

---

# ⚙️ Best Practices

## Be Specific

Weak:

```text
Write clearly.
```

Better:

```text
Use short declarative sentences during transitions.
Avoid abstract framing unless introducing a new concept.
```

Specific instructions produce more stable editorial behavior.

---

## Use the “Forbidden” Section Aggressively

The `FORBIDDEN` section is one of the highest-leverage parts of the profile.

Examples:

- Generic motivational language
- Corporate tone
- Repetitive openers
- Excessive hedging
- Buzzwords
- Weak transitions
- Overuse of em dashes

Negative constraints often improve quality more than positive instructions.

---

## Separate Writing from Editing

Do not overload `STYLE_CORE` with editing instructions.

Bad:

```text
Write the article and aggressively tighten every paragraph.
```

Better:

- `STYLE_CORE` → generation behavior
- `VOICE_CORE` → refinement behavior

This separation improves consistency significantly.

---

## Keep Profiles Modular

Instead of:

```text
One giant monolithic prompt
```

prefer modular sections:

- Tone rules
- Structural rules
- Forbidden rules
- Rhythm rules
- Formatting rules

Modular profiles are easier to maintain and debug.

---

## Keep Profiles Concise

Overly long profiles can:

- Introduce prompt conflicts
- Reduce consistency
- Increase drift
- Lower stability

Longer is not always better.

---

# 🧠 High-Leverage Areas

The biggest quality improvements usually come from refining:

| Area | Impact |
|---|---|
| Forbidden patterns | Extremely high |
| Narrative pacing | High |
| Structural rules | High |
| Transition behavior | High |
| Sentence rhythm | Medium |
| Tone descriptors | Medium |

---

# ⚠️ Common Mistakes

| Mistake | Better Approach |
|---|---|
| Too generic (“write well”) | Define tone + worldview |
| Mixing style and editing rules | Keep STYLE and VOICE separate |
| No “Forbidden” section | Define what you do not want |
| Trying to imitate someone else | Define your own perspective |
| Extremely long prompts | Keep profiles focused and modular |

---

# 💰 Cost Optimization Note

## Recommended Default

```javascript
const RECOMMEND_SKIP_VOICE = true;
```

We recommend keeping Voice Architect disabled initially.

The quality-to-cost ratio is often not worth the additional API calls until your `STYLE_CORE` becomes more mature.

Benefits:

- Lower API cost
- Faster execution
- Better free-tier compatibility

Enable Voice refinement only when additional editorial polish is required.

---

# 🔄 Iteration Strategy

## Recommended Process

After every 5–10 essays:

1. Review weak patterns
2. Add corrective rules
3. Remove ineffective instructions
4. Tighten forbidden patterns
5. Simplify conflicting guidance

Treat voice configuration as an evolving editorial system.

---

# ⚠️ Important Philosophy

The pipeline is the orchestration layer.

Your voice profiles are the editorial intelligence layer.

The system amplifies the quality of the instructions you provide.

---

# 🔒 Public vs Private Logic

The public repository intentionally exposes:

- Pipeline architecture
- State management
- Recovery systems
- Templates and best practices

while omitting:

- Proprietary prompts
- Editorial heuristics
- Voice systems
- Internal optimization logic

Your strongest `STYLE_CORE` and `VOICE_CORE` configurations should remain private.

---

# 📚 Recommended Reading

| File | Purpose |
|---|---|
| `README.md` | Repository overview |
| `docs/SETUP.md` | Installation guide |
| `docs/ARCHITECTURE.md` | Pipeline breakdown |
| `docs/ERROR_RECOVERY.md` | Troubleshooting guide |
| `scripts/pipeline.gs` | Core orchestration engine |

---

# 📌 Next Steps

1. Customize the templates above
2. Run a few test essays
3. Refine based on real output
4. Repeat

Strong editorial systems emerge through iteration, not perfect first drafts.

---

Built by Mahesh Mali
