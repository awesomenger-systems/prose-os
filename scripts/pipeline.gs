/**
 * ═══════════════════════════════════════════════════════════════
 * Prose OS — AI Editorial Pipeline
 * Lightweight Multi-Stage Editorial Orchestration System
 * Built with Google Apps Script + Gemini + Google Sheets
 *
 * Author: Mahesh Mali
 * ═══════════════════════════════════════════════════════════════
 *
 * NOTE:
 * This public version intentionally omits
 * proprietary editorial prompts, refinement logic,
 * and internal optimization heuristics.
 */

// ─────────────────────────────────────────────────────────────
// EDITORIAL CONFIGURATION
// Replace placeholders with your own editorial logic.
// Keep detailed prompts and refinement systems private.
// ─────────────────────────────────────────────────────────────

const STYLE_CORE = `
Add:
- Editorial structure guidance
- Formatting preferences
- Narrative constraints
- SEO/AEO behavior
- Publication rules
- Writing preferences
`;

const VOICE_CORE = `
Add:
- Editing priorities
- Clarity rules
- Rhythm preferences
- Refinement behavior
- Structural cleanup rules
`;

const RECOMMEND_SKIP_VOICE = true;

// ─────────────────────────────────────────────────────────────
// PIPELINE CONSTANTS
// ─────────────────────────────────────────────────────────────

const MARKER_CONTINUES = "===CONTINUE_WRITING===";
const MARKER_COMPLETE  = "===ESSAY_COMPLETE===";

const ST_PENDING      = "Pending";
const ST_PROCESSING   = "Processing";
const ST_QUOTA_WAIT   = "Quota Wait";
const ST_ERROR        = "Error";
const ST_READY        = "Ready";
const ST_READY_REVIEW = "Ready - Review";
const ST_CONTENT_FAIL = "Content Fail";

const MAX_OUTPUT_TOKENS = 8000;
const MIN_SECTION_WORDS = 300;
const MIN_TOTAL_WORDS   = 900;

// ─────────────────────────────────────────────────────────────
// MODEL ROUTING
// Configure different models for different editorial workloads
// ─────────────────────────────────────────────────────────────

const MODEL_ROUTER = {
  "Duplicate Check": "gemini-1.5-flash",
  "Insight Generator": "gemini-1.5-flash",
  "Structure Planner": "gemini-1.5-flash",
  "Hook Writer": "gemini-2.5-flash",
  "Writer Part 1": "gemini-2.5-flash",
  "Writer Part 2": "gemini-2.5-flash",
  "Fact Checker": "gemini-1.5-flash",
  "Voice Architect": "gemini-2.5-flash",
  "SEO Generator": "gemini-1.5-flash",
  "Final Editor": "gemini-1.5-flash"
};

// ─────────────────────────────────────────────────────────────
// GOOGLE SHEETS MENU
// ─────────────────────────────────────────────────────────────

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Prose OS 🚀")
    .addItem("▶ Run Pipeline", "runPipeline")
    .addItem("⏳ Resume Quota Wait", "resumeQuotaWait")
    .addItem("🔄 Force Rerun", "forceRerun")
    .addSeparator()
    .addItem("🎨 Color Code Dashboard", "colorCodeDashboard")
    .addItem("⏱ Install Trigger", "installTrigger")
    .addToUi();
}

// ─────────────────────────────────────────────────────────────
// INSTALL AUTOMATIC TRIGGER
// ─────────────────────────────────────────────────────────────

function installTrigger() {
  ScriptApp.newTrigger("runPipeline")
    .timeBased()
    .everyMinutes(5)
    .create();
}

// ─────────────────────────────────────────────────────────────
// COLUMN MAPPING
// Maps sheet headers dynamically to avoid hardcoded indexes
// ─────────────────────────────────────────────────────────────

function getColMap(sheet) {
  const headers = sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0];

  const normalized = {};
  const map = {};

  headers.forEach((header, i) => {
    if (!header) return;

    const key = header
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "");

    normalized[key] = i + 1;
  });

  const expected = {
    topic: "topic",
    status: "status",
    agent: "agent",
    insight: "insight",
    thesis: "thesis",
    hook: "hook",
    section1: "section1",
    section2: "section2",
    finalessay: "finalessay",
    metadata: "metadata",
    notes: "notes",
    doclink: "doclink",
    usagelog: "usagelog",
    skipvoice: "skipvoice"
  };

  Object.keys(expected).forEach(key => {
    map[key] = normalized[expected[key]] || null;
  });

  return map;
}

