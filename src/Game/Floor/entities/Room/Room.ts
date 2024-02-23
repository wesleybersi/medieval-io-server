import { oneIn, randomNum } from "../../../../utilities";
import Floor from "../../Floor";
import { MatrixCellType } from "../../types";
import { Chest } from "../Chest/Chest";

export class Room {
  floor: Floor;
  cells: {
    row: number;
    col: number;
    type: MatrixCellType;
  }[];
  size: { rows: number; cols: number };
  center: { row: number; col: number };
  hasMainStairs = false;

  constructor(
    floor: Floor,
    cells: { row: number; col: number; type: MatrixCellType }[]
  ) {
    this.floor = floor;
    this.cells = cells;
    this.center = this.findCenter();
    this.size = this.calculateSize();
    // if (this.size.rows >= 2 || this.size.cols >= 2) {
    this.placeTreasure({
      row: this.center.row,
      col: this.center.col,
    });
    // }

    if (this.areCellsSurrounded()) {
      for (const cell of cells) {
        if (oneIn(16)) continue;
        this.floor.objectMatrix[cell.row][cell.col] = "floor-17";
      }
    }

    if (cells.length < 100 && oneIn(3)) {
      let r = randomNum(6);
      for (const cell of cells) {
        if (oneIn(16)) continue;
        this.floor.objectMatrix[cell.row][cell.col] = ("floor-" +
          r.toString()) as MatrixCellType;
      }
    }
  }
  findCenter(): { row: number; col: number } {
    if (this.cells.length === 0) {
      throw new Error("No cells provided");
    }

    // Calculate the average row and column values
    const sumRow = this.cells.reduce((sum, cell) => sum + cell.row, 0);
    const sumCol = this.cells.reduce((sum, cell) => sum + cell.col, 0);

    const centerRow = Math.round(sumRow / this.cells.length);
    const centerCol = Math.round(sumCol / this.cells.length);

    return { row: centerRow, col: centerCol };
  }
  calculateSize(): {
    rows: number;
    cols: number;
  } {
    if (this.cells.length === 0) {
      throw new Error("No cells provided");
    }

    // Find the minimum and maximum row and column values
    const minRow = Math.min(...this.cells.map((cell) => cell.row));
    const maxRow = Math.max(...this.cells.map((cell) => cell.row));
    const minCol = Math.min(...this.cells.map((cell) => cell.col));
    const maxCol = Math.max(...this.cells.map((cell) => cell.col));

    // Calculate the size in rows and columns
    const numRows = maxRow - minRow + 1;
    const numCols = maxCol - minCol + 1;

    return { rows: numRows, cols: numCols };
  }
  areCellsSurrounded(): boolean {
    // Find the minimum and maximum row and column values
    const minRow = Math.min(...this.cells.map((cell) => cell.row));
    const maxRow = Math.max(...this.cells.map((cell) => cell.row));
    const minCol = Math.min(...this.cells.map((cell) => cell.col));
    const maxCol = Math.max(...this.cells.map((cell) => cell.col));

    // Check if the surrounding cells are walls
    for (let row = minRow - 1; row <= maxRow + 1; row++) {
      for (let col = minCol - 1; col <= maxCol + 1; col++) {
        if (
          row < 0 ||
          col < 0 ||
          row >= this.floor.objectMatrix.length ||
          col >= this.floor.objectMatrix[row].length ||
          !this.floor.objectMatrix[row][col].includes("wall")
        ) {
          return false;
        }
      }
    }

    return true;
  }

  placeTreasure({ row, col }: { row: number; col: number }) {
    if (!oneIn(5)) return;
    if (this.cells.length > 100 && !oneIn(4)) {
      return;
    }
    let surroundCount = 0;
    const surroundings = [
      { row: row - 1, col },
      { row: row + 1, col },
      { row, col: col - 1 },
      { row, col: col + 1 },
    ];
    for (const { row, col } of surroundings) {
      if (this.floor.isValidCell(row, col)) {
        if (this.floor.objectMatrix[row][col].includes("floor")) {
          surroundCount++;
        }
      }
    }

    if (surroundCount >= 2) {
      if (
        this.floor.isValidCell(row + 1, col) &&
        this.floor.objectMatrix[row + 1][col].includes("floor")
      ) {
        new Chest(this.floor, row, col);
      }
    }
  }
}
