import { deterministicVariant } from "@/lib/hashing/deterministicVariant";
import type {
  AgentOptions,
  AgentReplyType,
  AttachmentMeta,
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
  "Happy to keep brainstorming whenever you are.",
];

const FORMAL_GREETINGS = ["Greetings.", "Hello.", "Good day."];

const FORMAL_CLOSINGS = [
  "Please advise if further clarification is required.",
  "Do not hesitate to follow up for additional detail.",
  "I remain available for any subsequent questions.",
];

const MODEL_TRANSITIONS: Record<ModelChoice, string> = {
  "gpt-mini": "Here’s the condensed view:",
  "gpt-prose": "Here’s the flow of the idea:",
  "gpt-tutor": "Let’s unpack it together:",
};

const MODEL_SIGNATURE: Record<ModelChoice, string> = {
  "gpt-mini": "_Model gpt-mini keeps things crisp and direct._",
  "gpt-prose": "_Model gpt-prose leans into smooth narrative phrasing._",
  "gpt-tutor": "_Model gpt-tutor adds guidance cues for learning._",
};

const LEARNING_TIPS = [
  "Learning tip: summarise the answer in your own words—rewriting reinforces retention.",
  "Learning tip: teach the concept to someone else; explaining it out loud is a quick mastery check.",
  "Learning tip: note the key steps on a sticky card so you can revisit them at a glance.",
];

const SUMMARY_SENTENCE_COUNT: Record<ResponseLength, number> = {
  short: 1,
  medium: 2,
  long: 3,
};

const BULLET_LIMITS: Record<ResponseLength, number> = {
  short: 3,
  medium: 5,
  long: 7,
};

const STEP_LIMITS: Record<ResponseLength, number> = {
  short: 3,
  medium: 5,
  long: 7,
};

const CODE_SNIPPETS = [
  {
    language: "css",
    body: `.chat-shell {
  padding: 2rem;
  max-width: 720px;
  border-radius: 1.75rem;
}`,
  },
  {
    language: "tsx",
    body: `const { theme, toggleTheme } = useTheme();

useEffect(() => {
  document.documentElement.dataset.theme = theme;
}, [theme]);`,
  },
  {
    language: "typescript",
    body: `function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}`,
  },
];

function pickVariant(
  options: AgentOptions,
  source: readonly string[],
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
    "implement",
    "make",
    "plan",
    "prepare",
    "write",
  ].includes(firstWord);
}

export function detectReplyType(
  text: string,
  _options: AgentOptions,
): AgentReplyType {
  const lowered = normalise(text);

  if (!lowered) {
    return "summary";
  }

  if (lowered.startsWith("what is") || lowered.includes("definition")) {
    return "definition";
  }

  if (
    lowered.startsWith("how to") ||
    lowered.startsWith("how do i") ||
    lowered.includes(" step ") ||
    lowered.includes("guide") ||
    isImperativeStart(lowered)
  ) {
    return "steps";
  }

  if (lowered.includes("list") || lowered.includes("ideas")) {
    return "bullets";
  }

  if (lowered.includes("?")) {
    return "qa";
  }

  if (lowered.split(/\s+/).length <= 4) {
    return "quip";
  }

  return "summary";
}

export function computeTypingDelay(
  text: string,
  options: AgentOptions,
  attachments: AttachmentMeta[],
): number {
  const lengthFactor = Math.min(text.length * 6, 280);
  const responseAdjustment =
    options.responseLength === "long"
      ? 200
      : options.responseLength === "short"
        ? -60
        : 80;
  const attachmentAdjustment = attachments.length * 45;
  const total = 360 + lengthFactor + responseAdjustment + attachmentAdjustment;
  return Math.max(320, Math.min(total, 860));
}

