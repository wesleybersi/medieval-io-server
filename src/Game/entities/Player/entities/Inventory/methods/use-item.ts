import { Inventory } from "../Inventory";

export function useItem(this: Inventory, row: number, col: number) {
  const item = this.itemSlots[row][col];
  if (!item) return;

  switch (item.key) {
    case "potion-red":
      this.player.health = Math.min(this.player.health + 50, 100);
      break;
  }

  if (item.type === "item") {
    this.itemSlots[row][col] = null;
    this.selectedSlot = null;
  }
}
