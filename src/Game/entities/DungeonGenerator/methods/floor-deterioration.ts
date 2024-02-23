import { oneIn, randomNum } from "../../../../utilities";
import { DungeonGenerator } from "../DungeonGenerator";

export function floorDeterioration(this: DungeonGenerator) {
  let deterationProbability = Math.max(randomNum(20), 1);

  this.floor.objectMatrix.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === "floor") {
        if (oneIn(deterationProbability)) {
          this.floor.objectMatrix[y][x] += "-" + randomNum(6);
        } else {
          this.floor.objectMatrix[y][x] = "floor-0";
        }
      }
    });
    if (oneIn(8)) {
      if (oneIn(2)) {
        deterationProbability--;
      } else {
        deterationProbability--;
      }
      if (deterationProbability < 0) deterationProbability = 0;
    }
  });
}
