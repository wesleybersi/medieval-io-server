import { Spikes } from "./../entities/Spikes/Spikes";
import { oneIn, randomLowerNumber, randomNum } from "../../utilities";
import Game from "../Game";
import { getNearestEmptyCell } from "./methods/get-nearest-empty-cell";
import { getAdjacentCells } from "./methods/get-adjacent-cells";
import { CELL_SIZE, WALL_SIZE } from "../../constants";
import { Player } from "../entities/Player/Player";
import { getTouchedCells } from "./methods/get-touched-cells";
import { trackPosition } from "./methods/track-position";
import { Projectile } from "../entities/Weapon/Projectile/Projectile";
import { removeFromTracker } from "./methods/remove-from-tracker";
import { Wall } from "../entities/Wall/Wall";
import { Tile } from "../entities/Tile/Tile";
import { Pickup, WeaponPickup } from "../entities/Pickup/Pickup";
import { addToIndividualTrackerCell } from "./methods/add-to-tracker-cell";
import { Hole } from "../entities/Hole/Hole";
import { EmissionData } from "./types";
import { updatePlayers } from "./update/players";
import { updateProjectiles } from "./update/projectiles";
import { updateTiles } from "./update/tiles";
import { updatePickups } from "./update/pickups";
import { updateTracker } from "./update/tracker";
import { emit } from "./emit/emit-to-player";
import { emitInitialData } from "./emit/emit-initial-data";
import { Socket } from "socket.io";
import { removePlayer } from "./methods/remove-player";
import { addPlayer } from "./methods/add-player";
import { Stairs } from "../entities/Stairs/Stairs";
import { Carver } from "./populate/Carver/Carver";
import { Pot } from "../entities/Pot/Pot";
import {
  getRandomWeaponTier,
  getRandomWeaponType,
} from "../entities/Pickup/random-weapon";

export type GridObject =
  | Player
  | Tile
  | Projectile
  | Wall
  | Pickup
  | Hole
  | Stairs
  | Spikes
  | Pot;

export type MatrixCellType =
  | "floor"
  | "wall"
  | "pot"
  | "spikes"
  | "spikes-on"
  | "spikes-off"
  | "water"
  | "hole"
  | "stairs-up"
  | "stairs-down";

export default class Floor {
  game: Game;
  index: number;
  rows: number = 1;
  cols: number = 1;
  cellSize: number = CELL_SIZE;

  players: Map<string, Player> = new Map(); // <id, Player>
  projectiles: Set<Projectile> = new Set();
  projectileIndex: number = 0;

  matrix: MatrixCellType[][] = [["wall"]]; //Static cell based objects
  decoration: Map<string, string> = new Map(); // <(row,col), decoration>

  tracker: Map<string, Set<GridObject>> = new Map(); //non-static objects touching cells

  //TODO Move to tracker
  objects: Map<string, Stairs> = new Map();

  //TODO Move to matrix
  walls: Map<string, Wall> = new Map(); // <row,col, Wall>
  holes: Map<string, Hole> = new Map(); // <row,col, Wall>

  tiles: Map<number, Tile> = new Map(); // <index, Tile>
  pickups: Map<string, Pickup> = new Map(); // <row,col,Pickup>
  pickupTarget: number = 0;

  stairsUp: Stairs[] = [];
  stairsDown: Stairs[] = [];

  //Updaters
  globalTimers: { [key: number]: Spikes[] } = {}; // For instance: {60: Spike} will trigger the update method of the spike every 60 frames
  updatePlayers: (delta: number, counter: number) => void = updatePlayers;
  updateProjectiles: (delta: number) => void = updateProjectiles;
  updateTiles: (delta: number) => void = updateTiles;
  updatePickups: (delta: number) => void = updatePickups;
  updateTracker: (delta: number) => void = updateTracker;

  emit: () => void = emit;
  emitInitialData: (socket: Socket) => void = emitInitialData;

  addPlayer: (player: Player, pos?: { row: number; col: number }) => void =
    addPlayer;
  removePlayer: (player: Player) => void = removePlayer;
  emissionData: EmissionData = {
    players: [],
    tiles: [],
    projectiles: [],
    destroyedPots: [],
    spikes: [],
    pickups: [],
    tracker: [],
  };
  getNearestEmptyCell: (
    row: number,
    col: number,
    checked?: Set<string>
  ) => {
    row: number;
    col: number;
  } = getNearestEmptyCell;
  getAdjacentCells: (
    row: number,
    col: number
  ) => { [key: string]: { row: number; col: number } } = getAdjacentCells;
  getTouchedCells: (
    x: number,
    y: number,
    width?: number,
    height?: number
  ) => string[] = getTouchedCells;
  trackPosition: (object: GridObject, width?: number, height?: number) => void =
    trackPosition;
  addToTrackerCell: (
    object: Wall | Pickup | Hole | Stairs | Spikes | Pot
  ) => void = addToIndividualTrackerCell;
  removeFromTracker: (object: GridObject) => void = removeFromTracker;
  constructor(game: Game, index: number) {
    this.game = game;
    this.index = index;
  }

