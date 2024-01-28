import Floor, { MatrixCellType } from "../../Floor";
import { Player } from "../../../entities/Player/Player";

export type SpikeConfig = {
  initialState: "on" | "off";
  globalTimer?: number;

  // button?: Button
};

export class Spikes {
  state: "on" | "off";
  // globalTimer: number | null;
  floor: Floor;
  row: number;
  col: number;

  interval: number = 3;
  constructor(floor: Floor, row: number, col: number, config: SpikeConfig) {
    this.floor = floor;
    this.row = row;
    this.col = col;
    this.state = config.initialState;
    this.floor.addToTrackerCell(this, row, col);
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
