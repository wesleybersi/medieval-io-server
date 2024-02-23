import { MatrixCellType } from "../../types";

export function isWallSurrounded(
  matrix: MatrixCellType[][],
  row: number,
  col: number
): boolean {
  const rows = matrix.length;
  const cols = matrix[0].length;

  // Check if the cell is within bounds
  if (row < 0 || col < 0 || row >= rows || col >= cols) {
    return false;
  }

  // Check all 8 neighboring cells
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;

    // Check if the neighboring cell is within bounds and is not a wall
    if (
      newRow >= 0 &&
      newRow < rows &&
      newCol >= 0 &&
      newCol < cols &&
      matrix[newRow][newCol] !== "wall" &&
      matrix[newRow][newCol] !== "wall-cracks" &&
      matrix[newRow][newCol] !== "surrounded-wall"
    ) {
      return false; // If any neighboring cell is not a wall, the wall is not surrounded
    }
  }

  // If all neighboring cells are walls, the wall is surrounded
  return true;
}
