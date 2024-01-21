import { CELL_SIZE } from "../../../constants";
import { oneIn } from "../../../utilities";
import { WeaponPickup } from "../Pickup/Pickup";
import {
  getRandomWeaponTier,
  getRandomWeaponType,
} from "../Pickup/random-weapon";
import { Arrow } from "../Weapon/Projectile/projectile-types/Arrow";
import Floor from "../../Floor/Floor";

export class Tile {
  floor: Floor;
  type: "Crate";
  id: number;
  x: number;
  y: number;
  hp: number;
  boundingBox = { top: 0, left: 0, right: 0, bottom: 0 };
  width: number = CELL_SIZE - 16;
  height: number = CELL_SIZE - 16;
  velocityX: number = 0;
  velocityY: number = 0;
  touchedCells: string[] = [];
  didUpdate = false;
  arrowsAttached = new Set<Arrow>();
  constructor(grid: Floor, id: number, x: number, y: number) {
    this.floor = grid;
    this.type = "Crate";
    this.id = id;
    this.x = x;
    this.y = y;
    this.hp = this.type === "Crate" ? 75 : Infinity;
    this.floor.tiles.set(id, this);
    this.update();
  }
  update() {
    this.boundingBox.top = this.y - this.height / 2;
    this.boundingBox.bottom = this.y + this.height / 2;
    this.boundingBox.left = this.x - this.width / 2;
    this.boundingBox.right = this.x + this.width / 2;
    this.floor.trackPosition(this, this.width, this.height);
    this.didUpdate = true;
  }
  hit(amount: number) {
    console.log(this.hp);
    this.hp -= amount;
    this.update();
  }
  remove() {
    for (const arrow of this.arrowsAttached) {
      arrow.state = "OnGround";
      arrow.emit = true;
    }
    if (oneIn(10)) {
      const type = getRandomWeaponType();
      const tier = getRandomWeaponTier(type);
      new WeaponPickup(
        this.floor,
        Math.floor(this.y / CELL_SIZE),
        Math.floor(this.x / CELL_SIZE),
        { type, tier }
      );
    }
    this.floor.removeFromTracker(this);
    this.floor.tiles.delete(this.id);
  }
}
