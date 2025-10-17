export interface FileLike {
  readonly name: string;
  readonly size: number;
  readonly type?: string;
}

export interface AttachmentValidationResult<T extends FileLike = FileLike> {
  accepted: T[];
  rejected: T[];
  errors: string[];
}

export const MAX_FILE_COUNT = 5;
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export function validateAttachments<T extends FileLike>(
  files: readonly T[],
  existingCount = 0,
): AttachmentValidationResult<T> {
  const errors: string[] = [];
  const accepted: T[] = [];
  const rejected: T[] = [];

  const remainingSlots = Math.max(0, MAX_FILE_COUNT - existingCount);

  if (files.length > remainingSlots) {
    errors.push(
      `You can attach up to ${MAX_FILE_COUNT} files. Remove ${
        existingCount + files.length - MAX_FILE_COUNT
      } file(s) and try again.`,
    );
  }

  for (const file of files) {
    const exceedsCount = accepted.length >= remainingSlots;
    const exceedsSize = file.size > MAX_FILE_SIZE_BYTES;

    if (exceedsCount || exceedsSize) {
      rejected.push(file);
      if (exceedsSize) {
        errors.push(
          `${file.name} is too large. Each file must be under 10 MB.`,
        );
      }
      continue;
    }

    accepted.push(file);
  }

  return { accepted, rejected, errors };
}
