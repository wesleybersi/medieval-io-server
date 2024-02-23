import { getRandomInt, randomNum } from "../../../../../utilities";
import { Projectile } from "../Projectile";
import { ProjectileConfig } from "../types";

export function construct(this: Projectile, config: ProjectileConfig) {
  this.x = config.x;
  this.y = config.y;
  this.z = config.z ?? 20;
  this.shooter = config.shooter;
  this.spread = config.spread ?? 0;
  this.bounce = config.bounce ?? false;
  this.maxSpeed = config.maxSpeed ?? Infinity;
  this.state = config.initialState ?? "active";
  this.damage = config.damage;
  this.maxDamage = config.damage;
  this.isHold = config.hold ?? false;
  this.velocity = config.speed;
  this.angle = config.angle;
  // if (this.spread) {
  //   const halfSpread = this.spread / 2;
  //   console.log(halfSpread);
  //   const diffusion = Math.floor(
  //     getRandomInt(-this.spread / 2, this.spread / 2)
  //   );
  //   // console.log(this.angle, diffusion);
  //   this.angle += diffusion;
  //   // console.log(this.angle);
  // }

  this.angle += getRandomInt(-2, 2);

  this.acceleration = config.acceleration ?? 0;
  this.decceleration = config.decceleration ?? 0;
  this.delayedImpact = config.delayedImpact ?? 0;
  this.iterations = config.iterations ?? Infinity;
  this.followPointer = config.followPointer ?? false;

  switch (this.type) {
    case "arrow":
      this.width = 32;
      this.height = 32;
      this.decceleration = config.decceleration ?? 10;
      break;
    case "boomerang":
      this.width = 64;
      this.height = 64;
      this.decceleration = config.decceleration ?? 50;
      this.responsiveness = config.responsiveness ?? 150;
      break;
    case "pot":
      this.width = 64;
      this.height = 64;
      break;
    case "spear":
      this.width = 32;
      this.height = 32;
      break;
    case "spear-collider":
      this.width = 32;
      this.height = 32;
      break;
    case "sword-collider":
      this.width = 48;
      this.height = 48;
      break;
  }
  this.updateBoundingBox();
}
