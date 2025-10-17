import { deterministicVariant } from "@/lib/hashing/deterministicVariant";
import type {
  AgentOptions,
  AgentReplyType,
  AttachmentMeta,
  FocusOption,
  ModelChoice,
  ResponseLength,
  ToneOption,
} from "@/types";

const FRIENDLY_GREETINGS = [
  "Hey there!",
  "Hi! Great question.",
  "Hello! Happy to help.",
];

const FRIENDLY_CLOSINGS = [
  "Let me know what else you need.",
  "I’m here if you want to dig deeper.",
  "Feel free to ask for more detail anytime.",
];

const FORMAL_GREETINGS = ["Greetings.", "Hello.", "Good day."];

const FORMAL_CLOSINGS = [
  "Please advise if further detail is required.",
  "Do not hesitate to follow up for clarification.",
  "I remain available for any additional questions.",
];

const NEUTRAL_TRANSITIONS: Record<ModelChoice, string> = {
  "gpt-mini": "Here is the concise breakdown:",
  "gpt-prose": "Here’s a cohesive walkthrough:",
  "gpt-tutor": "Let’s unpack this together:",
};

const MODEL_SIGNOFF: Record<ModelChoice, string> = {
  "gpt-mini": "_Model gpt-mini prioritises succinct, direct guidance._",
  "gpt-prose": "_Model gpt-prose leans into smooth narrative phrasing._",
  "gpt-tutor": "_Model gpt-tutor highlights learning cues for you._",
};

const LEARNING_TIPS = [
  "Learning tip: try summarising the answer in your own words to refine understanding.",
  "Learning tip: teach this concept to someone else—it cements the knowledge.",
  "Learning tip: jot the key steps on a sticky note for quick recall later.",
];

const SHORT_RESP_LIMITS: Record<ResponseLength, number> = {
  short: 2,
  medium: 4,
  long: 6,
};

const STEP_LIMITS: Record<ResponseLength, number> = {
  short: 3,
  medium: 5,
  long: 7,
};

const BULLET_LIMITS: Record<ResponseLength, number> = {
  short: 3,
  medium: 5,
  long: 7,
};

function pickVariant(
  options: AgentOptions,
  source: string[],
  seed: string,
): string {
  const index = deterministicVariant(
    `${seed}-${options.model}-${options.tone}`,
    source.length,
  );
  return source[index];
}

function normalise(text: string): string {
  return text.trim().toLowerCase();
}

function isImperativeStart(text: string): boolean {
  const [firstWord] = text.split(/\s+/);
  if (!firstWord) return false;
  return [
    "build",
    "create",
    "design",
    "draft",
    "write",
    "plan",
    "explain",
  ].includes(firstWord);
}

export function detectReplyType(
  text: string,
  options: AgentOptions,
): AgentReplyType {
  const lowered = normalise(text);

  if (!lowered) {
    return "summary";
  }

  if (
    lowered.startsWith("what is") ||
    lowered.includes("define ") ||
    lowered.includes("definition") ||
    options.focus === "technical"
  ) {
    return "definition";
  }

  if (
    lowered.startsWith("how to") ||
    lowered.startsWith("how do i") ||
    lowered.includes(" step ") ||
    lowered.includes("guide") ||
    options.focus === "actionable" ||
    isImperativeStart(lowered)
  ) {
    return "steps";
  }

  if (lowered.includes("?")) {
    return "qa";
  }

  if (lowered.split(/\s+/).length <= 4) {
    return "quip";
  }

  if (lowered.includes("list") || lowered.includes("ideas")) {
    return "bullets";
  }

  return "summary";
}

export function computeTypingDelay(
  text: string,
  options: AgentOptions,
  attachments: AttachmentMeta[],
): number {
  const lengthFactor = Math.min(text.length * 7, 300);
  const responseAdjustment =
    options.responseLength === "long"
      ? 180
      : options.responseLength === "short"
        ? -40
        : 80;
  const attachmentAdjustment = attachments.length * 35;
  const focusAdjustment =
    options.focus === "technical"
      ? 40
      : options.focus === "actionable"
        ? 60
        : 0;

  const total =
    320 +
    lengthFactor +
    responseAdjustment +
    attachmentAdjustment +
    focusAdjustment;
  return Math.max(300, Math.min(800, total));
}

