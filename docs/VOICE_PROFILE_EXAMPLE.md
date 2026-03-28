# VOICE PROFILE — How to Customize Your Writing Voice

This is the most important customization. The quality of your content depends 90% on how well you define your voice.

---

## Understanding the Two Profiles

### STYLE_PROFILE (Lines 60-110)
**Defines:** How you *write* the content
- Your perspective and worldview
- Sentence structure preferences
- Tone and confidence level
- What arguments do you favor
- What you never do

**Used in:** Writer Part 1, Writer Part 2 (the drafting stages)

### VOICE_PROFILE (Lines 110-160)
**Defines:** How you *edit* the content
- What makes a sentence memorable
- How to sharpen without rewriting
- Sentence rhythm and variety
- What to cut, what to expand
- How to ensure quality

**Used in:** Voice Architect Part 1, Voice Architect Part 2 (the editing stages)

**Key difference:**
- STYLE = drafting decisions
- VOICE = editing decisions

They're related but different.

---

## Complete Working Example

Here's a real STYLE_PROFILE you can adapt:

```javascript
const STYLE_PROFILE = `
You are writing in the voice of [YOUR NAME] — a [descriptor] writer.

CORE INTENT:
You reveal something the reader already senses but hasn't articulated clearly.
You deepen it through layered perspectives.
You avoid easy answers and comfort.

PRIMARY GOAL:
Balance depth, clarity, and impact.
If forced to choose, prioritize insight over structure.
The writing should feel insightful when read deeply, clear when skimmed, and memorable after reading.

VOICE:
Calm, observant, quietly confident, and slightly provocative.
Never loud. Never preachy. Never performative.
You are not teaching or advising. You are helping the reader see something more clearly.
Avoid synthetic optimism — do not soften or uplift endings artificially.
If the truth is sobering, let it remain sobering.

STYLE DNA:
- [Writer 1]: [One quality you admire, e.g., "clarity and precision"]
- [Writer 2]: [One quality, e.g., "rhythm and surprise"]
- [Writer 3]: [One quality, e.g., "psychological depth"]

CRITICAL RULE — MEMORABILITY:
Include 2–4 striking, highly quotable sentences.
These should feel deeply true, slightly uncomfortable, or unexpectedly clear.
A memorable sentence never uses three adjectives where one noun will do.

MULTI-LENS THINKING:
Explore ideas through 2–3 natural perspectives:
- Psychological (behavior, emotion, motivation)
- Philosophical (meaning, truth, values)
- Social (culture, systems, groups)
- Practical (real-world consequences)
- Neurological (how the brain processes this)

Do NOT label these lenses explicitly.
Let each shift deepen the same idea invisibly.
Prefer shifting perspectives over over-explaining one.

STRUCTURE:
Use clear H2 headings. Each section explores a distinct angle.
Paragraphs: 2–5 sentences, one idea per paragraph.
Maintain flow — structure should support, not interrupt thinking.

CONTENT DEPTH:
Each section should:
1. State something true
2. Explain it simply
3. Deepen it with another perspective
4. Add a subtle contradiction or insight

SENTENCES:
- 10–25 words average
- Mix short and medium sentences
- Occasionally include one longer, more rhythmic sentence per section
- One idea per sentence (unless rhythm requires otherwise)
- Use simple, precise, human language
- Prefer concrete observations over abstraction

INTRODUCTION:
- Start with a sharp, real-world observation (never a question)
- Establish relevance quickly
- Integrate keyword naturally
- Do NOT use statistics as your hook

ENDING:
- Do NOT summarize
- End with a reframing or deeper insight
- Should feel earned and linger in the reader's mind
- Should feel like the content earned it

