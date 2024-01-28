import { io } from "../../../server";

import Floor from "../Floor";

export function emit(this: Floor) {
  for (const [id, player] of this.players) {
    const {
      id,
      name,
      color,
      floor,
      state,
      x,
      y,
      angle,
      weaponry,
      health,
      gold,
      weaponIndex,
      projectiles,
      finalSecondsAlive,
      dialog,
    } = player;
    this.emissionData.client = {
      id,
      name,
      color,
      state,
      floor: floor.index,
      x,
      y,
      angle,
      health,
      gold,
      secondsAlive: finalSecondsAlive,
      weaponry: weaponry.map(({ type, tier, durability, bonus }) => ({
        type,
        tier,
        durability: durability.current,
        bonus,
      })),
      projectiles,
      weaponIndex,
      dialog,
    };

    io.to(id).emit("Game State Update", this.emissionData);
  }
}
