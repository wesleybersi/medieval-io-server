import { WeaponPickup } from "../../entities/Pickup/Pickup";
import {
  getRandomWeaponTier,
  getRandomWeaponType,
} from "../../entities/Pickup/random-weapon";
import Floor from "../Floor";

export function updatePickups(this: Floor) {
  if (this.pickups.size < this.pickupTarget) {
    const randomRow = Math.floor(Math.random() * this.rows);
    const randomCol = Math.floor(Math.random() * this.cols);
    const { row, col } = this.getNearestEmptyCell(
      randomRow,
      randomCol,
      new Set()
    );
    if (!this.pickups.has(`${row},${col}`)) {
      const type = getRandomWeaponType();
      const tier = getRandomWeaponTier(type);
      new WeaponPickup(this, row, col, {
        type,
        tier,
      });
    }
  }
  for (const [, pickup] of this.pickups) {
    if (this.game.frameCount % 60 === 0) {
      pickup.timeRemaining--;
    }
    if (pickup.timeRemaining <= 0) {
      pickup.canBeRemoved = true;
    }
    if (pickup.didEmit && !pickup.canBeRemoved) continue;

    if (pickup instanceof WeaponPickup) {
      const { row, col, weaponType, canBeRemoved: wasPickedUp } = pickup;

      this.emissionData.pickups.push({
        type: weaponType,
        row,
        col,
        remove: wasPickedUp ? true : undefined,
      });
      pickup.didEmit = true;
      if (wasPickedUp) pickup.remove();
    }
  }
}