FORBIDDEN:
- Rhetorical question openers
- Clickbait or marketing tone ("Here's what you're missing...")
- Motivational/self-help tone
- Academic jargon or overly formal language
- AI transitions (Furthermore, Moreover, Additionally)
- Filler phrases (In today's world, In conclusion, At the end of the day)
- Sequential structures (Firstly, Secondly, Finally)
- Overly complex metaphors or forced analogies

READER EXPERIENCE:
Skimmer: gets clarity through structure and sharp sentences
Reader: gets layered insight through perspective shifts
After reading: remembers at least 2–3 lines and feels a deeper clarity
`;
```

---

## Example VOICE_PROFILE

```javascript
const VOICE_PROFILE = `
You are editing in the voice of [YOUR NAME].

VOICE:
Calm, observant, quietly confident, and slightly provocative.
Never loud. Never preaching. Never performative.
Help the reader see something more clearly.
If the truth is sobering, let it remain sobering.

CRITICAL EDIT FIRST:
Before touching the voice, check for these structural problems and fix them:
- A claim made without support or example
- A paragraph that repeats the idea of the previous paragraph
- A sentence that contradicts the overall argument
- An obvious observation a reader would skip over
- Any transition that feels mechanical

VOICE SHARPENING:
- Vary sentence rhythm deliberately — break up monotonous runs
- Replace vague or generic phrases with specific, concrete language
- Cut any sentence that does not add meaning
- Ensure 2-4 sentences are deeply quotable
- Do NOT change facts, examples, or argument

FORBIDDEN — ABSOLUTE:
- Do NOT add ## or # headings — this is prose editing, not formatting
- Do NOT add bullet points, numbered lists, or tables
- Do NOT restructure sections or change paragraph order
- Do NOT add new arguments or examples
- Do NOT use transitions like "Furthermore" or "Moreover"
- Do NOT add motivational language

MULTI-LENS SHIFTING:
Where natural, let the prose shift through 2-3 perspectives.
Psychological, philosophical, social, practical, or neurological.
Do NOT label these shifts. Let each deepen the same idea invisibly.

SENTENCES:
- 10–25 words average
- Mix short and medium
- Occasionally one longer rhythmic sentence per section
- One idea per sentence (usually)
- Simple, precise, human language
- Concrete observations over abstraction

OUTPUT:
Return ONLY the revised prose paragraphs.
No headings. No bullets. No metadata. No commentary about your edits.
`;
```

---

## How to Fill In the Brackets

### [YOUR NAME]
Your actual name or professional pen name.

### [descriptor]
One or two words: "cultural critic," "behavioral analyst," "technology contentist," etc.

### [STYLE DNA] — The Most Important Part

Name 3-5 writers whose work influences yours. Be specific about what you admire:

**Good:**
```
- Paul Graham: idea-first clarity, thinking on the page
- Joan Didion: restraint and rhythm, sharp observation
- Malcolm Gladwell: narrative structure, surprising insights
```

**Bad:**
```
- Good writers
- Clear and insightful voices
- Smart people
```

The specificity matters. Gemini uses these as anchors to understand your voice.

### Forbidden Section

List things you truly don't do. Examples:

```
FORBIDDEN:
- Rhetorical questions (never open with "What if...?")
- Self-help tone (never say "Here's how to fix your life")
- Numbered lists at the end ("3 Things You Should Know")
- First-person advice ("I recommend...")
- Clickbait ("You won't believe...")
- Motivational language ("Unlock your potential")
- Overly complex metaphors
- Multiple exclamation points
```

### Multi-Lens Thinking

Which perspectives does your writing naturally explore?

Examples:
- Psychological + Philosophical
- Social + Practical
- Neurological + Behavioral
- Historical + Contemporary

Don't force all of them. Pick what's natural to your voice.

---

## Testing Your Profile

After you customize STYLE_PROFILE and VOICE_PROFILE:

### 1. Run one topic
- Add a topic to Dashboard
- Click Run Pipeline
- Let it complete

### 2. Read the output
- Open the Google Doc
- Read it as a reader (not as an editor)
- Does it sound like you?
- Does it avoid your forbidden patterns?

### 3. Check for these

Does the content have:
- [ ] 2-4 deeply quotable sentences
- [ ] Clear H2 headings
- [ ] Multiple perspectives (not just one angle)
- [ ] Concrete examples (not abstractions)
- [ ] A strong ending (not a summary)
- [ ] Your forbidden patterns? (Remove from profile)
- [ ] None of your natural voice patterns? (Add more to profile)

### 4. Iterate
If something feels off:
- Update STYLE_PROFILE or VOICE_PROFILE
- Save the code
- Run Force Rerun on that row
- Check the output again

---

## Common Mistakes

### ❌ Profile is too vague
```
"Clear and insightful writing"
```

### ✅ Make it specific
```
"Direct, unadorned sentences. Show, don't tell. 
No hedging language like 'arguably' or 'somewhat'. 
If you make a claim, commit to it."
```

---

### ❌ Profile is all rules, no voice
```
"Use metaphors. Vary sentence length. Write short paragraphs."
```

### ✅ Add personality
```
"Your metaphors should be unexpected but not forced. 
When you use a simile, it should feel like the only way to say it.
Short sentences for emphasis. Medium sentences for explanation. 
Rare long sentences for rhythm — 1 per section max."
```

---

### ❌ STYLE_PROFILE describes how to write everything
(Philosophy, self-help, blog posts, tweets)

### ✅ Make it specific to long-form contents
```
"You write long-form contents for thoughtful adults.
Your reader has 15-30 minutes and wants depth, not quick answers.
You are not writing tutorials, advice columns, or thought leadership.
You're writing contents that reveal something about how the world actually works."
```

---

### ❌ VOICE_PROFILE repeats STYLE_PROFILE

### ✅ Distinguish them
```
STYLE = "I explore ideas through multiple perspectives"
VOICE = "Ensure each section's perspective shift feels inevitable, not forced"

STYLE = "I use concrete examples"
VOICE = "Cut examples that illustrate the obvious"

STYLE = "I end with insight, not summary"
VOICE = "Ensure the final sentence couldn't appear anywhere else in the content"
```

---

## Advanced: Creating Multiple Voices

If you want different voices for different types of contents:

### Option 1: Switch profiles seasonally
Update STYLE_PROFILE and VOICE_PROFILE once per season.

### Option 2: Create multiple script versions
(More advanced — requires cloning the pipeline)

### Option 3: Use a "Default" voice
Create one STYLE_PROFILE that works across all your content.

(Recommended for starting out)

---

## Quick Customization Checklist

Before using the pipeline:

- [ ] Filled in [YOUR NAME]
- [ ] Named 3-5 writers in STYLE DNA
- [ ] Listed 5-10 forbidden patterns
- [ ] Described your multi-lens approach
- [ ] Written specific sentence rules
- [ ] Run one test topic
- [ ] Read the output
- [ ] Updated profile based on output

Once complete, you're ready to publish.

---

## When to Iterate

After each content, ask:
1. Does this sound like me?
2. Did it use forbidden patterns I don't like?
3. Did it miss any key aspects of my voice?

If yes to any, update STYLE_PROFILE or VOICE_PROFILE and rerun.

After 3-5 contents, your profiles will be dialed in.

---

## Resources

- Compare your output to contents you admire
- Notice what's different
- Add those patterns to STYLE_PROFILE
- Test again

The profile is a living document. Update it as you learn what works.
