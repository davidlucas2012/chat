import { motion } from "framer-motion";

export function EmptyState() {
  return (
    <div className="flex h-full flex-1 items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center gap-4 text-center"
      >
        <motion.div
          className="rounded-full border border-dashed border-muted bg-muted/30 px-4 py-2 text-xs font-medium uppercase tracking-widest text-muted-foreground"
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        >
          Simple AI Chat
        </motion.div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            Ask anything…
          </h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Personalise the response using the panel beside the composer. I’ll
            tailor tone, depth, and structure for you.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
