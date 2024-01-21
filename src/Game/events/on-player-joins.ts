import { Socket } from "socket.io";
import Game from "../Game";

export function onJoinGame(this: Game, socket: Socket) {
  socket.on("Join Game", (req: JoinGameRequest) => {
    this.addPlayer(socket, { name: req.name, color: req.color });
  });
}

export interface JoinGameRequest {
  name: string;
  color: number;
}
