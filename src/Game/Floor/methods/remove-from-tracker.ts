import { Pickup } from "../../entities/Pickup/Pickup";
import Floor, { GridObject } from "../Floor";
import { Hole } from "../../entities/Hole/Hole";
import { Wall } from "../../entities/Wall/Wall";
import { Stairs } from "../../entities/Stairs/Stairs";
import { Spikes } from "../../entities/Spikes/Spikes";
import { Pot } from "../../entities/Pot/Pot";

export function removeFromTracker(this: Floor, object: GridObject) {
  if (
    object instanceof Wall ||
    object instanceof Pickup ||
    object instanceof Hole ||
    object instanceof Stairs ||
    object instanceof Spikes ||
    object instanceof Pot
  )
    return;
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
