import { CELL_SIZE } from "../../../../constants";
import { rectanglesAreColliding } from "../../../../utilities";
import { WeaponPickup } from "../../Pickup/Pickup";
import { Stairs } from "../../Stairs/Stairs";
import { Projectile } from "../../Weapon/Projectile/Projectile";
import { Arrow } from "../../Weapon/Projectile/projectile-types/Arrow";
import { Player } from "../Player";

export function action(this: Player) {
  for (const pos of this.touchedCells) {
    const cell = this.floor.tracker.get(pos);
    if (!cell) continue;
    for (const obj of Array.from(cell).sort((obj) =>
      obj instanceof Projectile ? 1 : -1
    )) {
      if (obj instanceof Arrow) {
        if (obj.state === "OnGround" || obj.state.startsWith("Hit")) {
          const arrow = obj;
          arrow.get(this);
          return;
        }
      } else if (obj instanceof WeaponPickup) {
        const pickup = obj;
        pickup.get(this);
      } else if (obj instanceof Stairs) {
        const stairs = obj;
        const stair = stairs.a.floor === this.floor ? stairs.a : stairs.b;

        if (
          rectanglesAreColliding(
            { x: this.x, y: this.y, width: this.width, height: this.height },
            {
              x: stair.col * CELL_SIZE + CELL_SIZE / 2,
              y: stair.row * CELL_SIZE + CELL_SIZE / 2,
              width: CELL_SIZE,
              height: CELL_SIZE,
            }
          )
        ) {
          stairs.enter(this);
        }
      }
    }
  }
}
