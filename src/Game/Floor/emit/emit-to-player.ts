import { io } from "../../../server";
import Game from "../../Game";
import Floor from "../Floor";

export function emit(this: Floor) {
  for (const [id, player] of this.players) {
    const {
      id,
      name,
      color,
      floor,
      x,
      y,
      angle,
      weaponry,
      health,
      weaponIndex,
      projectiles,
    } = player;
    this.emissionData.client = {
      id,
      name,
      color,
      floor: floor.index,
      x,
      y,
      angle,
      health,
      weaponry: weaponry.map(({ type, tier }) => ({
        type,
        tier,
      })),
      projectiles,
      weaponIndex,
    };
    io.to(id).emit("Game State Update", this.emissionData);
  }
}
