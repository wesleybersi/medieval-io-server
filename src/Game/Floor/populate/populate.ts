import { randomNum } from "../../../utilities";
import { Hole } from "../entities/Hole/Hole";
import { Spikes } from "../entities/Spikes/Spikes";
import { Wall } from "../entities/Wall/Wall";
import Floor from "../Floor";
import { DungeonGenerator } from "./DungeonGenerator/DungeonGenerator";

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
              globalTimer: 120,
            });
          }
          break;
        case "wall":
        case "wall-cracks":
        case "wall-torch":
          {
            new Wall(this, y, x);
            // new Hole(this, y, x);
            // this.objectMatrix[y][x] = "hole";
          }
          break;

        case "surrounded-wall":
          // new Hole(this, y, x);
          // this.objectMatrix[y][x] = "hole";
          break;
        case "hole":
          new Hole(this, y, x);
          break;
      }
    });
  });

  //   //ANCHOR Surround new rooms with walls
  //   this.matrix.forEach((row, y) => {
  //     row.forEach((cell, x) => {
  //       if (cell === "floor") {
  //         const cellAbove = this.matrix[y - 1] ? this.matrix[y - 1][x] : null;
  //         const cellBelow = this.matrix[y + 1] ? this.matrix[y + 1][x] : null;
  //         const cellRight = this.matrix[y][x + 1] ?? null;
  //         const cellLeft = this.matrix[y][x - 1] ?? null;

  //         if (cellAbove && cellAbove === "surrounded-wall") {
  //           this.matrix[y - 1][x] = "wall";
  //           new Wall(this, y - 1, x);
  //         }
  //         if (cellBelow && cellBelow === "surrounded-wall") {
  //           this.matrix[y + 1][x] = "wall";
  //           new Wall(this, y + 1, x);
  //         }
  //         if (cellRight && cellRight === "surrounded-wall") {
  //           this.matrix[y][x + 1] = "wall";
  //           new Wall(this, y, x + 1);
  //         }
  //         if (cellLeft && cellLeft === "surrounded-wall") {
  //           this.matrix[y][x - 1] = "wall";
  //           new Wall(this, y, x - 1);
  //         }
  //       }
  //     });
  //   });
  // };

  // for (let i = 0; i < config.roomDepth; i++) {
  //   createRooms();
  //   createRooms();
  // }

  // //Find places to create rooms

  // // const dampen = () => {
  // //   this.matrix.forEach((row, y) => {
  // //     row.forEach((cell, x) => {
  // //       if (cell === "wall") {
  // //         const cellAbove = this.matrix[y - 1] ? this.matrix[y - 1][x] : null;
  // //         const cellBelow = this.matrix[y + 1] ? this.matrix[y + 1][x] : null;
  // //         const cellRight = this.matrix[y][x + 1] ?? null;
  // //         const cellLeft = this.matrix[y][x - 1] ?? null;

  // //         const arr = [];
  // //         if (cellAbove) arr.push(cellAbove);
  // //         if (cellBelow) arr.push(cellBelow);
  // //         if (cellRight) arr.push(cellRight);
  // //         if (cellLeft) arr.push(cellLeft);

  // //         if (arr.length === 1) {
  // //           this.matrix[y][x] = "floor";
  // //           this.walls.get(`${y},${x}`)?.remove();
  // //         }
  // //       }
  // //     });
  // //   });
  // // };
  // // dampen();
  // // dampen();
  // // dampen();

  // //ANCHOR Recheck surrounded walls and place items
  // this.matrix.forEach((row, y) => {
  //   const torchRange = Math.max(randomNum(10), 3);
  //   row.forEach((cell, x) => {
  //     if (cell === "surrounded-wall") {
  //       if (!isWallSurrounded(this.matrix, y, x)) {
  //         this.matrix[y][x] = "wall";
  //         new Wall(this, y, x);
  //       }
  //     } else if (cell === "floor") {
  //       if (isWallSurrounded(this.matrix, y, x)) {
  //         this.matrix[y][x] = "wall";
  //         new Wall(this, y, x);
  //       } else {
  //         //ANCHOR Place random items like pots and chests
  //         if (
  //           (row[x - 1] && row[x - 1] === "wall") ||
  //           (row[x + 1] && row[x + 1] === "wall") ||
  //           (this.matrix[y - 1] && this.matrix[y - 1][x] === "wall") ||
  //           (this.matrix[y + 1] && this.matrix[y + 1][x] === "wall") ||
  //           oneIn(16)
  //         ) {
  //           if (oneIn(32)) new Pot(this, y, x);
  //         } else {
  //           // if (oneIn(400)) {
  //           //   if (
  //           //     this.matrix[y + 1] &&
  //           //     this.matrix[y + 1][x] &&
  //           //     this.matrix[y + 1][x] === "floor"
  //           //   ) {
  //           //     new Chest(this, y, x);
  //           //   }
  //           // }
  //         }
  //       }
  //     } else if (cell === "wall") {
  //       const cellAbove = this.matrix[y - 1] ? this.matrix[y - 1][x] : null;
  //       const cellBelow = this.matrix[y + 1] ? this.matrix[y + 1][x] : null;
  //       if (
  //         cellAbove &&
  //         cellAbove === "surrounded-wall" &&
  //         cellBelow &&
  //         cellBelow === "floor"
  //       ) {
  //         if (x % torchRange === 0) {
  //           this.decoration.torches.push({ row: y, col: x });
  //         }
  //       }
  //     }
  //   });
  // });

  this.rows = this.objectMatrix.length;
  this.cols = this.objectMatrix[0].length;

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

  // //Pickups
  // for (let row = 0; row < this.rows; row++) {
  //   for (let col = 0; col < this.cols; col++) {
  //     const trackerPos = this.tracker.get(`${row},${col}`);
  //     if (trackerPos && trackerPos.size > 0) continue;

  //     if (oneIn(200)) {
  //       const type = getRandomWeaponType();
  //       const tier = getRandomWeaponTier(type);
  //       new WeaponPickup(this, row, col, {
  //         type,
  //         tier,
  //       });
  //     }
  //   }
  // }
  // this.pickupTarget = this.pickups.size;
}
