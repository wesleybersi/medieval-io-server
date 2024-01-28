import { WeaponBonus } from "../entities/Player/entities/Weapon/Weapon";
import { Direction } from "../../types";
import { ItemType } from "./entities/ItemDrop/ItemDrop";
import { ProjectileState, ProjectileType } from "../entities/Projectile/types";

import {
  WeaponType,
  WeaponTier,
} from "../entities/Player/entities/Weapon/types";

export interface EmissionData {
  client?: {
    id: string;
    name: string;
    color: number;
    floor: number;
    state: string;
    x: number;
    y: number;
    angle: number;
    health: number;
    gold: number;
    weaponry: {
      type: WeaponType;
      tier: WeaponTier;
      durability: number;
      isAttack?: boolean;
      bonus?: WeaponBonus;
    }[];
    secondsAlive: number;
    weaponIndex: number;
    projectiles: { arrows: number };
    dialog?: { name: string; text: string[] };
  };
  players: {
    id: string;
    color: number;
    state: string;
    x: number;
    y: number;
    angle: number;
    weapon: {
      type: WeaponType;
      tier: WeaponTier;
      isLoaded?: boolean;
      isAttack?: boolean;
      force?: number;
      position?: string;
    };
    wasHit?: boolean;
    isDead?: boolean;
  }[];
  updaters: Emission[];
  //This is going to grow and grow and grow. Need a new system
  pickups: {
    type: WeaponType;
    row: number;
    col: number;
    amount?: number;
    remove?: boolean;
  }[];
  tracker: { key: string; amount: number }[];
}

export type EmissionType =
  | "pot"
  | "spikes"
  | "chest"
  | "door"
  | "drop-arrow"
  | "drop-five-arrows"
  | "drop-gold"
  | "drop-heart"
  | "drop-key"
  | "drop-potion-red"
  | "drop-potion-blue"
  | "drop-potion-green"
  | "projectile-arrow"
  | "projectile-pot"
  | "projectile-spear";
export interface Emission {
  type: EmissionType;
  state?: string;
  id?: string;
  row?: number;
  col?: number;
  x?: number;
  y?: number;
  z?: number;
  angle?: number;
  tier?: number;
  hp?: number;
  velocity?: number;
  isOn?: boolean;
  isOpen?: boolean;
  isCarry?: boolean;
  flash?: boolean;
  hit?: boolean;
  direction?: Direction;
  remove?: boolean;
}
