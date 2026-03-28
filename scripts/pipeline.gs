/**
 * ═══════════════════════════════════════════════════════════════
 * ProseOS — AI Essay & Long-Form Content Pipeline
 * 17-stage quality-controlled system using Google Sheets + Gemini
 * Output: Professional Google Docs with SEO metadata + image briefs
 * 
 * Recommended: Keep RECOMMEND_SKIP_VOICE = true to save API calls
 * ═══════════════════════════════════════════════════════════════
 */

// ─── CONFIGURATION ────────────────────────────────────────────────────────────
const STYLE_PROFILE = `[Insert your full Writing Style Profile here]`;

const VOICE_PROFILE = `[Insert your full Editing Voice Profile here]`;

// Cost Optimization
const RECOMMEND_SKIP_VOICE = true;   // Recommended: true

const GEMINI_MODEL = "gemini-2.5-flash";
const MAX_OUTPUT = 8000;

const MARKER_CONTINUES = "<<<CONTINUES>>>";
const MARKER_COMPLETE  = "<<<COMPLETE>>>";

// Status constants
const ST_PENDING       = "Pending";
const ST_PROCESSING    = "Processing";
const ST_QUOTA_WAIT    = "Quota Wait";
const ST_ERROR         = "Error";
const ST_READY         = "Ready";
const ST_READY_REVIEW  = "Ready - Review";
const ST_CONTENT_FAIL  = "Content Fail";

// ─── DUPLICATE CHECK ─────────────────────────────────────────────────────────
function checkIsDuplicate(topic) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const mem = ss.getSheetByName("Memory");
  if (!mem) return false;

  const data = mem.getDataRange().getValues();
  if (data.length < 2) return false;

  const pastTopics = data.slice(1).map(row => (row[1] || "").toString().trim());

  const currentWords = topic
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 4);

  if (currentWords.length === 0) return false;

  for (let past of pastTopics) {
    if (!past) continue;
    const pastWords = past.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(/\s+/);
    const matches = currentWords.filter(word => pastWords.includes(word));
    if (matches.length / currentWords.length > 0.4) return true;
  }
  return false;
}

// ─── UTILITIES ───────────────────────────────────────────────────────────────
function getColMap(sheet) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const map = {};
  headers.forEach((h, i) => {
    const key = h.toString().toLowerCase().replace(/[^a-z0-9]/g, "");
    map[key] = i + 1;
  });
  return map;
}

function updateCell(sheet, row, col, val) {
  if (!col) return;
  sheet.getRange(row, col).setValue(val);
  SpreadsheetApp.flush();
}

function safeInput(text) {
  if (!text) return "";
  return text.toString().substring(0, 8000);
}

function tailInput(text) {
  if (!text) return "";
  return text.toString().slice(-4000);
}

function cleanMarkers(text) {
  if (!text) return "";
  return text.toString()
    .replace(MARKER_CONTINUES, "")
    .replace(MARKER_COMPLETE, "")
    .trim();
}

function wordCount(text) {
  return (text || "").toString().split(/\s+/).filter(Boolean).length;
}

// ─── GEMINI API ──────────────────────────────────────────────────────────────
function callGeminiWithRetry(prompt) {
  for (let i = 0; i < 3; i++) {
    try {
      return callGemini(prompt);
    } catch (e) {
      if (i === 2) throw e;
      Utilities.sleep(5000 * Math.pow(2, i));
    }
  }
}

