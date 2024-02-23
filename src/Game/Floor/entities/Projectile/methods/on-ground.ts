import { Projectile } from "../Projectile";

export function onGround(this: Projectile) {
  switch (this.type) {
    case "arrow":
      this.state = "on-ground";
      break;
    case "boomerang":
      this.state = "on-ground";
      break;
    case "pot":
      this.state = "destroyed";
      break;
    case "spear":
      this.state = "on-ground";
      break;
    case "spear":
      this.state = "destroyed";
      break;
  }
}
