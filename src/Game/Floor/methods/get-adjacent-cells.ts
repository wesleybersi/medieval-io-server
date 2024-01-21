import Floor from "../Floor";

export function getAdjacentCells(
  this: Floor,
  row: number,
  col: number
): { [key: string]: { row: number; col: number } } {
  const adjacentTiles: { [key: string]: { row: number; col: number } } = {
    top: { row: row - 1, col },
    bottom: { row: row + 1, col },
    left: { row, col: col - 1 },
    right: { row, col: col + 1 },
  };
  for (const [side, { row, col }] of Object.entries(adjacentTiles)) {
    if (row < 0 || col < 0 || row > this.rows - 1 || col > this.cols - 1) {
      delete adjacentTiles[side];
    }
  }
  return adjacentTiles;
}