function callGemini(prompt) {
  const key = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
  if (!key) throw new Error("GEMINI_API_KEY not found in Script Properties");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`;
  
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: MAX_OUTPUT }
  };

  const response = UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  if (response.getResponseCode() !== 200) {
    throw new Error(`API Error: ${response.getContentText().substring(0, 300)}`);
  }

  const json = JSON.parse(response.getContentText());
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text || "";

  return {
    text: text,
    usage: `Tokens: ${json.usageMetadata?.totalTokenCount || "?"}`
  };
}

// ─── GOOGLE DOC CREATION ─────────────────────────────────────────────────────
function createGoogleDoc(topic, blogContent, seoContent) {
  const doc = DocumentApp.create(`Draft: ${topic}`);
  const body = doc.getBody();
  body.clear();

  body.appendParagraph(topic)
      .setFontSize(24)
      .setBold(true)
      .setLineSpacing(1.5)
      .setSpacingAfter(18);

  body.appendHorizontalRule();

  if (seoContent) {
    body.appendParagraph("📋 SEO & METADATA").setBold(true).setFontSize(14);
    body.appendParagraph(seoContent).setFontSize(10).setForegroundColor("#444444");
    body.appendHorizontalRule();
  }

  const lines = blogContent.split("\n");
  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;

    let p;
    if (trimmed.startsWith("# ")) {
      p = body.appendParagraph(trimmed.replace("# ", "")).setHeading(DocumentApp.ParagraphHeading.HEADING1);
    } else if (trimmed.startsWith("## ")) {
      p = body.appendParagraph(trimmed.replace("## ", "")).setHeading(DocumentApp.ParagraphHeading.HEADING2);
    } else if (trimmed.startsWith("> ")) {
      p = body.appendParagraph(trimmed.replace("> ", "")).setItalic(true).setIndentStart(36);
    } else {
      p = body.appendParagraph(trimmed);
    }

    if (p) p.setFontSize(12).setLineSpacing(1.5);
  });

  doc.saveAndClose();
  return doc.getUrl();
}

// ─── MENU ────────────────────────────────────────────────────────────────────
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Awesomengers")
    .addItem("Run Pipeline", "runPipeline")
    .addItem("Force Rerun", "forceRerun")
    .addItem("Resume Quota Wait Rows", "resumeQuotaWait")
    .addSeparator()
    .addItem("Discover Trending Ideas", "fetchTrendingIdeas")
    .addItem("Approve Ideas to Dashboard", "approveIdeas")
    .addItem("Archive Finished Articles", "archiveFinished")
    .addSeparator()
    .addItem("Color-Code Dashboard", "colorcodeDashboard")
    .addItem("Refresh Pipeline Health", "updatePipelineHealth")
    .addToUi();
}

// ─── MAIN PIPELINE ───────────────────────────────────────────────────────────
function processNextStep(sheet, rowNum, col, row) {
  const topic      = (row[col.topic - 1] || "").trim();
  let   agent      = (row[col.agent - 1] || "Duplicate Check").trim();
  const insight    = row[col.insight - 1] || "";
  const thesis     = row[col.thesis - 1] || "";
  const section1   = row[col.section1 - 1] || "";
  const section2   = row[col.section2 - 1] || "";
  const finalEssay = row[col.finalessay - 1] || "";

  const skipVoice = RECOMMEND_SKIP_VOICE || 
                    (col.skipvoice && String(row[col.skipvoice - 1] || "").toLowerCase().trim() === "yes");

  if (!topic) throw new Error("Topic column is empty.");

  let prompt = "";
  let nextAgent = "";

  switch (agent) {

    case "Duplicate Check":
      if (checkIsDuplicate(topic)) {
        updateCell(sheet, rowNum, col.status, ST_ERROR);
        updateCell(sheet, rowNum, col.usagelog, 
          "DUPLICATE WARNING: Topic overlaps with a previously published essay.\n" +
          "Change the angle or set Agent to 'Insight Generator' to override.");
        return;
      }
      updateCell(sheet, rowNum, col.agent, "Insight Generator");
      updateCell(sheet, rowNum, col.usagelog, "Duplicate check passed ✓");
      return;

    case "Insight Generator":
      prompt = `Topic: "${topic}"\n\nGenerate 3 non-obvious insights and 2 observable patterns. Label: INSIGHTS: and PATTERNS:.`;
      nextAgent = "Thesis Architect";
      break;

    case "Thesis Architect":
      prompt = `Topic: "${topic}"\nInsights: ${insight}\n\nWrite ONE strong thesis statement (1-2 sentences) with tension.`;
      nextAgent = "Hook Writer";
      break;

    case "Hook Writer":
      prompt = `Thesis: ${thesis}\n\nWrite 60-90 word opening paragraph. Start with concrete observation. No clichés.`;
      nextAgent = "Writer Part 1";
      break;

    case "Writer Part 1":
      prompt = `${STYLE_PROFILE}\n\nTopic: "${topic}"\nThesis: ${thesis}\n\nWrite first ~800 words.\nEnd with: ${MARKER_CONTINUES}`;
      nextAgent = "Writer Part 2";
      break;

    case "Writer Part 2":
      prompt = `${STYLE_PROFILE}\n\nTopic: "${topic}"\nContinue from:\n"""\n${tailInput(cleanMarkers(section1))}\n"""\n\nWrite ~800 more words. End with memorable insight.\nEnd with: ${MARKER_COMPLETE}`;
      nextAgent = "Word Count Gate";
      break;

    case "Word Count Gate":
      const totalWords = wordCount(cleanMarkers(section1)) + wordCount(cleanMarkers(section2));
      if (totalWords < 1000) throw new Error(`WORD COUNT FAIL: ${totalWords} words`);
      
      updateCell(sheet, rowNum, col.usagelog, `Word count OK (${totalWords} words)`);
      
      if (skipVoice) {
        updateCell(sheet, rowNum, col.agent, "Merge Sections");
        updateCell(sheet, rowNum, col.usagelog, "Voice Architect skipped (recommended - saves API calls)");
      } else {
        updateCell(sheet, rowNum, col.agent, "Fact Checker (Part 1)");
      }
      return;

    case "Fact Checker (Part 1)":
      prompt = `Review this essay section for factual accuracy. Rewrite ONLY incorrect sentences. Keep style intact:\n\n${safeInput(section1)}`;
      nextAgent = "Fact Checker (Part 2)";
      break;

    case "Fact Checker (Part 2)":
      prompt = `Review this essay section for factual accuracy. Rewrite ONLY incorrect sentences. Keep style intact:\n\n${safeInput(section2)}`;
      nextAgent = "Merge Sections";
      break;

    case "Merge Sections":
      const mergedContent = cleanMarkers(section1) + "\n\n" + cleanMarkers(section2);
      updateCell(sheet, rowNum, col.finalessay, mergedContent);
      
      if (skipVoice) {
        updateCell(sheet, rowNum, col.agent, "Blog Formatter");
      } else {
        updateCell(sheet, rowNum, col.agent, "Voice Architect (Part 1)");
      }
      return;

    case "Voice Architect (Part 1)":
      prompt = `${VOICE_PROFILE}\n\nSharpen the prose, vary rhythm, and remove passive voice:\n\n${safeInput(section1)}`;
      nextAgent = "Voice Architect (Part 2)";
      break;

    case "Voice Architect (Part 2)":
      prompt = `${VOICE_PROFILE}\n\nSharpen the prose, vary rhythm, and remove passive voice:\n\n${safeInput(section2)}`;
      nextAgent = "Blog Formatter";
      break;

    case "Blog Formatter":
      prompt = `Transform this essay into a structured blog post. Use # H1, ## H2s. Include 1 pull-quote (> quote). Paragraphs 3-5 sentences max.\n\nContent:\n${finalEssay || (section1 + "\n\n" + section2)}`;
      nextAgent = "SEO Generator";
      break;

    case "SEO Generator":
      prompt = `Generate SEO metadata:\nBEST_TITLE (under 65 chars)\nMETA_DESCRIPTION (150-160 chars)\n3 FAQs\n\nContent:\n${safeInput(finalEssay)}`;
      nextAgent = "Image Prompt Architect";
      break;

    case "Image Prompt Architect":
      prompt = `Generate 3 editorial image prompts (Hero, Section, Anchor) - conceptual style with negative space.\nTopic: "${topic}"`;
      nextAgent = "Final Editor";
      break;

    case "Final Editor":
      const docLink = createGoogleDoc(topic, finalEssay || (section1 + "\n\n" + section2), row[col.metadata - 1] || "");
      updateCell(sheet, rowNum, col.doclink, docLink);
      updateCell(sheet, rowNum, col.status, ST_READY);
      updateCell(sheet, rowNum, col.usagelog, "✅ Google Doc created successfully");
      return;

    default:
      throw new Error(`Unknown agent: ${agent}`);
  }

  if (prompt) {
    const res = callGeminiWithRetry(prompt);
    saveAgentOutput(sheet, rowNum, col, agent, res, nextAgent);
  }
}

