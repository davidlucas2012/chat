export function deterministicVariant(input: string, modulo: number): number {
  if (modulo <= 0) {
    throw new Error("Modulo must be positive");
  }

  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(index);
    hash |= 0; // force 32 bit
  }

  return Math.abs(hash) % modulo;
}
