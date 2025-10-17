import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, UserRound } from "lucide-react";

import { FileChips } from "@/components/FileChips";
import { MarkdownContent } from "@/lib/markdown/renderMarkdown";
import { formatTimestamp } from "@/lib/time/formatTimestamp";
import { cn } from "@/lib/utils";
import type { AgentMessage, ChatMessage as ChatMessageType } from "@/types";

interface ChatMessageProps {
  message: ChatMessageType;
}

function isAssistantMessage(
  message: ChatMessageType,
): message is AgentMessage {
  return message.role === "assistant";
}

export function ChatMessage({ message }: ChatMessageProps) {
  const shouldReduceMotion = useReducedMotion();
  const isAssistant = isAssistantMessage(message);
  const timestamp = formatTimestamp(message.createdAt);

  const animationProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] },
      };

  return (
    <motion.div
      className={cn(
        "flex w-full",
        isAssistant ? "justify-start" : "justify-end",
      )}
      {...animationProps}
    >
      <div
        className={cn(
          "flex max-w-[88%] items-end gap-3",
          isAssistant ? "flex-row" : "flex-row-reverse",
        )}
      >
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-full border border-chat-border/70 shadow-sm",
            isAssistant
              ? "bg-bubble-assistant text-accent"
              : "bg-bubble-user text-accent",
          )}
          aria-hidden="true"
        >
          {isAssistant ? (
            <Sparkles className="size-4" />
          ) : (
            <UserRound className="size-4" />
          )}
        </span>

        <div
          className={cn(
            "flex flex-1 flex-col gap-2",
            isAssistant ? "items-start" : "items-end",
          )}
        >
          <div
            className={cn(
              "w-full rounded-2xl border border-chat-border/70 px-4 py-3 text-[0.9375rem] leading-6 shadow-sm",
              isAssistant
                ? "bg-bubble-assistant text-foreground"
                : "bg-bubble-user text-foreground dark:text-foreground",
            )}
          >
            {isAssistant ? (
              <MarkdownContent
                className="prose-sm prose-neutral max-w-none dark:prose-invert prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0"
                content={message.markdown}
              />
            ) : (
              <p className="whitespace-pre-wrap text-foreground">
                {message.content}
              </p>
            )}
          </div>

          {message.attachments && message.attachments.length > 0 ? (
            <div
              className={cn(
                "w-full",
                isAssistant ? "justify-start" : "justify-end",
                "flex",
              )}
            >
              <FileChips attachments={message.attachments} />
            </div>
          ) : null}

          <span className="text-[0.75rem] font-medium tracking-tight text-timestamp">
            {timestamp}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