export function buildAttachmentLine(
  attachments: AttachmentMeta[],
): string | null {
  if (attachments.length === 0) {
    return null;
  }

  const extensions = Array.from(
    new Set(
      attachments.map((item) => item.extension.toLowerCase()).filter(Boolean),
    ),
  );

  const noun = attachments.length === 1 ? "attachment" : "attachments";
  const suffix = extensions.length > 0 ? ` (${extensions.join(", ")})` : "";
  return `> Noted ${attachments.length} ${noun}${suffix}. I’ll weave them into the reply.`;
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

  const subject = withoutLead.trim();
  if (!subject) {
    return "your request";
  }

  return subject.charAt(0).toUpperCase() + subject.slice(1);
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

function maybeAddCodeSnippet(
  originalInput: string,
  subject: string,
  options: AgentOptions,
): string | null {
  if (
    !/(code|component|snippet|toggle|example|implement|css|typescript|react)/i.test(
      originalInput,
    )
  ) {
    return null;
  }

  const index = deterministicVariant(
    `${subject}-${originalInput}-${options.model}`,
    CODE_SNIPPETS.length,
  );
  const snippet = CODE_SNIPPETS[index];
  return `\`\`\`${snippet.language}\n${snippet.body}\n\`\`\``;
}

interface ReplyContext {
  subject: string;
  originalInput: string;
  options: AgentOptions;
  transition: string;
}

type ReplyBuilder = (context: ReplyContext) => string;

const summaryBuilder: ReplyBuilder = ({ subject, options, transition }) => {
  const sentenceCount = SUMMARY_SENTENCE_COUNT[options.responseLength];
  const sentences = [
    `${transition} ${subject} boils down to a few focused moves.`,
    "Keep the scope tight so each deliverable feels intentional.",
    "Share a quick recap at the end so stakeholders never guess what's next.",
  ].slice(0, sentenceCount);

  const highlights =
    options.responseLength === "short"
      ? []
      : [
          `- Momentum: pick one measurable signal to watch as ${subject.toLowerCase()} takes shape.`,
          "- Risks: note blockers early and pair each with a lightweight fallback.",
        ];

  return [`**Overview: ${subject}**`, ...sentences, ...highlights].join("\n\n");
};

const bulletBuilder: ReplyBuilder = ({ subject, options, transition }) => {
  const limit = BULLET_LIMITS[options.responseLength];
  const bullets = [
    `- Clarify what ${subject.toLowerCase()} should achieve and who benefits.`,
    "- Capture constraints—time, tooling, review cycles.",
    "- Draft a simple narrative so the team aligns on tone.",
    "- Prep a lightweight artifact to track decisions.",
    "- Schedule a retro checkpoint to gather feedback quickly.",
    "- Pair each action with an owner and a calm deadline.",
    "- Surface open questions so they're resolved in daylight.",
  ].slice(0, limit);

  return [`${transition} Here’s a punchy list:`, ...bullets].join("\n");
};

const stepsBuilder: ReplyBuilder = ({ subject, options, transition }) => {
  const limit = STEP_LIMITS[options.responseLength];
  const steps = [
    `Map the intent of ${subject} and note any success metrics.`,
    "Outline key milestones—draft, review, launch.",
    "Assign clear owners and share expectations openly.",
    "Prototype or test early to de-risk the approach.",
    "Document learnings and fold them back into the plan.",
    "Close with a recap and next steps for the team.",
    "Capture a short retrospective so it’s easy to iterate.",
  ]
    .slice(0, limit)
    .map((step, index) => `${index + 1}. ${step}`);

  return [`${transition} Try this cadence:`, ...steps].join("\n");
};

const quipBuilder: ReplyBuilder = ({ subject, options }) => {
  const closer =
    options.model === "gpt-mini"
      ? "All tidied up."
      : "Momentum stays high on my end.";
  return `Consider ${subject.toLowerCase()} handled. ${closer}`;
};

const definitionBuilder: ReplyBuilder = ({ subject, options, transition }) => {
  const detail =
    options.responseLength === "long"
      ? [
          "- When it shines: clarifies intent and reduces thrash.",
          "- When to adapt: if the audience or channels change midstream.",
        ]
      : [];

  return [
    `${transition} Let’s pin down what ${subject.toLowerCase()} means.`,
    `**Definition:** ${subject} captures the principles that keep your execution consistent, calm, and explainable.`,
    "**Quick example:** pair planning decisions with a single source of truth so everyone reads the same signals.",
    ...detail,
  ].join("\n\n");
};

const qaBuilder: ReplyBuilder = ({
  subject,
  originalInput: _originalInput,
  transition,
  options,
}) => {
  const extras =
    options.responseLength === "long"
      ? [
          "- Follow-up: revisit the plan after the first implementation and capture notes.",
          "- Signal: choose one metric that indicates momentum is healthy.",
        ]
      : [];

  return [
    `${transition} ${subject} hinges on aligning expectations, scoping the effort, and sharing results without drama.`,
    ...extras,
  ].join("\n\n");
};

const replyBuilders: Record<AgentReplyType, ReplyBuilder> = {
  summary: summaryBuilder,
  bullets: bulletBuilder,
  steps: stepsBuilder,
  quip: quipBuilder,
  definition: definitionBuilder,
  qa: qaBuilder,
};

export interface ReplyFragments {
  header?: string | null;
  body: string;
  footer?: string | null;
  attachmentNote?: string | null;
  modelSignature: string;
  learningTip?: string | null;
  codeSample?: string | null;
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
  const transition = MODEL_TRANSITIONS[options.model];
  const attachmentNote = buildAttachmentLine(attachments);
  const builder = replyBuilders[replyType];
  const rawBody = builder({ subject, originalInput, options, transition });
  const codeSample = maybeAddCodeSnippet(originalInput, subject, options);
  const learningTip = maybeAddLearningTip(options.model, options, seed);

  const body = applyModelVoice(options.model, rawBody);

  return {
    header: greeting,
    body,
    footer: closing,
    attachmentNote,
    modelSignature: MODEL_SIGNATURE[options.model],
    learningTip,
    codeSample,
  };
}

function applyModelVoice(model: ModelChoice, body: string): string {
  if (model === "gpt-mini") {
    const blocks = body.split("\n\n");
    return blocks.slice(0, 3).join("\n\n");
  }

  if (model === "gpt-tutor") {
    return body.replace(/\.($|\s)/g, ". ");
  }

  return body;
}
