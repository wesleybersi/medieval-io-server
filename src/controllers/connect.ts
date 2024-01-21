import { Socket } from "socket.io";
import { sockets } from "../server";

export function connectSocket(socket: Socket) {
  console.log("New client has connected to the server");
  sockets.add(socket);
  console.log(sockets.size, "connected sockets");
}
