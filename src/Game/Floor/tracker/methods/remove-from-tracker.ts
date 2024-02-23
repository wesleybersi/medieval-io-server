import { Shooter } from "../../entities/Shooter/Shooter";
import { Tracker } from "../Tracker";
import { TrackerObject } from "../types";

export function removeFromTracker(this: Tracker, object: TrackerObject) {
  if (Tracker.isStaticObject(object)) {
    const cell = this.cells.get(`${object.row},${object.col}`);
    cell?.delete(object);
    if (object instanceof Shooter) {
      for (const cell of object.proximityCells) {
        const trackerCell = this.cells.get(`${cell.row},${cell.col}`);
        if (trackerCell) {
          trackerCell.delete(object);
        }
      }
    }
    return;
  }
  for (const cellKey of object.touchedCells) {
    const cell = this.cells.get(cellKey);
    if (cell) {
      cell.delete(object);
      if (cell.size === 0) {
        this.cells.delete(cellKey);
      }
    }
  }
}
