import { Direction } from "../../../../../types";
import { oneIn } from "../../../../../utilities";
import { Door } from "../../../entities/Door/Door";
import { DungeonGenerator } from "../DungeonGenerator";

export interface RoomConfig {
  probability: number;
}

export function createRooms(this: DungeonGenerator, config: RoomConfig) {
  this.floor.objectMatrix.forEach((row, y) => {
    row.forEach((cell, x) => {
      const newArea = (direction: Direction) => {
        if (oneIn(config.probability)) {
          this.floor.objectMatrix[y][x] = "floor-0";
          if (oneIn(5)) {
            // Keep empty
          } else {
            if (direction === "up" || direction === "down") {
              new Door(this.floor, "horizontal", y, x);
            } else if (direction === "left" || direction === "right") {
              new Door(this.floor, "vertical", y, x);
            }
          }
          if (direction === "up") {
            this.createRoom("surrounded-wall", "floor", direction, y - 1, x);
          } else if (direction === "down") {
            this.createRoom("surrounded-wall", "floor", direction, y + 1, x);
          } else if (direction === "left") {
            this.createRoom("surrounded-wall", "floor", direction, y, x - 1);
          } else if (direction === "right") {
            this.createRoom("surrounded-wall", "floor", direction, y, x + 1);
          }
        }
      };

      if (cell === "wall") {
        if (
          this.floor.objectMatrix[y - 1] &&
          this.floor.objectMatrix[y - 1][x] &&
          this.floor.objectMatrix[y - 1][x] === "surrounded-wall" &&
          this.floor.objectMatrix[y + 1] &&
          this.floor.objectMatrix[y + 1][x] &&
          this.floor.objectMatrix[y + 1][x] === "floor" &&
          this.floor.objectMatrix[y][x - 1] &&
          this.floor.objectMatrix[y][x - 1] === "wall" &&
          this.floor.objectMatrix[y][x + 1] &&
          this.floor.objectMatrix[y][x + 1] === "wall"
        ) {
          newArea("up");
        }
        if (
          this.floor.objectMatrix[y + 1] &&
          this.floor.objectMatrix[y + 1][x] &&
          this.floor.objectMatrix[y + 1][x] === "surrounded-wall" &&
          this.floor.objectMatrix[y - 1] &&
          this.floor.objectMatrix[y - 1][x] &&
          this.floor.objectMatrix[y - 1][x] === "floor" &&
          this.floor.objectMatrix[y][x - 1] &&
          this.floor.objectMatrix[y][x - 1] === "wall" &&
          this.floor.objectMatrix[y][x + 1] &&
          this.floor.objectMatrix[y][x + 1] === "wall"
        ) {
          newArea("down");
        }
        if (
          this.floor.objectMatrix[y] &&
          this.floor.objectMatrix[y][x + 1] &&
          this.floor.objectMatrix[y][x + 1] === "surrounded-wall" &&
          this.floor.objectMatrix[y] &&
          this.floor.objectMatrix[y][x - 1] &&
          this.floor.objectMatrix[y][x - 1] === "floor" &&
          this.floor.objectMatrix[y + 1] &&
          this.floor.objectMatrix[y + 1][x] &&
          this.floor.objectMatrix[y + 1][x] === "wall" &&
          this.floor.objectMatrix[y - 1] &&
          this.floor.objectMatrix[y - 1][x] &&
          this.floor.objectMatrix[y - 1][x] === "wall"
        ) {
          newArea("right");
        }
        if (
          this.floor.objectMatrix[y] &&
          this.floor.objectMatrix[y][x - 1] &&
          this.floor.objectMatrix[y][x - 1] === "surrounded-wall" &&
          this.floor.objectMatrix[y] &&
          this.floor.objectMatrix[y][x + 1] &&
          this.floor.objectMatrix[y][x + 1] === "floor" &&
          this.floor.objectMatrix[y + 1] &&
          this.floor.objectMatrix[y + 1][x] &&
          this.floor.objectMatrix[y + 1][x] === "wall" &&
          this.floor.objectMatrix[y - 1] &&
          this.floor.objectMatrix[y - 1][x] &&
          this.floor.objectMatrix[y - 1][x] === "wall"
        ) {
          newArea("left");
        }
      }
    });
  });
  this.surroundFloorsWithWalls();
}
