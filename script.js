/**
 * Voice Interview — Candidate ↔ Interviewer (logs Q/A, final feedback)
 * - Does NOT use candidate answers to generate next questions (as requested).
 * - Stores {question, answer} for each turn.
 * - Provides "Finish interview" to ask LLM for feedback and performance level.
 * (c) 2024 Google — Apache-2.0
 */

import { marked } from "https://cdn.jsdelivr.net/npm/marked@13.0.3/lib/marked.esm.js";
import DOMPurify from "https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.es.mjs";



// — Real-time camera (mirrored) —
const cameraEl = document.getElementById("camera");

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },  // front camera if available
      audio: false
    });
    cameraEl.srcObject = stream;
  } catch (err) {
    console.error("Camera access error:", err);
    // (Optional) show a small inline message if you want
  }
}

startCamera();



// ───────────────────────────────────────────────
// 1) Job setup
// ───────────────────────────────────────────────
const JOB_TITLE = "AI Scientist";
const JOB_DESCRIPTION = `
We are hiring an AI Scientist to research and build advanced models across LLMs, computer vision, and multimodal AI.
You will design experiments, fine-tune models, evaluate architectures, and collaborate with cross-functional teams
to build responsible and scalable AI systems.
`.trim();

const SYSTEM_PROMPT = `
You are an AI Interviewer conducting a structured job interview for the role of "${JOB_TITLE}".
You must ask one question at a time. Keep the tone professional and concise.
Do not answer your own questions. Do not include commentary or markdown tables.
`.trim();

const STARTER_PROMPT = `
Hi Gemini, you're an AI Interviewer and you are going to recruit a candidate for the following job role: ${JOB_TITLE}.
Here’s the job description:

${JOB_DESCRIPTION}

Start with "Introduce yourself" as the first question.
Then, continue the interview by asking only one new question at a time
based on the job description and your previous question.
Do not include the candidate's responses, just progress naturally with appropriate questions.
`.trim();

const NEXT_QUESTION_PROMPT = (prevQuestion) => `
You're conducting a job interview for the role "${JOB_TITLE}".
Use this job description:

${JOB_DESCRIPTION}

Your previous question was:
"${prevQuestion}"

Now, ask the next relevant question as if the candidate answered.
Do not include any commentary, instructions, or context — output only the next question.
`.trim();

// ⭐ NEW — Final feedback prompt builder
const FEEDBACK_PROMPT = (turns) => `
You are an interview feedback assistant. You are reviewing an interview for the role "${JOB_TITLE}".
Use the job description and the full transcript below to provide constructive, concise feedback.

Job description:
${JOB_DESCRIPTION}

Transcript (each turn has a question and the candidate's answer):
${turns.map((t, i) => `Turn ${i + 1}:\nQ: ${t.question}\nA: ${t.answer || "(no answer)"}\n`).join("\n")}

Return the following sections (plain text, no markdown tables):
1) Summary of strengths (3–6 bullet points)
2) Areas to improve (3–6 bullet points)
3) Evidence (short quotes or references to specific answers, if present)
4) Performance level: ONE WORD from {Poor, Good, Excellent}

Do not include any other sections. Ensure the "Performance level" line contains exactly one of Poor, Good, or Excellent.
`.trim();

// ───────────────────────────────────────────────
// 2) DOM elements
// ───────────────────────────────────────────────
const chat = document.getElementById("chat");
const transcriptEl = document.getElementById("transcript");
const errorEl = document.getElementById("error");
const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const resetBtn = document.getElementById("reset-btn");
const finishBtn = document.getElementById("finish-btn"); // ⭐ NEW
const raw = document.getElementById("raw");

// ───────────────────────────────────────────────
// 3) Helpers
// ───────────────────────────────────────────────
function showError(msg) {
  errorEl.textContent = msg;
  errorEl.style.display = "block";
  setTimeout(() => (errorEl.style.display = "none"), 6000);
}

function addMessage(role, html) {
  const row = document.createElement("div");
  row.className = `msg ${role === "Candidate" ? "candidate" : "interviewer"}`;
  const tag = document.createElement("div");
  tag.className = "tag";
  tag.textContent = `${role}:`;
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerHTML = html;
  row.append(tag, bubble);
  chat.append(row);
  chat.scrollTop = chat.scrollHeight;
  return bubble;
}

function stripMarkdown(md) {
  const tmp = document.createElement("div");
  tmp.innerHTML = DOMPurify.sanitize(marked.parse(md));
  return tmp.textContent || tmp.innerText || md;
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 1.0;
  u.pitch = 1.0;
  u.volume = 1.0;
  speechSynthesis.speak(u);
}

// ───────────────────────────────────────────────
// 4) Model session setup (fixed params)
// ───────────────────────────────────────────────
let session = null;
async function ensureSession() {
  if (!("LanguageModel" in self)) {
    showError("Prompt API not available. Please use Chrome (Dev/Canary) with AI flags enabled.");
    throw new Error("Prompt API unavailable");
  }
  if (!session) {
    session = await LanguageModel.create({
      temperature: 0.3,
      topK: 3,
      output: { language: "en" },
      initialPrompts: [{ role: "system", content: SYSTEM_PROMPT }],
    });
  }
  return session;
}

// ───────────────────────────────────────────────
// 5) Interview flow + LOGGING
// ───────────────────────────────────────────────
let previousQuestion = "";
let listening = false;

