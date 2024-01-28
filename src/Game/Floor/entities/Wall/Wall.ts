import { CELL_SIZE } from "../../../../constants";
import Floor from "../../Floor";

export class Wall {
  grid: Floor;
  row: number;
  col: number;
  x: number;
  y: number;
  health: number;
  boundingBox: { top: number; left: number; right: number; bottom: number };
  adjacentWalls: { [key: string]: boolean } = {};
  width = CELL_SIZE;
  height = CELL_SIZE;

  type: "" | "torch" | "pillar-flame" | "pillar" = "";
  constructor(grid: Floor, row: number, col: number) {
    this.grid = grid;
    this.health = 16;

    this.row = row;
    this.col = col;
    this.x = col * CELL_SIZE + CELL_SIZE / 2;
    this.y = row * CELL_SIZE + CELL_SIZE / 2;
    this.boundingBox = {
      top: Math.floor(row * CELL_SIZE),
      left: Math.floor(col * CELL_SIZE),
      right: Math.floor(col * CELL_SIZE + CELL_SIZE),
      bottom: Math.floor(row * CELL_SIZE + CELL_SIZE),
    };
    this.grid.walls.set(`${row},${col}`, this);
    this.grid.addToTrackerCell(this, row, col);
  }
  remove() {
    this.grid.walls.delete(`${this.row},${this.col}`);
    const tracker = this.grid.tracker.get(`${this.row},${this.col}`);

    for (const pos of Object.entries(this.adjacentWalls)) {
      //TODO Remove from eachotehr
    }

    tracker?.delete(this);
  }
  getCollisionSide(obj: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  }): "top" | "bottom" | "left" | "right" | "none" {
    if (
      obj.bottom < this.boundingBox.top ||
      obj.top > this.boundingBox.bottom ||
      obj.right < this.boundingBox.left ||
      obj.left > this.boundingBox.right
    ) {
      return "none";
    }

    const topCollision = Math.abs(obj.bottom - this.boundingBox.top);
    const bottomCollision = Math.abs(obj.top - this.boundingBox.bottom);
    const leftCollision = Math.abs(obj.right - this.boundingBox.left);
    const rightCollision = Math.abs(obj.left - this.boundingBox.right);

    // If no adjacentWalls conditions are met, use the original logic
    const minCollision = Math.min(
      topCollision,
      bottomCollision,
      leftCollision,
      rightCollision
    );

    //Takes care of corner jank
    if (this.adjacentWalls.top) {
      if (minCollision === topCollision)
        if (obj.right > this.boundingBox.right) {
          return "right";
        } else {
          return "left";
        }
    }

    if (this.adjacentWalls.bottom) {
      if (minCollision === bottomCollision)
        if (obj.right > this.boundingBox.right) {
          return "right";
        } else {
          return "left";
        }
    }

    if (this.adjacentWalls.left) {
      if (minCollision === leftCollision)
        if (obj.bottom > this.boundingBox.bottom) {
          return "bottom";
        } else {
          return "top";
        }
    }
    if (this.adjacentWalls.right) {
      if (minCollision === rightCollision)
        if (obj.bottom > this.boundingBox.bottom) {
          return "bottom";
        } else {
          return "top";
        }
    }

    if (minCollision === topCollision) {
      return "top";
    } else if (minCollision === bottomCollision) {
      return "bottom";
    } else if (minCollision === leftCollision) {
      return "left";
    } else {
      return "right";
    }
  }
}
