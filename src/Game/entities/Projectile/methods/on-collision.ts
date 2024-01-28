import { Chest } from "../../../Floor/entities/Chest/Chest";
import { Door } from "../../../Floor/entities/Door/Door";
import { Wall } from "../../../Floor/entities/Wall/Wall";
import { Projectile } from "../Projectile";

export function onCollision(this: Projectile, object: Wall | Chest | Door) {
  this.velocity = 0;

  switch (this.type) {
    case "arrow":
      this.state = "on-object";
      break;
    case "pot":
      if (object instanceof Chest) {
        object.open();
      }
      this.state = "destroyed";
      break;
    case "spear":
      this.state = "on-object";
      break;
    case "spear-collider":
    case "sword-collider":
      this.state = "removed";
      break;
  }
}
