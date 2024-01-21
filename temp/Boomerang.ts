// import { clamp } from "../../../../utilities";
// import Game from "../../Game";

// export class Boomerang {
//   game: Game;
//   id: number;
//   x: number;
//   y: number;
//   angle: number;
//   speed: number;
//   decceleration: number = 40;
//   didReturn = false;
//   constructor(game: Game, x: number, y: number, angle: number) {
//     this.game = game;
//     this.x = x;
//     this.y = y;
//     this.speed = 1500;
//     this.angle = angle;
//     this.id = game.projectileIndex + 1;
//     game.projectileIndex++;
//     game.projectiles.add(this);
//   }
//   update(delta: number) {
//     const delta_x = Math.cos(this.angle * (Math.PI / 180));
//     const delta_y = Math.sin(this.angle * (Math.PI / 180));
//     const x = this.x + delta_x * this.speed * delta;
//     const y = this.y + delta_y * this.speed * delta;

//     if (this.game.grid.pointDoesCollide(x, y)) {
//       this.didCollide();
//       return;
//     }
//     for (const [, player] of this.game.players) {
//       if (player.doesCollide(x, y)) {
//         player.hit(10);
//         this.didCollide();
//       }
//     }
//     this.speed = clamp(this.speed - this.decceleration, -1500, 1500);

//     this.x = x;
//     this.y = y;

//     console.log(this.x, this.y);
//   }
//   didCollide() {
//     this.game.projectiles.delete(this);
//     console.log("KABOOM");
//   }
// }
