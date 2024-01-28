import { Crossbow } from "../entities/Weapon/weapons/Crossbow";
import { Player } from "../Player";

export function inventory(this: Player) {
  if (this.state !== "in-inventory") {
    console.log("INVE");
    this.state = "in-inventory";
  } else {
    this.state = "moving";
  }
}
