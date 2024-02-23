import { Direction } from "../../../../types";
import { randomNum } from "../../../../utilities";
import { MatrixCellType } from "../../../Floor/types";
import { DungeonGenerator } from "../DungeonGenerator";

export function createRoom(
  this: DungeonGenerator,
  from: MatrixCellType,
  to: MatrixCellType,
  direction: Direction,
  startRow: number,
  startCol: number
) {
  const width = Math.max(randomNum(this.maxAreaWidth * 1.5), this.minAreaWidth);
  const height = Math.max(
    randomNum(this.maxAreaHeight * 2),
    this.minAreaHeight
  );

  if (direction === "left") {
    startCol = Math.max(startCol - width + 1, 0);
  } else if (direction === "up") {
    startRow = Math.max(startRow - height + 1, 0);
  }

  for (let row = startRow; row < startRow + height; row++) {
    for (let col = startCol; col < startCol + width; col++) {
      if (
        this.floor.isValidCell(row, col) &&
        this.floor.objectMatrix[row][col] === from
      ) {
        this.floor.objectMatrix[row][col] = to;
      }
    }
  }
}
