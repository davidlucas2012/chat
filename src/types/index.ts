export type ChatRole = "user" | "assistant";

export type ResponseLength = "short" | "medium" | "long";
export type ModelChoice = "gpt-mini" | "gpt-prose" | "gpt-tutor";
export type ToneOption = "neutral" | "friendly" | "formal";
export type FocusOption = "overview" | "technical" | "actionable";

export type AgentReplyType =
  | "summary"
  | "bullets"
  | "steps"
  | "quip"
  | "definition"
  | "qa";

export interface AttachmentMeta {
  id: string;
  name: string;
  size: number;
  type?: string;
  extension: string;
}

export interface AgentOptions {
  responseLength: ResponseLength;
  model: ModelChoice;
  tone: ToneOption;
  focus: FocusOption;
}

export interface MessageBase {
  content: string;
  attachments?: AttachmentMeta[];
}

export interface TimestampedMessage extends MessageBase {
  id: string;
  createdAt: number;
}

export interface UserMessage extends TimestampedMessage {
  role: "user";
}

export interface GeneratedAgentMessage extends MessageBase {
  role: "assistant";
  replyType: AgentReplyType;
  optionsSnapshot: AgentOptions;
}

export interface AgentMessage extends GeneratedAgentMessage {
  id: string;
  createdAt: number;
}

export type ChatMessage = UserMessage | AgentMessage;
