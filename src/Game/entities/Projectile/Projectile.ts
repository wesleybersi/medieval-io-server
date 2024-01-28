import { CELL_SIZE } from "../../../constants";
import { clamp, rectanglesAreColliding } from "../../../utilities";
import Floor from "../../Floor/Floor";
import { Chest } from "../../Floor/entities/Chest/Chest";
import { Door } from "../../Floor/entities/Door/Door";
import { Player } from "../Player/Player";
import { Pot } from "../../Floor/entities/Pot/Pot";
import { Wall } from "../../Floor/entities/Wall/Wall";
import { SpearTier } from "../Player/entities/Weapon/types";
import { ProjectileConfig, ProjectileState, ProjectileType } from "./types";
import { get } from "./methods/get";
import { EmissionType } from "../../Floor/types";
import { construct } from "./methods/construct";

import { onPlayerImpact } from "./methods/on-player-impact";
import { onPotImpact } from "./methods/on-pot-impact";
import { onCollision } from "./methods/on-collision";
import { active } from "./methods/active";
import { onGround } from "./methods/on-ground";
import { getAngleOffset } from "../../../utilities/offset";
import { Shooter } from "../../Floor/entities/Shooter/Shooter";

export class Projectile {
  floor!: Floor;
  shooter!: Player | Shooter;
  id: string;
  x!: number;
  y!: number;
  z!: number;
  width: number = 0;
  height: number = 0;
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
  tier?: SpearTier;
  touchedCells: string[] = [];
  construct: (config: ProjectileConfig) => void = construct;
  get: (player: Player) => void = get;
  active: (delta: number) => void = active;
  onPlayerImpact: (player: Player) => void = onPlayerImpact;
  onPotImpact: (pot: Pot) => void = onPotImpact;
  onGround: () => void = onGround;
  onCollision: (object: Wall | Chest | Door) => void = onCollision;
  constructor(floor: Floor, type: ProjectileType, config: ProjectileConfig) {
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
        });

        this.floor.updaters.add(this);
        break;

      case "on-ground":
      case "on-object":
      case "on-target":
        //Projectile emits once and then stops emitting until state changes
        this.floor.emissions.push({
          type: ("projectile-" + this.type) as EmissionType,
          id: this.id,
          state: this.state,
          x: this.x,
          y: this.y,
          z: this.z,
          velocity: this.velocity,
          angle: this.angle,
        });

        this.floor.updaters.delete(this);
        break;
      case "removed":
      case "destroyed":
        //Projectile emits and is immediately removed
        this.remove();
        break;
    }
  }
  update(delta: number) {
    this.iterations--;
    if (this.iterations <= 0) this.state = "destroyed";
    switch (this.state) {
      case "active":
        this.active(delta);
        break;
      case "holding":
        if (this.shooter && this.shooter instanceof Player) {
          const { x, y } = getAngleOffset(
            this.shooter.x,
            this.shooter.y,
            this.shooter.angle,
            this.shooter.radius / 2
          );
          this.x = x;
          this.y = y;
          this.angle = this.shooter.angle;
        }
        break;
    }
    this.updateTracker();
    this.emit();
  }
  updateTracker() {
    this.floor.trackPosition(this, this.width * 2, this.height * 2);
  }
  remove() {
    this.floor.removeFromTracker(this);
    this.floor.updaters.delete(this);
    this.floor.lastEmissions.delete(this.id);
    this.floor.emissions.push({
      type: ("projectile-" + this.type) as EmissionType,
      id: this.id,
      state: this.state,
      remove: true,
    });
  }
}
