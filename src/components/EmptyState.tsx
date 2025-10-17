import { motion } from "framer-motion";

export function EmptyState() {
  return (
    <div className="flex h-[280px] flex-col items-center justify-center text-center">
      <motion.span
        className="text-4xl"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        ✨
      </motion.span>
      <motion.div
        className="mt-3 space-y-2 text-sm text-muted-foreground"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <p className="text-base font-medium text-foreground">Ask anything…</p>
        <p className="max-w-sm leading-relaxed">
          I’ll give calm, deterministic replies and keep options close by so you
          can tweak tone, length, and model any time.
        </p>
      </motion.div>
    </div>
  );
}
