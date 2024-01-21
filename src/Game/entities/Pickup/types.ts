import { WeaponTier, WeaponType } from "../Weapon/types";

export type PickupType = "Weapon" | "Potion";

export interface PickupWeaponConfig {
  type: WeaponType;
  tier: WeaponTier;
}

export interface PickupPotionConfig {
  type: "Health Increase";
}
