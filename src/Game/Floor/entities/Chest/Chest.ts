import { CELL_SIZE } from "../../../../constants";
import { oneIn } from "../../../../utilities";
import Floor from "../../Floor";
import { ItemDrop } from "../ItemDrop/ItemDrop";
import { WeaponPickup } from "../Pickup/Pickup";
import {
  getRandomWeaponTier,
  getRandomWeaponType,
} from "../Pickup/random-weapon";

export class Chest {
  floor: Floor;
  tier: "silver" | "gold";
  isOpen = false;
  row: number;
  col: number;
  x: number;
  y: number;
  width = CELL_SIZE;
  height = CELL_SIZE;
  boundingBox: { top: number; left: number; right: number; bottom: number };
  constructor(floor: Floor, row: number, col: number) {
    this.floor = floor;
    this.tier = oneIn(4) ? "gold" : "silver";
    this.row = row;
    this.col = col;
    this.x = col * CELL_SIZE + CELL_SIZE / 2;
    this.y = row * CELL_SIZE + CELL_SIZE / 2;
    this.floor.addToTrackerCell(this, row, col);
    this.floor.spriteGridMatrix.set(
      `${this.row},${this.col}`,
      this.isOpen ? `chest-${this.tier}-open` : `chest-${this.tier}-closed`
    );
    this.boundingBox = {
      top: Math.floor(row * CELL_SIZE),
      left: Math.floor(col * CELL_SIZE),
      right: Math.floor(col * CELL_SIZE + CELL_SIZE),
      bottom: Math.floor(row * CELL_SIZE + CELL_SIZE),
    };
  }
  open() {
    this.isOpen = true;
    this.floor.emissions.push({
      type: "chest",
      row: this.row,
      col: this.col,
      isOpen: this.isOpen,
    });

    this.floor.spriteGridMatrix.set(
      `${this.row},${this.col}`,
      `chest-${this.tier}-open`
    );
    // if (oneIn(10)) {

    // if (oneIn(3)) {
    //   new Item(this.floor, "random", this.row, this.col);
    // } else {
    const type = getRandomWeaponType();
    const tier = getRandomWeaponTier(type);
    new WeaponPickup(
      this.floor,
      Math.floor(this.y / CELL_SIZE),
      Math.floor(this.x / CELL_SIZE),
      { type, tier }
    );
    // }

    // }
  }
  getCollisionSide(obj: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  }): "top" | "bottom" | "left" | "right" | "none" {
    if (
      obj.bottom < this.boundingBox.top ||
      obj.top > this.boundingBox.bottom ||
      obj.right < this.boundingBox.left ||
      obj.left > this.boundingBox.right
    ) {
      return "none";
    }

    const topCollision = Math.abs(obj.bottom - this.boundingBox.top);
    const bottomCollision = Math.abs(obj.top - this.boundingBox.bottom);
    const leftCollision = Math.abs(obj.right - this.boundingBox.left);
    const rightCollision = Math.abs(obj.left - this.boundingBox.right);

    // If no adjacentWalls conditions are met, use the original logic
    const minCollision = Math.min(
      topCollision,
      bottomCollision,
      leftCollision,
      rightCollision
    );

    if (minCollision === topCollision) {
      return "top";
    } else if (minCollision === bottomCollision) {
      return "bottom";
    } else if (minCollision === leftCollision) {
      return "left";
    } else {
      return "right";
    }
  }
  remove() {
    this.floor.removeFromTracker(this);
  }
}
