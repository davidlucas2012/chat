import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Composer } from "@/components/Composer";
import { MessageList } from "@/components/MessageList";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-dvh bg-background text-foreground">
        <div className="container flex min-h-dvh flex-col gap-6 py-10">
          <header className="flex items-center justify-between rounded-2xl border bg-card/80 px-6 py-4 shadow-sm backdrop-blur">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Simple AI Chat Interface
              </p>
              <h1 className="text-2xl font-semibold text-foreground">
                Deterministic agent with personality controls
              </h1>
            </div>
            <ThemeToggle />
          </header>

          <Card className="relative flex min-h-[65vh] flex-1 flex-col overflow-hidden">
            <CardHeader className="border-b bg-card/80 backdrop-blur">
              <CardTitle className="text-lg font-semibold text-foreground">
                Conversation
              </CardTitle>
            </CardHeader>
            <CardContent className="flex h-full flex-1 flex-col gap-6 p-0">
              <div className="flex-1 px-6">
                <MessageList />
              </div>
              <div className="sticky bottom-0 z-10 bg-gradient-to-t from-card via-card to-transparent px-6 pb-6 pt-3">
                <Composer />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