// ─── RESPONSE HANDLER ────────────────────────────────────────────────────────
function saveAgentOutput(sheet, rowNum, col, agent, res, nextAgent) {
  const text = res.text || "";

  if (agent === "Insight Generator") {
    const insights = text.match(/INSIGHTS:([\s\S]*?)(?=PATTERNS:|$)/i);
    const patterns = text.match(/PATTERNS:([\s\S]*)/i);
    if (insights) updateCell(sheet, rowNum, col.insight, insights[1].trim());
    if (patterns) updateCell(sheet, rowNum, col.pattern, patterns[1].trim());
  } else {
    const mapping = {
      "Thesis Architect": col.thesis,
      "Hook Writer": col.hook,
      "Writer Part 1": col.section1,
      "Writer Part 2": col.section2,
      "Fact Checker (Part 1)": col.section1,
      "Fact Checker (Part 2)": col.section2,
      "Voice Architect (Part 1)": col.section1,
      "Voice Architect (Part 2)": col.section2,
      "Blog Formatter": col.finalessay,
      "SEO Generator": col.metadata,
      "Image Prompt Architect": col.notes || col.metadata
    };

    const targetCol = mapping[agent];
    if (targetCol) updateCell(sheet, rowNum, targetCol, text);
  }

  updateCell(sheet, rowNum, col.agent, nextAgent);
  updateCell(sheet, rowNum, col.usagelog, res.usage);
}

