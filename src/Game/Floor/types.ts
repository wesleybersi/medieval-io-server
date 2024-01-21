import {
  ProjectileState,
  ProjectileType,
} from "../entities/Weapon/Projectile/types";
import { WeaponTier, WeaponType } from "../entities/Weapon/types";

export interface EmissionData {
  client?: {
    id: string;
    name: string;
    color: number;
    floor: number;
    x: number;
    y: number;
    angle: number;
    health: number;
    weaponry: { type: WeaponType; tier: WeaponTier }[];
    weaponIndex: number;
    projectiles: { arrows: number };
  };
  players: {
    id: string;
    color: number;
    x: number;
    y: number;
    angle: number;
    weapon: { type: WeaponType; tier: WeaponTier; isLoaded?: boolean };
    wasHit?: boolean;
    isDead?: boolean;
  }[];
  tiles: {
    id: number;
    type: "Crate";
    x: number;
    y: number;
    hp: number;
  }[];
  spikes: {
    row: number;
    col: number;
    state: "on" | "off";
  }[];
  destroyedPots: {
    row: number;
    col: number;
  }[];
  //This is going to grow and grow and grow. Need a new system
  pickups: {
    type: WeaponType;
    row: number;
    col: number;
    amount?: number;
    remove?: boolean;
  }[];
  projectiles: {
    id: number;
    type: ProjectileType;
    state: ProjectileState;
    x: number;
    y: number;
    z: number;
    angle: number;
    velocity: number;
  }[];
  tracker: { key: string; amount: number }[];
}
