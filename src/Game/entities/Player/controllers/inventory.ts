import { Crossbow } from "../entities/Weapon/weapons/Crossbow";
import { Player } from "../Player";

export function inventory(this: Player) {
  if (this.state !== "in-inventory") {
    this.state = "in-inventory";
  } else {
    this.inventory.selectedSlot = null;
    this.state = "moving";
  }
}
