// import Floor, { MatrixCellType } from "../../Floor/Floor";
// import { Player } from "../Player/Player";

// export class Button {
//   type: "trigger" | "hold";
//   floor: Floor;
//   row: number;
//   col: number;
//   constructor(floor: Floor, row: number, col: number) {
//     this.floor = floor;
//     this.row = row;
//     this.col = col;
//     this.floor.addToTrackerCell(this);

//     if (config.globalTimer) {
//       if (!this.floor.globalTimers[config.globalTimer]) {
//         this.floor.globalTimers[config.globalTimer] = [];
//       }
//       this.floor.globalTimers[config.globalTimer].push(this);
//     }
//   }
//   update() {
//     if (this.state === "on") {
//       this.state = "off";
//     } else if (this.state === "off") {
//       this.state = "on";
//     }
//     this.floor.emissionData.spikes.push({
//       row: this.row,
//       col: this.col,
//       state: this.state,
//     });
//   }
//   remove() {
//     //TODO - Remove from global timers
//   }
// }