export function buildAttachmentLine(
  attachments: AttachmentMeta[],
): string | null {
  if (attachments.length === 0) {
    return null;
  }

  const extensions = Array.from(
    new Set(
      attachments
        .map((attachment) => attachment.extension.toLowerCase())
        .filter(Boolean),
    ),
  ).join(", ");

  const noun = attachments.length === 1 ? "attachment" : "attachments";
  const suffix = extensions ? ` (${extensions})` : "";
  return `> I noticed ${attachments.length} ${noun}${suffix}. I'll keep them in mind.`;
}

export function extractSubject(text: string): string {
  const cleaned = text.replace(/\?+$/, "").trim();
  if (!cleaned) {
    return "your request";
  }

  const withoutLead = cleaned.replace(
    /^(how to|how do i|what is|define|explain)\s+/i,
    "",
  );

  return withoutLead.charAt(0).toUpperCase() + withoutLead.slice(1);
}

function getGreeting(
  tone: ToneOption,
  options: AgentOptions,
  seed: string,
): string | null {
  if (tone === "friendly") {
    return pickVariant(options, FRIENDLY_GREETINGS, `greet-${seed}`);
  }
  if (tone === "formal") {
    return pickVariant(options, FORMAL_GREETINGS, `greet-${seed}`);
  }
  return null;
}

function getClosing(
  tone: ToneOption,
  options: AgentOptions,
  seed: string,
): string | null {
  if (tone === "friendly") {
    return pickVariant(options, FRIENDLY_CLOSINGS, `close-${seed}`);
  }
  if (tone === "formal") {
    return pickVariant(options, FORMAL_CLOSINGS, `close-${seed}`);
  }
  return null;
}

function buildFocusLine(
  focus: FocusOption,
  responseLength: ResponseLength,
): string | null {
  const emphasis = responseLength === "long" ? "Detailed focus" : "Focus";
  switch (focus) {
    case "overview":
      return `${emphasis}: a clear overview you can skim quickly.`;
    case "technical":
      return `${emphasis}: technical nuance so implementation is safer.`;
    case "actionable":
      return `${emphasis}: concrete moves you can take next.`;
    default:
      return null;
  }
}

function applyModelVoice(model: ModelChoice, body: string): string {
  if (model === "gpt-mini") {
    return body
      .split("\n")
      .map((line) => line.replace(/\b(and|that)\b/gi, "").trim())
      .join("\n")
      .replace(/\n{3,}/g, "\n\n");
  }

  if (model === "gpt-prose") {
    return body.replace(/\n\n/g, "\n\n");
  }

  return body;
}

function maybeAddLearningTip(
  model: ModelChoice,
  options: AgentOptions,
  seed: string,
): string | null {
  if (model !== "gpt-tutor") {
    return null;
  }

  return pickVariant(options, LEARNING_TIPS, `tip-${seed}`);
}

export interface ReplyFragments {
  header?: string | null;
  body: string;
  footer?: string | null;
  attachmentNote?: string | null;
  modelSignature: string;
  learningTip?: string | null;
}

export function composeReply(
  replyType: AgentReplyType,
  subject: string,
  originalInput: string,
  options: AgentOptions,
  attachments: AttachmentMeta[],
): ReplyFragments {
  const seed = `${replyType}-${subject}-${originalInput.length}`;
  const greeting = getGreeting(options.tone, options, seed);
  const closing = getClosing(options.tone, options, seed);
  const transition = NEUTRAL_TRANSITIONS[options.model];
  const attachmentNote = buildAttachmentLine(attachments);
  const focusLine = buildFocusLine(options.focus, options.responseLength);

  const builders: Record<AgentReplyType, () => string> = {
    summary: () => buildSummary(subject, options, transition, focusLine),
    bullets: () => buildBullets(subject, options, transition, focusLine),
    steps: () => buildSteps(subject, options, transition, focusLine),
    quip: () => buildQuip(subject, options),
    definition: () => buildDefinition(subject, options, transition, focusLine),
    qa: () => buildQA(subject, originalInput, options, transition, focusLine),
  };

  const rawBody = builders[replyType]();
  const withVoice = applyModelVoice(options.model, rawBody);
  const modelSignature = MODEL_SIGNOFF[options.model];
  const learningTip = maybeAddLearningTip(options.model, options, seed);

  return {
    header: greeting,
    body: withVoice,
    footer: closing,
    attachmentNote,
    modelSignature,
    learningTip,
  };
}

