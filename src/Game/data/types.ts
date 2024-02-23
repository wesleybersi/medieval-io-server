export interface InventoryItem {
  key: string;
  type: "weapon" | "item" | "upgrade" | "projectile";
  durability?: number;
  stacks?: number;
  amount?: number;
}
