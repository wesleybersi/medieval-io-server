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
import { Collider } from "../../../entities/Collider/Collider";

export type ItemType =
  | "coin"
  | "key"
  | "arrow"
  | "key-gold"
  | "key-silver"
  | "five-arrows"
  | "potion-red"
  | "potion-blue"
  | "potion-green"
  | "heart";

export class ItemDrop extends Collider {
  id: string;
  floor: Floor;
  type: ItemType;
  touchedCells: string[] = [];
  lifespan = 150;
  flashTreshold = 30;
  isFlashing = false;
  constructor(floor: Floor, type: ItemType | "random", y: number, x: number) {
    super(x, y, 12, 12, false);
    this.floor = floor;
    if (type === "random") {
      const types: ItemType[] = [
        "coin",
        "heart",
        "potion-red",
        "potion-blue",
        "potion-green",
        "arrow",
        // "five-arrows",
      ];
      this.type = types[randomNum(types.length)];
    } else {
      this.type = type;
    }
    this.id = `${new Date().getTime()}_${Math.floor(Math.random() * 1000)}`;
    this.floor.tracker.track(this, this.width, this.height);
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
    if (
      player.inventory.itemSlots.every((row) =>
        row.every((slot) => slot !== null)
      )
    ) {
      //TODO Inventory Full UI Message
      return;
    }

    switch (this.type) {
      case "coin":
        player.gold += 10;
        break;
      case "key-silver":
      case "key-gold":
      case "potion-red":
      case "potion-blue":
      case "potion-green":
      case "arrow":
        player.inventory.pushItem(this.type);
        break;
      case "heart":
        player.health = 100;
        break;
    }

    this.remove();
  }
  remove() {
    this.floor.tracker.remove(this);
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
