import { CELL_SIZE } from "../../../../constants";
import { Collider } from "../../../entities/Collider/Collider";
import Floor from "../../Floor";

export class Hole extends Collider {
  floor: Floor;
  row: number;
  col: number;
  constructor(floor: Floor, row: number, col: number) {
    super(
      col * CELL_SIZE + CELL_SIZE / 2,
      row * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE,
      CELL_SIZE,
      false
    );
    this.isObstructing = false;
    this.floor = floor;
    this.row = row;
    this.col = col;
    this.floor.tracker.addToCell(this, row, col);

    if (
      this.floor.objectMatrix[row][col - 1] &&
      this.floor.objectMatrix[row][col - 1] === "hole"
    ) {
      this.boundingBox.left -= CELL_SIZE;
    }
    if (
      this.floor.objectMatrix[row][col + 1] &&
      this.floor.objectMatrix[row][col + 1] === "hole"
    ) {
      this.boundingBox.right += CELL_SIZE;
    }
    if (
      this.floor.objectMatrix[row - 1] &&
      this.floor.objectMatrix[row - 1][col] === "hole"
    ) {
      this.boundingBox.top -= CELL_SIZE;
    }
    if (
      this.floor.objectMatrix[row + 1] &&
      this.floor.objectMatrix[row + 1][col] === "hole"
    ) {
      this.boundingBox.top += CELL_SIZE;
    }
  }
}