// ⭐ NEW — store all turns here
const interviewLog = []; // [{question: string, answer: string}]

async function askQuestion(promptText) {
  const sess = await ensureSession();
  const interviewerBubble = addMessage("Interviewer", "…");
  let result = "", prev = "";

  const stream = await sess.promptStreaming(promptText);
  for await (const chunk of stream) {
    const diff = chunk.startsWith(prev) ? chunk.slice(prev.length) : chunk;
    result += diff;
    interviewerBubble.innerHTML = DOMPurify.sanitize(marked.parse(result));
    raw.textContent = result;
    prev = chunk;
  }

  const plain = stripMarkdown(result).trim();
  previousQuestion = plain;

  // ⭐ NEW — add a new turn with empty answer placeholder
  interviewLog.push({ question: plain, answer: "" });

  speak(plain);
}

// Start interview immediately
(async function initInterview() {
  try {
    await askQuestion(STARTER_PROMPT);
  } catch (err) {
    showError(err.message || "Error starting interview");
  }
})();

// ───────────────────────────────────────────────
// 6) Speech recognition setup
// ───────────────────────────────────────────────
const SpeechRecognition =
  self.SpeechRecognition || self.webkitSpeechRecognition || null;
let recognition = null;

function initRecognition() {
  if (!SpeechRecognition) {
    startBtn.disabled = true;
    stopBtn.disabled = true;
    showError("Speech Recognition API not supported in this browser.");
    return;
  }

  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = true;

  let finalTranscript = "";

  recognition.onstart = () => {
    listening = true;
    transcriptEl.textContent = "Listening…";
    startBtn.disabled = true;
    stopBtn.disabled = false;
  };

  recognition.onerror = (e) => {
    console.warn("Speech recognition error:", e.error);
    showError(`Mic error: ${e.error}`);
  };

  recognition.onresult = (evt) => {
    let interim = "";
    for (let i = evt.resultIndex; i < evt.results.length; i++) {
      const t = evt.results[i][0].transcript;
      if (evt.results[i].isFinal) finalTranscript += t + " ";
      else interim += t;
    }
    transcriptEl.textContent = (finalTranscript + interim).trim();
  };

  recognition.onend = async () => {
    listening = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;

    const text = transcriptEl.textContent.trim();
    if (!text) return;

    // Candidate bubble
    addMessage("Candidate", DOMPurify.sanitize(text));

    // ⭐ NEW — attach the candidate answer to the LAST turn
    const lastTurn = interviewLog[interviewLog.length - 1];
    if (lastTurn) lastTurn.answer = text;

    transcriptEl.textContent = "";

    // Generate next question WITHOUT using user response
    try {
      await askQuestion(NEXT_QUESTION_PROMPT(previousQuestion));
    } catch (err) {
      showError(err.message || "Error generating next question");
    }
  };
}
initRecognition();

// ───────────────────────────────────────────────
// 7) Controls
// ───────────────────────────────────────────────
startBtn.addEventListener("click", () => {
  if (!recognition) return;
  try {
    window.speechSynthesis.cancel();
    transcriptEl.textContent = "";
    // reset partial buffer for a fresh utterance
    // (Chrome sometimes reuses the last interim buffer across starts)
    recognition.abort?.();
    recognition.start();
  } catch (e) {
    showError("Failed to start mic. Check HTTPS and mic permissions.");
  }
});

stopBtn.addEventListener("click", () => {
  if (recognition && listening) recognition.stop();
});

resetBtn.addEventListener("click", async () => {
  window.speechSynthesis.cancel();
  chat.innerHTML = "";
  raw.textContent = "";
  transcriptEl.textContent = "";
  previousQuestion = "";
  interviewLog.length = 0; // ⭐ NEW — clear log
  session?.destroy?.();
  session = null;
  if (listening) recognition.stop();
  startBtn.disabled = false;
  stopBtn.disabled = true;

  try {
    await askQuestion(STARTER_PROMPT);
  } catch (err) {
    showError(err.message || "Error restarting interview");
  }
});

// ⭐ NEW — Finish interview: send log to LLM for feedback
finishBtn.addEventListener("click", async () => {
  window.speechSynthesis.cancel();

  if (interviewLog.length === 0) {
    showError("No interview turns recorded yet.");
    return;
  }

  try {
    const sess = await ensureSession();
    const bubble = addMessage("Interviewer", "<i>Analyzing interview and preparing feedback…</i>");
    let result = "", prev = "";

    const feedbackPrompt = FEEDBACK_PROMPT(interviewLog);
    const stream = await sess.promptStreaming(feedbackPrompt);

    for await (const chunk of stream) {
      const diff = chunk.startsWith(prev) ? chunk.slice(prev.length) : chunk;
      result += diff;
      bubble.innerHTML = DOMPurify.sanitize(marked.parse(result));
      raw.textContent = result;
      prev = chunk;
    }

    // Try to speak the concise verdict if available
    const verdictMatch = /Performance level:\s*(Poor|Good|Excellent)/i.exec(result);
    if (verdictMatch) {
      speak(`Performance level: ${verdictMatch[1]}`);
    } else {
      // fallback: speak first line
      const firstLine = stripMarkdown(result).split("\n").find(Boolean) || "Feedback ready.";
      speak(firstLine);
    }
  } catch (err) {
    addMessage("Interviewer", `<i>Error during feedback:</i> ${DOMPurify.sanitize(err.message)}`);
    showError(err.message || "Unknown error while generating feedback");
  }
});
