import { randomNum } from "../../../utilities";
import { Player } from "../../entities/Player/Player";
import Floor from "../Floor";

export function addPlayer(
  this: Floor,
  player: Player,
  pos?: { row: number; col: number }
) {
  player.floor = this;
  this.players.set(player.id, player);
  if (!pos) {
    const { row, col } = this.getRandomEmptyCell();
    player.moveToCell(row, col);
  } else {
    player.moveToCell(pos.row, pos.col);
  }
  this.emitInitialData(player.socket);
}
