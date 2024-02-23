import { CELL_SIZE } from "../../../../constants";
import { Collider } from "../../../entities/Collider/Collider";
import Floor from "../../Floor";

export class Wall extends Collider {
  grid: Floor;
  row: number;
  col: number;
  health: number;
  adjacentWalls: {
    top: boolean;
    bottom: boolean;
    left: boolean;
    right: boolean;
  } = { top: false, bottom: false, left: false, right: false };
  type: "" | "torch" | "pillar-flame" | "pillar" = "";
  constructor(grid: Floor, row: number, col: number) {
    super(
      col * CELL_SIZE + CELL_SIZE / 2,
      row * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE,
      CELL_SIZE,
      true
    );
    this.grid = grid;
    this.health = 16;
    this.row = row;
    this.col = col;

    this.grid.walls.set(`${row},${col}`, this);
    this.grid.tracker.addToCell(this, row, col);
  }
  remove() {
    this.grid.walls.delete(`${this.row},${this.col}`);

    const tracker = this.grid.tracker.cells.get(`${this.row},${this.col}`);
    for (const pos of Object.entries(this.adjacentWalls)) {
      //TODO Remove from eachotehr
    }

    tracker?.delete(this);
  }
}
