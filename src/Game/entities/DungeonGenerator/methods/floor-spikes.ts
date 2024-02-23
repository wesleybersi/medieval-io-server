import { Direction } from "../../../../types";
import { getRandomDirection, oneIn, randomNum } from "../../../../utilities";

import { DungeonGenerator } from "../DungeonGenerator";

export function addFloorSpikes(this: DungeonGenerator) {
  const addPatch = (
    direction: Direction,
    startCol: number,
    startRow: number
  ) => {
    const width = Math.max(randomNum(this.maxAreaWidth), 1);
    const height = Math.max(randomNum(this.maxAreaHeight), 1);
    const initiallyOn = oneIn(2);
    const smoothen = oneIn(4);
    const alternate = oneIn(8);

    if (direction === "left") {
      startCol = Math.max(startCol - width + 1, 0);
    } else if (direction === "up") {
      startRow = Math.max(startRow - height + 1, 0);
    }

    for (let row = startRow; row < startRow + height; row++) {
      for (let col = startCol; col < startCol + width; col++) {
        if (smoothen) {
          if (
            row === startRow ||
            row === startRow + height - 1 ||
            col === startCol ||
            col === startCol + width - 1
          )
            continue;
        }
        if (
          this.floor.isValidCell(row, col) &&
          this.floor.objectMatrix[row][col].includes("floor")
        ) {
          if (alternate) {
            if (oneIn(2)) {
              if (row % 3 === 0 || row % 4 === 0) {
                this.floor.objectMatrix[row][col] = "spikes-on";
              } else {
                this.floor.objectMatrix[row][col] = "spikes-off";
              }
            } else {
              if (col % 3 === 0 || col % 4 === 0) {
                this.floor.objectMatrix[row][col] = "spikes-on";
              } else {
                this.floor.objectMatrix[row][col] = "spikes-off";
              }
            }
          } else {
            this.floor.objectMatrix[row][col] = initiallyOn
              ? "spikes-on"
              : "spikes-off";
          }
        }
      }
    }
  };

  for (
    let i = 0;
    i <
    Math.floor(
      (this.floor.rows * this.floor.cols) / Math.max(randomNum(5000), 100)
    );
    i++
  ) {
    const { row, col } = this.floor.getRandomEmptyCell();
    addPatch(getRandomDirection(), col, row);
  }
}