function buildSummary(
  subject: string,
  options: AgentOptions,
  transition: string,
  focusLine: string | null,
): string {
  const detail = SHORT_RESP_LIMITS[options.responseLength];
  const highlight =
    options.responseLength === "long" ? "Key takeaways" : "Highlights";
  const segments = [
    `**${highlight} on ${subject}:**`,
    `${transition} ${subject} boils down to ${detail} essentials you can act on swiftly.`,
  ];

  if (focusLine) {
    segments.push(focusLine);
  }

  if (options.responseLength !== "short") {
    segments.push(
      `• Impact: expect measurable outcomes after ${options.responseLength === "long" ? "a structured follow-through" : "a focused session"}.`,
      `• Watch-outs: track progress at least once every ${options.responseLength === "long" ? "few days" : "week"}.`,
    );
  }

  return segments.join("\n\n");
}

function buildBullets(
  subject: string,
  options: AgentOptions,
  transition: string,
  focusLine: string | null,
): string {
  const limit = BULLET_LIMITS[options.responseLength];
  const bullets = [
    `- Core idea: clarify the objective of ${subject}.`,
    "- Context: note the audience and constraints.",
    "- Signals: establish what success should look like.",
    "- Risks: list known blockers and mitigation tactics.",
    "- Next checkpoint: schedule a review to adjust course.",
    "- Resource hint: prep a quick reference doc.",
    "- Reflection: capture lessons learned for reuse.",
  ].slice(0, limit);

  const sections = [
    `${transition} Here’s a quick-hit list for ${subject}:`,
    ...bullets,
  ];

  if (focusLine) {
    sections.splice(1, 0, `- ${focusLine}`);
  }

  return sections.join("\n");
}

function buildSteps(
  subject: string,
  options: AgentOptions,
  transition: string,
  focusLine: string | null,
): string {
  const limit = STEP_LIMITS[options.responseLength];
  const steps = [
    `Gather context about ${subject} and confirm the goal.`,
    "Break the work into manageable milestones.",
    "Assign ownership and deadlines for each milestone.",
    "Validate early progress with a quick review.",
    "Document insights in a lightweight tracker.",
    "Plan a retrospective to capture improvements.",
    "Share the outcome with stakeholders succinctly.",
  ].slice(0, limit);

  const numbered = steps.map((step, index) => `${index + 1}. ${step}`);

  const sections = [
    `${transition} Follow these steps for ${subject}:`,
    ...numbered,
  ];

  if (focusLine) {
    sections.splice(1, 0, `_${focusLine}_`);
  }

  return sections.join("\n");
}

function buildQuip(subject: string, options: AgentOptions): string {
  const flavour =
    options.tone === "friendly"
      ? `Looks like ${subject} just asked for a high-five.`
      : `Consider ${subject} handled with minimal fuss.`;
  return `${flavour} ${options.model === "gpt-mini" ? "Done and dusted." : "All set on my end."}`;
}

function buildDefinition(
  subject: string,
  options: AgentOptions,
  transition: string,
  focusLine: string | null,
): string {
  const exampleIntro =
    options.responseLength === "long"
      ? "Illustrative scenario"
      : "Quick example";

  const lines = [
    `${transition} Let’s pin down ${subject}.`,
    `**Definition:** ${subject} refers to the essential mechanics that keep your process reliable and predictable.`,
    `**${exampleIntro}:** imagine applying it during a sprint review—everyone knows the checklist, the signals, and the standards.`,
  ];

  if (focusLine) {
    lines.push(`**Focus note:** ${focusLine}`);
  }

  if (options.responseLength === "long") {
    lines.push(
      "- When to use it: to align new collaborators fast.",
      "- When to adapt: if constraints change mid-project.",
    );
  }

  return lines.join("\n\n");
}

function buildQA(
  subject: string,
  originalInput: string,
  options: AgentOptions,
  transition: string,
  focusLine: string | null,
): string {
  const answerIntro =
    options.responseLength === "short"
      ? "Answer"
      : options.responseLength === "long"
        ? "Expanded answer"
        : "Detailed answer";

  const lines = [
    `**Q:** ${originalInput.trim()}`,
    `**A:** ${transition} ${subject} depends on aligning intent, constraints, and measurement in one place.`,
  ];

  if (focusLine) {
    lines.push(`**Focus reminder:** ${focusLine}`);
  }

  if (options.responseLength !== "short") {
    lines.push(
      `**${answerIntro}:** carve out time to draft, review, and iterate with clear checkpoints.`,
    );
  }

  if (options.responseLength === "long") {
    lines.push(
      "- Follow-up: collect feedback after first implementation.",
      "- Signal: stick with a single metric to gauge success.",
    );
  }

  return lines.join("\n\n");
}
