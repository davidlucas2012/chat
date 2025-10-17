import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Paperclip, SendHorizonal } from "lucide-react";

import { FileChips } from "@/components/FileChips";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { validateAttachments } from "@/lib/files/validateAttachments";
import { useChatStore } from "@/store/chatStore";
import type { AttachmentMeta } from "@/types";

let attachmentCounter = 0;

const PLACEHOLDER_PROMPTS = [
  "Ask me anything about your roadmap.",
  "Need help drafting your next update?",
  "Curious how to pitch the idea? Just ask.",
  "Want a quick summary or plan? I’m on it.",
  "Looking for feedback on your concept? Let me know.",
  "Need help with a specific section? Just point it out.",
  "Want to brainstorm ideas? I'm here to help.",
  "Looking for inspiration? Let's explore some options.",
];

function createAttachmentMeta(file: File): AttachmentMeta {
  attachmentCounter += 1;
  const extension = file.name.includes(".")
    ? (file.name.split(".").pop() ?? "")
    : "";

  return {
    id: `attachment_${attachmentCounter}`,
    name: file.name,
    size: file.size,
    type: file.type,
    extension,
  };
}

export function Composer() {
  const sendMessage = useChatStore((state) => state.sendMessage);
  const [value, setValue] = useState("");
  const [placeholder, setPlaceholder] = useState("");
  const [attachments, setAttachments] = useState<AttachmentMeta[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isSendDisabled = useMemo(() => value.trim().length === 0, [value]);
  const promptIndexRef = useRef(0);
  const characterIndexRef = useRef(0);
  const isDeletingRef = useRef(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const typeNext = () => {
      const prompt = PLACEHOLDER_PROMPTS[promptIndexRef.current];

      if (!isDeletingRef.current) {
        const nextLength = characterIndexRef.current + 1;
        const nextText = prompt.slice(0, nextLength);
        setPlaceholder(nextText);
        characterIndexRef.current = nextLength;

        if (nextLength === prompt.length) {
          isDeletingRef.current = true;
          timer = setTimeout(typeNext, 1500);
          return;
        }

        timer = setTimeout(typeNext, 30);
        return;
      }

      const nextLength = Math.max(characterIndexRef.current - 1, 0);
      const nextText = prompt.slice(0, nextLength);
      setPlaceholder(nextText);
      characterIndexRef.current = nextLength;

      if (nextLength === 0) {
        isDeletingRef.current = false;
        promptIndexRef.current =
          (promptIndexRef.current + 1) % PLACEHOLDER_PROMPTS.length;
        timer = setTimeout(typeNext, 400);
        return;
      }

      timer = setTimeout(typeNext, 20);
    };

    timer = setTimeout(typeNext, 300);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleSubmit = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (isSendDisabled) {
      return;
    }

    sendMessage({ text: value, attachments });
    setValue("");
    setAttachments([]);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) {
      return;
    }

    const validation = validateAttachments(files, attachments.length);

    if (validation.errors.length > 0) {
      setError(validation.errors[validation.errors.length - 1]);
    } else {
      setError(null);
    }

    if (validation.accepted.length > 0) {
      setAttachments((previous) => [
        ...previous,
        ...validation.accepted.map(createAttachmentMeta),
      ]);
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((previous) => previous.filter((item) => item.id !== id));
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3" autoComplete="off">
      <div className="flex items-center gap-3 rounded-2xl border border-chat-border/80 bg-surface px-4 py-3 shadow-[0px_14px_30px_-24px_rgba(15,23,42,0.35)] transition-[border,box-shadow] focus-within:border-accent focus-within:shadow-[0px_24px_60px_-28px_rgba(56,189,248,0.45)] dark:focus-within:border-accent dark:focus-within:shadow-[0px_24px_60px_-28px_rgba(59,130,246,0.35)] dark:shadow-[0px_18px_40px_-28px_rgba(0,0,0,0.6)]">
        <div className="flex items-center gap-1">
          <input
            ref={fileInputRef}
            id="chat-attachments"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelection}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Attach files"
            className="size-10 rounded-xl border border-transparent text-muted-foreground transition-colors hover:border-chat-border hover:bg-bubble-assistant/60 hover:text-foreground dark:hover:text-foreground"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="size-4" />
          </Button>
        </div>

        <div className="flex w-full items-center">
          <label htmlFor="chat-input" className="sr-only">
            Message
          </label>
          <Textarea
            id="chat-input"
            value={value}
            placeholder={placeholder}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSubmit();
              }
            }}
            aria-describedby={error ? "chat-error" : undefined}
            className="min-h-[52px] w-full resize-none rounded-xl border border-transparent bg-transparent px-3 py-3 text-[0.95rem] leading-6 text-foreground shadow-none transition-[border-color,box-shadow] focus-visible:border-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        <Button
          type="submit"
          disabled={isSendDisabled}
          className="size-11 rounded-xl bg-accent text-accent-foreground shadow-sm transition-transform hover:translate-y-[-2px] disabled:translate-y-0 disabled:bg-muted disabled:text-muted-foreground"
        >
          <SendHorizonal className="size-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>Up to 5 files, 10 MB each</span>
        {error ? (
          <p id="chat-error" role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}
      </div>

      <FileChips attachments={attachments} onRemove={handleRemoveAttachment} />
    </form>
  );
}
