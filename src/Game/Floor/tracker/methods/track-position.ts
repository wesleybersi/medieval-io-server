import { CELL_SIZE } from "../../../../constants";
import { Tracker } from "../Tracker";
import { TrackerObject } from "../types";

export function trackPosition(
  this: Tracker,
  object: TrackerObject,
  width = CELL_SIZE,
  height = CELL_SIZE
) {
  if (Tracker.isStaticObject(object)) return;
  this.remove(object);
  const grace = 64;
  object.touchedCells = this.getOverlappingCells(
    object.x,
    object.y,
    width ? object.width + grace : width,
    height ? object.height + grace : height
  );
  for (const cellKey of object.touchedCells) {
    const cell = this.cells.get(cellKey);
    if (cell) {
      cell.add(object);
    } else {
      this.cells.set(cellKey, new Set([object]));
    }
  }
}
