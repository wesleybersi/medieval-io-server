import { CELL_SIZE } from "../../../../constants";
import { rectanglesAreColliding } from "../../../../utilities";
import { Chest } from "../../../Floor/entities/Chest/Chest";
import { ItemDrop } from "../../../Floor/entities/ItemDrop/ItemDrop";
import { Door } from "../../../Floor/entities/Door/Door";
import { WeaponPickup } from "../../../Floor/entities/Pickup/Pickup";
import { Pot } from "../../../Floor/entities/Pot/Pot";
import { Stairs } from "../../../Floor/entities/Stairs/Stairs";

import { Projectile } from "../../Projectile/Projectile";

import { Player } from "../Player";
import { Sign } from "../../../Floor/entities/Sign/Sign";

export function action(this: Player) {
  if (this.state === "in-dialog" || this.dialog) {
    delete this.dialog;
    this.state = "moving";
    return;
  }

  if (this.carriedItem) {
    if (this.carriedItem instanceof Pot) {
      this.carriedItem.drop(this.x, this.y + this.height);
      this.carriedItem = null;
      return;
    }
  }

  for (const pos of this.touchedCells) {
    const cell = this.floor.tracker.get(pos);
    if (!cell) continue;
    for (const obj of Array.from(cell).sort((obj) =>
      obj instanceof Projectile ? 1 : -1
    )) {
      if (obj instanceof Projectile) {
        if (obj.state.startsWith("on")) {
          obj.get(this);
          return;
        }
      } else if (obj instanceof WeaponPickup) {
        const pickup = obj;
        pickup.get(this);
      } else if (obj instanceof Chest) {
        const chest = obj;
        if (!chest.isOpen && chest.y < this.y) {
          chest.open();
          this.dialog = {
            name: "Ariel",
            text: [
              "I see you just opened a chest.",
              "That is really cool.",
              "Far out.",
            ],
          };
          return;
        }
      } else if (obj instanceof Door) {
        const door = obj;
        if (door.isOpen) {
          door.close();
          return;
        } else {
          door.open(this.x, this.y);
          return;
        }
      } else if (obj instanceof Pot) {
        this.weaponIndex = -1;
        const pot = obj;
        pot.carry(this);
      } else if (obj instanceof Sign) {
        const sign = obj;
        sign.read(this);
      } else if (obj instanceof Stairs) {
        const stairs = obj;
        if (
          rectanglesAreColliding(
            { x: this.x, y: this.y, width: this.width, height: this.height },
            {
              x: stairs.col * CELL_SIZE + CELL_SIZE / 2,
              y: stairs.row * CELL_SIZE + CELL_SIZE / 2,
              width: CELL_SIZE,
              height: CELL_SIZE,
            }
          )
        ) {
          stairs.enter(this);
          return;
        }
      } else if (obj instanceof ItemDrop) {
        const item = obj;
        item.get(this);
      }
    }
  }
}
