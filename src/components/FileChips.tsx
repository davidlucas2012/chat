import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatBytes } from "@/lib/format/bytes";
import type { AttachmentMeta } from "@/types";

interface FileChipsProps {
  attachments: AttachmentMeta[];
  onRemove?: (id: string) => void;
}

export function FileChips({ attachments, onRemove }: FileChipsProps) {
  if (attachments.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className="flex items-center gap-2 rounded-xl border border-chat-border/70 bg-surface px-3 py-1.5 text-xs text-muted-foreground shadow-sm"
        >
          <span className="max-w-[160px] truncate font-medium text-foreground">
            {attachment.name}
          </span>
          <span>{formatBytes(attachment.size)}</span>
          {onRemove ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-6 rounded-full bg-transparent text-muted-foreground transition-colors hover:bg-bubble-user/40 hover:text-foreground"
              onClick={() => onRemove(attachment.id)}
              aria-label={`Remove ${attachment.name}`}
            >
              <X className="size-3" />
            </Button>
          ) : null}
        </div>
      ))}
    </div>
  );
}
