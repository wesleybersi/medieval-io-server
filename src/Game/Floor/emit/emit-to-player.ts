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
      force,
      health,
      gold,
      inventory,
      projectiles,
      finalSecondsAlive,
      dialog,
      bowCustomization,
    } = player;
    this.emissionData.client = {
      id,
      name,
      color,
      state,
      force,
      floor: floor.index,
      x,
      y,
      angle,
      health,
      gold,
      secondsAlive: finalSecondsAlive,
      projectiles,
      inventory: {
        size: { rows: inventory.rows, cols: inventory.cols },
        itemSlots: player.state === "in-inventory" ? inventory.itemSlots : [],
        selectedSlot: player.inventory.selectedSlot,
        hotkeys: inventory.hotkeys,
        hotkeyIndex: inventory.hotkeyIndex,
      },
      dialog,
      bowCustomization,
    };

    io.to(id).emit("Game State Update", this.emissionData);
  }
}
