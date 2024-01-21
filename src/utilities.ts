import { Cardinal, Direction } from "./types";

export function oneIn(chance: number): boolean {
  if (!Math.floor(Math.random() * chance)) return true;
  return false;
}

export function randomNum(num: number): number {
  return Math.floor(Math.random() * num);
}

export function getOppositeSide(cardinal: Cardinal) {
  const oppositeMap: { [key: string]: Cardinal } = {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left",
  };
  return oppositeMap[cardinal];
}

export function getOppositeDirection(direction: Direction) {
  const oppositeMap: { [key: string]: Direction } = {
    up: "down",
    down: "up",
    left: "right",
    right: "left",
  };
  return oppositeMap[direction];
}

export function cardinalToDirection(cardinal: Cardinal): Direction {
  const oppositeMap: { [key: string]: Direction } = {
    top: "up",
    bottom: "down",
    left: "left",
    right: "right",
  };
  return oppositeMap[cardinal];
}

export function directionToCardinal(direction: Direction): Cardinal {
  const oppositeMap: { [key: string]: Cardinal } = {
    up: "top",
    down: "bottom",
    left: "left",
    right: "right",
  };
  return oppositeMap[direction];
}

export function randomPosition(
  rowCount: number,
  colCount: number,
  cellSize: number
) {
  const randX = Math.floor(Math.random() * colCount) * cellSize + cellSize / 2;
  const randY = Math.floor(Math.random() * rowCount) * cellSize + cellSize / 2;
  return { x: randX, y: randY };
}

export function directionToAdjacent(
  direction: Direction,
  row: number,
  col: number
) {
  let newRow = row;
  let newCol = col;

  if (direction === "up") {
    newRow--;
  } else if (direction === "down") {
    newRow++;
  } else if (direction === "left") {
    newCol--;
  } else if (direction === "right") {
    newCol++;
  }

  return { row: newRow, col: newCol };
}

export function cardinalToAdjacent(
  cardinal: Cardinal,
  row: number,
  col: number
) {
  let newRow = row;
  let newCol = col;

  if (cardinal === "top") {
    newRow--;
  } else if (cardinal === "bottom") {
    newRow++;
  } else if (cardinal === "left") {
    newCol--;
  } else if (cardinal === "right") {
    newCol++;
  }

  return { row: newRow, col: newCol };
}

export function spliceString(
  value: string,
  index: number,
  count: number,
  add: string
) {
  // We cannot pass negative indexes directly to the 2nd slicing operation.
  if (index < 0) {
    index = value.length + index;
    if (index < 0) {
      index = 0;
    }
  }

  return value.slice(0, index) + (add || "") + value.slice(index + count);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function rectanglesAreColliding(
  posA: {
    x: number;
    y: number;
    width: number;
    height: number;
  },
  posB: {
    x: number;
    y: number;
    width: number;
    height: number;
  }
) {
  if (posA.y + posA.height < posB.y) return false;
  if (posA.y > posB.y + posB.height) return false;
  if (posA.x + posA.width < posB.x) return false;
  if (posA.x > posB.x + posB.width) return false;
  return true;
}

export function getRandomDirection(): Direction {
  const directions: Direction[] = ["up", "left", "right", "down"];
  return directions[randomNum(directions.length)];
}

export function randomLowerNumber(num: number): number {
  // Adjust the power factor based on your skew preference
  const skewFactor = 1;

  // Generate a random number between 0 and 1
  const randomValue = Math.random();

  // Apply the skewing using a power function
  const skewedResult = Math.floor(Math.pow(randomValue, skewFactor) * num);

  return skewedResult;
}

export function randomHigherNumber(range: number): number {
  const min = 0;
  const max = range;
  const biasPoint = max;
  const biasStrength = 0.2;

  const biasFactor = Math.exp(
    -Math.pow((biasPoint - min) / (max - min), 2) /
      (2 * Math.pow(biasStrength, 2))
  );
  const randomNumber = min + Math.random() * (max - min);

  return randomNumber * (1 - biasFactor) + biasPoint * biasFactor;
}
