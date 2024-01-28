import { randomNum } from "../../../../../utilities";
import { DungeonGenerator } from "../DungeonGenerator";

export function addHoles(this: DungeonGenerator) {
  //TODO - Water / Lava
  const startRandomHole = () => {
    const getRandomSurroundedCell = (): { row: number; col: number } => {
      const cells: { row: number; col: number }[] = [];
      this.floor.objectMatrix.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell.includes("surrounded")) {
            cells.push({ row: y, col: x });
          }
        });
      });
      return cells[randomNum(cells.length)];
    };
    const { row, col } = getRandomSurroundedCell();
    let iterations = randomNum(64);

    const expandHole = (row: number, col: number) => {
      iterations--;
      if (iterations <= 0) return;

      const surroundings = [
        { row, col: col - 1 },
        { row, col: col + 1 },
        { row: row + 1, col },
        { row: row - 1, col },
      ];

      for (const cell of surroundings.sort(() => Math.random() - 0.5)) {
        if (this.floor.isValidCell(cell.row, cell.col)) {
          if (this.floor.objectMatrix[cell.row][cell.col].includes("wall")) {
            this.floor.objectMatrix[cell.row][cell.col] = "hole";
            expandHole(cell.row, cell.col);
          }
        }
      }
    };
    expandHole(row, col);
  };

  for (
    let i = 0;
    i < randomNum(this.floor.rows * this.floor.cols) / randomNum(300);
    i++
  ) {
    startRandomHole();
  }
}
