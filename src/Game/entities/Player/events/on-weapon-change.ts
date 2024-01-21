import { Socket } from "socket.io";
import { Bow } from "../../Weapon/weapons/Bow";
import { Crossbow } from "../../Weapon/weapons/Crossbow";
import { Player } from "../Player";

export default function onWeaponChange(this: Player, socket: Socket) {
  socket.on("Player Weapon Change", (index: number) => {
    this.changeWeapon(index);
  });
}
