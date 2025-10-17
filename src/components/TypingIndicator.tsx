import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function TypingIndicator() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="flex w-full justify-start" role="status" aria-live="assertive">
      <div className="flex max-w-[88%] items-end gap-3">
        <span className="flex size-9 items-center justify-center rounded-full border border-chat-border/70 bg-bubble-assistant text-accent shadow-sm" aria-hidden="true">
          <Sparkles className="size-4" />
        </span>
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-center gap-2 rounded-2xl border border-chat-border/70 bg-bubble-assistant px-4 py-2.5 shadow-sm">
            {shouldReduceMotion ? (
              <span className="text-sm text-muted-foreground">
                Assistant is typing…
              </span>
            ) : (
              <span className="flex items-center gap-1">
                {[0, 1, 2].map((index) => (
                  <motion.span
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    className="size-2.5 rounded-full bg-accent"
                    animate={{
                      opacity: [0.2, 1, 0.2],
                      y: [0, -4, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.2,
                      ease: "easeInOut",
                      delay: index * 0.16,
                    }}
                  />
                ))}
              </span>
            )}
          </div>
          <span className="text-[0.75rem] font-medium tracking-tight text-timestamp">
            Typing…
          </span>
        </div>
      </div>
    </div>
  );
}
