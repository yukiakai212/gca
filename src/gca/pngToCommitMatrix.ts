import sharp from 'sharp';
import { CommitLevelMatrix, CommitLevel } from '../types.js';

/**
 * Convert PNG image to GitHub-style contribution matrix (7 x 52)
 */
export async function pngToCommitMatrix(
  filePath: string,
  weeks: number,
  rng: () => number,
): Promise<CommitLevelMatrix> {
  const WIDTH = weeks;
  const HEIGHT = 7;

  // Resize + grayscale
  const { data } = await sharp(filePath)
    .resize(WIDTH, HEIGHT, {
      fit: 'fill',
    })
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Init matrix [row][col]
  const matrix: CommitLevelMatrix = Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(0));

  // raw grayscale: 1 byte per pixel (0..255)
  for (let row = 0; row < HEIGHT; row++) {
    for (let col = 0; col < WIDTH; col++) {
      const idx = row * WIDTH + col;
      const gray = data[idx]; // 0 (black) -> 255 (white)

      // invert black = high commit
      const inverted = 255 - gray;
      const gammaCorrected = Math.pow(inverted / 255, 1.2) * 255;

      //const jitter = (rng() - 0.5) * 20
      //const noisy = inverted + jitter

      // quantize to 5 levels (0..4)
      const level = quantizeTo5Levels(gammaCorrected); //inverted

      matrix[row][col] = level;
    }
  }

  return matrix;
}

/**
 * Map grayscale (0..255) to level 0..4
 */
function quantizeTo5Levels(value: number): CommitLevel {
  // clamp
  const v = Math.max(0, Math.min(255, value));

  if (v < 51) return 0; // ~0–20%
  if (v < 102) return 1; // ~20–40%
  if (v < 153) return 2; // ~40–60%
  if (v < 204) return 3; // ~60–80%
  return 4; // ~80–100%
}
