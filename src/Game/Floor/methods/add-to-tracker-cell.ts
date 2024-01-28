import { Pickup } from "../entities/Pickup/Pickup";
import Floor from "../Floor";
import { Hole } from "../entities/Hole/Hole";
import { Wall } from "../entities/Wall/Wall";
import { Stairs } from "../entities/Stairs/Stairs";
import { Spikes } from "../entities/Spikes/Spikes";
import { Pot } from "../entities/Pot/Pot";
import { Chest } from "../entities/Chest/Chest";
import { Door } from "../entities/Door/Door";
import { ItemDrop } from "../entities/ItemDrop/ItemDrop";
import { Shooter } from "../entities/Shooter/Shooter";
import { Sign } from "../entities/Sign/Sign";

export function addToIndividualTrackerCell(
  this: Floor,
  object:
    | Wall
    | Pickup
    | Hole
    | Stairs
    | Spikes
    | Chest
    | Door
    | ItemDrop
    | Shooter
    | Sign,
  row: number,
  col: number
) {
  if (object instanceof ItemDrop) {
    // const trackerPos = this.tracker.get(`${object.}`)
  } else {
    const trackerPos = this.tracker.get(`${row},${col}`);
    if (trackerPos) trackerPos.add(object);
    else this.tracker.set(`${row},${col}`, new Set([object]));
  }
}
