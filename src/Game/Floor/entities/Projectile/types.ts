import { Player } from "../../../entities/Player/Player";
import { Shooter } from "../Shooter/Shooter";
import { SpearTier } from "../../../entities/Player/entities/Weapon/types";

export type ProjectileType =
  | "arrow"
  | "pot"
  | "spear"
  | "boomerang"
  | "spear-collider"
  | "sword-collider";
export type ProjectileState =
  | "active"
  | "holding"
  | "on-ground"
  | "on-object"
  | "on-target"
  | "removed"
  | "destroyed";

export interface ProjectileConfig {
  shooter: Player;
  x: number;
  y: number;
  z?: number;
  angle: number;
  speed: number;
  damage: number;
  initialState?: ProjectileState;
  acceleration?: number;
  decceleration?: number;
  responsiveness?: number;
  maxSpeed?: number;
  spread?: number;
  delayedImpact?: number;
  bounce?: boolean;
  hold?: boolean;
  durability?: number;
  tier?: SpearTier;
  iterations?: number;
  followPointer?: boolean;
}
