import Floor from "../../Floor";
import { MatrixCellType } from "../../types";
import { Player } from "../../../entities/Player/Player";
import { Collider } from "../../../entities/Collider/Collider";
import { CELL_SIZE } from "../../../../constants";

export type SpikeConfig = {
  initialState: "on" | "off";
};

export class Spikes extends Collider {
  state: "on" | "off";
  floor: Floor;
  row: number;
  col: number;
  interval: number = 3;
  constructor(floor: Floor, row: number, col: number, config: SpikeConfig) {
    super(
      col * CELL_SIZE + CELL_SIZE / 2,
      row * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE,
      CELL_SIZE,
      false
    );
    this.floor = floor;
    this.row = row;
    this.col = col;
    this.state = config.initialState;
    this.floor.tracker.addToCell(this, row, col);
    this.floor.globalTimedUpdaters[this.interval].add(this);
  }
  update() {
    if (this.state === "on") {
      this.state = "off";
      this.floor.objectMatrix[this.row][this.col] = "spikes-off";
    } else if (this.state === "off") {
      this.state = "on";
      this.floor.objectMatrix[this.row][this.col] = "spikes-on";
    }
    this.floor.emissionData.updaters.push({
      type: "spikes",
      row: this.row,
      col: this.col,
      isOn: this.state === "on",
    });
    this.floor.updaters.delete(this);
  }
}
