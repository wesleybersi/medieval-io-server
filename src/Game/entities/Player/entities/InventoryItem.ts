import { Player } from "../Player";

export type InventoryItemType =
  | "potion-red"
  | "potion-blue"
  | "potion-green"
  | "bomb"
  | "key";

export interface InventoryItemConfig {}

export class InventoryItem {
  name: string;
  amount: number;
  maxAmount: number;

  constructor(player: Player, type: string, config: InventoryItemConfig) {}
}
