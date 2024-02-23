import { Inventory } from "./../../../../entities/Player/entities/Inventory/Inventory";
import { Player } from "../../../../entities/Player/Player";
import { Projectile } from "../Projectile";

export function onPlayerImpact(this: Projectile, player: Player) {
  switch (this.type) {
    case "arrow":
      if (this.shooter === player) return;
      if (this.velocity < 50) return;

      player.hurt(this.damage);
      this.velocity = 0;
      this.state = "on-target";
      break;
    case "boomerang":
      if (this.velocity < 0 && this.shooter === player) {
        this.shooter.inventory.pushItem("boomerang");
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
          break;
        } else {
          this.state = "on-ground";
          this.velocity = 0;
          break;
        }
      } else {
        if (this.velocity < 50) return;
        if (this.shooter !== player) {
          player.hurt(this.damage);
          this.state = "on-ground";
        } else {
          this.state = "active";
        }
      }

      break;
    case "pot":
      if (this.shooter === player) return;
      player.hurt(this.damage);
      this.velocity = 0;
      this.state = "destroyed";
      break;
    case "spear":
      if (this.shooter === player) return;
      if (this.velocity < 50) return;
      player.hurt(this.damage);
      this.velocity = 0;
      this.state = "on-target";
      break;
    case "spear-collider":
    case "sword-collider":
      if (this.shooter === player) return;
      player.hurt(this.damage);
      this.velocity = 0;
      this.state = "on-target";
      break;
  }
}
