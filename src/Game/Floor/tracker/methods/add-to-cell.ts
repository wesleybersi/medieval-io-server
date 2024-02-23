import { Tracker } from "../Tracker";
import { TrackerObject } from "../types";

export function addToCell(
  this: Tracker,
  object: TrackerObject,
  row: number,
  col: number
) {
  const trackerPos = this.cells.get(`${row},${col}`);
  if (trackerPos) trackerPos.add(object);
  else this.cells.set(`${row},${col}`, new Set([object]));
}
