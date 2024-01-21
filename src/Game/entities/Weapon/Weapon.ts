import { Player } from "../Player/Player";
import { WeaponTier, WeaponType } from "./types";

export class Weapon {
  player: Player;
  type: WeaponType;
  tier: WeaponTier;
  allowsShield = false;
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
  update() {
    //
  }
}
