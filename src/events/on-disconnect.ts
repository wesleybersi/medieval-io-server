import { Socket } from "socket.io";
import { sockets } from "../server";
import { disconnectSocket } from "../controllers/disconnect";

export default function onDisconnect(socket: Socket) {
  socket.on("disconnect", () => disconnectSocket);
}
