/**
 * Get last Sunday (00:00:00) based on local timezone
 */
function getLastSunday(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  const day = d.getDay(); // 0 = Sunday
  d.setDate(d.getDate() - day);

  return d;
}

/**
 * Add days to date (immutable)
 */
function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/**
 * Map matrix position to commit date
 *
 * @param row 0..6 (Sun..Sat)
 * @param col 0..weeks-1
 * @param weeks total number of columns (usually 52 or 53)
 */
export function mapPixelToDate(row: number, col: number, weeks: number, anchorSunday: Date): Date {
  if (row < 0 || row > 6) {
    throw new Error('row must be between 0 (Sun) and 6 (Sat)');
  }

  const endSunday = getLastSunday(anchorSunday);

  // Left-most column start date
  const startDate = addDays(endSunday, -(weeks - 1) * 7);

  return addDays(startDate, col * 7 + row);
}
