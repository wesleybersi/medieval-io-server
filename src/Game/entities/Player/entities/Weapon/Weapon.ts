import { Player } from "../../Player";
import { WeaponTier, WeaponType } from "./types";

export class Weapon {
  player: Player;
  type: WeaponType;
  tier: WeaponTier;
  durability: { current: number; margin: number } = {
    current: 100,
    margin: 0,
  }; // Decreases by margin
  isBroken = false;
  breakDelay = 2;
  bonus?: WeaponBonus;
  isAttack: boolean = false;
  constructor(
    player: Player,
    config: {
      type: WeaponType;
      tier: WeaponTier;
    }
  ) {
    this.player = player;
    this.type = config.type;
    this.tier = config.tier;
  }
  update(delta: number) {}
  setDurability(amount: number) {
    this.durability.margin = 100 / amount;
  }
}

export type WeaponBonus = "durability-up" | "damage-up" | "velocity-up";
