import { Bow } from "../../Weapon/weapons/Bow";
import { Crossbow } from "../../Weapon/weapons/Crossbow";
import { Player } from "../Player";

export function changeWeapon(this: Player, index: number) {
  if (this.didDie) return;
  if (this.weaponry[index - 1]) {
    const activeWeapon = this.weaponry[this.weaponIndex];
    if (activeWeapon instanceof Bow) {
      if (activeWeapon.heldProjectile) {
        activeWeapon.heldProjectile.state = "Inactive";
        activeWeapon.heldProjectile = null;
        this.projectiles.arrows++;
      }
    } else if (activeWeapon instanceof Crossbow) {
      if (activeWeapon.isLoaded) {
        activeWeapon.isLoaded = false;
        this.projectiles.arrows++;
      }
    }

    this.weaponIndex = index - 1;
  }
}
