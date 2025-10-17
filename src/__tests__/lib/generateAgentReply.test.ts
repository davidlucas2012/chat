import { describe, expect, it } from "vitest";

import { generateAgentReply } from "@/lib/agent/generateAgentReply";
import type { AgentOptions, AttachmentMeta } from "@/types";

const baseOptions: AgentOptions = {
  responseLength: "medium",
  model: "gpt-prose",
  tone: "neutral",
};

function createOptions(overrides: Partial<AgentOptions> = {}): AgentOptions {
  return { ...baseOptions, ...overrides };
}

const attachments: AttachmentMeta[] = [
  {
    id: "a1",
    name: "spec.pdf",
    extension: "pdf",
    size: 1024,
  },
  {
    id: "a2",
    name: "mock.png",
    extension: "png",
    size: 2048,
  },
];

describe("generateAgentReply", () => {
  it("returns steps for how-to prompts", () => {
    const result = generateAgentReply(
      "How to launch the onboarding flow?",
      createOptions({ responseLength: "long" }),
      [],
    );
    expect(result.replyType).toBe("steps");
    expect(result.markdown).toContain("1.");
    expect(result.optionsSnapshot.responseLength).toBe("long");
  });

  it("returns definition style for what-is prompts", () => {
    const result = generateAgentReply(
      "What is a sprint retrospective?",
      createOptions({ tone: "formal" }),
      [],
    );
    expect(result.replyType).toBe("definition");
    expect(result.markdown).toContain("**Definition:**");
    expect(result.markdown).toContain("Quick example");
  });

  it("returns bullets when requesting lists", () => {
    const result = generateAgentReply(
      "List ideas for the launch checklist",
      createOptions({ responseLength: "short" }),
      [],
    );
    expect(result.replyType).toBe("bullets");
    expect(
      result.markdown.split("\n").some((line) => line.trim().startsWith("-")),
    ).toBe(true);
  });

  it("returns summary for general prompts", () => {
    const result = generateAgentReply(
      "Share guidance on leading a remote workshop",
      createOptions({ model: "gpt-mini" }),
      attachments,
    );
    expect(result.replyType).toBe("summary");
    expect(result.markdown).toContain("> Noted 2 attachments (pdf, png)");
    expect(result.markdown).toContain("Model gpt-mini");
  });

  it("returns quip for short notes", () => {
    const result = generateAgentReply("Thanks!", baseOptions, []);
    expect(result.replyType).toBe("quip");
    expect(result.markdown.toLowerCase()).toContain("handled");
  });

  it("returns Q&A for question prompts and adds learning tip for tutor", () => {
    const result = generateAgentReply(
      "Is the roadmap ready for handoff?",
      createOptions({ model: "gpt-tutor", tone: "friendly" }),
      [],
    );
    expect(result.replyType).toBe("qa");
    expect(result.markdown).toContain("**Q:**");
    expect(result.markdown).toContain("Learning tip");
  });
});
