import { isWallSurrounded } from "../../../Floor/populate/methods/is-wall-surrounded";
import { DungeonGenerator } from "../DungeonGenerator";

export function detectSurroundedWalls(this: DungeonGenerator) {
  const surroundedWalls: { y: number; x: number }[] = [];
  this.floor.objectMatrix.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === "wall") {
        if (isWallSurrounded(this.floor.objectMatrix, y, x)) {
          surroundedWalls.push({ y, x });
        }
      } else if (cell === "surrounded-wall") {
        if (!isWallSurrounded(this.floor.objectMatrix, y, x)) {
          this.floor.objectMatrix[y][x] = "wall";
        }
      }
    });
  });
  surroundedWalls.forEach((wall) => {
    this.floor.objectMatrix[wall.y][wall.x] = "surrounded-wall";
  });
}
