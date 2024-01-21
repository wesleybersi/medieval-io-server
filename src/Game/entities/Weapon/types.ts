export type WeaponType = "Bow" | "Crossbow";
export interface WeaponConfig {
  type: WeaponType;
  tier: WeaponTier;
}

export type BowTier =
  | "Wooden Bow"
  | "Reinforced Bow"
  | "Composite Bow"
  | "Longbow"
  | "Shortbow"
  | "Enchanted Bow"
  | "Legendary Bow"
  | "Divine Bow";

export type CrossbowTier = "Crossbow";

export type WeaponTier = BowTier | CrossbowTier;
