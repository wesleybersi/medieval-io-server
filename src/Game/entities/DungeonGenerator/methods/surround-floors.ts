import { isWallSurrounded } from "../../../Floor/populate/methods/is-wall-surrounded";
import { DungeonGenerator } from "../DungeonGenerator";

export function surroundFloorsWithWalls(this: DungeonGenerator) {
  const notSurroundedFloors: { y: number; x: number }[] = [];
  this.floor.objectMatrix.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === "floor") {
        const cellAbove = this.floor.objectMatrix[y - 1]
          ? this.floor.objectMatrix[y - 1][x]
          : null;
        const cellBelow = this.floor.objectMatrix[y + 1]
          ? this.floor.objectMatrix[y + 1][x]
          : null;
        const cellRight = this.floor.objectMatrix[y][x + 1] ?? null;
        const cellLeft = this.floor.objectMatrix[y][x - 1] ?? null;
        if (cellAbove && cellAbove === "surrounded-wall") {
          this.floor.objectMatrix[y - 1][x] = "wall";
        }
        if (cellBelow && cellBelow === "surrounded-wall") {
          this.floor.objectMatrix[y + 1][x] = "wall";
        }
        if (cellRight && cellRight === "surrounded-wall") {
          this.floor.objectMatrix[y][x + 1] = "wall";
        }
        if (cellLeft && cellLeft === "surrounded-wall") {
          this.floor.objectMatrix[y][x - 1] = "wall";
        }
      }
    });
  });
  notSurroundedFloors.forEach((wall) => {
    this.floor.objectMatrix[wall.y][wall.x] = "surrounded-wall";
  });
}
