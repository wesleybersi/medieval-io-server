import { Socket } from "socket.io";
import Game from "../Game";

export default function onSetPlayerPosition(this: Game, socket: Socket) {
  socket.on("Position Request", (row, col) => {
    if (!socket.player) return;
    const { row: newRow, col: newCol } =
      socket.player.floor.getNearestEmptyCell(row, col);

    socket.player.moveToCell(newRow, newCol);
  });
}
