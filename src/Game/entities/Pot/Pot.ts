import { CELL_SIZE } from "../../../constants";
import Floor from "../../Floor/Floor";

export class Pot {
  floor: Floor;
  row: number;
  col: number;
  x: number;
  y: number;
  width = CELL_SIZE * 0.75;
  height = CELL_SIZE * 0.75;
  constructor(floor: Floor, row: number, col: number) {
    this.floor = floor;
    this.row = row;
    this.col = col;
    this.x = col * CELL_SIZE + CELL_SIZE / 2;
    this.y = row * CELL_SIZE + CELL_SIZE / 2;
    this.floor.addToTrackerCell(this);
    this.floor.matrix[row][col] = "pot";
  }
  hit() {
    this.floor.emissionData.destroyedPots.push({
      row: this.row,
      col: this.col,
    });
    this.floor.matrix[this.row][this.col] = "floor";
    this.floor.removeFromTracker(this);
  }
}
