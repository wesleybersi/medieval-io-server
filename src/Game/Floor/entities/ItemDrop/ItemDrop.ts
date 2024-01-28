import { CELL_SIZE } from "../../../../constants";
import { oneIn, randomNum } from "../../../../utilities";
import Floor from "../../Floor";
import { EmissionType } from "../../types";
import { WeaponPickup } from "../Pickup/Pickup";
import {
  getRandomWeaponTier,
  getRandomWeaponType,
} from "../Pickup/random-weapon";
import { Player } from "../../../entities/Player/Player";

export type ItemType =
  | "coin"
  | "key"
  | "arrow"
  | "five-arrows"
  | "potion-red"
  | "potion-blue"
  | "potion-green"
  | "heart";

export class ItemDrop {
  id: string;
  floor: Floor;
  type: ItemType;
  x: number;
  y: number;
  width = CELL_SIZE * 0.75;
  height = CELL_SIZE * 0.75;
  touchedCells: string[] = [];
  lifespan = 150;
  flashTreshold = 30;
  isFlashing = false;
  constructor(floor: Floor, type: ItemType | "random", y: number, x: number) {
    this.floor = floor;
    if (type === "random") {
      const types: ItemType[] = [
        "coin",
        "heart",
        "potion-red",
        "potion-blue",
        "potion-green",
        "arrow",
        "five-arrows",
      ];
      this.type = types[randomNum(types.length)];
    } else {
      this.type = type;
    }
    this.x = x;
    this.y = y;
    this.id = `${new Date().getTime()}_${Math.floor(Math.random() * 1000)}`;
    this.floor.trackPosition(this, this.width, this.height);
    this.floor.emissions.push({
      id: this.id,
      type: ("drop-" + this.type) as EmissionType,
      y,
      x,
    });
    this.floor.updaters.add(this);
  }
  update(delta: number) {
    this.lifespan -= 10 * delta;
    console.log(this.lifespan);
    if (!this.isFlashing && Math.floor(this.lifespan) <= 30) {
      this.isFlashing = true;
      this.floor.emissions.push({
        id: this.id,
        type: ("drop-" + this.type) as EmissionType,
        flash: true,
      });
    }
    if (this.lifespan <= 0) {
      this.remove();
    } else {
      this.floor.updaters.add(this);
    }
  }
  get(player: Player) {
    switch (this.type) {
      case "coin":
        player.gold += 10;
        break;
      case "heart":
        player.health = 100;
        break;
      case "potion-red":
        player.health += 50;
        if (player.health >= 100) player.health = 100;
        break;
      case "potion-blue":
        break;
      case "potion-green":
        break;
      case "arrow":
        player.projectiles.arrows++;
        break;
      case "five-arrows":
        player.projectiles.arrows += 5;
        break;
    }

    this.remove();
  }
  remove() {
    this.floor.removeFromTracker(this);
    this.floor.lastEmissions.delete(this.id);
    this.floor.updaters.delete(this);
    this.floor.emissions.push({
      type: ("drop-" + this.type) as EmissionType,
      id: this.id,
      y: this.y,
      x: this.x,

      remove: true,
    });
  }
}
