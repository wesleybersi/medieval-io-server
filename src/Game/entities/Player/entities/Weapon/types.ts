export type WeaponType = "Bow" | "Crossbow" | "Spear" | "Sword";

export type BowTier =
  | "Wooden Bow"
  | "Reinforced Bow"
  | "Composite Bow"
  | "Longbow"
  | "Shortbow"
  | "Enchanted Bow"
  | "Legendary Bow"
  | "Divine Bow";

export type CrossbowTier =
  | "Simple Crossbow"
  | "Steel Crossbow"
  | "Repeating Crossbow"
  | "Compound Crossbow"
  | "Light Crossbow"
  | "Heavy Crossbow"
  | "Semi-Automatic Crossbow"
  | "Enchanted Crossbow"
  | "Mythical Crossbow"
  | "Divine Crossbow";

export type SpearTier = "Wooden Spear";
export type SwordTier = "Sword";

export type WeaponTier = BowTier | CrossbowTier | SpearTier | SwordTier;
