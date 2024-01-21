import { BowTier, WeaponTier, WeaponType } from "../Weapon/types";

export function getRandomWeaponType(): WeaponType {
  const types: WeaponType[] = ["Bow", "Crossbow"];
  return types[Math.floor(Math.random() * types.length)];
}

export function getRandomWeaponTier(type: WeaponType): WeaponTier {
  if (type === "Bow") {
    const tiers: BowTier[] = [
      "Wooden Bow",
      "Reinforced Bow",
      "Composite Bow",
      "Longbow",
      "Shortbow",
      "Enchanted Bow",
      "Legendary Bow",
      "Divine Bow",
    ];
    //TODO Probability
    return tiers[Math.floor(Math.random() * tiers.length)];
  } else {
    return "Crossbow";
  }
  return "Wooden Bow";
}
