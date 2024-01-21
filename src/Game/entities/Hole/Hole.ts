import Floor from "../../Floor/Floor";

export class Hole {
  grid: Floor;
  row: number;
  col: number;
  constructor(grid: Floor, row: number, col: number) {
    this.grid = grid;
    this.row = row;
    this.col = col;
    this.grid.addToTrackerCell(this);
    this.grid.holes.set(`${row},${col}`, this);
  }
}
