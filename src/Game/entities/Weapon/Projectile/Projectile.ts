import { randomNum } from "../../../../utilities";
import Floor from "../../../Floor/Floor";
import Game from "../../../Game";
import { Player } from "../../Player/Player";
import { ProjectileConfig, ProjectileState, ProjectileType } from "./types";

export class Projectile {
  state: ProjectileState;
  floor: Floor;
  shotBy: Player;
  id: number;
  emit: boolean = true;
  x: number;
  y: number;
  z: number;
  angle: number;
  type: ProjectileType = "Arrow";
  damage: number;
  maxDamage: number;
  maxSpeed: number;
  velocity: number;
  acceleration: number;
  decceleration: number;
  delayedImpact: number;
  spread: number;
  bounce: boolean;
  touchedCells: string[] = [];
  isHold: boolean;
  constructor(floor: Floor, type: ProjectileType, config: ProjectileConfig) {
    this.floor = floor;
    this.x = config.x;
    this.y = config.y;
    this.shotBy = config.shotBy;
    this.z = 20;
    this.spread = config.spread ?? 0;
    if (this.spread) {
      this.x += randomNum(this.spread) - randomNum(this.spread * 2);
      this.y += randomNum(this.spread) - randomNum(this.spread * 2);
    }
    this.bounce = config.bounce ?? false;
    this.maxSpeed = config.maxSpeed ?? Infinity;
    this.state = config.initialState ?? "Active";
    this.damage = config.damage;
    this.maxDamage = config.damage;
    this.isHold = config.hold ?? false;
    this.velocity = config.speed;
    this.type = type;
    this.angle = config.angle;
    this.acceleration = config.acceleration ?? 0;
    this.decceleration = config.decceleration ?? 0;
    this.delayedImpact = config.delayedImpact ?? 0;
    this.id = floor.projectileIndex + 1;
    floor.projectileIndex++;
    floor.projectiles.add(this);
  }
  update(delta: number) {}

  remove() {
    this.emit = false;
    this.floor.removeFromTracker(this);
    this.floor.projectiles.delete(this);
  }
}
