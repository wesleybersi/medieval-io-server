import { Player } from "../../Player/Player";
import { createNewWeapon } from "../../Player/entities/Weapon/create-weapon";
import { Projectile } from "../Projectile";

export function get(this: Projectile, player: Player) {
  switch (this.type) {
    case "arrow":
      player.projectiles.arrows++;
      break;
    case "pot":
      this.state = "removed";
      break;
    case "spear":
      const spear = createNewWeapon(player, {
        type: "Spear",
        tier: "Wooden Spear",
      });
      if (this.durability && this.tier) {
        spear.durability.current = this.durability;
        spear.tier = this.tier;
      }

      player.weaponry.push(spear);
      player.weaponIndex = player.weaponry.length - 1;
      break;
  }
  this.remove();
}
