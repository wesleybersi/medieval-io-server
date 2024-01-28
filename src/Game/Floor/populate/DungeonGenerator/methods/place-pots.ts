import { CELL_SIZE } from "../../../../../constants";
import { oneIn } from "../../../../../utilities";
import { Pot } from "../../../entities/Pot/Pot";
import { DungeonGenerator } from "../DungeonGenerator";

export function placePots(this: DungeonGenerator) {
  let chance = 64;
  const min = 6;

  this.floor.objectMatrix.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell.includes("floor")) {
        if (oneIn(2)) chance++;
        if (oneIn(2)) chance--;
        if (chance < min) chance = min;
        if (oneIn(chance)) {
          if (
            (row[x - 1] && row[x - 1].includes("wall")) ||
            (row[x + 1] && row[x + 1].includes("wall")) ||
            (this.floor.objectMatrix[y - 1] &&
              this.floor.objectMatrix[y - 1][x].includes("wall")) ||
            (this.floor.objectMatrix[y + 1] &&
              this.floor.objectMatrix[y + 1][x].includes("wall")) ||
            oneIn(24)
          ) {
            if (!this.floor.spriteGridMatrix.has(`${y},${x}`)) {
              new Pot(
                this.floor,
                x * CELL_SIZE + CELL_SIZE / 2,
                y * CELL_SIZE + CELL_SIZE / 2
              );
            }
          }
        }
      }
    });
  });
}
