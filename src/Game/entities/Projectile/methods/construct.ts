import { randomNum } from "../../../../utilities";
import { Projectile } from "../Projectile";
import { ProjectileConfig } from "../types";

export function construct(this: Projectile, config: ProjectileConfig) {
  this.x = config.x;
  this.y = config.y;
  this.z = config.z ?? 20;
  this.shooter = config.shooter;
  this.spread = config.spread ?? 0;
  if (this.spread) {
    this.x += randomNum(this.spread) - randomNum(this.spread * 2);
    this.y += randomNum(this.spread) - randomNum(this.spread * 2);
  }
  this.bounce = config.bounce ?? false;
  this.maxSpeed = config.maxSpeed ?? Infinity;
  this.state = config.initialState ?? "active";
  this.damage = config.damage;
  this.maxDamage = config.damage;
  this.isHold = config.hold ?? false;
  this.velocity = config.speed;
  this.angle = config.angle;
  this.acceleration = config.acceleration ?? 0;
  this.decceleration = config.decceleration ?? 0;
  this.delayedImpact = config.delayedImpact ?? 0;
  this.iterations = config.iterations ?? Infinity;

  switch (this.type) {
    case "arrow":
      this.width = 4;
      this.height = 4;
      this.decceleration = config.decceleration ?? 5;
      break;
    case "pot":
      this.width = 8;
      this.height = 8;
      break;
    case "spear":
      this.width = 6;
      this.height = 6;
      break;
    case "spear-collider":
      this.width = 8;
      this.height = 8;
      break;
    case "sword-collider":
      this.width = 24;
      this.height = 24;
      break;
  }
}
