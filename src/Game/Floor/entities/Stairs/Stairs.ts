import Floor from "../../Floor";
import { Player } from "../../../entities/Player/Player";

export class Stairs {
  floor: Floor;
  direction: "up" | "down";
  row: number;
  col: number;
  target!: Stairs;
  constructor(
    floor: Floor,
    direction: "up" | "down",
    row: number,
    col: number
  ) {
    this.floor = floor;
    this.direction = direction;
    this.row = row;
    this.col = col;

    this.floor.spriteGridMatrix.set(
      `${this.row},${this.col}`,
      `stairs-${direction}`
    );

    this.floor.addToTrackerCell(this, row, col);
  }
  link(target: Stairs) {
    this.target = target;
  }
  enter(player: Player) {
    player.floor.removePlayer(player);
    this.target.floor.addPlayer(player, {
      row: this.target.row,
      col: this.target.col,
    });
  }
}
