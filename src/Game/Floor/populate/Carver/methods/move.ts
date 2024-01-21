import { Carver } from "./../Carver";
import { getRandomDirection, oneIn, randomNum } from "../../../../../utilities";
import { MatrixCellType } from "../../../Floor";

export function move(this: Carver) {
  this.iterationsLeft--;
  if (oneIn(10)) this.direction = getRandomDirection();

  const directions = {
    up: { row: this.row - 1, col: this.col }, //Up
    down: { row: this.row + 1, col: this.col }, //Down
    left: { row: this.row, col: this.col - 1 }, //Left
    right: { row: this.row, col: this.col + 1 }, //Right
  };
  const cell = directions[this.direction];

  //If below zero
  if (cell.row < 0) {
    this.floor.matrix.unshift([
      ...Array.from({ length: this.floor.cols }).map(
        () => "wall" as MatrixCellType
      ),
    ]);
    this.floor.rows = this.floor.matrix.length;
    cell.row = 0;
  }
  if (cell.col < 0) {
    this.floor.matrix.forEach((gridRow) => gridRow.unshift("wall"));
    this.floor.cols = this.floor.matrix[0].length;
    cell.col = 0;
  }

  //If bigger than grid
  if (cell.row > this.floor.rows - 1) {
    this.floor.matrix.push([
      ...Array.from({ length: this.floor.cols }).map(
        () => "wall" as MatrixCellType
      ),
    ]);
    this.floor.rows = this.floor.matrix.length;
  }
  if (cell.col > this.floor.cols - 1) {
    this.floor.matrix.forEach((gridRow) => gridRow.push("wall"));
    this.floor.cols = this.floor.matrix[0].length;
  }
  this.row = cell.row;
  this.col = cell.col;

  if (this.floor.matrix[cell.row][cell.col] === "wall") {
    let type: "floor" | "spikes-on" | "spikes-off" = "floor";
    if (oneIn(this.probability.spikes)) {
      type = `spikes-${oneIn(2) ? "on" : "off"}`;
    }
    this.carve(type);
  }
  if (this.iterationsLeft > 0) {
    if (oneIn(this.chanceOfBranching)) {
      new Carver(this.floor, this.row, this.col, {
        iterations: randomNum(this.iterationsLeft),
        probability: this.probability,
      }).move();
    }

    this.move();
  }
}
