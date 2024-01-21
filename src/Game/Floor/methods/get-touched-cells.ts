import { CELL_SIZE } from "../../../constants";
import Floor from "../Floor";

export function getTouchedCells(
  this: Floor,
  x: number,
  y: number,
  width = CELL_SIZE,
  height = CELL_SIZE
): string[] {
  const cellKeys: string[] = [];
  const startX = Math.floor((x - width / 2) / CELL_SIZE);
  const startY = Math.floor((y - height / 2) / CELL_SIZE);
  const endX = Math.floor((x + width / 2) / CELL_SIZE);
  const endY = Math.floor((y + height / 2) / CELL_SIZE);

  for (let col = startX; col <= endX; col++) {
    for (let row = startY; row <= endY; row++) {
      cellKeys.push(`${row},${col}`);
    }
  }

  return cellKeys;
}
