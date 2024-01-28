import { CELL_SIZE } from "../../../../constants";
import Floor from "../../Floor";

export class Hole {
  floor: Floor;
  row: number;
  col: number;
  x: number;
  y: number;
  boundingBox: { top: number; left: number; right: number; bottom: number };
  constructor(floor: Floor, row: number, col: number) {
    this.floor = floor;
    this.row = row;
    this.col = col;
    this.x = col * CELL_SIZE + CELL_SIZE / 2;
    this.y = row * CELL_SIZE + CELL_SIZE / 2;
    this.floor.addToTrackerCell(this, row, col);

    this.boundingBox = {
      top: Math.floor(this.y - CELL_SIZE / 2),
      left: Math.floor(this.x - CELL_SIZE / 2),
      right: Math.floor(this.x + CELL_SIZE / 2),
      bottom: Math.floor(this.y + CELL_SIZE / 2),
    };

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
  isRectOverlapping(x: number, y: number, width: number, height: number) {
    const left = x - width / 2;
    const right = x + width / 2;
    const top = y - height / 2;
    const bottom = y + height / 2;

    if (right < this.boundingBox.left || left > this.boundingBox.right) {
      return false;
    }

    if (bottom < this.boundingBox.top || top > this.boundingBox.bottom) {
      return false;
    }

    return true;
  }
  isRectCompletelyOverlapping(
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    const left = x - width / 3;
    const right = x + width / 3;
    const top = y - height / 3;
    const bottom = y + height / 3;

    if (
      left >= this.boundingBox.left &&
      right <= this.boundingBox.right &&
      top >= this.boundingBox.top &&
      bottom <= this.boundingBox.bottom
    ) {
      return true;
    }

    return false;
  }
}
