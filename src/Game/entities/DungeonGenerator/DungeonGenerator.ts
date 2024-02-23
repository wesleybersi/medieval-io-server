import { Direction } from "../../../types";
import {
  getRandomDirection,
  getRandomInt,
  oneIn,
  randomNum,
} from "../../../utilities";
import Floor from "../../Floor/Floor";
import { MatrixCellType } from "../../Floor/types";
import { addBorderWalls } from "./methods/add-border-walls";
import { addTorches } from "./methods/add-torches";
import { clampArea } from "./methods/clamp";
import { clearArea } from "./methods/clear-area";
import { createRoom } from "./methods/create-room";
import { RoomConfig, createRooms } from "./methods/create-rooms";
import { detectSurroundedWalls } from "./methods/detect-surrounded";
import { floorDeterioration } from "./methods/floor-deterioration";
import { surroundFloorsWithWalls } from "./methods/surround-floors";
import { addFloorPatches } from "./methods/floor-patches";
import { addFloorSpikes } from "./methods/floor-spikes";
import { defineRooms } from "./methods/define-rooms";
import { placePots } from "./methods/place-pots";
import { addHoles } from "./methods/add-holes";
import { addShooters } from "./methods/add-shooters";
import { placeSigns } from "./methods/place-signs";
import { generateCorridors } from "./methods/generate-corridors";

export interface CarveConfig {
  iterations: number;
  probability: { branching: number; spikes: number; water: number };
}
export class DungeonGenerator {
  floor: Floor;
  row: number;
  col: number;
  iterationsLeft: number;
  probability: { branching: number; spikes: number; water: number };
  direction: Direction;

  //Methods
  generateCorridorrs: () => void = generateCorridors;
  clearArea: (type: MatrixCellType) => void = clearArea;
  detectSurroundedWalls: () => void = detectSurroundedWalls;
  addBorderWalls: (amount: number) => void = addBorderWalls;
  clampArea: () => void = clampArea;
  surroundFloorsWithWalls: () => void = surroundFloorsWithWalls;
  addTorches: () => void = addTorches;
  floorDeterioration: () => void = floorDeterioration;
  addFloorPatches: () => void = addFloorPatches;
  addFloorSpikes: () => void = addFloorSpikes;
  placePots: () => void = placePots;
  placeSigns: () => void = placeSigns;
  addHoles: () => void = addHoles;
  addShooters: () => void = addShooters;

  createRooms: (probability: RoomConfig) => void = createRooms;
  createRoom: (
    from: MatrixCellType,
    to: MatrixCellType,
    direction: Direction,
    row: number,
    col: number
  ) => void = createRoom;
  defineRooms: () => void = defineRooms;

  //Constants
  minAreaWidth = 2;
  minAreaHeight = 2;
  maxAreaWidth = 20;
  maxAreaHeight = 20;

  chanceOfWater = 16;

  constructor(floor: Floor, row: number, col: number, config: CarveConfig) {
    this.floor = floor;
    this.iterationsLeft = config.iterations;
    this.probability = config.probability;
    this.row = row;
    this.col = col;
    this.direction = getRandomDirection();

    //Procedure
    //Iterates and creates random areas at chance
    this.generateCorridorrs();
    //Detects all walls that are completely surrounded by walls
    this.detectSurroundedWalls();
    //Centers the area
    this.clampArea();
    //Adds walls around the area
    this.addBorderWalls(25);

    //
    this.detectSurroundedWalls();

    //
    this.addHoles();
    //Creates rooms adjacent to existing walls

    // this.createRooms({ probability: Math.max(randomNum(80), 24) });
    //
    // this.detectSurroundedWalls();

    // this.createRooms({ probability: Math.max(randomNum(80), 24) });
    //
    this.detectSurroundedWalls();

    // this.addTorches();

    //Randomze floor tiles
    this.floorDeterioration();
    //
    // this.defineRooms();
    //Adds patches of dirt to the floor tiles
    this.addFloorPatches(); //TODO Carpets
    //Adds patches of spike strips to the floor tiles
    // this.addFloorSpikes();
    //

    // this.placeSigns();

    //

    // this.addShooters();
    //
    this.detectSurroundedWalls();

    this.floor.objectMatrix.forEach((row, y) =>
      row.forEach((cell, x) => (this.floor.objectMatrix[y][x] = "floor-0"))
    );
    this.addHoles();

    this.floor.objectMatrix.forEach((row, y) =>
      row.forEach((cell, x) => {
        if (cell.includes("floor")) {
          const left = { y, x: x - 1 };
          const right = { y, x: x + 1 };
          const top = { y: y - 1, x };
          const bottom = { y: y + 1, x };

          const positions = [left, right, top, bottom];

          let isAdjacentWater = false;
          for (const position of positions) {
            if (!this.floor.isValidCell(position.y, position.x)) continue;
            if (this.floor.objectMatrix[position.y][position.x] === "hole") {
              this.floor.objectMatrix[y][x] = "floor-6";
              isAdjacentWater = true;
              break;
            }
          }

          if (isAdjacentWater) {
            for (const position of positions) {
              if (!this.floor.isValidCell(position.y, position.x)) continue;
              if (
                this.floor.objectMatrix[position.y][position.x].includes(
                  "floor"
                )
              ) {
                this.floor.objectMatrix[position.y][position.x] = "floor-6";
              }
            }
          }
        }
      })
    );

    //
  }
}
