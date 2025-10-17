import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
        <Badge
          key={attachment.id}
          variant="outline"
          className="flex items-center gap-2 rounded-full bg-muted/30 px-3 py-1 text-xs"
        >
          <span className="font-medium text-foreground">{attachment.name}</span>
          <span className="text-muted-foreground">
            {formatBytes(attachment.size)}
          </span>
          {onRemove ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-6 rounded-full bg-transparent text-muted-foreground hover:text-foreground"
              onClick={() => onRemove(attachment.id)}
              aria-label={`Remove ${attachment.name}`}
            >
              <X className="size-3" />
            </Button>
          ) : null}
        </Badge>
      ))}
    </div>
  );
}
