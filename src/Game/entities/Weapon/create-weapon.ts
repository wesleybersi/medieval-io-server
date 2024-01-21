import { Player } from "../Player/Player";
import { Weapon } from "./Weapon";
import { WeaponConfig, WeaponType } from "./types";
import { Bow } from "./weapons/Bow";
import { Crossbow } from "./weapons/Crossbow";

export function createNewWeapon(player: Player, config: WeaponConfig): Weapon {
  switch (config.type) {
    case "Bow":
      return new Bow(player, config);
    case "Crossbow":
      return new Crossbow(player, config);
  }
}
