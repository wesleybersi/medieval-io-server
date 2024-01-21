import { Player } from "../../Player/Player";

export type ProjectileType = "Arrow";
export type ProjectileState =
  | "Holding"
  | "Active"
  | "Inactive"
  | "OnGround"
  | "HitWall"
  | "HitTile"
  | "HitTarget"
  | "PickedUp"
  | "Destroyed";

export interface ProjectileConfig {
  x: number;
  y: number;
  angle: number;
  shotBy: Player;
  speed: number;
  damage: number;
  initialState?: ProjectileState;
  acceleration?: number;
  decceleration?: number;
  maxSpeed?: number;
  spread?: number;
  delayedImpact?: number;
  bounce?: boolean;
  hold?: boolean;
}
