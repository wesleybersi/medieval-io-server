import { Socket } from "socket.io";
import { Bow } from "../entities/Weapon/weapons/Bow";
import { Crossbow } from "../entities/Weapon/weapons/Crossbow";
import { Player } from "../Player";

export default function onWeaponChange(this: Player, socket: Socket) {
  socket.on("Player Weapon Change", (index: number) => {
    this.changeWeapon(index);
  });
}
