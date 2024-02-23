import Floor from "../Floor";

export function getNearestEmptyCell(
  this: Floor,
  row: number,
  col: number,
  checked: Set<string> = new Set()
): { row: number; col: number } {
  const occupiedCell =
    this.objectMatrix[row][col].includes("wall") ||
    this.spriteGridMatrix.has(`${row},${col}`);
  if (!occupiedCell && this.isValidCell(row, col)) {
    return { row, col };
  } else {
    checked.add(`${row},${col}`);
    const positions = this.getAdjacentCells(row, col);
    for (const position of Object.values(positions).sort(
      () => Math.random() - 0.5
    )) {
      if (checked.has(`${position.row},${position.col}`)) continue;
      return this.getNearestEmptyCell(position.row, position.col, checked);
    }
  }
  return { row, col };
}