// ─────────────────────────────────────────────────────────────
// UTILITIES
// ─────────────────────────────────────────────────────────────

function updateCell(sheet, row, col, value) {
  if (!col) return;

  sheet.getRange(row, col).setValue(value);
}

function safeInput(text, max = 5000) {
  return (text || "")
    .toString()
    .substring(0, max);
}

function tailInput(text, max = 3500) {
  return (text || "")
    .toString()
    .slice(-max);
}

function cleanMarkers(text) {
  return (text || "")
    .replace(new RegExp(MARKER_CONTINUES, "g"), "")
    .replace(new RegExp(MARKER_COMPLETE, "g"), "")
    .trim();
}

function wordCount(text) {
  return (text || "")
    .toString()
    .split(/\s+/)
    .filter(Boolean)
    .length;
}

function logUsage(sheet, rowNum, col, message) {
  if (!col.usagelog) return;

  const timestamp = Utilities.formatDate(
    new Date(),
    Session.getScriptTimeZone(),
    "yyyy-MM-dd HH:mm:ss"
  );

  updateCell(
    sheet,
    rowNum,
    col.usagelog,
    `[${timestamp}] ${message}`
  );
}

// ─────────────────────────────────────────────────────────────
// DUPLICATE DETECTION PLACEHOLDER
// Replace with semantic memory or embedding-based similarity
// ─────────────────────────────────────────────────────────────

function checkIsDuplicate(topic) {
  // TODO:
  // Compare against semantic summaries
  // stored in Memory sheet.

  return false;
}

// ─────────────────────────────────────────────────────────────
// GEMINI CLIENT
// ─────────────────────────────────────────────────────────────

function callGemini(prompt, agent = "default") {
  const apiKey = PropertiesService
    .getScriptProperties()
    .getProperty("GEMINI_API_KEY");

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY missing");
  }

  const model =
    MODEL_ROUTER[agent] || "gemini-1.5-flash";

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.72,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      topP: 0.95
    }
  };

  const response = UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  const code = response.getResponseCode();

  if (code === 429) {
    throw new Error("QUOTA_EXCEEDED");
  }

  if (code !== 200) {
    throw new Error(
      `API Error ${code}: ${response.getContentText()}`
    );
  }

  const json = JSON.parse(response.getContentText());

  return (
    json.candidates?.[0]?.content?.parts?.[0]?.text || ""
  ).trim();
}

// ─────────────────────────────────────────────────────────────
// RETRY WRAPPER
// ─────────────────────────────────────────────────────────────

function callGeminiWithRetry(
  prompt,
  agent,
  retries = 3
) {
  for (let i = 0; i < retries; i++) {
    try {
      return callGemini(prompt, agent);
    }

    catch (err) {
      if (i === retries - 1) {
        throw err;
      }

      Utilities.sleep(2000 * Math.pow(2, i));
    }
  }
}

// ─────────────────────────────────────────────────────────────
// MAIN ORCHESTRATOR
// Executes exactly ONE stage per execution
// ─────────────────────────────────────────────────────────────

