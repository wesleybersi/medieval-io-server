import {
  BowTier,
  CrossbowTier,
  SpearTier,
  SwordTier,
  WeaponTier,
  WeaponType,
} from "../../../entities/Player/entities/Weapon/types";
import { Sword } from "../../../entities/Player/entities/Weapon/weapons/Sword";

export function getRandomWeaponType(): WeaponType {
  const types: WeaponType[] = ["Bow", "Crossbow", "Spear", "Sword"];
  return types[Math.floor(Math.random() * types.length)];
}

export function getRandomWeaponTier(type: WeaponType): WeaponTier {
  if (type === "Bow") {
    const tiers: BowTier[] = [
      "Wooden Bow",
      // "Reinforced Bow",
      "Composite Bow",
      "Longbow",
      "Shortbow",
      // "Enchanted Bow",
      "Legendary Bow",
      "Divine Bow",
    ];
    //TODO Probability
    return tiers[Math.floor(Math.random() * tiers.length)];
  } else if (type === "Crossbow") {
    const tiers: CrossbowTier[] = [
      "Simple Crossbow",
      "Steel Crossbow",
      "Repeating Crossbow",
      "Compound Crossbow",
      "Light Crossbow",
      "Heavy Crossbow",
      "Enchanted Crossbow",
      "Semi-Automatic Crossbow",
      "Mythical Crossbow",
    ];
    return tiers[Math.floor(Math.random() * tiers.length)];
  } else if (type === "Spear") {
    const tiers: SpearTier[] = ["Wooden Spear"];
    return tiers[Math.floor(Math.random() * tiers.length)];
  } else if (type === "Sword") {
    const tiers: SwordTier[] = ["Sword"];
    return tiers[Math.floor(Math.random() * tiers.length)];
  }
  return "Wooden Bow";
}
