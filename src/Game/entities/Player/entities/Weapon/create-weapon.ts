import { Player } from "../../Player";
import { Weapon } from "./Weapon";
import { WeaponConfig, WeaponType } from "./types";
import { Bow } from "./weapons/Bow";
import { Crossbow } from "./weapons/Crossbow";
import { Spear } from "./weapons/Spear";
import { Sword } from "./weapons/Sword";

export function createNewWeapon(player: Player, config: WeaponConfig): Weapon {
  switch (config.type) {
    case "Bow":
      return new Bow(player, config);
    case "Crossbow":
      return new Crossbow(player, config);
    case "Spear":
      return new Spear(player, config);
    case "Sword":
      return new Sword(player, config);
  }
}
