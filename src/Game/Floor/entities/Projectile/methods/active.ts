import { clamp } from "../../../../../utilities";

import { Player } from "../../../../entities/Player/Player";
import { Pot } from "../../Pot/Pot";

import { Projectile } from "../Projectile";
import { Collider } from "../../../../entities/Collider/Collider";

export function active(this: Projectile, delta: number) {
  const delta_x = Math.cos(this.angle * (Math.PI / 180));
  const delta_y = Math.sin(this.angle * (Math.PI / 180));
  let x = this.x + delta_x * this.velocity * delta;
  let y = this.y + delta_y * this.velocity * delta;

  for (const pos of this.touchedCells) {
    if (this.isHold) break;

    const cell = this.floor.tracker.cells.get(pos);

    if (cell) {
      for (const object of cell) {
        if (object === this) continue;
        if (object instanceof Collider) {
          if (object.isObstructing) {
            const collidesAt = object.getCollisionSide(this.boundingBox);
            if (!collidesAt) continue;
            if (object instanceof Player) {
              this.onPlayerImpact(object);
            } else if (object instanceof Pot) {
              // this.onCollision(object);
              this.onPotImpact(object);
              break;
            } else {
              this.onCollision(object);
              return;
            }
          }
        }
      }
    }
  }
  if (this.state !== "active") return;

  if (this.velocity < 0 && this.targetAngle !== undefined) {
    const adjustAngle = (currentAngle: number, targetAngle: number) => {
      if (this.responsiveness === undefined) return 0;
      // Calculate the angular distance in the range [-180, 180]
      let angularDistance = ((targetAngle - currentAngle + 180) % 360) - 180;

      // Adjust the angle based on the shortest path
      if (angularDistance > 180) {
        currentAngle +=
          angularDistance - 360 < delta * this.responsiveness
            ? angularDistance - 360
            : delta * this.responsiveness;
      } else if (angularDistance < -180) {
        currentAngle +=
          angularDistance + 360 > -delta * this.responsiveness
            ? angularDistance + 360
            : -delta * this.responsiveness;
      } else {
        currentAngle +=
          Math.abs(angularDistance) < delta * this.responsiveness
            ? angularDistance
            : angularDistance > 0
            ? delta * this.responsiveness
            : -delta * this.responsiveness;
      }

      // Ensure the angle stays within [-360, 360)
      if (currentAngle < -180) {
        currentAngle += 360;
      }
      if (currentAngle > 180) {
        currentAngle -= 360;
      }

      return currentAngle;
    };

    this.angle = adjustAngle(this.angle, this.targetAngle);
  }

  switch (this.type) {
    case "boomerang":

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

      if (this.type !== "boomerang" && this.velocity <= 0) {
        this.velocity = 0;
        this.onGround();
      } else if (this.type === "boomerang" && this.velocity <= 0) {
        const newAngle = this.shooter.angleBetweenVectors({
          x: this.x,
          y: this.y,
        });
        this.targetAngle = newAngle;
        if (Math.abs(this.velocity) > this.maxSpeed) {
          this.velocity = -this.maxSpeed;
        }
      }

      this.x = x;
      this.y = y;
      break;
  }
}
