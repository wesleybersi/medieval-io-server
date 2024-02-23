import { DungeonGenerator } from "../DungeonGenerator";

export function clampArea(this: DungeonGenerator) {
  let spliceAmount = 0;
  // check per row from top
  for (const row of this.floor.objectMatrix) {
    if (row.every((cell) => cell === "wall")) {
      spliceAmount++;
    } else {
      break;
    }
  }
  this.floor.objectMatrix.splice(0, spliceAmount);
  this.floor.rows -= spliceAmount;

  //check per row from bottom
  spliceAmount = 0;
  for (const row of [...this.floor.objectMatrix].reverse()) {
    if (row.every((cell) => cell === "wall")) {
      spliceAmount++;
    } else {
      break;
    }
  }
  this.floor.objectMatrix.splice(
    this.floor.objectMatrix.length - spliceAmount,
    spliceAmount
  );
  this.floor.rows -= spliceAmount;

  //check per col from left and right
  const columnIsWall = (row: number, col: number): boolean => {
    if (this.floor.objectMatrix[row][col] === "floor") {
      return false;
    } else {
      if (row === this.floor.rows - 1) {
        return true;
      }
      return columnIsWall(row + 1, col);
    }
  };

  spliceAmount = 0;
  for (let col = 0; col < this.floor.cols; col++) {
    if (columnIsWall(0, col)) {
      this.floor.objectMatrix.forEach((row) => row.shift());
      spliceAmount++;
    } else {
      break;
    }
  }
  this.floor.cols -= spliceAmount;

  spliceAmount = 0;
  for (let col = this.floor.cols - 1; col >= 0; col--) {
    if (columnIsWall(0, col)) {
      this.floor.objectMatrix.forEach((row) => row.pop());
      spliceAmount++;
    } else {
      break;
    }
  }
  this.floor.cols -= spliceAmount;
}
