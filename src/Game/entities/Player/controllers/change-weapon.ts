import { active } from "../../Projectile/methods/active";
import { Bow } from "../entities/Weapon/weapons/Bow";
import { Crossbow } from "../entities/Weapon/weapons/Crossbow";
import { Player } from "../Player";

export function changeWeapon(this: Player, index: number) {
  if (this.didDie) return;
  if (this.carriedItem) return;
  if (this.weaponry[index - 1]) {
    if (this.weaponIndex === index - 1) {
      const activeWeapon = this.weaponry[this.weaponIndex];
      if (activeWeapon instanceof Crossbow) activeWeapon.unload();
      this.weaponIndex = -1;
      return;
    }

    const activeWeapon = this.weaponry[this.weaponIndex];
    if (activeWeapon instanceof Bow) {
      if (activeWeapon.heldProjectile) {
        activeWeapon.heldProjectile.state = "removed";
        activeWeapon.heldProjectile = null;
        this.projectiles.arrows++;
      }
    } else if (activeWeapon instanceof Crossbow) {
      activeWeapon.unload();
    }

    this.weaponIndex = index - 1;
  }
}
