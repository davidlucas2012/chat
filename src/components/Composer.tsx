import { useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Paperclip, SendHorizonal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileChips } from "@/components/FileChips";
import { validateAttachments } from "@/lib/files/validateAttachments";
import { useChatStore } from "@/store/chatStore";
import { OptionsPanel } from "@/components/OptionsPanel";
import type { AttachmentMeta } from "@/types";

let attachmentCounter = 0;

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
  const [attachments, setAttachments] = useState<AttachmentMeta[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isSendDisabled = useMemo(() => value.trim().length === 0, [value]);

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
    <div className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-lg md:flex-row md:items-start md:gap-6">
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-1 flex-col gap-3"
      >
        <label htmlFor="chat-input" className="sr-only">
          Message
        </label>
        <Textarea
          id="chat-input"
          value={value}
          placeholder="Share your question or task…"
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSubmit();
            }
          }}
          aria-describedby={error ? "chat-error" : undefined}
        />
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
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
              className="gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="size-4" />
              Attach files
            </Button>
            <span className="text-xs text-muted-foreground">
              Up to 5 files, 10 MB each
            </span>
          </div>
          <Button type="submit" disabled={isSendDisabled} className="gap-2">
            Send
            <SendHorizonal className="size-4" />
          </Button>
        </div>
        {error ? (
          <p id="chat-error" role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}
        <FileChips
          attachments={attachments}
          onRemove={handleRemoveAttachment}
        />
      </form>
      <div className="w-full md:max-w-xs">
        <OptionsPanel />
      </div>
    </div>
  );
}
