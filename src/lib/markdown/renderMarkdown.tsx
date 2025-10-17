import type { HTMLAttributes, ReactNode } from "react";
import { defaultSchema } from "hast-util-sanitize";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize from "rehype-sanitize";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

const schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [
      ...(defaultSchema.attributes?.code ?? []),
      ["className"],
      ["data-language"],
    ],
    span: [...(defaultSchema.attributes?.span ?? []), ["className"]],
    a: [...(defaultSchema.attributes?.a ?? []), ["target"], ["rel"]],
  },
} as const;

type CodeProps = HTMLAttributes<HTMLElement> & {
  inline?: boolean;
  children?: ReactNode;
};

const CodeBlock = ({ inline, children, className, ...props }: CodeProps) => {
  if (inline) {
    return (
      <code
        className={cn(
          "rounded-lg bg-bubble-assistant px-1.5 py-0.5 font-mono text-sm text-foreground",
          className,
        )}
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <code
      className={cn(
        "block max-h-80 overflow-auto rounded-2xl bg-bubble-assistant p-4 font-mono text-sm leading-relaxed text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </code>
  );
};

const components: Components = {
  a: ({ href, children, ...props }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
      {...props}
    >
      {children}
    </a>
  ),
  code: CodeBlock,
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        "my-4 overflow-hidden rounded-2xl border border-chat-border/60 bg-bubble-assistant",
        className,
      )}
      {...props}
    />
  ),
  ul: ({ className, ...props }) => (
    <ul
      className={cn(
        "my-3 ml-5 list-disc space-y-1.5 text-sm leading-relaxed",
        className,
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={cn(
        "my-3 ml-5 list-decimal space-y-1.5 text-sm leading-relaxed",
        className,
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }) => (
    <p
      className={cn(
        "my-2 text-[0.95rem] leading-6 text-foreground",
        className,
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }) => (
    <li
      className={cn("text-[0.95rem] leading-6 text-foreground", className)}
      {...props}
    />
  ),
};

interface MarkdownContentProps {
  className?: string;
  content: string;
}

export function MarkdownContent({ className, content }: MarkdownContentProps) {
  return (
    <div
      className={cn(
        "prose prose-sm prose-neutral dark:prose-invert",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          [rehypeSanitize, schema],
          [rehypeHighlight, { ignoreMissing: true }],
        ]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
