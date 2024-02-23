import { oneIn } from "../../../../utilities";
import { Sign } from "../../../Floor/entities/Sign/Sign";
import { DungeonGenerator } from "../DungeonGenerator";

export function placeSigns(this: DungeonGenerator) {
  let chance = 1000;
  const min = 6;

  this.floor.objectMatrix.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell.includes("floor")) {
        if (oneIn(chance)) {
          if (
            this.floor.objectMatrix[y + 1] &&
            this.floor.objectMatrix[y + 1][x].includes("floor") &&
            !this.floor.spriteGridMatrix.has(`${y},${x}`)
          ) {
            this.floor.spriteGridMatrix.set(`${y},${x}`, "sign-rectangle");
          }
        }
      }
    });
  });
}
