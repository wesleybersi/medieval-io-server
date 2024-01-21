import { Socket } from "socket.io";
import Game from "../Game";

export function removePlayer(this: Game, socket: Socket) {
  this.players.delete(socket.player.id);
  socket.player.floor.removeFromTracker(socket.player);
}
