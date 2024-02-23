import Floor from "../../Floor";
import { Player } from "../../../entities/Player/Player";
import { Collider } from "../../../entities/Collider/Collider";
import { CELL_SIZE } from "../../../../constants";

export class Stairs extends Collider {
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
    super(
      col * CELL_SIZE + CELL_SIZE / 2,
      row * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE,
      CELL_SIZE,
      false
    );
    this.floor = floor;
    this.direction = direction;
    this.row = row;
    this.col = col;
    this.floor.spriteGridMatrix.set(
      `${this.row},${this.col}`,
      `stairs-${direction}`
    );

    this.floor.tracker.addToCell(this, row, col);
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
