import {
  composeReply,
  detectReplyType,
  extractSubject,
} from "@/lib/agent/rules";
import type {
  AgentOptions,
  AttachmentMeta,
  GeneratedAgentMessage,
} from "@/types";

export function generateAgentReply(
  input: string,
  options: AgentOptions,
  attachments: AttachmentMeta[],
): GeneratedAgentMessage {
  const replyType = detectReplyType(input, options);
  const subject = extractSubject(input);
  const fragments = composeReply(
    replyType,
    subject,
    input,
    options,
    attachments,
  );

  const sections: string[] = [];

  if (fragments.header) {
    sections.push(fragments.header);
  }

  sections.push(fragments.body);

  if (fragments.codeSample) {
    sections.push(fragments.codeSample);
  }

  if (fragments.attachmentNote) {
    sections.push(fragments.attachmentNote);
  }

  if (fragments.learningTip) {
    sections.push(`> ${fragments.learningTip}`);
  }

  if (fragments.footer) {
    sections.push(fragments.footer);
  }

  if (fragments.modelSignature) {
    sections.push(fragments.modelSignature);
  }

  const markdown = sections.join("\n\n").trim();

  return {
    role: "assistant",
    markdown,
    replyType,
    optionsSnapshot: { ...options },
  };
}
