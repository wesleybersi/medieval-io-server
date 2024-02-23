import { Pot } from "../../Pot/Pot";
import { Projectile } from "../Projectile";

export function onPotImpact(this: Projectile, pot: Pot) {
  switch (this.type) {
    case "arrow":
      if (this.state === "active") {
        this.state = "on-object";
        this.onTarget = pot;
        pot.attachedProjectiles.set([this.x - pot.x, this.y - pot.y], this);
        pot.hit(1);
      }
      break;
    case "boomerang":
      if (this.state === "active") {
        pot.hit(3);
        if (pot) {
          this.state = "on-object";
        } else {
          this.state = "on-ground";
        }
      }
      break;
    case "pot":
      if (this.state === "active") {
        pot.hit(3);
        if (pot) {
          this.state = "on-object";
        } else {
          this.state = "on-ground";
        }
      }
      break;
    case "spear":
    case "spear-collider":
    case "sword-collider":
      if (this.state === "active") {
        pot.hit(3);
        if (pot) {
          this.state = "on-object";
        } else {
          this.state = "on-ground";
        }
      }
      break;
  }
}
