import { oneIn } from "../../../../utilities";
import { Shooter } from "../../../Floor/entities/Shooter/Shooter";
import { DungeonGenerator } from "../DungeonGenerator";

export function addShooters(this: DungeonGenerator) {
  this.floor.objectMatrix.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === "wall") {
        if (oneIn(50)) {
          const down = () => {
            const floorBelow =
              this.floor.isValidCell(y + 1, x) &&
              this.floor.objectMatrix[y + 1][x].includes("floor");

            if (floorBelow) {
              if (this.floor.spriteGridMatrix.has(`${y},${x}`)) return false;
              this.floor.spriteGridMatrix.set(`${y},${x}`, "shooter-down");
              return true;
            }
            return false;
          };

          const up = () => {
            const floorAbove =
              this.floor.isValidCell(y - 1, x) &&
              this.floor.objectMatrix[y - 1][x].includes("floor");
            if (floorAbove) {
              if (this.floor.spriteGridMatrix.has(`${y},${x}`)) return false;
              this.floor.spriteGridMatrix.set(`${y},${x}`, "shooter-up");
              return true;
            }
            return false;
          };

          const left = () => {
            const floorLeft =
              this.floor.isValidCell(y, x - 1) &&
              this.floor.objectMatrix[y][x - 1].includes("floor");
            if (floorLeft) {
              if (this.floor.spriteGridMatrix.has(`${y},${x}`)) return false;
              this.floor.spriteGridMatrix.set(`${y},${x}`, "shooter-left");
              return true;
            }
            return false;
          };

          const right = () => {
            const floorRight =
              this.floor.isValidCell(y, x + 1) &&
              this.floor.objectMatrix[y][x + 1].includes("floor");
            if (floorRight) {
              if (this.floor.spriteGridMatrix.has(`${y},${x}`)) return false;
              this.floor.spriteGridMatrix.set(`${y},${x}`, "shooter-right");
              return true;
            }
            return false;
          };

          const functions = [down, up, left, right]
            .sort(() => Math.random() - 0.5)
            .filter((cell) => cell);

          for (const placeShooter of functions) {
            if (placeShooter()) break;
          }
        }
      }
    });
  });
}
