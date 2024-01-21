import { Socket } from "socket.io";
import { connectSocket } from "../controllers/connect";

export default function onConnect(socket: Socket) {
  socket.on("connect", () => connectSocket);
}
