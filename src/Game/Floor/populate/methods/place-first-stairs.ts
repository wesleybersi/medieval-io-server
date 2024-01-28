import { randomNum } from "../../../../utilities";
import { Chest } from "../../entities/Chest/Chest";
import { Stairs } from "../../entities/Stairs/Stairs";
import Floor from "../../Floor";

export function placeStairsToNextLevel(this: Floor) {
  //If current floor is last floor, don't place stairs
  if (this.index === this.game.floors.length - 1) return;

  const nextFloor = this.game.floors[this.index + 1];

  // const roomA = Array.from(this.rooms)[randomNum(this.rooms.size)];
  // const trackerCellA = this.tracker.get(
  //   `${roomA.center.row},${roomA.center.col}`
  // );
  // if (trackerCellA) {
  //   for (const object of trackerCellA) {
  //     if (object instanceof Chest) {
  //       object.remove();
  //     }
  //   }
  // }

  // const roomB = Array.from(nextFloor.rooms)[randomNum(nextFloor.rooms.size)];
  // const trackerCellB = nextFloor.tracker.get(
  //   `${roomB.center.row},${roomB.center.col}`
  // );
  // if (trackerCellB) {
  //   for (const object of trackerCellB) {
  //     if (object instanceof Chest) {
  //       object.remove();
  //     }
  //   }
  // }

  const down = this.getRandomEmptyCell();
  const up = nextFloor.getRandomEmptyCell();

  const stairsDown = new Stairs(this, "down", down.row, down.col);
  const stairsUp = new Stairs(nextFloor, "up", up.row, up.col);

  stairsDown.link(stairsUp);
  stairsUp.link(stairsDown);

  console.log("Row offset:", down.row, up.row, down.row - up.row);
  console.log("Col offset:", down.col, up.col, down.col - up.col);

  this.nextFloorOffset = { rows: down.row - up.row, cols: down.col - up.col };

  this.downPos = { row: down.row, col: down.col };
}
