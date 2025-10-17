import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import type { ModelChoice, ResponseLength, ToneOption } from "@/types";

const RESPONSE_LENGTH_OPTIONS: { value: ResponseLength; label: string }[] = [
  { value: "short", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "long", label: "Long" },
];

const MODEL_OPTIONS: { value: ModelChoice; label: string }[] = [
  { value: "gpt-mini", label: "GPT Mini" },
  { value: "gpt-prose", label: "GPT Prose" },
  { value: "gpt-tutor", label: "GPT Tutor" },
];

const TONE_OPTIONS: { value: ToneOption; label: string }[] = [
  { value: "neutral", label: "Neutral" },
  { value: "friendly", label: "Friendly" },
  { value: "formal", label: "Formal" },
];

interface ControlDefinition {
  label: string;
  help: string;
  value: string;
  onChange: (next: string) => void;
  options: { value: string; label: string }[];
}

export function OptionsPanel() {
  const responseLength = useOptionsStore((state) => state.responseLength);
  const model = useOptionsStore((state) => state.model);
  const tone = useOptionsStore((state) => state.tone);
  const setResponseLength = useOptionsStore((state) => state.setResponseLength);
  const setModel = useOptionsStore((state) => state.setModel);
  const setTone = useOptionsStore((state) => state.setTone);

  const controls: ControlDefinition[] = [
    {
      label: "Response",
      help: "Controls how detailed the assistant should be.",
      value: responseLength,
      onChange: (value) => setResponseLength(value as ResponseLength),
      options: RESPONSE_LENGTH_OPTIONS,
    },
    {
      label: "Model",
      help: "Shapes the voice, pacing, and sign-off style.",
      value: model,
      onChange: (value) => setModel(value as ModelChoice),
      options: MODEL_OPTIONS,
    },
    {
      label: "Tone",
      help: "Adds warmth, neutrality, or formality to replies.",
      value: tone,
      onChange: (value) => setTone(value as ToneOption),
      options: TONE_OPTIONS,
    },
  ];

  const summary = `${controls[0].label}: ${controls[0].options.find((opt) => opt.value === controls[0].value)?.label ?? controls[0].value}  •  ${controls[1].label}: ${controls[1].options.find((opt) => opt.value === controls[1].value)?.label ?? controls[1].value}  •  ${controls[2].label}: ${controls[2].options.find((opt) => opt.value === controls[2].value)?.label ?? controls[2].value}`;

  return (
    <TooltipProvider>
      <div className="space-y-2 text-sm text-foreground">
        <div className="md:hidden">
          <MobileOptions controls={controls} summary={summary} />
        </div>
        <div className="hidden flex-wrap items-center gap-2 md:flex">
          {controls.map((control, index) => (
            <InlineControl
              key={control.label}
              control={control}
              isLast={index === controls.length - 1}
            />
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}

function InlineControl({
  control,
  isLast,
}: {
  control: ControlDefinition;
  isLast: boolean;
}) {
  return (
    <div className="inline-flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            tabIndex={0}
            className="cursor-help text-xs uppercase tracking-[0.24em] text-muted-foreground outline-none focus-visible:rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:ring-accent"
          >
            {control.label}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top">{control.help}</TooltipContent>
      </Tooltip>
      <span aria-hidden="true" className="text-muted-foreground">
        :
      </span>
      <Select value={control.value} onValueChange={control.onChange}>
        <SelectTrigger className="h-auto w-auto gap-1 rounded-xl border border-transparent bg-transparent px-2 py-1 text-sm font-medium text-foreground transition-colors hover:border-chat-border/70 focus-visible:border-chat-border/70 focus-visible:ring-0 [&>span:last-child]:hidden">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="w-40 rounded-xl border border-chat-border/70 bg-surface shadow-xl">
          {control.options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isLast ? null : (
        <span aria-hidden="true" className="px-1 text-muted-foreground">
          •
        </span>
      )}
    </div>
  );
}

function MobileOptions({
  controls,
  summary,
}: {
  controls: ControlDefinition[];
  summary: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="flex w-full items-center justify-between rounded-2xl border border-chat-border/70 bg-surface px-3 py-2 text-sm font-medium"
        >
          <span className="text-left">Options</span>
          <ChevronDown className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[280px] space-y-4 rounded-2xl border border-chat-border/70 bg-surface p-4 shadow-xl"
      >
        <p className="text-xs text-muted-foreground">{summary}</p>
        <div className="space-y-4">
          {controls.map((control) => (
            <StackedControl key={control.label} control={control} />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function StackedControl({ control }: { control: ControlDefinition }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              tabIndex={0}
              className="cursor-help text-[0.7rem] uppercase tracking-[0.28em] text-muted-foreground outline-none focus-visible:rounded-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:ring-accent"
            >
              {control.label}
            </span>
          </TooltipTrigger>
          <TooltipContent>{control.help}</TooltipContent>
        </Tooltip>
      </div>
      <Select value={control.value} onValueChange={control.onChange}>
        <SelectTrigger className="h-10 w-full rounded-xl border border-chat-border/70 bg-surface px-3 text-sm font-medium text-foreground focus-visible:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="rounded-xl border border-chat-border/70 bg-surface shadow-xl">
          {control.options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
