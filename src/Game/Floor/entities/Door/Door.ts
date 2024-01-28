import { Direction } from "../../../../types";
import { CELL_SIZE } from "../../../../constants";

import Floor, { MatrixCellType, SpriteGridType } from "../../Floor";

export class Door {
  floor: Floor;
  isLocked = false;
  isOpen = false;
  orientation: "horizontal" | "vertical";
  row: number;
  col: number;
  x: number;
  y: number;
  width = CELL_SIZE;
  height = CELL_SIZE;
  boundingBox: { top: number; left: number; right: number; bottom: number };

  constructor(
    floor: Floor,
    orientation: "horizontal" | "vertical",
    row: number,
    col: number,
    isLocked?: boolean
  ) {
    this.floor = floor;
    this.orientation = orientation;
    this.row = row;
    this.col = col;
    this.x = col * CELL_SIZE + CELL_SIZE / 2;
    this.y = row * CELL_SIZE + CELL_SIZE / 2;

    let spriteType = "";
    if (orientation === "horizontal") {
      spriteType = "horz-door-closed";
    } else if (orientation === "vertical") {
      spriteType = "vert-door-closed";
    }

    this.floor.spriteGridMatrix.set(
      `${this.row},${this.col}`,
      spriteType as SpriteGridType
    );

    if (isLocked) this.isLocked = true;

    this.floor.addToTrackerCell(this, row, col);

    this.boundingBox = {
      top: Math.floor(row * CELL_SIZE),
      left: Math.floor(col * CELL_SIZE),
      right: Math.floor(col * CELL_SIZE + CELL_SIZE),
      bottom: Math.floor(row * CELL_SIZE + CELL_SIZE),
    };
  }
  open(x: number, y: number) {
    this.isOpen = true;
    let direction: Direction = "up";

    if (this.orientation === "horizontal") {
      if (y < this.y) {
        direction = "down";
      } else if (y > this.y) {
        direction = "up";
      }
    } else if (this.orientation === "vertical") {
      if (x < this.x) {
        direction = "right";
      } else if (x > this.x) {
        direction = "left";
      }
    }

    this.floor.emissions.push({
      type: "door",
      row: this.row,
      col: this.col,
      isOpen: true,
      direction,
    });

    this.floor.spriteGridMatrix.set(
      `${this.row},${this.col}`,
      this.orientation === "horizontal"
        ? (("horz-door-open" + "-" + direction) as SpriteGridType)
        : (("vert-door-open" + "-" + direction) as SpriteGridType)
    );
  }
  close() {
    this.isOpen = false;
    this.floor.emissions.push({
      type: "door",
      row: this.row,
      col: this.col,
      isOpen: false,
    });

    this.floor.spriteGridMatrix.set(
      `${this.row},${this.col}`,
      this.orientation === "horizontal"
        ? "horz-door-closed"
        : "vert-door-closed"
    );
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
