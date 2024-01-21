import { Carver } from "./../Carver";
import { randomNum } from "../../../../../utilities";
import { MatrixCellType } from "../../../Floor";

export function carve(this: Carver, target: MatrixCellType) {
  const width = Math.max(randomNum(this.maxAreaWidth), this.minAreaWidth);
  const height = Math.max(randomNum(this.maxAreaHeight), this.minAreaHeight);

  let startRow = this.row;
  let startCol = this.col;

  if (this.direction === "left") {
    startCol = Math.max(startCol - width + 1, 0);
  } else if (this.direction === "up") {
    startRow = Math.max(startRow - height + 1, 0);
  }
  //TODO If below zero. Unshift

  for (let row = startRow; row < startRow + height; row++) {
    for (let col = startCol; col < startCol + width; col++) {
      if (row > this.floor.rows - 1) {
        this.floor.matrix.push([
          ...Array.from({ length: this.floor.cols }).map(
            () => "wall" as MatrixCellType
          ),
        ]);
        this.floor.rows = this.floor.matrix.length;
      }
      if (col > this.floor.cols - 1) {
        this.floor.matrix.forEach((gridRow) => gridRow.push("wall"));
        this.floor.cols = this.floor.matrix[0].length;
      }

      this.floor.matrix[row][col] = target;
    }
  }
}
