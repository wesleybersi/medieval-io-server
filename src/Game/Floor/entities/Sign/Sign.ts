import Floor from "../../Floor";
import { Player } from "../../../entities/Player/Player";
import { Collider } from "../../../entities/Collider/Collider";
import { CELL_SIZE } from "../../../../constants";

export class Sign extends Collider {
  floor: Floor;
  row: number;
  col: number;
  text: string[];
  constructor(floor: Floor, row: number, col: number, text: string[]) {
    super(
      col * CELL_SIZE + CELL_SIZE / 2,
      row * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE,
      CELL_SIZE,
      false
    );
    this.floor = floor;
    this.text = text;
    this.row = row;
    this.col = col;
    this.floor = floor;
    this.floor.tracker.addToCell(this, row, col);
  }
  remove() {
    this.floor.tracker.remove(this);
  }
  read(player: Player) {
    player.dialog = { name: "", text: this.text };
    player.state = "in-dialog";
  }
}
