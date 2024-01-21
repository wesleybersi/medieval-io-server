// import { clamp, rectanglesAreColliding } from "../../../../../utilities";
// import Game from "../../../Game";
// import { Tile } from "../../../Grid/Tile/Tile";
// import { Player } from "../../../Player/Player";
// import { Projectile } from "../Projectile";
// import { ProjectileConfig } from "../types";

// export class Arrow extends Projectile {
//   constructor(game: Game, config: ProjectileConfig) {
//     super(game, "Arrow", config);
//   }
//   update(delta: number) {
//     if (!this.isActive) return;
//     const delta_x = Math.cos(this.angle * (Math.PI / 180));
//     const delta_y = Math.sin(this.angle * (Math.PI / 180));
//     let x = this.x + delta_x * this.velocity * delta;
//     let y = this.y + delta_y * this.velocity * delta;

//     if (!this.isHold && this.game.grid.pointDoesCollide(x, y)) {
//       //   this.didCollide();
//       if (this.bounce) {
//         this.angle = -this.angle;
//         this.x = this.x + Math.abs(this.x - x);
//         this.y = this.y + Math.abs(this.y - y);
//       }

//       return;
//     }
//     for (const pos of this.touchedCells) {
//       if (this.isHold) continue;
//       const cell = this.game.grid.tracker.get(pos);
//       if (cell) {
//         for (const object of cell) {
//           if (object instanceof Player || object instanceof Tile) {
//             const { x, y, width, height } = object;
//             if (
//               rectanglesAreColliding(
//                 {
//                   x: x - width / 2,
//                   y: y - height / 2,
//                   width,
//                   height,
//                 },
//                 { x: this.x - 6, y: this.y - 6, width: 12, height: 12 }
//               )
//             ) {
//               object.hit(this.damage);
//               if (object instanceof Player && object.health <= 0) {
//                 //Kill++
//               }
//               if (object instanceof Tile && object.hp <= 0) {
//                 this.delayedImpact = 0;
//               }
//               //   this.didCollide();
//               this.isActive = false;
//               //Impact
//               return;
//             }
//           }
//         }
//       }
//     }

//     this.velocity = clamp(
//       this.velocity + this.acceleration,
//       this.velocity,
//       this.maxSpeed
//     );
//     this.velocity -= this.decceleration;
//     if (!this.isHold && this.velocity <= 0) {
//       this.velocity = 0;
//       //   this.remove();
//     }

//     if (this.x !== x || this.y !== y) this.game.grid.trackPosition(this);

//     this.x = x;
//     this.y = y;
//   }
// }
