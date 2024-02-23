import { InventoryItem } from "./types";

export const itemKeys = [
  "potion-red",
  "potion-green",
  "potion-blue",
  "key-gold",
  "key-silver",
  "arrow",
];

export const allItems: InventoryItem[] = itemKeys.map((key) => {
  const inventoryItem: InventoryItem = {
    key,
    type: "item",
  };
  switch (key) {
    case "arrow":
      inventoryItem.stacks = 10;
      inventoryItem.amount = 1;
      inventoryItem.type = "projectile";
      break;
    default:
      break;
  }

  return inventoryItem;
});
