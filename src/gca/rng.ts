export function createSeededRng(seed: number): () => number {
  let s = seed >>> 0;

  return () => {
    // LCG (Linear Congruential Generator)
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}
