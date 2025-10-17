export type ChatRole = "user" | "assistant";

export type ResponseLength = "short" | "medium" | "long";
export type ModelChoice = "gpt-mini" | "gpt-prose" | "gpt-tutor";
export type ToneOption = "neutral" | "friendly" | "formal";

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
}

export interface TimestampedMessage {
  attachments?: AttachmentMeta[];
  id: string;
  createdAt: number;
}

export interface UserMessage extends TimestampedMessage {
  content: string;
  role: "user";
}

export interface GeneratedAgentMessage {
  role: "assistant";
  markdown: string;
  replyType: AgentReplyType;
  optionsSnapshot: AgentOptions;
}

export interface AgentMessage extends GeneratedAgentMessage {
  attachments?: AttachmentMeta[];
  id: string;
  createdAt: number;
}

export type ChatMessage = UserMessage | AgentMessage;
