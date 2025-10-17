import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-chat-border/70 pb-4">
      <h1 className="text-[1.125rem] font-semibold tracking-tight text-foreground sm:text-xl">
        Simple AI Chat
      </h1>
      <ThemeToggle />
    </header>
  );
}
