import { DungeonGenerator } from "../DungeonGenerator";
import { getRandomDirection, oneIn } from "../../../../utilities";
import { MatrixCellType } from "../../../Floor/types";

export function generateCorridors(this: DungeonGenerator) {
  this.iterationsLeft--;
  if (oneIn(8)) this.direction = getRandomDirection();

  const directions = {
    up: { row: this.row - 1, col: this.col }, //Up
    down: { row: this.row + 1, col: this.col }, //Down
    left: { row: this.row, col: this.col - 1 }, //Left
    right: { row: this.row, col: this.col + 1 }, //Right
  };
  const cell = directions[this.direction];

  //If below zero
  if (cell.row < 0) {
    this.floor.objectMatrix.unshift([
      ...Array.from({ length: this.floor.cols }).map(
        () => "wall" as MatrixCellType
      ),
    ]);
    this.floor.rows++;
    cell.row++;
  }
  if (cell.col < 0) {
    this.floor.objectMatrix.forEach((gridRow) => gridRow.unshift("wall"));
    this.floor.cols++;
    cell.col++;
  }

  //If bigger than grid
  if (cell.row > this.floor.rows - 1) {
    this.floor.objectMatrix.push([
      ...Array.from({ length: this.floor.cols }).map(
        () => "wall" as MatrixCellType
      ),
    ]);
    this.floor.rows++;
  }
  if (cell.col > this.floor.cols - 1) {
    this.floor.objectMatrix.forEach((gridRow) => gridRow.push("wall"));
    this.floor.cols++;
  }
  this.row = cell.row;
  this.col = cell.col;

  if (this.floor.objectMatrix[cell.row][cell.col] === "wall") {
    this.clearArea("floor");
  }
  if (this.iterationsLeft > 0) {
    this.generateCorridorrs();
  }
}
