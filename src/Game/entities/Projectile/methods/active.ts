import { clamp, rectanglesAreColliding } from "../../../../utilities";
import { Chest } from "../../../Floor/entities/Chest/Chest";
import { Door } from "../../../Floor/entities/Door/Door";
import { Player } from "../../Player/Player";
import { Pot } from "../../../Floor/entities/Pot/Pot";
import { Shooter } from "../../../Floor/entities/Shooter/Shooter";
import { Wall } from "../../../Floor/entities/Wall/Wall";
import { Projectile } from "../Projectile";

export function active(this: Projectile, delta: number) {
  const delta_x = Math.cos(this.angle * (Math.PI / 180));
  const delta_y = Math.sin(this.angle * (Math.PI / 180));
  let x = this.x + delta_x * this.velocity * delta;
  let y = this.y + delta_y * this.velocity * delta;

  for (const pos of this.touchedCells) {
    if (this.isHold) break;
    const cell = this.floor.tracker.get(pos);
    if (cell) {
      for (const object of cell) {
        if (
          object instanceof Wall ||
          object instanceof Chest ||
          (object instanceof Door && !object.isOpen)
        ) {
          const wall = object;
          const collidesAt = wall.getCollisionSide({
            top: this.y - this.height / 2,
            left: this.x - this.width / 2,
            right: this.x + this.width / 2,
            bottom: this.y + this.height / 2,
          });
          if (collidesAt === "none") continue;
          this.onCollision(object);
          return;
        } else if (object instanceof Player) {
          if (this.shooter === object) continue;
          const player = object;
          const { x, y, width, height } = player;
          if (
            rectanglesAreColliding(
              {
                x: x - width / 2,
                y: y - height / 2,
                width,
                height,
              },
              {
                x: this.x - this.width / 2,
                y: this.y - this.height / 2,
                width: this.width,
                height: this.height,
              }
            )
          ) {
            this.onPlayerImpact(player);
            return;
          }
        } else if (object instanceof Pot) {
          const pot = object;
          const { x, y, width, height } = pot;
          if (
            rectanglesAreColliding(
              {
                x: x - width / 2,
                y: y - height / 2,
                width,
                height,
              },
              {
                x: this.x - this.width / 2,
                y: this.y - this.height / 2,
                width: this.width,
                height: this.height,
              }
            )
          ) {
            this.onPotImpact(pot);
            break;
          }
        } else if (object instanceof Shooter) {
          if (this.type !== "pot") break;
          if (
            object.isRectOverlapping(this.x, this.y, this.width, this.height)
          ) {
            object.shoot();
          }
        } else if (object instanceof Projectile && object !== this) {
          if (object.type === "arrow") {
            object.state = "on-ground";
          }
        }
      }
    }
  }
  if (this.state !== "active") return;

  switch (this.type) {
    case "arrow":
    case "pot":
    case "spear":
    case "spear-collider":
    case "sword-collider":
      this.velocity = clamp(
        this.velocity + this.acceleration,
        this.velocity,
        this.maxSpeed
      );
      this.velocity -= this.decceleration;

      if (this.velocity <= 0) {
        this.velocity = 0;
        this.onGround();
      }

      this.x = x;
      this.y = y;
      break;
    case "boomerang":
      break;

      break;
  }
}
