export const printPreview = (levelMatrix: number[]) => {
  const LEVEL_CHAR = [' ', '.', ':', '*', '#'];
  for (let row = 0; row < 7; row++) {
    let line = '';
    for (let col = 0; col < 52; col++) {
      const level = levelMatrix[row * 52 + col];
      line += LEVEL_CHAR[level];
    }
    console.log(line);
  }
};