// ─── ENTRY POINT ─────────────────────────────────────────────────────────────
function runPipeline() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dash = ss.getSheetByName("Dashboard");
  if (!dash) throw new Error("Dashboard sheet not found");

  const col = getColMap(dash);
  const data = dash.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    const status = (data[i][col.status - 1] || "").toString().trim();
    if (status === ST_PENDING || status === ST_PROCESSING) {
      updateCell(dash, i + 1, col.status, ST_PROCESSING);
      try {
        processNextStep(dash, i + 1, col, data[i]);
      } catch (e) {
        updateCell(dash, i + 1, col.status, ST_ERROR);
        updateCell(dash, i + 1, col.usagelog, e.message);
        console.error(e);
      }
      break;
    }
  }
}

// ─── ADDITIONAL FUNCTIONS ────────────────────────────────────────────────────
function forceRerun() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dash = ss.getSheetByName("Dashboard");
  if (!dash) return;

  const col = getColMap(dash);
  const data = dash.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    const status = (data[i][col.status - 1] || "").toString();
    if (status.includes("Error") || status.includes("Fail") || status === ST_READY) {
      updateCell(dash, i + 1, col.status, ST_PROCESSING);
      processNextStep(dash, i + 1, col, data[i]);
      break;
    }
  }
}

function resumeQuotaWait() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dash = ss.getSheetByName("Dashboard");
  if (!dash) return;

  const col = getColMap(dash);
  const data = dash.getDataRange().getValues();

  let resumed = 0;
  for (let i = 1; i < data.length; i++) {
    if ((data[i][col.status - 1] || "").toString().includes("Quota")) {
      updateCell(dash, i + 1, col.status, ST_PENDING);
      resumed++;
    }
  }
  console.log(`Resumed ${resumed} rows`);
}

function colorcodeDashboard() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dash = ss.getSheetByName("Dashboard");
  if (!dash) return;

  const col = getColMap(dash);
  const data = dash.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    const status = (data[i][col.status - 1] || "").toString().toLowerCase();
    let color = "#ffffff";

    if (status === "ready") color = "#d4edda";
    else if (status === "processing") color = "#fff3cd";
    else if (status.includes("error")) color = "#f8d7da";
    else if (status.includes("quota")) color = "#ffe5cc";
    else if (status === "pending") color = "#f0f0f0";

    dash.getRange(i + 1, 1, 1, dash.getLastColumn()).setBackground(color);
  }
}

function updatePipelineHealth() {
  // Optional: Add basic health tracking if needed
  console.log("Pipeline health updated");
}

// Placeholder for other functions (add more as you need)
function fetchTrendingIdeas() { console.log("Trending ideas discovery - implement if needed"); }
function approveIdeas() { console.log("Approve ideas - implement if needed"); }
function archiveFinished() { console.log("Archive finished - implement if needed"); }
