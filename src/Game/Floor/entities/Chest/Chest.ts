import { CELL_SIZE } from "../../../../constants";
import { oneIn } from "../../../../utilities";
import Floor from "../../Floor";
import { Collider } from "../../../entities/Collider/Collider";
import { WeaponPickup } from "../Pickup/Pickup";
import {
  getRandomWeaponTier,
  getRandomWeaponType,
} from "../Pickup/random-weapon";

export class Chest extends Collider {
  floor: Floor;
  tier: "silver" | "gold";
  isOpen = false;
  row: number;
  col: number;
  constructor(floor: Floor, row: number, col: number) {
    super(
      col * CELL_SIZE + CELL_SIZE / 2, //x
      row * CELL_SIZE + CELL_SIZE / 2, //y
      CELL_SIZE, //width
      CELL_SIZE,
      true //height
    );

    this.floor = floor;
    this.tier = oneIn(4) ? "gold" : "silver";
    this.row = row;
    this.col = col;
    this.floor.tracker.addToCell(this, row, col);
    this.floor.spriteGridMatrix.set(
      `${this.row},${this.col}`,
      this.isOpen ? `chest-${this.tier}-open` : `chest-${this.tier}-closed`
    );
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

    const type = getRandomWeaponType();
    const tier = getRandomWeaponTier(type);
    new WeaponPickup(
      this.floor,
      Math.floor(this.y / CELL_SIZE),
      Math.floor(this.x / CELL_SIZE),
      { type, tier }
    );
  }

  remove() {
    this.floor.tracker.remove(this);
  }
}
