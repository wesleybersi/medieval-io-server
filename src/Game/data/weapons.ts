import { InventoryItem } from "./types";

export const crossbows = [
  "crossbow-simple",
  "crossbow-steel",
  "crossbow-repeating",
  "crossbow-compound",
  "crossbow-light",
  "crossbow-heavy",
  "crossbow-semi-auto",
  "crossbow-enchanted",
  "crossbow-divine",
];

export const bows = [
  "bow-normal",
  "bow-wooden",
  "bow-reinforced",
  "bow-composite",
  "bow-long",
  "bow-short",
  "bow-enchanted",
  "bow-legendary",
  "bow-divine",
];

export const swords = ["sword-two-handed"];
export const spears = ["spear-wooden"];
export const boomerangs = ["boomerang"];

export const weaponKeys = [bows, crossbows, swords].flat();

export const allWeapons: InventoryItem[] = weaponKeys.map((key) => {
  const inventoryItem: InventoryItem = {
    key,
    type: "weapon",
    durability: 100,
  };
  return inventoryItem;
});
