import { Player } from "../../Player/Player";
import { Projectile } from "../Projectile";

export function onPlayerImpact(this: Projectile, player: Player) {
  switch (this.type) {
    case "arrow":
      if (this.velocity < 50) return;
      player.hurt(this.damage);
      this.velocity = 0;
      this.state = "on-target";
      break;
    case "pot":
      player.hurt(this.damage);
      this.velocity = 0;
      this.state = "destroyed";
      break;
    case "spear":
      if (this.velocity < 50) return;
      player.hurt(this.damage);
      this.velocity = 0;
      this.state = "on-target";
      break;
    case "spear-collider":
    case "sword-collider":
      player.hurt(this.damage);
      this.velocity = 0;
      this.state = "on-target";
      break;
  }
}
