import { Socket } from "socket.io";
import { Player } from "../Player";
import { Direction } from "../../../../types";

export default function onMovement(this: Player, socket: Socket) {
  socket.on("Player Cursor", (key: Direction, isDown: boolean) => {
    this.updateCursors(key, isDown);
  });
}
