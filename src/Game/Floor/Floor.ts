import { Spikes } from "./entities/Spikes/Spikes";
import { oneIn, randomLowerNumber, randomNum } from "../../utilities";
import Game from "../Game";
import { getNearestEmptyCell } from "./methods/get-nearest-empty-cell";
import { getAdjacentCells } from "./methods/get-adjacent-cells";
import { CELL_SIZE } from "../../constants";
import { Player } from "../entities/Player/Player";
import { getTouchedCells } from "./methods/get-touched-cells";
import { trackPosition } from "./methods/track-position";
import { Projectile } from "../entities/Projectile/Projectile";
import { removeFromTracker } from "./methods/remove-from-tracker";
import { Wall } from "./entities/Wall/Wall";
import { Pickup, WeaponPickup } from "./entities/Pickup/Pickup";
import { addToIndividualTrackerCell } from "./methods/add-to-tracker-cell";
import { Hole } from "./entities/Hole/Hole";
import { EmissionData, Emission as Emission } from "./types";
import { updatePlayers } from "./update/players";

import { updateTracker } from "./update/tracker";
import { emit } from "./emit/emit-to-player";
import { emitInitialData } from "./emit/emit-initial-data";
import { Socket } from "socket.io";
import { removePlayer } from "./methods/remove-player";
import { addPlayer } from "./methods/add-player";

import { Pot } from "./entities/Pot/Pot";
import { Chest } from "./entities/Chest/Chest";
import { Door } from "./entities/Door/Door";
import { ItemDrop, ItemType } from "./entities/ItemDrop/ItemDrop";
import { PopulateConfig, populate } from "./populate/populate";
import { update } from "./update/update";
import { placeStairsToNextLevel } from "./populate/methods/place-first-stairs";
import { Stairs } from "./entities/Stairs/Stairs";
import { placeStairsAtOffset } from "./populate/methods/place-stairs-at-offset";
import { Room } from "./entities/Room/Room";
import { ProjectileType } from "../entities/Projectile/types";
import { Shooter } from "./entities/Shooter/Shooter";
import { Sign } from "./entities/Sign/Sign";

export type GridObject =
  | Player
  | Projectile
  | Wall
  | Pickup
  | Hole
  | Stairs
  | Spikes
  | Pot
  | Chest
  | Door
  | ItemDrop
  | Shooter
  | Sign;

export type MatrixCellType = //TODO Only grid cell objects

    | "floor"
    | "floor-0"
    | "floor-1"
    | "floor-2"
    | "floor-3"
    | "floor-4"
    | "floor-5"
    | "floor-6"
    | "floor-7"
    | "floor-8"
    | "floor-9"
    | "floor-10"
    | "floor-11"
    | "floor-12"
    | "floor-13"
    | "floor-14"
    | "floor-15"
    | "floor-16"
    | "floor-17"
    | "floor-18"
    | "floor-19"
    | "shooter-up"
    | "shooter-down"
    | "shooter-left"
    | "shooter-right"
    | "wall"
    | "wall-torch"
    | "wall-damaged"
    | "wall-cracks"
    | "surrounded-wall"
    | "spikes"
    | "spikes-on"
    | "spikes-off"
    | "water"
    | "hole"
    | ItemType;

export type SpriteGridType =
  | "pot"
  | "horz-door-open-up"
  | "horz-door-open-down"
  | "horz-door-closed"
  | "horz-door-locked"
  | "vert-door-open-left"
  | "vert-door-open-right"
  | "vert-door-closed"
  | "vert-door-locked"
  | "stairs-up"
  | "stairs-down"
  | "chest-silver-open"
  | "chest-silver-closed"
  | "chest-gold-open"
  | "chest-gold-closed"
  | "sign-rectangle";

export type SpriteIDType = "pot" | ProjectileType;

export default class Floor {
  game: Game;
  index: number;
  rows: number = 1;
  cols: number = 1;
  cellSize: number = CELL_SIZE;

  potsToRespawn = 0;

  players: Map<string, Player> = new Map(); // <id, Player>

  objectMatrix: MatrixCellType[][] = [["wall"]]; //Mostly walls and floor tiles
  spriteGridMatrix: Map<string, SpriteGridType> = new Map(); // <row,col, Sprite>
  lastEmissions: Map<string, Emission> = new Map(); // <id, Sprite Emission>

  decoration: {
    torches: { row: number; col: number }[];
  } = {
    torches: [],
  };

  tracker: Map<string, Set<GridObject>> = new Map(); //non-static objects touching cells

  //TODO Move to matrix
  walls: Map<string, Wall> = new Map(); // <row,col, Wall>
  holes: Map<string, Hole> = new Map(); // <row,col, Wall>

  pickups: Map<string, Pickup> = new Map(); // <row,col,Pickup>
  pickupTarget: number = 0;

  rooms = new Set<Room>();

  downPos: { row: number; col: number } = { row: 0, col: 0 };
  nextFloorOffset: { rows: number; cols: number } = { rows: 0, cols: 0 };

  //Populate
  populate: (config: PopulateConfig) => void = populate;
  placeStairsToNextLevel: () => void = placeStairsToNextLevel;
  placeStairsAtOffset: () => void = placeStairsAtOffset;

  //Updaters
  globalTimedUpdaters: {
    [key: number]: Set<Spikes>;
  } = {
    1: new Set(),
    2: new Set(),
    3: new Set(),
    4: new Set(),
    5: new Set(),
    6: new Set(),
    7: new Set(),
    8: new Set(),
  };

  updaters: Set<ItemDrop | Spikes | Projectile | Shooter> = new Set(); //Add object to this set and the object's update method gets called each frame
  emissions: Emission[] = []; //Add an emission to this array and the emission will be send to the client

  updatePlayers: (delta: number, counter: number) => void = updatePlayers;
  updateTracker: (delta: number) => void = updateTracker;
  update: (delta: number, counter: number) => void = update;

  emit: () => void = emit;
  emitInitialData: (socket: Socket) => void = emitInitialData;

  addPlayer: (player: Player, pos?: { row: number; col: number }) => void =
    addPlayer;
  removePlayer: (player: Player) => void = removePlayer;
  emissionData: EmissionData = {
    players: [],
    updaters: [],
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
    object:
      | Wall
      | Pickup
      | Hole
      | Stairs
      | Spikes
      | Chest
      | Door
      | ItemDrop
      | Shooter
      | Sign,
    row: number,
    col: number
  ) => void = addToIndividualTrackerCell;
  removeFromTracker: (object: GridObject) => void = removeFromTracker;
  constructor(game: Game, index: number) {
    this.game = game;
    this.index = index;
  }
  isValidCell(row: number, col: number): boolean {
    return (
      row >= 0 &&
      row < this.objectMatrix.length &&
      col >= 0 &&
      col < this.objectMatrix[0].length
    );
  }

  getRandomEmptyCell(): { row: number; col: number } {
    const cells: { row: number; col: number }[] = [];
    this.objectMatrix.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell.includes("floor")) {
          // if (!this.walls.has(`${y},${x}`) && !this.tracker.has(`${y},${x}`))
          cells.push({ row: y, col: x });
        }
      });
    });
    return cells[randomNum(cells.length)];
  }

  getObjectInPlace(row: number, col: number) {
    const pos = `${row},${col}`;
    return this.walls.has(pos) || this.holes.has(pos);
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