function processNextStep(sheet, rowNum, col, row) {
  const topic =
    (row[col.topic - 1] || "").toString().trim();

  let agent =
    (row[col.agent - 1] || "Duplicate Check")
      .toString()
      .trim();

  const skipVoice =
    RECOMMEND_SKIP_VOICE ||
    String(row[col.skipvoice - 1] || "")
      .toLowerCase() === "yes";

  if (!topic) {
    throw new Error("Topic missing");
  }

  let prompt = "";
  let nextAgent = "";

  // ─────────────────────────────────────────────────────────
  // DUPLICATE CHECK
  // ─────────────────────────────────────────────────────────

  if (agent === "Duplicate Check") {
    const isDuplicate = checkIsDuplicate(topic);

    if (isDuplicate) {
      updateCell(sheet, rowNum, col.status, ST_CONTENT_FAIL);

      logUsage(
        sheet,
        rowNum,
        col,
        "Duplicate topic detected"
      );

      return;
    }

    updateCell(
      sheet,
      rowNum,
      col.agent,
      "Insight Generator"
    );

    return;
  }

  // ─────────────────────────────────────────────────────────
  // INSIGHT GENERATOR
  // ─────────────────────────────────────────────────────────

  if (agent === "Insight Generator") {
    prompt = `
Topic:
"${topic}"

Generate:
- Non-obvious insights
- Behavioral patterns
- Contrasting perspectives
- Editorial angles
`;

    nextAgent = "Structure Planner";
  }

  // ─────────────────────────────────────────────────────────
  // STRUCTURE PLANNER
  // ─────────────────────────────────────────────────────────

  else if (agent === "Structure Planner") {
    prompt = `
Topic:
"${topic}"

Generate:
- Structured outline
- Section flow
- Narrative progression
- Editorial framing
`;

    nextAgent = "Hook Writer";
  }

  // ─────────────────────────────────────────────────────────
  // HOOK WRITER
  // ─────────────────────────────────────────────────────────

  else if (agent === "Hook Writer") {
    prompt = `
Topic:
"${topic}"

Write:
- Strong opening paragraph
- Clear framing
- Reader hook
`;

    nextAgent = "Writer Part 1";
  }

  // ─────────────────────────────────────────────────────────
  // WRITER PART 1
  // ─────────────────────────────────────────────────────────

  else if (agent === "Writer Part 1") {
    prompt = `
${STYLE_CORE}

Topic:
"${topic}"

Write the first half of the article.

End exactly with:
${MARKER_CONTINUES}
`;

    nextAgent = "Writer Part 2";
  }

  // ─────────────────────────────────────────────────────────
  // WRITER PART 2
  // ─────────────────────────────────────────────────────────

  else if (agent === "Writer Part 2") {
    const previous = cleanMarkers(
      sheet.getRange(rowNum, col.section1).getValue()
    );

    prompt = `
${STYLE_CORE}

Continue this article:

${tailInput(previous)}

Complete the article.

End exactly with:
${MARKER_COMPLETE}
`;

    nextAgent = "Fact Checker";
  }

  // ─────────────────────────────────────────────────────────
  // FACT CHECKER
  // ─────────────────────────────────────────────────────────

  else if (agent === "Fact Checker") {
    const section1 = cleanMarkers(
      sheet.getRange(rowNum, col.section1).getValue()
    );

    const section2 = cleanMarkers(
      sheet.getRange(rowNum, col.section2).getValue()
    );

    const content =
      section1 + "\n\n" + section2;

    prompt = `
Review for:
- Factual risks
- Unsupported claims
- Logical inconsistencies

Do not rewrite voice or structure.

${safeInput(content)}
`;

    nextAgent =
      skipVoice
        ? "SEO Generator"
        : "Voice Architect";
  }

  // ─────────────────────────────────────────────────────────
  // VOICE ARCHITECT
  // ─────────────────────────────────────────────────────────

  else if (agent === "Voice Architect") {
    if (skipVoice) {
      updateCell(
        sheet,
        rowNum,
        col.agent,
        "SEO Generator"
      );

      return;
    }

    const content = cleanMarkers(
      sheet.getRange(rowNum, col.finalessay).getValue()
    );

    prompt = `
${VOICE_CORE}

Edit for:
- Clarity
- Rhythm
- Precision
- Readability

${safeInput(content)}
`;

    nextAgent = "SEO Generator";
  }

  // ─────────────────────────────────────────────────────────
  // SEO GENERATOR
  // ─────────────────────────────────────────────────────────

  else if (agent === "SEO Generator") {
    const content = cleanMarkers(
      sheet.getRange(rowNum, col.finalessay).getValue()
    );

    prompt = `
Generate:
- SEO title
- Meta description
- Slug
- FAQs
- AEO metadata

${safeInput(content, 3500)}
`;

    nextAgent = "Final Editor";
  }

  // ─────────────────────────────────────────────────────────
  // FINAL EDITOR
  // ─────────────────────────────────────────────────────────

  else if (agent === "Final Editor") {
    const finalEssay =
      sheet.getRange(rowNum, col.finalessay)
        .getValue();

    const metadata =
      sheet.getRange(rowNum, col.metadata)
        .getValue();

    const docUrl = createGoogleDoc(
      topic,
      finalEssay,
      metadata
    );

    updateCell(
      sheet,
      rowNum,
      col.doclink,
      docUrl
    );

    updateCell(
      sheet,
      rowNum,
      col.status,
      ST_READY
    );

    logUsage(
      sheet,
      rowNum,
      col,
      `Completed (${wordCount(finalEssay)} words)`
    );

    return;
  }

  // ─────────────────────────────────────────────────────────
  // EXECUTE PROMPT
  // ─────────────────────────────────────────────────────────

  if (prompt) {
    const output = callGeminiWithRetry(
      prompt,
      agent
    );

    saveAgentOutput(
      sheet,
      rowNum,
      col,
      agent,
      output
    );

    updateCell(
      sheet,
      rowNum,
      col.agent,
      nextAgent
    );

    logUsage(
      sheet,
      rowNum,
      col,
      `${agent} completed`
    );
  }
}
