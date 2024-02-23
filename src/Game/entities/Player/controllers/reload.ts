import { Crossbow } from "../entities/Weapon/weapons/Crossbow";
import { Player } from "../Player";

export function reload(this: Player) {
  const weapon = this.activeWeapon;
  if (weapon instanceof Crossbow) {
    weapon.playerDidReload = true;
  }
}
