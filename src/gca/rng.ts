export function createSeededRng(seed: number | string): () => number {
  let s = typeof seed === 'string' ? hashStringToUint32(seed) : seed >>> 0;

  return () => {
    // LCG (Linear Congruential Generator)
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}
function hashStringToUint32(str: string): number {
  let h = 2166136261 >>> 0; // FNV-1a
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
