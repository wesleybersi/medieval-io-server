import { Socket } from "socket.io";
import Game from "../Game";
import { Player } from "../entities/Player/Player";
import { randomNum } from "../../utilities";
import { JoinGameRequest } from "../events/on-player-joins";

export function addPlayer(this: Game, socket: Socket, config: JoinGameRequest) {
  const { name, color } = config;

  const floorIndex = randomNum(this.floors.length);
  socket.player = new Player(
    socket,
    this,
    this.floors[floorIndex],
    socket.id,
    name,
    color
  );
  this.players.set(socket.id, socket.player);

  console.log("Total players:", this.players.size);

  //Enable game events
  // onEnterFloor(socket, game);
  // onSetPlayerPosition(socket, game);

  // Enable player control events
  // onPlayerMovement(socket);
  // onPointer(socket);
  // onShift(socket);
  // onAction(socket);
  // onWeaponChange(socket);
  // onPlayerAngle(socket);
}
