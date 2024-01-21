import { Pickup } from "../../entities/Pickup/Pickup";
import Floor from "../Floor";
import { Hole } from "../../entities/Hole/Hole";
import { Wall } from "../../entities/Wall/Wall";
import { Stairs } from "../../entities/Stairs/Stairs";
import { Spikes } from "../../entities/Spikes/Spikes";
import { Pot } from "../../entities/Pot/Pot";

export function addToIndividualTrackerCell(
  this: Floor,
  object: Wall | Pickup | Hole | Stairs | Spikes | Pot
) {
  if (object instanceof Stairs) {
    const stair = this === object.a.floor ? object.a : object.b;
    const trackerPos = this.tracker.get(`${stair.row},${stair.col}`);
    if (trackerPos) trackerPos.add(object);
    else this.tracker.set(`${stair.row},${stair.col}`, new Set([object]));
  } else {
    const trackerPos = this.tracker.get(`${object.row},${object.col}`);
    if (trackerPos) trackerPos.add(object);
    else this.tracker.set(`${object.row},${object.col}`, new Set([object]));
  }
}
