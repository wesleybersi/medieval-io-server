import { Socket } from "socket.io";
import { Player } from "../Player";

export default function onActionPress(this: Player, socket: Socket) {
  socket.on("Player Action", () => {
    console.log("ACTION");
    this.action();
  });
}
