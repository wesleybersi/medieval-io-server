import { Direction } from "../../../../types";
import { getRandomDirection, oneIn, randomNum } from "../../../../utilities";
import { Hole } from "../../../entities/Hole/Hole";
import Floor, { MatrixCellType } from "../../Floor";
import { carve } from "./methods/carve";
import { move } from "./methods/move";

export interface CarveConfig {
  iterations: number;
  probability: { spikes: number; water: number };
}

export class Carver {
  floor: Floor;
  row: number;
  col: number;
  iterationsLeft: number;
  probability: { spikes: number; water: number };
  direction: Direction;

  //Methods
  move: () => void = move;
  carve: (target: MatrixCellType) => void = carve;

  //Constants
  minAreaWidth = 2;
  minAreaHeight = 2;
  maxAreaWidth = 10;
  maxAreaHeight = 10;
  chanceOfBranching = 64;
  chanceOfWater = 16;

  constructor(floor: Floor, row: number, col: number, config: CarveConfig) {
    this.floor = floor;
    this.iterationsLeft = config.iterations;
    this.probability = config.probability;
    this.row = row;
    this.col = col;
    this.direction = getRandomDirection();
  }
}
