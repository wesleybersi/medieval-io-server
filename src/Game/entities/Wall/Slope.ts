// import { CELL_SIZE } from "../../../constants";
// import Floor from "../../Floor/Floor";

// export class Slope {
//   grid: Floor;
//   slopeType: "br" | "bl" | "tr" | "tl";
//   row: number;
//   col: number;
//   start: { x: number; y: number };
//   end: { x: number; y: number };
//   constructor(
//     grid: Floor,
//     slopeType: "br" | "bl" | "tr" | "tl",
//     row: number,
//     col: number
//   ) {
//     this.grid = grid;
//     this.slopeType = slopeType;
//     this.row = row;
//     this.col = col;
//     grid.slopes.set(`${this.row},${this.col}`, this);
//     this.grid.addToTrackerCell(this);
//     switch (slopeType) {
//       case "br":
//       case "tl":
//         this.start = {
//           x: this.col * CELL_SIZE,
//           y: this.row * CELL_SIZE + CELL_SIZE,
//         };
//         this.end = {
//           x: this.col * CELL_SIZE + CELL_SIZE,
//           y: this.row * CELL_SIZE,
//         };
//         break;
//       case "bl":
//       case "tr":
//         this.start = {
//           x: this.col * CELL_SIZE,
//           y: this.row * CELL_SIZE,
//         };
//         this.end = {
//           x: this.col * CELL_SIZE + CELL_SIZE,
//           y: this.row * CELL_SIZE + CELL_SIZE,
//         };
//         break;
//     }
//   }
//   isColliding(boundingBox: {
//     top: number;
//     left: number;
//     bottom: number;
//     right: number;
//   }) {
//     const { start, end } = this;
//     const slope = (end.y - start.y) / (end.x - start.x);
//     const yIntercept = start.y - slope * start.x;

//     return hasCrossedLine(boundingBox, slope, yIntercept);
//   }
//   remove() {
//     const tracker = this.grid.tracker.get(`${this.row},${this.col}`);
//     tracker?.delete(this);
//     this.grid.slopes.delete(`${this.row},${this.col}`);
//   }
// }

// function hasCrossedLine(
//   rectangle: { top: number; left: number; bottom: number; right: number },
//   slope: number,
//   yIntercept: number
// ) {
//   const points = [
//     { x: rectangle.left, y: rectangle.top },
//     { x: rectangle.right, y: rectangle.top },
//     { x: rectangle.right, y: rectangle.bottom },
//     { x: rectangle.left, y: rectangle.bottom },
//   ];

//   for (let i = 0; i < 4; i++) {
//     const x1 = points[i].x;
//     const y1 = points[i].y;
//     const x2 = points[(i + 1) % 4].x;
//     const y2 = points[(i + 1) % 4].y;

//     const side1 = slope * x1 + yIntercept;
//     const side2 = slope * x2 + yIntercept;

//     if ((y1 - side1) * (y2 - side2) < 0) {
//       // The rectangle has crossed the line
//       return true;
//     }
//   }

//   // The rectangle has not crossed the line
//   return false;
// }

// // function reflectPlayer(player, slope, yIntercept) {
// //   // Calculate the intersection point
// //   const intersectionX =
// //     (slope * player.y + player.x - slope * yIntercept) / (slope * slope + 1);
// //   const intersectionY = slope * intersectionX + yIntercept;

// //   // Adjust player's position to the intersection point
// //   player.x = intersectionX;
// //   player.y = intersectionY;

// //   // Calculate the normal vector of the wall at the intersection point
// //   const wallNormal = { x: -slope, y: 1 };

// //   // Calculate the reflection vector
// //   const dotProduct =
// //     player.velocity.x * wallNormal.x + player.velocity.y * wallNormal.y;
// //   const reflectionVector = {
// //     x: player.velocity.x - 2 * dotProduct * wallNormal.x,
// //     y: player.velocity.y - 2 * dotProduct * wallNormal.y,
// //   };

// //   // Update player's velocity with the reflection vector
// //   player.velocity.x = reflectionVector.x;
// //   player.velocity.y = reflectionVector.y;
// // }
