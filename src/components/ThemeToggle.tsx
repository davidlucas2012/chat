import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "@/components/theme/ThemeProvider";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={toggleTheme}
          >
            <motion.span
              className="relative inline-flex size-5 items-center justify-center"
              animate={{ rotate: theme === "dark" ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 16 }}
            >
              <Sun
                className={cn(
                  "absolute size-5 transition-opacity",
                  theme === "dark" ? "opacity-0" : "opacity-100",
                )}
              />
              <Moon
                className={cn(
                  "absolute size-5 transition-opacity",
                  theme === "dark" ? "opacity-100" : "opacity-0",
                )}
              />
            </motion.span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          Switch to {theme === "dark" ? "light" : "dark"} mode
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
