import { CELL_SIZE } from "../../../../constants";
import { oneIn } from "../../../../utilities";
import Floor from "../../Floor";
import { ItemDrop } from "../ItemDrop/ItemDrop";
import { WeaponPickup } from "../Pickup/Pickup";
import {
  getRandomWeaponTier,
  getRandomWeaponType,
} from "../Pickup/random-weapon";
import { Player } from "../../../entities/Player/Player";
import { Projectile } from "../../../entities/Projectile/Projectile";

//TODO - class Carryable
// type: "Pot" | "Crate"
// Pots get destroyed on impact
// Crates don't
// Pots get pierced by arrows
// Crates have hp and arrows will stick to them
export class Pot {
  floor: Floor;
  isBeingCarried: boolean = false;
  id: string;
  x: number;
  y: number;
  boundingBox!: { top: number; left: number; right: number; bottom: number };
  width = CELL_SIZE;
  height = CELL_SIZE;
  touchedCells = [];
  constructor(floor: Floor, x: number, y: number) {
    this.floor = floor;
    this.id = `${new Date().getTime()}_${Math.floor(Math.random() * 1000)}`;
    this.x = x;
    this.y = y;
    this.floor.trackPosition(this);
    this.setBoundingBox();
    this.floor.lastEmissions.set(this.id, { type: "pot", x, y });
  }
  setBoundingBox() {
    this.boundingBox = {
      top: Math.floor(this.y - CELL_SIZE / 2),
      left: Math.floor(this.x - CELL_SIZE / 2),
      right: Math.floor(this.x + CELL_SIZE / 2),
      bottom: Math.floor(this.y + CELL_SIZE / 2),
    };
  }
  hit() {
    this.floor.emissionData.updaters.push({
      type: "pot",
      id: this.id,
      y: this.y,
      x: this.x,
      hit: true,
    });

    if (oneIn(4)) {
      if (oneIn(5)) {
        new ItemDrop(this.floor, "random", this.y, this.x);
      } else {
        if (oneIn(2)) {
          new ItemDrop(this.floor, "coin", this.y, this.x);
        } else {
          new ItemDrop(this.floor, "arrow", this.y, this.x);
        }
      }
    }
    this.remove();
  }

  drop(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.setBoundingBox();
    this.floor.trackPosition(this);
    this.floor.emissions.push({
      type: "pot",
      id: this.id,
      x,
      y,
    });
    // this.floor.spriteIDMatrix.set(this.id, { type: "pot", x, y });
  }
  fall(player: Player) {
    new Projectile(player.floor, "pot", {
      x: player.x,
      y: player.y,
      z: 16,
      angle: 180,
      shooter: player,
      speed: 24,
      damage: 25,
      decceleration: 2,
      acceleration: 0,
      spread: 3,
    });

    this.remove();
  }
  carry(player: Player) {
    player.carriedItem = this;
    this.floor.removeFromTracker(this);
  }
  update(x: number, y: number) {
    this.x = x;
    this.y = y;
    // this.floor.spriteIDMatrix.set(this.id, { type: "pot", x, y });
    this.floor.emissions.push({
      type: "pot",
      id: this.id,
      x: x,
      y: y,
    });
  }
  throw(player: Player, angle: number) {
    //TODO Hold to throw
    new Projectile(player.floor, "pot", {
      x: player.x,
      y: player.y,
      z: 16,
      angle: player.angle,
      shooter: player,
      speed: 400,
      damage: 25,
      decceleration: 20,
      acceleration: 0,
      spread: 3,
    });
    player.carriedItem = null;
    this.remove();
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
    this.floor.lastEmissions.delete(this.id);
    this.floor.removeFromTracker(this);
    this.floor.emissions.push({
      type: "pot",
      id: this.id,
      remove: true,
    });
  }
}
