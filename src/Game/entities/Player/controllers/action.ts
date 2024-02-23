import { CELL_SIZE } from "../../../../constants";
import { rectanglesAreColliding } from "../../../../utilities";
import { Chest } from "../../../Floor/entities/Chest/Chest";
import { ItemDrop } from "../../../Floor/entities/ItemDrop/ItemDrop";
import { Door } from "../../../Floor/entities/Door/Door";
import { WeaponPickup } from "../../../Floor/entities/Pickup/Pickup";
import { Pot } from "../../../Floor/entities/Pot/Pot";
import { Stairs } from "../../../Floor/entities/Stairs/Stairs";

import { Projectile } from "../../../Floor/entities/Projectile/Projectile";

import { Player } from "../Player";
import { Sign } from "../../../Floor/entities/Sign/Sign";
import { Collider } from "../../Collider/Collider";

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
    const cell = this.floor.tracker.cells.get(pos);
    if (!cell) continue;
    for (const obj of Array.from(cell).sort((obj) =>
      obj instanceof Projectile ? 1 : -1
    )) {
      if (obj instanceof WeaponPickup) {
        const pickup = obj;
        pickup.get(this);
        break;
      } else if (obj instanceof Collider) {
        // if (obj instanceof Pot) {
        // this.inventory.deselectHotKey();
        // obj.carry(this);
        // break;
        if (obj instanceof Projectile) {
          if (obj.state.startsWith("on")) {
            obj.get(this);
            return;
          }
        } else if (obj instanceof Stairs) {
          if (obj.overlapsWith(this.boundingBox)) obj.enter(this);
          break;
        } else if (obj instanceof Sign) {
          obj.read(this);
          break;
        } else if (obj instanceof Door) {
          const door = obj;
          if (door.isOpen) {
            // if (
            // door.overlapsWith(this.boundingBox)
            //Prevent being pushed into wall by closing door
            // ) {
            // continue;
            // }
            door.close();
            break;
          } else {
            door.open(this.x, this.y);
            break;
          }
        } else if (obj instanceof ItemDrop) {
          obj.get(this);
          break;
        } else if (obj instanceof Chest) {
          const chest = obj;
          if (!chest.isOpen && chest.y < this.y) {
            chest.open();
            break;
          }
        }
      }
    }
  }
}
