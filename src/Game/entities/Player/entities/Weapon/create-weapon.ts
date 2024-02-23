import { Player } from "../../Player";
import { Weapon } from "./Weapon";
import { Boomerang } from "./weapons/Boomerang";

import { Bow } from "./weapons/Bow";
import { Crossbow } from "./weapons/Crossbow";
import { Spear } from "./weapons/Spear";
import { Sword } from "./weapons/Sword";

export function createNewWeapon(
  player: Player,
  key: string,
  durability: number
): Weapon {
  if (key.startsWith("bow")) {
    return new Bow(player, key, durability);
  } else if (key.startsWith("crossbow")) {
    return new Crossbow(player, key, durability);
  } else if (key.startsWith("spear")) {
    return new Spear(player, key, durability);
  } else if (key.startsWith("sword")) {
    return new Sword(player, key, durability);
  } else if (key.startsWith("boomerang")) {
    return new Boomerang(player, key, durability);
  } else {
    return new Bow(player, "wooden-bow", 5);
  }
}
