import { Player } from "../../../../entities/Player/Player";
import { createNewWeapon } from "../../../../entities/Player/entities/Weapon/create-weapon";
import { Projectile } from "../Projectile";

export function get(this: Projectile, player: Player) {
  switch (this.type) {
    case "arrow":
      player.inventory.pushItem("arrow");
      break;
    case "boomerang":
      if (!this.shooter.inventory.hotkeys[0]) {
        this.shooter.inventory.hotkeys[0] = {
          type: "weapon",
          key: "boomerang",
          durability: 100,
        };
        this.state = "destroyed";
        this.shooter.inventory.selectHotKey(1);
        break;
      } else if (!this.shooter.inventory.hotkeys[1]) {
        this.shooter.inventory.hotkeys[1] = {
          type: "weapon",
          key: "boomerang",
          durability: 100,
        };
        this.state = "destroyed";
        this.shooter.inventory.selectHotKey(2);
      }
      break;
    case "pot":
      this.state = "removed";
      break;
    case "spear":
      //TODO
      const spear = createNewWeapon(player, "spear", 100);
      if (this.durability && this.tier) {
        spear.durability.current = this.durability;
      }

      // player.activeWeapon = spear;
      // player.weaponry.push(spear);
      // player.inventory.hotkeyIndex = player.weaponry.length - 1;
      break;
  }
  this.remove();
}
