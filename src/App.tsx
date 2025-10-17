import { Composer } from "@/components/Composer";
import { Header } from "@/components/Header";
import { MessageList } from "@/components/MessageList";
import { OptionsPanel } from "@/components/OptionsPanel";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

function App() {
  return (
    <ThemeProvider>
      <div className="flex h-full w-full flex-col overflow-hidden bg-page text-foreground transition-colors">
        <div className="flex flex-1 min-h-0 flex-col gap-6 px-6 py-6 sm:px-10 sm:py-8 lg:px-16">
          <Header />
          <main className="min-w-xl self-center relative flex flex-1 min-h-0 flex-col overflow-hidden rounded-[2rem] border border-chat-border/70 bg-surface shadow-[0px_32px_120px_-60px_rgba(15,23,42,0.28)] dark:shadow-[0px_32px_120px_-60px_rgba(0,0,0,0.6)]">
            <div className="flex-1 min-h-0 overflow-hidden">
              <MessageList />
            </div>
            <div className="sticky bottom-0 z-10 space-y-3 border-t border-chat-border/70 bg-surface/95 px-5 pb-5 pt-4 backdrop-blur supports-[backdrop-filter]:bg-surface/85">
              <Composer />
              <OptionsPanel />
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
