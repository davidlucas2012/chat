import { motion, useReducedMotion } from "framer-motion";
import { Bot, User } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FileChips } from "@/components/FileChips";
import { MarkdownContent } from "@/lib/markdown/renderMarkdown";
import { formatTimestamp } from "@/lib/time/formatTimestamp";
import type { AgentMessage, ChatMessage as ChatMessageType } from "@/types";

interface ChatMessageProps {
  message: ChatMessageType;
}

function isAgentMessage(message: ChatMessageType): message is AgentMessage {
  return message.role === "assistant";
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";
  const assistantMessage = isAgentMessage(message) ? message : null;
  const shouldReduceMotion = useReducedMotion();
  const timestamp = formatTimestamp(message.createdAt);

  const animationProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.2 },
      };

  return (
    <motion.div
      className="flex w-full gap-3"
      data-role={message.role}
      {...animationProps}
    >
      <Avatar className="mt-1 size-9">
        <AvatarFallback className="bg-muted text-muted-foreground">
          {isAssistant ? (
            <Bot className="size-4" />
          ) : (
            <User className="size-4" />
          )}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-medium">
            {isAssistant ? "Assistant" : "You"}
          </span>
          <span aria-hidden="true">•</span>
          <span>{timestamp}</span>
          {assistantMessage ? (
            <AssistantMeta message={assistantMessage} />
          ) : null}
        </div>
        <div
          className={`max-w-[70%] rounded-2xl border px-4 py-3 text-sm leading-relaxed ${
            isAssistant
              ? "bg-muted/40 text-foreground"
              : "ml-auto bg-primary text-primary-foreground"
          }`}
        >
          {isAssistant ? (
            <MarkdownContent
              className="prose-sm prose-headings:mt-0 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0 dark:prose-invert"
              content={message.content}
            />
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}
        </div>
        {message.attachments && message.attachments.length > 0 ? (
          <div
            className={`flex ${
              isAssistant ? "ml-12 justify-start" : "ml-auto justify-end"
            }`}
          >
            <FileChips attachments={message.attachments} />
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

function AssistantMeta({ message }: { message: AgentMessage }) {
  return (
    <div className="flex items-center gap-2">
      <Badge variant="muted" className="capitalize">
        {message.replyType.replace("-", " ")}
      </Badge>
      <Badge variant="outline">{message.optionsSnapshot.model}</Badge>
    </div>
  );
}
