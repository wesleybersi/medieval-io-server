import { Player } from "../../Player";
import { WeaponTier, WeaponType } from "./types";

export class Weapon {
  player: Player;
  key: string;
  durability: { current: number; margin: number } = {
    current: 100,
    margin: 0,
  }; // Decreases by margin
  isBroken = false;
  breakDelay = 2;
  bonus?: WeaponBonus;
  isAttack: boolean = false;
  constructor(player: Player, key: string, durability: number) {
    this.player = player;
    this.key = key;
    this.durability.current = durability;
  }
  update(delta: number) {}
  setDurability(amount: number) {
    this.durability.margin = 100 / amount;
  }
}

export type WeaponBonus = "durability-up" | "damage-up" | "velocity-up";
