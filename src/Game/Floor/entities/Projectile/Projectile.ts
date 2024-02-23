import { BoundingBox, Collider } from "./../../../entities/Collider/Collider";
import { CELL_SIZE } from "../../../../constants";
import { clamp, rectanglesAreColliding } from "../../../../utilities";
import Floor from "../../Floor";
import { Chest } from "../Chest/Chest";
import { Door } from "../Door/Door";
import { Player } from "../../../entities/Player/Player";
import { Pot } from "../Pot/Pot";
import { Wall } from "../Wall/Wall";
import { SpearTier } from "../../../entities/Player/entities/Weapon/types";
import { ProjectileConfig, ProjectileState, ProjectileType } from "./types";
import { get } from "./methods/get";
import { EmissionType } from "../../types";
import { construct } from "./methods/construct";

import { onPlayerImpact } from "./methods/on-player-impact";
import { onPotImpact } from "./methods/on-pot-impact";
import { onCollision } from "./methods/on-collision";
import { active } from "./methods/active";
import { onGround } from "./methods/on-ground";
import { getAngleOffset } from "../../../../utilities/offset";
import { Shooter } from "../Shooter/Shooter";

export class Projectile extends Collider {
  floor!: Floor;
  shooter!: Player;
  boundingBox!: BoundingBox;
  id: string;
  z!: number;
  angle!: number;
  state!: ProjectileState;
  type: ProjectileType = "arrow";
  damage!: number;
  maxDamage!: number;
  maxSpeed!: number;
  velocity!: number;
  acceleration!: number;
  decceleration!: number;
  delayedImpact!: number;
  spread!: number;
  bounce!: boolean;
  isHold!: boolean;
  durability?: number;
  iterations = Infinity;
  followPointer?: boolean;
  tier?: SpearTier;
  holdForce: number = 0;
  targetAngle?: number;
  responsiveness?: number;
  touchedCells: string[] = [];
  onTarget: Player | Pot | null = null;
  construct: (config: ProjectileConfig) => void = construct;
  get: (player: Player) => void = get;
  active: (delta: number) => void = active;
  onPlayerImpact: (player: Player) => void = onPlayerImpact;
  onPotImpact: (pot: Pot) => void = onPotImpact;
  onGround: () => void = onGround;
  onCollision: (object: Collider) => void = onCollision;
  constructor(floor: Floor, type: ProjectileType, config: ProjectileConfig) {
    super(config.x, config.y, 1, 1, false);
    this.id = `${new Date().getTime()}_${Math.floor(Math.random() * 1000)}`;
    this.floor = floor;
    this.type = type;
    this.construct(config);
    this.floor.updaters.add(this);
  }
  emit() {
    switch (this.state) {
      case "active":
      case "holding":
        //Active projectile updating and emitting
        this.floor.emissions.push({
          type: ("projectile-" + this.type) as EmissionType,
          id: this.id,
          state: this.state,
          x: this.x,
          y: this.y,
          z: this.z,
          velocity: this.velocity,
          angle: this.angle,
          color: this.shooter.color,
        });

        this.floor.updaters.add(this);
        break;

      case "on-ground":
      case "on-object":
      case "on-target":
        this.floor.emissions.push({
          type: ("projectile-" + this.type) as EmissionType,
          id: this.id,
          state: this.state,
          x: this.x,
          y: this.y,
          z: this.z,
          velocity: this.velocity,
          angle: this.angle,
          color: this.shooter.color,
        });
        this.floor.updaters.add(this);
        // this.floor.updaters.delete(this);
        break;
      case "removed":
      case "destroyed":
        //Projectile emits and is immediately removed
        this.remove();
        break;
    }
  }
  update(delta: number) {
    this.updateBoundingBox();
    this.updateTracker();
    this.iterations -= delta * 100;
    if (this.iterations <= 0) this.state = "destroyed";
    switch (this.state) {
      case "active":
        this.active(delta);
        break;
      case "on-object":
        this.width = 128;
        this.height = 128;
        break;
      case "on-ground":
        this.width = 250;
        this.height = 250;
        for (const pos of this.touchedCells) {
          if (this.isHold) break;

          const cell = this.floor.tracker.cells.get(pos);

          if (cell) {
            for (const object of cell) {
              if (object === this) continue;
              if (object instanceof Collider) {
                if (object instanceof Player) {
                  if (object.x > this.x) this.x += delta * 120;
                  if (object.x < this.x) this.x -= delta * 120;
                  if (object.y > this.y) this.y += delta * 120;
                  if (object.y < this.y) this.y -= delta * 120;
                  if (object.getCollisionSide(this.boundingBox)) {
                    this.remove();
                    return;
                  }
                  // this.emit();
                }
              }
            }
          }
        }
        break;
      case "holding":
        if (this.shooter && this.shooter instanceof Player) {
          let offset = 0;
          if (this.type.includes("arrow")) {
            offset = 200 - this.holdForce * 70;
          } else if (this.type.includes("boomerang")) {
            offset = 140 - this.holdForce * 70;
          }
          const { x, y } = getAngleOffset(
            this.shooter.x,
            this.shooter.y,
            this.shooter.angle,
            offset
          );
          this.x = x;
          this.y = y;
          this.angle = this.shooter.angle;
        }
        break;
    }

    this.emit();
  }
  updateTracker() {
    this.floor.tracker.track(this, this.width * 3, this.height * 3);
  }
  remove() {
    this.floor.tracker.remove(this);
    this.floor.updaters.delete(this);
    this.floor.lastEmissions.delete(this.id);
    if (this.onTarget) {
      for (const [offset, projectile] of this.onTarget?.attachedProjectiles) {
        this.onTarget.attachedProjectiles.delete(offset);
      }
    }
    this.floor.emissions.push({
      type: ("projectile-" + this.type) as EmissionType,
      id: this.id,
      state: this.state,
      remove: true,
    });
  }
}
