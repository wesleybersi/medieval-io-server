import { Direction } from "../../../../types";
import { getRandomDirection, oneIn, randomNum } from "../../../../utilities";
import { MatrixCellType } from "../../../Floor/types";
import { DungeonGenerator } from "../DungeonGenerator";

export function addFloorPatches(this: DungeonGenerator) {
  const addPatch = (
    direction: Direction,
    startCol: number,
    startRow: number
  ) => {
    const width = Math.max(randomNum(this.maxAreaWidth), 2);
    const height = Math.max(randomNum(this.maxAreaHeight), 2);

    if (direction === "left") {
      startCol = Math.max(startCol - width + 1, 0);
    } else if (direction === "up") {
      startRow = Math.max(startRow - height + 1, 0);
    }

    const isAlreadyPatched = () => {
      for (let row = startRow; row < startRow + height; row++) {
        for (let col = startCol; col < startCol + width; col++) {
          if (!this.floor.isValidCell(row, col)) return true;
          if (Number(this.floor.objectMatrix[row][col].slice(6)) > 5)
            return true;
        }
      }
      return false;
    };
    if (isAlreadyPatched()) return;

    for (let row = startRow; row < startRow + height; row++) {
      for (let col = startCol; col < startCol + width; col++) {
        // if (!this.floor.matrix[row] || !this.floor.matrix[row][col]) continue;
        if (this.floor.objectMatrix[row][col].includes("floor")) {
          if (row === startRow && col === startCol) {
            //Top Left
            this.floor.objectMatrix[row][col] = "floor-6";
            if (width > 2 && height > 2) {
              if (this.floor.objectMatrix[row + 1][col + 1].includes("floor")) {
                this.floor.objectMatrix[row + 1][col + 1] = "floor-18";
              }
            }
          } else if (row === startRow + height - 1 && col === startCol) {
            //Bottom Left
            this.floor.objectMatrix[row][col] = "floor-12";
            if (width > 2 && height > 2) {
              if (this.floor.objectMatrix[row - 1][col + 1].includes("floor")) {
                this.floor.objectMatrix[row - 1][col + 1] = "floor-16";
              }
            }
          } else if (row === startRow && col === startCol + width - 1) {
            //Top Right
            this.floor.objectMatrix[row][col] = "floor-8";
            if (width > 2 && height > 2) {
              if (this.floor.objectMatrix[row + 1][col - 1].includes("floor")) {
                this.floor.objectMatrix[row + 1][col - 1] = "floor-17";
              }
            }
          } else if (
            row === startRow + height - 1 &&
            col === startCol + width - 1
          ) {
            //Bottom Right
            this.floor.objectMatrix[row][col] = "floor-14";
            if (width > 2 && height > 2) {
              if (this.floor.objectMatrix[row - 1][col - 1].includes("floor")) {
                this.floor.objectMatrix[row - 1][col - 1] = "floor-15";
              }
            }
          } else if (
            row === startRow &&
            col > startCol &&
            col < startCol + width - 1
          ) {
            this.floor.objectMatrix[row][col] = "floor-7";
          } else if (
            row === startRow + height - 1 &&
            col > startCol &&
            col < startCol + width - 1
          ) {
            this.floor.objectMatrix[row][col] = "floor-13";
          } else if (
            row > startRow &&
            row < startRow + height - 1 &&
            col === startCol
          ) {
            this.floor.objectMatrix[row][col] = "floor-9";
          } else if (
            row > startRow &&
            row < startRow + height - 1 &&
            col === startCol + width - 1
          ) {
            this.floor.objectMatrix[row][col] = "floor-11";
          } else {
            if (Number(this.floor.objectMatrix[row][col].slice(6)) >= 16)
              continue;
            this.floor.objectMatrix[row][col] = "floor-10";
          }
        }
      }
    }
  };

  for (
    let i = 0;
    i < Math.floor((this.floor.rows * this.floor.cols) / 2000);
    i++
  ) {
    const { row, col } = this.floor.getRandomEmptyCell();
    addPatch(getRandomDirection(), col, row);
  }
}
