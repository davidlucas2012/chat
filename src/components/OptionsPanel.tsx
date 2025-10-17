import type { ReactNode } from "react";
import { Info } from "lucide-react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useOptionsStore } from "@/store/optionsStore";
import type {
  FocusOption,
  ModelChoice,
  ResponseLength,
  ToneOption,
} from "@/types";

const RESPONSE_LENGTH_OPTIONS: { value: ResponseLength; label: string }[] = [
  { value: "short", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "long", label: "Long" },
];

const MODEL_OPTIONS: { value: ModelChoice; label: string }[] = [
  { value: "gpt-mini", label: "gpt-mini" },
  { value: "gpt-prose", label: "gpt-prose" },
  { value: "gpt-tutor", label: "gpt-tutor" },
];

const TONE_OPTIONS: { value: ToneOption; label: string }[] = [
  { value: "neutral", label: "Neutral" },
  { value: "friendly", label: "Friendly" },
  { value: "formal", label: "Formal" },
];

const FOCUS_OPTIONS: { value: FocusOption; label: string }[] = [
  { value: "overview", label: "Overview" },
  { value: "technical", label: "Technical" },
  { value: "actionable", label: "Actionable" },
];

export function OptionsPanel() {
  const responseLength = useOptionsStore((state) => state.responseLength);
  const model = useOptionsStore((state) => state.model);
  const tone = useOptionsStore((state) => state.tone);
  const focus = useOptionsStore((state) => state.focus);
  const setResponseLength = useOptionsStore((state) => state.setResponseLength);
  const setModel = useOptionsStore((state) => state.setModel);
  const setTone = useOptionsStore((state) => state.setTone);
  const setFocus = useOptionsStore((state) => state.setFocus);

  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-4 rounded-xl border border-dashed border-border/60 bg-muted/30 p-4">
        <OptionField
          label="Response length"
          help="Controls how detailed the assistant should be."
        >
          <Select
            value={responseLength}
            onValueChange={(value: ResponseLength) => setResponseLength(value)}
          >
            <SelectTrigger aria-label="Select response length">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RESPONSE_LENGTH_OPTIONS.map((entry) => (
                <SelectItem key={entry.value} value={entry.value}>
                  {entry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </OptionField>

        <OptionField
          label="Model voice"
          help="Shapes the reply style and pacing."
        >
          <Select
            value={model}
            onValueChange={(value: ModelChoice) => setModel(value)}
          >
            <SelectTrigger aria-label="Select model voice">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MODEL_OPTIONS.map((entry) => (
                <SelectItem key={entry.value} value={entry.value}>
                  {entry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </OptionField>

        <OptionField label="Tone" help="Adds warmth, neutrality, or formality.">
          <Select
            value={tone}
            onValueChange={(value: ToneOption) => setTone(value)}
          >
            <SelectTrigger aria-label="Select tone">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TONE_OPTIONS.map((entry) => (
                <SelectItem key={entry.value} value={entry.value}>
                  {entry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </OptionField>

        <OptionField
          label="Focus"
          help="Choose whether to emphasise overview, technical nuance, or immediate actions."
        >
          <Select
            value={focus}
            onValueChange={(value: FocusOption) => setFocus(value)}
          >
            <SelectTrigger aria-label="Select focus">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FOCUS_OPTIONS.map((entry) => (
                <SelectItem key={entry.value} value={entry.value}>
                  {entry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </OptionField>
      </div>
    </TooltipProvider>
  );
}

interface OptionFieldProps {
  label: string;
  help: string;
  children: ReactNode;
}

function OptionField({ label, help, children }: OptionFieldProps) {
  return (
    <div className="flex min-w-[180px] flex-1 flex-col gap-2">
      <Label className="inline-flex items-center gap-1 text-xs uppercase tracking-wide text-muted-foreground">
        {label}
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="size-3 cursor-help" aria-label={`${label} help`} />
          </TooltipTrigger>
          <TooltipContent>{help}</TooltipContent>
        </Tooltip>
      </Label>
      {children}
    </div>
  );
}
