import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

import { ChatMessage } from "@/components/ChatMessage";
import { EmptyState } from "@/components/EmptyState";
import { TypingIndicator } from "@/components/TypingIndicator";
import { useChatStore } from "@/store/chatStore";

export function MessageList() {
  const messages = useChatStore((state) => state.messages);
  const isTyping = useChatStore((state) => state.isTyping);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const behavior = shouldReduceMotion ? "auto" : "smooth";

    if (sentinelRef.current) {
      sentinelRef.current.scrollIntoView({ behavior, block: "end" });
    } else {
      container.scrollTo({ top: container.scrollHeight, behavior });
    }
  }, [messages.length, isTyping, shouldReduceMotion]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-y-auto pr-1"
      aria-live="polite"
      aria-atomic="false"
    >
      <div className="flex w-full flex-col gap-6 pb-16 pt-4">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        {isTyping ? <TypingIndicator /> : null}
        <div ref={sentinelRef} />
      </div>
    </div>
  );
}
