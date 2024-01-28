import Floor from "../../Floor";
import { Player } from "../../../entities/Player/Player";

export class Sign {
  floor: Floor;
  row: number;
  col: number;
  text: string[];
  constructor(floor: Floor, row: number, col: number, text: string[]) {
    this.floor = floor;
    this.text = text;
    this.row = row;
    this.col = col;
    this.floor = floor;
    this.floor.spriteGridMatrix.set(`${row},${col}`, "sign-rectangle");
    this.floor.addToTrackerCell(this, row, col);
  }
  remove() {
    this.floor.removeFromTracker(this);
  }
  read(player: Player) {
    player.dialog = { name: "", text: this.text };
    player.state = "in-dialog";
  }
}