  update(delta: number, counter: number) {
    this.emissionData = {
      players: [],
      tiles: [],
      projectiles: [],
      destroyedPots: [],
      spikes: [],
      pickups: [],
      tracker: [],
    };
    this.updatePlayers(delta, counter);
    this.updatePickups(delta);
    this.updateTiles(delta);
    this.updateProjectiles(delta);

    //ANCHOR Global timers
    for (const [timer, objects] of Object.entries(this.globalTimers)) {
      if (objects.length === 0) {
        //If no objects found, delete timer
        delete this.globalTimers[Number(timer)];
        continue;
      }
      if (counter % Number(timer) === 0) {
        //Update all objects in timer
        for (const obj of objects) obj.update();
      }
    }

    this.updateTracker(delta);
  }

  populate() {
    const MIN_ITERATIONS = 32;
    const MAX_ITERATIONS = Math.max(350, MIN_ITERATIONS);

    //Floor zero starts at random
    let startRow = Math.max(randomNum(100), 2);
    let startCol = Math.max(randomNum(100), 2);

    //Rest start from staircase
    //TODO Staircase 2.0
    if (this.stairsUp.length > 0) {
      startRow = this.stairsUp[0].b.row;
      startCol = this.stairsUp[0].b.col;
    }
    this.matrix = Array.from({ length: startRow + 1 }).map(() =>
      Array.from({ length: startCol + 1 }).map(() => "wall")
    );

    this.rows = startRow;
    this.cols = startCol;

    new Carver(this, startRow, startCol, {
      iterations: randomNum(MAX_ITERATIONS),
      probability: { spikes: 24, water: Infinity },
    }).move();

    //TODO Fix
    // this.clampGrid();
    this.matrix.unshift(Array.from({ length: this.cols }).map(() => "wall"));
    this.matrix.push(Array.from({ length: this.cols }).map(() => "wall"));
    this.matrix.forEach((row) => row.unshift("wall"));
    this.matrix.forEach((row) => row.push("wall"));
    this.matrix.forEach((row, y) => {
      row.forEach((cell, x) => {
        switch (cell) {
          case "floor":
            if (
              (row[x - 1] && row[x - 1] === "wall") ||
              (row[x + 1] && row[x + 1] === "wall") ||
              (this.matrix[y - 1] && this.matrix[y - 1][x] === "wall") ||
              (this.matrix[y + 1] && this.matrix[y - 1][x] === "wall") ||
              oneIn(16)
            ) {
              if (oneIn(16)) new Pot(this, y, x);
            }

            break;
          case "spikes-on":
          case "spikes-off":
            {
              // let num = 60;
              // if (oneIn(3)) {
              //   num *= randomNum(4);
              // }
              new Spikes(this, y, x, {
                initialState: cell.endsWith("off") ? "off" : "on",
                globalTimer: 120,
                // globalTimer: num,
              });
            }
            break;
          case "wall":
            new Wall(this, y, x, WALL_SIZE);
            break;
          case "hole":
            new Hole(this, y, x);
            break;
        }
      });
    });

    this.rows = this.matrix.length;
    this.cols = this.matrix[0].length;

    console.log("Grid:", this.rows, "rows by", this.cols, "cols");

    if (this.stairsUp.length > 0) {
      this.matrix[this.stairsUp[0].b.row][this.stairsUp[0].b.col] = "stairs-up";
    }

    this.placeStairsToNextLevel();

    //Define walls

    for (const [_, wall] of this.walls) {
      const top = this.walls.get(`${wall.row - 1},${wall.col}`);
      const bottom = this.walls.get(`${wall.row + 1},${wall.col}`);
      const left = this.walls.get(`${wall.row},${wall.col - 1}`);
      const right = this.walls.get(`${wall.row},${wall.col + 1}`);
      if (top) wall.adjacentWalls.top = true;
      if (bottom) wall.adjacentWalls.bottom = true;
      if (left) wall.adjacentWalls.left = true;
      if (right) wall.adjacentWalls.right = true;
    }

    // let tileIndex = 0;
    // for (let row = 0; row < this.rows; row++) {
    //   for (let col = 0; col < this.cols; col++) {
    //     const trackerPos = this.tracker.get(`${row},${col}`);
    //     if (trackerPos && trackerPos.size > 0) continue;
    //     if (oneIn(50)) {
    //       new Tile(
    //         this,
    //         tileIndex,
    //         col * CELL_SIZE + CELL_SIZE / 2,
    //         row * CELL_SIZE + CELL_SIZE / 2
    //       );
    //       tileIndex++;
    //     }
    //   }
    // }

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
  getRandomEmptyCell(): { row: number; col: number } {
    const cells: { row: number; col: number }[] = [];
    this.matrix.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === "floor") {
          if (!this.walls.has(`${y},${x}`) && !this.tracker.has(`${y},${x}`))
            cells.push({ row: y, col: x });
        }
      });
    });
    return cells[randomNum(cells.length)];
  }
  placeStairsToNextLevel() {
    if (this.index === this.game.floors.length - 1) return;

    const { row, col } = this.getRandomEmptyCell();

    new Stairs(
      {
        floor: this,
        row,
        col,
        direction: "down",
      },
      {
        floor: this.game.floors[this.index + 1],
        row,
        col,
        direction: "up",
      }
    );
  }

  clampGrid() {
    let spliceAmount = 0;
    // check per row from top
    for (const row of this.matrix) {
      if (row.every((cell) => cell === "wall")) {
        spliceAmount++;
      } else {
        break;
      }
    }
    this.matrix.splice(0, spliceAmount);
    this.rows -= spliceAmount;

    for (const stairs of this.stairsUp) {
      stairs.b.row -= spliceAmount;
    }

    //check per row from bottom
    spliceAmount = 0;
    for (const row of [...this.matrix].reverse()) {
      if (row.every((cell) => cell === "wall")) {
        spliceAmount++;
      } else {
        break;
      }
    }
    this.matrix.splice(this.matrix.length - spliceAmount, spliceAmount);
    this.rows -= spliceAmount;

    //check per col from left and right
    const columnIsWall = (row: number, col: number): boolean => {
      if (this.matrix[row][col] === "floor") {
        return false;
      } else {
        if (row === this.rows - 1) {
          console.log("Column is wall");
          return true;
        }
        return columnIsWall(row + 1, col);
      }
    };

    spliceAmount = 0;
    for (let col = 0; col < this.cols; col++) {
      if (columnIsWall(0, col)) {
        this.matrix.forEach((row) => row.shift());
        spliceAmount++;
        console.log("Removing wall from left");
      } else {
        break;
      }
    }
    this.cols -= spliceAmount;
    for (const stairs of this.stairsUp) {
      stairs.b.col -= spliceAmount;
    }

    spliceAmount = 0;
    for (let col = this.cols - 1; col >= 0; col--) {
      if (columnIsWall(0, col)) {
        this.matrix.forEach((row) => row.pop());
        spliceAmount++;
        console.log("Removing wall from right");
      } else {
        break;
      }
    }
    this.cols -= spliceAmount;
  }

  getObjectInPlace(row: number, col: number) {
    const pos = `${row},${col}`;
    return this.walls.has(pos) || this.holes.has(pos);
  }

  calculateSurfaceNormal(point: {
    x: number;
    y: number;
  }): { direction: string; angle: number } | null {
    const row = Math.floor(point.y / CELL_SIZE);
    const col = Math.floor(point.x / CELL_SIZE);

    if (this.walls.has(`${row},${col}`)) {
      const isLeft = point.x % CELL_SIZE < CELL_SIZE / 2;
      const isTop = point.y % CELL_SIZE < CELL_SIZE / 2;
      const isRight = !isLeft;
      const isBottom = !isTop;

      if (isTop) return { direction: "top", angle: 90 };
      if (isBottom) return { direction: "bottom", angle: -90 };
      if (isLeft) return { direction: "left", angle: 180 };
      if (isRight) return { direction: "right", angle: 0 };
    }

    return null; // Return null if the point doesn't collide with a wall
  }

  isWithinBounds(row: number, col: number) {
    if (row < 0) return false;
    if (row > this.rows - 1) return false;
    if (col < 0) return false;
    if (col > this.cols - 1) return false;
    return true;
  }
  isWithinBorders(row: number, col: number) {
    if (row < 1) return false;
    if (row > this.rows - 2) return false;
    if (col < 1) return false;
    if (col > this.cols - 2) return false;
    return true;
  }
  pointDoesCollide(x: number, y: number) {
    const row = Math.floor(y / CELL_SIZE);
    const col = Math.floor(x / CELL_SIZE);

    if (this.walls.has(`${row},${col}`)) return true;
    return false;
  }
  collidesAt(
    x: number,
    y: number,
    width: number,
    height: number
  ): { row: number; col: number } | null {
    // Calculate the grid cell coordinates for the player's position
    // Calculate the half-width and half-height of the player's bounding box
    const halfWidth = width / 2;
    const halfHeight = height / 2;

    // Calculate the left, right, top, and bottom boundaries of the player's bounding box
    const leftBoundary = x - halfWidth;
    const rightBoundary = x + halfWidth;
    const topBoundary = y - halfHeight;
    const bottomBoundary = y + halfHeight;

    // Calculate the starting and ending grid cell coordinates for the player's bounding box
    const gridStartX = Math.floor(leftBoundary / CELL_SIZE);
    const gridEndX = Math.floor(rightBoundary / CELL_SIZE);
    const gridStartY = Math.floor(topBoundary / CELL_SIZE);
    const gridEndY = Math.floor(bottomBoundary / CELL_SIZE);

    // Check if any of the cells in the player's bounding box are occupied
    for (let gridX = gridStartX; gridX <= gridEndX; gridX++) {
      for (let gridY = gridStartY; gridY <= gridEndY; gridY++) {
        if (this.walls.has(`${gridY},${gridX}`)) {
          return { row: gridY, col: gridX };
        }
      }
    }

    // No collision detected
    return null;
  }
}
