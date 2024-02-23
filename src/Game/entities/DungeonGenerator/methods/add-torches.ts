import { oneIn, randomNum } from "../../../../utilities";
import { DungeonGenerator } from "../DungeonGenerator";

export function addTorches(this: DungeonGenerator) {
  const randomizeInterval = () => {
    let min = 3;
    let max = 10;
    return Math.max(randomNum(max - min), min) + min; // Trust me
  };
  let currentRow = 0;
  let currentInterval = randomizeInterval();

  this.floor.objectMatrix.forEach((row, y) => {
    if (currentRow !== y || oneIn(12)) {
      currentInterval = randomizeInterval();
      currentRow = y;
    }

    row.forEach((cell, x) => {
      if (cell === "wall") {
        const cellBelow = this.floor.objectMatrix[y + 1]
          ? this.floor.objectMatrix[y + 1][x]
          : null;

        if (x % currentInterval === 0 && cellBelow && cellBelow === "floor") {
          this.floor.objectMatrix[y][x] = "wall-torch";
        }
      }
    });
  });
}
