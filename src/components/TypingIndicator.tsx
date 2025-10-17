import { motion, useReducedMotion } from "framer-motion";

export function TypingIndicator() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex items-center gap-2 text-sm text-muted-foreground"
      >
        Assistant is preparing a reply…
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-2 text-sm text-muted-foreground"
    >
      <span className="font-medium">Assistant</span>
      <span className="flex items-center gap-1 rounded-full bg-muted px-3 py-1">
        {[0, 1, 2].map((index) => (
          <motion.span
            key={index}
            className="size-2 rounded-full bg-primary"
            animate={{
              opacity: [0.3, 1, 0.3],
              y: [0, -4, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              ease: "easeInOut",
              delay: index * 0.15,
            }}
          />
        ))}
      </span>
    </div>
  );
}
