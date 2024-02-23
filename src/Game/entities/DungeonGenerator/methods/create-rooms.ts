import { Direction } from "../../../../types";
import { oneIn } from "../../../../utilities";
import { Door } from "../../../Floor/entities/Door/Door";
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
            if (direction === "up") {
              if (oneIn(2)) {
                if (
                  this.floor.isEmptyCell(y + 1, x) &&
                  this.floor.isEmptyCell(y + 1, x + 1)
                ) {
                  this.floor.spriteGridMatrix.set(
                    `${y},${x}`,
                    "horz-door-closed-up"
                  );
                  this.floor.spriteGridMatrix.set(
                    `${y},${x + 1}`,
                    "horz-door-closed-up"
                  );
                  this.floor.objectMatrix[y][x + 1] = "floor-0";
                } else return;
              } else {
                if (
                  this.floor.isEmptyCell(y + 1, x) &&
                  this.floor.isEmptyCell(y + 1, x - 1)
                ) {
                  this.floor.spriteGridMatrix.set(
                    `${y},${x}`,
                    "horz-door-closed-up"
                  );
                  this.floor.spriteGridMatrix.set(
                    `${y},${x - 1}`,
                    "horz-door-closed-up"
                  );
                  this.floor.objectMatrix[y][x - 1] = "floor-0";
                } else return;
              }
            } else if (direction === "down") {
              if (oneIn(2)) {
                if (
                  this.floor.isEmptyCell(y - 1, x) &&
                  this.floor.isEmptyCell(y - 1, x + 1)
                ) {
                  this.floor.spriteGridMatrix.set(
                    `${y},${x}`,
                    "horz-door-closed-down"
                  );
                  this.floor.spriteGridMatrix.set(
                    `${y},${x + 1}`,
                    "horz-door-closed-down"
                  );
                  this.floor.objectMatrix[y][x + 1] = "floor-0";
                } else return;
              } else {
                if (
                  this.floor.isEmptyCell(y - 1, x) &&
                  this.floor.isEmptyCell(y - 1, x - 1)
                ) {
                  this.floor.spriteGridMatrix.set(
                    `${y},${x}`,
                    "horz-door-closed-down"
                  );
                  this.floor.spriteGridMatrix.set(
                    `${y},${x - 1}`,
                    "horz-door-closed-down"
                  );
                  this.floor.objectMatrix[y][x - 1] = "floor-0";
                } else return;
              }
            } else if (direction === "left") {
              if (oneIn(2)) {
                if (
                  this.floor.isEmptyCell(y, x + 1) &&
                  this.floor.isEmptyCell(y - 1, x + 1)
                ) {
                  this.floor.spriteGridMatrix.set(
                    `${y},${x}`,
                    "vert-door-closed-left"
                  );
                  this.floor.spriteGridMatrix.set(
                    `${y - 1},${x}`,
                    "vert-door-closed-left"
                  );
                  this.floor.objectMatrix[y - 1][x] = "floor-0";
                } else return;
              } else {
                if (
                  this.floor.isEmptyCell(y, x + 1) &&
                  this.floor.isEmptyCell(y + 1, x + 1)
                ) {
                  this.floor.spriteGridMatrix.set(
                    `${y},${x}`,
                    "vert-door-closed-left"
                  );
                  this.floor.spriteGridMatrix.set(
                    `${y + 1},${x}`,
                    "vert-door-closed-left"
                  );
                  this.floor.objectMatrix[y + 1][x] = "floor-0";
                } else return;
              }
            } else if (direction === "right") {
              if (oneIn(2)) {
                if (
                  this.floor.isEmptyCell(y, x - 1) &&
                  this.floor.isEmptyCell(y - 1, x - 1)
                ) {
                  this.floor.spriteGridMatrix.set(
                    `${y},${x}`,
                    "vert-door-closed-right"
                  );
                  this.floor.spriteGridMatrix.set(
                    `${y - 1},${x}`,
                    "vert-door-closed-right"
                  );
                  this.floor.objectMatrix[y - 1][x] = "floor-0";
                } else return;
              } else {
                if (
                  this.floor.isEmptyCell(y, x - 1) &&
                  this.floor.isEmptyCell(y + 1, x - 1)
                ) {
                  this.floor.spriteGridMatrix.set(
                    `${y},${x}`,
                    "vert-door-closed-right"
                  );
                  this.floor.spriteGridMatrix.set(
                    `${y + 1},${x}`,
                    "vert-door-closed-right"
                  );
                  this.floor.objectMatrix[y + 1][x] = "floor-0";
                } else return;
              }
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
          this.floor.isValidCell(y - 1, x) &&
          this.floor.objectMatrix[y - 1][x] === "surrounded-wall" &&
          this.floor.isValidCell(y + 1, x) &&
          this.floor.objectMatrix[y + 1][x] === "floor" &&
          this.floor.isValidCell(y, x - 1) &&
          this.floor.objectMatrix[y][x - 1] === "wall" &&
          this.floor.isValidCell(y, x + 1) &&
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
