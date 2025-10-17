import { describe, expect, it } from "vitest";

import {
  MAX_FILE_COUNT,
  MAX_FILE_SIZE_BYTES,
  validateAttachments,
} from "@/lib/files/validateAttachments";

const makeFile = (name: string, size: number) =>
  ({
    name,
    size,
    type: "application/octet-stream",
  }) as File;

describe("validateAttachments", () => {
  it("accepts files within limits", () => {
    const result = validateAttachments([makeFile("doc.txt", 1024)]);
    expect(result.accepted).toHaveLength(1);
    expect(result.errors).toHaveLength(0);
  });

  it("rejects files exceeding size limit", () => {
    const result = validateAttachments([
      makeFile("huge.mov", MAX_FILE_SIZE_BYTES + 1),
    ]);
    expect(result.accepted).toHaveLength(0);
    expect(result.errors[0]).toContain("too large");
  });

  it("rejects when exceeding count limit", () => {
    const files = Array.from({ length: MAX_FILE_COUNT + 1 }, (_, index) =>
      makeFile(`file-${index}.txt`, 1024),
    );
    const result = validateAttachments(files, 0);
    expect(result.accepted).toHaveLength(MAX_FILE_COUNT);
    expect(result.rejected).toHaveLength(1);
    expect(result.errors[0]).toContain("attach up to");
  });
});
