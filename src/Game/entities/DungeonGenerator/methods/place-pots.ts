import { CELL_SIZE } from "../../../../constants";
import { oneIn } from "../../../../utilities";
import { Pot } from "../../../Floor/entities/Pot/Pot";
import { DungeonGenerator } from "../DungeonGenerator";

export function placePots(this: DungeonGenerator) {
  let chance = 48;
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
            oneIn(12)
          ) {
            // if (!this.floor.spriteGridMatrix.has(`${y},${x}`)) {
            //   this.floor.spriteGridMatrix.set(`${y},${x}`, "pot");
            // }
          }
        }
      }
    });
  });
}
