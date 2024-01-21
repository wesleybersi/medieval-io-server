// import { CELL_SIZE } from "../../src/constants";
// import { deflectAngle } from "../../src/utilities/angle";
// import { getAngleOffset } from "../../src/utilities/offset";
// import Game from "../../src/entities/Game/Game";
// import { Player } from "../../src/entities/Game/Player/Player";

// const MAX_LASERS = 10;

// export class Laser {
//   game: Game;
//   id: string;
//   castCount = 0;
//   player: Player;
//   type = "Laser";
//   start: { x: number; y: number };
//   end: { x: number; y: number };
//   deflection: Laser | null = null;
//   constructor(
//     game: Game,
//     player: Player,
//     start: { x: number; y: number },
//     castCount?: number
//   ) {
//     this.game = game;
//     this.start = start;
//     this.end = { x: start.x, y: start.y };
//     this.player = player;
//     this.id = player.id;
//     if (castCount) {
//       this.castCount = castCount;
//       this.id += castCount;
//     }
//     game.lasers.add(this);
//   }
//   update(x: number, y: number, angle: number) {
//     this.start.x = x;
//     this.start.y = y;
//     const radians = angle * (Math.PI / 180);
//     const dx = Math.cos(radians);
//     const dy = Math.sin(radians);

//     let xIncrement, yIncrement;
//     if (Math.abs(dx) > Math.abs(dy)) {
//       xIncrement = dx > 0 ? 1 : -1;
//       yIncrement = dx === 0 ? 0 : dy / Math.abs(dx);
//     } else {
//       xIncrement = dy === 0 ? 0 : dx / Math.abs(dy);
//       yIncrement = dy > 0 ? 1 : -1;
//     }

//     let xIntersect = Math.round(x);
//     let yIntersect = Math.round(y);

//     while (
//       xIntersect >= 0 &&
//       xIntersect < this.game.grid.width &&
//       yIntersect >= 0 &&
//       yIntersect < this.game.grid.height
//     ) {
//       const surfaceNormal = this.game.grid.calculateSurfaceNormal({
//         x: xIntersect,
//         y: yIntersect,
//       });
//       if (surfaceNormal !== null) {
//         this.end.x = xIntersect;
//         this.end.y = yIntersect;
//         if (this.castCount >= MAX_LASERS) return;

//         // let deflectedAngle = deflectAngle(angle, surfaceNormal.angle);
//         // deflectedAngle = deflectedAngle % 360;
//         // if (deflectedAngle < 0) {
//         //   deflectedAngle += 360;
//         // }

//         if (!this.deflection) {
//           this.deflection = new Laser(
//             this.game,
//             this.player,
//             this.end,
//             this.castCount + 1
//           );
//         } else {
//           let newAngle = 0;
//           if (angle <= 180) {
//             newAngle = angle + 180;
//           } else {
//             newAngle = angle - 180;
//           }

//           // if (Math.abs(dx) > Math.abs(dy)) {
//           //   newAngle = 180 - newAngle;
//           // } else {
//           //   newAngle = 360 - newAngle;
//           // }
//           console.log(newAngle);

//           const { x: deflectedX, y: deflectedY } = getAngleOffset(
//             this.end.x,
//             this.end.y,
//             // Math.round(deflectedAngle),
//             newAngle,
//             16
//           );
//           // console.log(
//           //   "x",
//           //   Math.round(deflectedX),
//           //   "y",
//           //   Math.round(deflectedY),
//           //   "angle",
//           //   Math.round(deflectedAngle)
//           // );

//           this.deflection.update(
//             Math.round(deflectedX),
//             Math.round(deflectedY),
//             -angle % 360
//           );
//         }
//         return; // Laser hit a wall, stop tracing
//       }

//       xIntersect += xIncrement;
//       yIntersect += yIncrement;
//     }

//     // Laser reached the grid boundary without hitting a wall
//     this.end.x = xIntersect;
//     this.end.y = yIntersect;
//   }

//   remove() {
//     this.deflection?.remove();
//     this.game.lasers.delete(this);
//   }
// }
