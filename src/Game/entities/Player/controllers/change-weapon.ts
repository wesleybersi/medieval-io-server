import { active } from "../../../Floor/entities/Projectile/methods/active";
import { Bow } from "../entities/Weapon/weapons/Bow";
import { Crossbow } from "../entities/Weapon/weapons/Crossbow";
import { Player } from "../Player";

export function changeWeapon(this: Player, index: number) {
  if (this.didDie) return;
  if (this.carriedItem) return;

  this.inventory.selectHotKey(index);
}
