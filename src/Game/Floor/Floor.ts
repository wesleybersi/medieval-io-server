import { Spikes } from "./entities/Spikes/Spikes";
import { getRandomInt, randomNum } from "../../utilities";
import Game from "../Game";
import { getNearestEmptyCell } from "./methods/get-nearest-empty-cell";
import { getAdjacentCells } from "./methods/get-adjacent-cells";
import { CELL_SIZE } from "../../constants";
import { Player } from "../entities/Player/Player";
import { Projectile } from "./entities/Projectile/Projectile";
import { Wall } from "./entities/Wall/Wall";
import { Pickup } from "./entities/Pickup/Pickup";
import { Hole } from "./entities/Hole/Hole";
import {
  EmissionData,
  Emission as Emission,
  MatrixCellType,
  GridSpriteType,
} from "./types";
import { updatePlayers } from "./update/players";

import { emit } from "./emit/emit-to-player";
import { emitInitialData } from "./emit/emit-initial-data";
import { Socket } from "socket.io";
import { removePlayer } from "./methods/remove-player";
import { addPlayer } from "./methods/add-player";
import { ItemDrop, ItemType } from "./entities/ItemDrop/ItemDrop";
import { PopulateConfig, populate } from "./populate/populate";
import { update } from "./update/update";
import { placeStairsToNextLevel } from "./populate/methods/place-first-stairs";
import { placeStairsAtOffset } from "./populate/methods/place-stairs-at-offset";
import { Room } from "./entities/Room/Room";
import { Shooter } from "./entities/Shooter/Shooter";
import { Tracker } from "./tracker/Tracker";

export default class Floor {
  game: Game;
  index: number;
  rows: number = 1;
  cols: number = 1;
  cellSize: number = CELL_SIZE;

  potsToRespawn = 0;

  players: Map<string, Player> = new Map(); // <id, Player>

  objectMatrix: MatrixCellType[][] = [["wall"]]; //Mostly walls and floor tiles
  spriteGridMatrix: Map<string, GridSpriteType> = new Map(); // <row,col, Sprite>
  lastEmissions: Map<string, Emission> = new Map(); // <id, Sprite Emission>

  tracker = new Tracker(this);

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

  isEmptyCell(row: number, col: number) {
    if (!this.isValidCell(row, col)) return false;
    if (!this.objectMatrix[row][col].includes("floor")) return false;
    if (this.spriteGridMatrix.has(`${row},${col}`)) return false;

    return true;
  }

  getRandomEmptyCell(): { row: number; col: number } {
    const cells: { row: number; col: number }[] = [];
    this.objectMatrix.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell.includes("floor")) {
          if (this.isEmptyCell(y, x)) {
            cells.push({ row: y, col: x });
          }
        }
      });
    });
    return cells[getRandomInt(cells.length)];
  }

  //TODO Reevaluate
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
