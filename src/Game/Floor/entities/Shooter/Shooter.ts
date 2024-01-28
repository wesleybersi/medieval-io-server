import { Projectile } from "../../../entities/Projectile/Projectile";

import { CELL_SIZE } from "../../../../constants";
import { Direction } from "../../../../types";
import Floor, { SpriteGridType } from "../../Floor";
import { Player } from "../../../entities/Player/Player";

import { ProjectileType } from "../../../entities/Projectile/types";

export class Shooter {
  floor: Floor;
  row: number;
  col: number;
  direction: Direction;
  boundingBox: { top: number; left: number; right: number; bottom: number };
  triggers: Set<Player> = new Set();
  cooldown = { current: 0, total: 0.5 };
  proximityCells: { row: number; col: number }[] = [];
  constructor(floor: Floor, row: number, col: number, direction: Direction) {
    this.floor = floor;
    this.row = row;
    this.col = col;
    this.direction = direction;
    this.boundingBox = {
      top: Math.floor(this.row * CELL_SIZE),
      left: Math.floor(this.col * CELL_SIZE),
      right: Math.floor(this.col * CELL_SIZE + CELL_SIZE),
      bottom: Math.floor(this.row * CELL_SIZE + CELL_SIZE),
    };
    if (this.floor.spriteGridMatrix.has(`${row},${col}`)) return;
    this.floor.spriteGridMatrix.set(
      `${row},${col}`,
      ("shooter-" + direction) as SpriteGridType
    );
    this.setProximityPads();
  }

  setProximityPads() {
    const maxProximity = 10;

    switch (this.direction) {
      case "up":
        for (let i = 1; i < maxProximity + 2; i++) {
          if (
            this.floor.isValidCell(this.row - i, this.col) &&
            this.floor.objectMatrix[this.row - i][this.col].includes("floor")
          ) {
            this.boundingBox.top -= CELL_SIZE;
            this.floor.addToTrackerCell(this, this.row - i, this.col);
            this.proximityCells.push({ row: this.row - i, col: this.col });
          } else {
            break;
          }
        }
        break;
      case "down":
        for (let i = 1; i < maxProximity + 2; i++) {
          if (
            this.floor.isValidCell(this.row + i, this.col) &&
            this.floor.objectMatrix[this.row + i][this.col].includes("floor")
          ) {
            this.boundingBox.bottom += CELL_SIZE;
            this.floor.addToTrackerCell(this, this.row + i, this.col);
            this.proximityCells.push({ row: this.row + i, col: this.col });
          } else {
            break;
          }
        }
        break;
      case "left":
        for (let i = 1; i < maxProximity + 2; i++) {
          if (
            this.floor.isValidCell(this.row, this.col - i) &&
            this.floor.objectMatrix[this.row][this.col - i].includes("floor")
          ) {
            this.boundingBox.left -= CELL_SIZE;
            this.floor.addToTrackerCell(this, this.row, this.col - i);
            this.proximityCells.push({ row: this.row, col: this.col - i });
          } else {
            break;
          }
        }
        break;
      case "right":
        for (let i = 1; i < maxProximity + 2; i++) {
          if (
            this.floor.isValidCell(this.row, this.col + i) &&
            this.floor.objectMatrix[this.row][this.col + i].includes("floor")
          ) {
            this.boundingBox.right += CELL_SIZE;
            this.floor.addToTrackerCell(this, this.row, this.col + i);
            this.proximityCells.push({ row: this.row, col: this.col + i });
          } else {
            break;
          }
        }
        break;
    }
    if (
      this.proximityCells.length < 6 ||
      this.proximityCells.length > maxProximity
    ) {
      this.remove();
      return;
    }
    for (const cell of this.proximityCells) {
      this.floor.objectMatrix[cell.row][cell.col] = "floor-3";
    }
    // this.floor.objectMatrix[this.row][this.col] = "floor-0";
  }

  isRectOverlapping(x: number, y: number, width: number, height: number) {
    const left = x - width / 3;
    const right = x + width / 3;
    const top = y - height / 3;
    const bottom = y + height / 3;

    if (right < this.boundingBox.left || left > this.boundingBox.right) {
      return false;
    }

    if (bottom < this.boundingBox.top || top > this.boundingBox.bottom) {
      return false;
    }

    return true;
  }
  shoot() {
    if (this.cooldown.current > 0) return;
    this.cooldown.current += 0.001;
    let y = this.row * CELL_SIZE + CELL_SIZE / 2;
    let x = this.col * CELL_SIZE + CELL_SIZE / 2;
    let angle = 0;

    switch (this.direction) {
      case "up":
        y -= CELL_SIZE;
        angle = 270;
        break;
      case "down":
        y += CELL_SIZE;
        angle = 90;
        break;
      case "left":
        x -= CELL_SIZE;
        angle = 180;
        break;
      case "right":
        x += CELL_SIZE;
        angle = 0;
        break;
    }
    setTimeout(() => {
      new Projectile(this.floor, "arrow", {
        x,
        y,
        angle,
        speed: 350,
        damage: 20,
        shooter: this,
      });
      this.floor.updaters.add(this);
    }, 50);
  }
  update(delta: number) {
    this.cooldown.current += delta;
    if (this.cooldown.current >= this.cooldown.total) {
      this.cooldown.current = 0;
      this.floor.updaters.delete(this);
    }
  }
  remove() {
    this.floor.removeFromTracker(this);
    this.floor.spriteGridMatrix.delete(`${this.row},${this.col}`);
  }
}
