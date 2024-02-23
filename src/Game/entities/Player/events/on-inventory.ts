import { Socket } from "socket.io";
import { Bow } from "../entities/Weapon/weapons/Bow";
import { Crossbow } from "../entities/Weapon/weapons/Crossbow";
import { Player } from "../Player";

export function onInventory(this: Player, socket: Socket) {
  socket.on("Toggle Inventory", () => {
    this.toggleInventory();
  });
  socket.on("Select Inventory Item", (row: number, col: number) => {
    this.inventory.selectItem(row, col);
  });
  socket.on("Use Inventory Item", (row: number, col: number) => {
    this.inventory.useItem(row, col);
  });
  socket.on("Move Inventory Item", (row: number, col: number) => {
    this.inventory.moveItem(row, col);
  });
}
