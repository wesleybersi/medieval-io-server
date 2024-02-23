import { Collider } from "../../../../entities/Collider/Collider";
import { Chest } from "../../Chest/Chest";
import { Door } from "../../Door/Door";
import { Wall } from "../../Wall/Wall";
import { Projectile } from "../Projectile";

export function onCollision(this: Projectile, object: Collider) {
  this.velocity = 0;

  switch (this.type) {
    case "arrow":
      this.state = "on-object";
      break;
    case "boomerang":
      this.state = "on-object";
      break;
    case "pot":
      if (object instanceof Chest) {
        object.open();
      }
      if (object instanceof Door) {
        object.open(this.x, this.y);
      }
      this.state = "destroyed";
      break;
    case "spear":
      this.state = "on-object";
      break;
    case "spear-collider":
    case "sword-collider":
      this.state = "removed";

      if (object instanceof Door) {
        object.open(this.x, this.y);
      }
      break;
  }
}
