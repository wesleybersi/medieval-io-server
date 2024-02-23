import { Sign } from "./../entities/Sign/Sign";
import { getRandomInt, oneIn, randomNum } from "../../../utilities";
import { Hole } from "../entities/Hole/Hole";
import { Spikes } from "../entities/Spikes/Spikes";
import { Wall } from "../entities/Wall/Wall";
import Floor from "../Floor";
import { DungeonGenerator } from "../../entities/DungeonGenerator/DungeonGenerator";
import { Pot } from "../entities/Pot/Pot";
import { CELL_SIZE } from "../../../constants";
import { Door } from "../entities/Door/Door";
import { Shooter } from "../entities/Shooter/Shooter";
import { Direction } from "../../../types";

export interface PopulateConfig {
  iterations: number;
  roomChance: number;
  roomDepth: number;
}

export function populate(this: Floor, config: PopulateConfig) {
  new DungeonGenerator(this, 0, 0, {
    iterations: config.iterations,
    probability: {
      branching: Math.max(randomNum(80), 20),
      spikes: Math.max(randomNum(48), 16),
      water: Infinity,
    },
  });

  this.objectMatrix.forEach((row, y) => {
    row.forEach((cell, x) => {
      switch (cell) {
        case "floor":
          break;
        case "spikes-on":
        case "spikes-off":
          {
            new Spikes(this, y, x, {
              initialState: cell.endsWith("off") ? "off" : "on",
            });
          }
          break;
        case "wall":
        case "wall-cracks":
        case "wall-torch":
          {
            new Wall(this, y, x);
          }
          break;

        case "surrounded-wall":
          break;
        case "hole":
          new Hole(this, y, x);
          break;
      }
    });
  });

  for (const [pos, sprite] of this.spriteGridMatrix) {
    const [row, col] = pos.split(",").map((pos) => parseInt(pos));
    switch (sprite) {
      case "sign-rectangle":
        new Sign(this, row, col, ["Lorem ipsum", "Bacakigloui"]);
        break;
      // case "horz-door-closed-up":
      //   {
      //     const neighbor = this.spriteGridMatrix.get(`${row},${col - 1}`);
      //     if (neighbor && neighbor === sprite) {
      //       this.spriteGridMatrix.delete(`${row},${col}`);
      //       break;
      //     }
      //     new Door(this, "horizontal", "up", row, col);
      //   }
      //   break;
      // case "horz-door-closed-down":
      //   {
      //     const neighbor = this.spriteGridMatrix.get(`${row},${col - 1}`);
      //     if (neighbor && neighbor === sprite) {
      //       this.spriteGridMatrix.delete(`${row},${col}`);
      //       break;
      //     }
      //     new Door(this, "horizontal", "down", row, col);
      //   }
      //   break;
      // case "vert-door-closed-left":
      //   {
      //     const neighbor = this.spriteGridMatrix.get(`${row - 1},${col}`);
      //     if (neighbor && neighbor === sprite) {
      //       this.spriteGridMatrix.delete(`${row},${col}`);
      //       break;
      //     }
      //     new Door(this, "vertical", "left", row, col);
      //   }
      //   break;
      // case "vert-door-closed-left":
      //   {
      //     const neighbor = this.spriteGridMatrix.get(`${row - 1},${col}`);
      //     if (neighbor && neighbor === sprite) {
      //       this.spriteGridMatrix.delete(`${row},${col}`);
      //       break;
      //     }
      //     new Door(this, "vertical", "right", row, col);
      //   }
      //   break;
      case "shooter-up":
      case "shooter-down":
      case "shooter-left":
      case "shooter-right":
        new Shooter(this, row, col, sprite.slice(8) as Direction);
        break;
    }
  }

  this.rows = this.objectMatrix.length;
  this.cols = this.objectMatrix[0].length;

  const potIterations = Math.floor((this.rows * this.cols) / 125);
  for (let i = 0; i < potIterations; i++) {
    if (oneIn(6)) {
      const { row, col } = this.getRandomEmptyCell();

      if (
        this.isEmptyCell(row, col) &&
        this.isEmptyCell(row, col + 1) &&
        this.isEmptyCell(row + 1, col) &&
        this.isEmptyCell(row + 1, col + 1)
      ) {
        new Pot(this, col, row, true);
      }
    } else {
      const { row, col } = this.getRandomEmptyCell();
      new Pot(this, col, row);
      if (oneIn(6)) {
        if (this.isEmptyCell(row + 1, col)) {
          new Pot(this, col, row + 1);
        }
      }
      if (oneIn(6)) {
        if (this.isEmptyCell(row - 1, col)) {
          new Pot(this, col, row - 1);
        }
      }
      if (oneIn(6)) {
        if (this.isEmptyCell(row, col + 1)) {
          new Pot(this, col + 1, row);
        }
      }
      if (oneIn(6)) {
        if (this.isEmptyCell(row, col - 1)) {
          new Pot(this, col - 1, row);
        }
      }
    }
  }

  //Crates are let loose
  for (const [pos, sprite] of this.spriteGridMatrix) {
    if (sprite.includes("crate")) {
      this.spriteGridMatrix.delete(pos);
    }
  }

  console.log("Grid:", this.rows, "rows by", this.cols, "cols");

  for (const [_, wall] of this.walls) {
    if (this.objectMatrix[wall.row][wall.col].startsWith("wall") === false) {
      wall.remove();
      continue;
    }

    const top = this.walls.get(`${wall.row - 1},${wall.col}`);
    const bottom = this.walls.get(`${wall.row + 1},${wall.col}`);
    const left = this.walls.get(`${wall.row},${wall.col - 1}`);
    const right = this.walls.get(`${wall.row},${wall.col + 1}`);
    if (top) wall.adjacentWalls.top = true;
    if (bottom) wall.adjacentWalls.bottom = true;
    if (left) wall.adjacentWalls.left = true;
    if (right) wall.adjacentWalls.right = true;
  }
}
