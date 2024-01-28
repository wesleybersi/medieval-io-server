import { Pot } from "../../../Floor/entities/Pot/Pot";
import { Projectile } from "../Projectile";

export function onPotImpact(this: Projectile, pot: Pot) {
  switch (this.type) {
    case "arrow":
      pot.hit();
      break;
    case "pot":
      pot.hit();
      this.state = "destroyed";
      break;
    case "spear":
    case "spear-collider":
    case "sword-collider":
      pot.hit();
      break;
  }
}
