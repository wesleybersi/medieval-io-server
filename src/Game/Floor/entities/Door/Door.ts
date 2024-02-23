import { Direction } from "../../../../types";
import { CELL_SIZE } from "../../../../constants";

import Floor from "../../Floor";
import { MatrixCellType, GridSpriteType } from "../../types";
import { Collider } from "../../../entities/Collider/Collider";

export class Door extends Collider {
  floor: Floor;
  isLocked = false;
  isOpen = false;
  orientation: "horizontal" | "vertical";
  direction: Direction;
  row: number;
  col: number;
  touchedCells = [];
  constructor(
    floor: Floor,
    orientation: "horizontal" | "vertical",
    direction: Direction,
    row: number,
    col: number,
    isLocked?: boolean
  ) {
    super(
      orientation === "horizontal"
        ? col * CELL_SIZE + CELL_SIZE
        : col * CELL_SIZE + CELL_SIZE / 2, //x
      orientation === "horizontal"
        ? row * CELL_SIZE + CELL_SIZE / 2
        : row * CELL_SIZE + CELL_SIZE,
      orientation === "horizontal" ? CELL_SIZE * 2 : CELL_SIZE, //width
      orientation === "horizontal" ? CELL_SIZE : CELL_SIZE * 2, //height
      true //obstructs
    );
    this.floor = floor;
    this.orientation = orientation;
    this.direction = direction;
    this.row = row;
    this.col = col;

    if (isLocked) this.isLocked = true;

    this.floor.tracker.track(this);
  }
  open(x: number, y: number) {
    this.isOpen = true;
    this.isObstructing = false;

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
        ? (("horz-door-open" + "-" + direction) as GridSpriteType)
        : (("vert-door-open" + "-" + direction) as GridSpriteType)
    );
  }
  close() {
    this.isOpen = false;
    this.isObstructing = true;
    this.floor.emissions.push({
      type: "door",
      row: this.row,
      col: this.col,
      isOpen: false,
    });

    this.floor.spriteGridMatrix.set(
      `${this.row},${this.col}`,
      this.orientation === "horizontal"
        ? (("horz-door-closed" + this.direction) as GridSpriteType)
        : (("vert-door-closed" + this.direction) as GridSpriteType)
    );
  }
}
