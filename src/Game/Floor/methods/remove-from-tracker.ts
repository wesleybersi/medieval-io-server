import { Pickup } from "../entities/Pickup/Pickup";
import Floor, { GridObject } from "../Floor";
import { Hole } from "../entities/Hole/Hole";
import { Wall } from "../entities/Wall/Wall";

import { Spikes } from "../entities/Spikes/Spikes";
import { Pot } from "../entities/Pot/Pot";
import { Chest } from "../entities/Chest/Chest";
import { Door } from "../entities/Door/Door";
import { ItemDrop } from "../entities/ItemDrop/ItemDrop";
import { Stairs } from "../entities/Stairs/Stairs";
import { Shooter } from "../entities/Shooter/Shooter";
import { Sign } from "../entities/Sign/Sign";

export function removeFromTracker(this: Floor, object: GridObject) {
  if (
    object instanceof Wall ||
    object instanceof Pickup ||
    object instanceof Hole ||
    object instanceof Spikes ||
    object instanceof Chest ||
    object instanceof Door ||
    object instanceof Stairs ||
    object instanceof Sign
    //TODO STATIC OBJECT
  ) {
    const cell = this.tracker.get(`${object.row},${object.col}`);
    cell?.delete(object);
    return;
  }

  if (object instanceof Shooter) {
    for (const cell of object.proximityCells) {
      const trackerCell = this.tracker.get(`${cell.row},${cell.col}`);
      if (trackerCell) {
        trackerCell.delete(object);
      }
    }
    return;
  }

  for (const cellKey of object.touchedCells) {
    const cell = this.tracker.get(cellKey);
    if (cell) {
      cell.delete(object);
      if (cell.size === 0) {
        this.tracker.delete(cellKey);
      }
    }
  }
}
