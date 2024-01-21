import { Socket } from "socket.io";
import { sockets } from "../server";

export function disconnectSocket(socket: Socket) {
  if (socket.player?.game) {
    socket.player.game.removePlayer(socket);
  }
  sockets.delete(socket);
  console.log(socket.id, "has disconnected");
  console.log("Total connections:", sockets.size);
}
