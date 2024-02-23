import { WeaponBonus } from "../entities/Player/entities/Weapon/Weapon";
import { Direction } from "../../types";
import { ItemType } from "./entities/ItemDrop/ItemDrop";
import { ProjectileType } from "./entities/Projectile/types";

import {
  WeaponType,
  WeaponTier,
} from "../entities/Player/entities/Weapon/types";
import { InventoryItem } from "../data/types";

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
    force: number;

    health: number;
    gold: number;
    secondsAlive: number;
    inventory: {
      size: { rows: number; cols: number };
      itemSlots: (InventoryItem | null)[][];
      hotkeys: (InventoryItem | null)[];
      hotkeyIndex: number;
      selectedSlot: { row: number; col: number } | null;
    };
    projectiles: { arrows: number };
    dialog?: { name: string; text: string[] };
    bowCustomization: {
      drawSpeed: number; //0,1,2,3,4
      velocity: number;
      accuracy: number;
    };
  };
  players: {
    id: string;
    color: number;
    state: string;
    x: number;
    y: number;
    angle: number;
    weapon: {
      key: string;
      isLoaded?: boolean;
      isAttack?: boolean;
      force?: number;
      position?: string;
    } | null;
    wasHit?: boolean;
    isDead?: boolean;
  }[];
  updaters: Emission[];
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
  | "crate-small"
  | "crate-big"
  | "crate-small-explosive"
  | "crate-big-explosive"
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
  | "projectile-spear"
  | "projectile-boomerang";
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
  size?: number;
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
  color?: number;
}

export type MatrixCellType =
  | "floor"
  | "floor-0"
  | "floor-1"
  | "floor-2"
  | "floor-3"
  | "floor-4"
  | "floor-5"
  | "floor-6"
  | "floor-7"
  | "floor-8"
  | "floor-9"
  | "floor-10"
  | "floor-11"
  | "floor-12"
  | "floor-13"
  | "floor-14"
  | "floor-15"
  | "floor-16"
  | "floor-17"
  | "floor-18"
  | "floor-19"
  | "shooter-up"
  | "shooter-down"
  | "shooter-left"
  | "shooter-right"
  | "wall"
  | "wall-torch"
  | "wall-damaged"
  | "wall-cracks"
  | "surrounded-wall"
  | "spikes"
  | "spikes-on"
  | "spikes-off"
  | "water"
  | "hole"
  | ItemType;

export type GridSpriteType =
  | "crate-big"
  | "crate-small"
  | "crate-small-explosive"
  | "crate-big-explosive"
  | "horz-door-open-up"
  | "horz-door-open-down"
  | "horz-door-closed-up"
  | "horz-door-closed-down"
  // | "horz-door-locked"
  | "vert-door-open-left"
  | "vert-door-open-right"
  | "vert-door-closed-left"
  | "vert-door-closed-right"
  // | "vert-door-locked"
  | "stairs-up"
  | "stairs-down"
  | "chest-silver-open"
  | "chest-silver-closed"
  | "chest-gold-open"
  | "chest-gold-closed"
  | "sign-rectangle"
  | "shooter-up"
  | "shooter-down"
  | "shooter-left"
  | "shooter-right";

export type IDSpriteType = "crate-big" | "crate-small" | ProjectileType;
