import { Player } from "../../entities/Player/Player";
import Floor from "../Floor";

export function removePlayer(this: Floor, player: Player) {
  this.players.delete(player.id);
  this.tracker.remove(player);
}
