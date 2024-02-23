import { Sign } from "../entities/Sign/Sign";
import { Player } from "../../entities/Player/Player";
import { Chest } from "../entities/Chest/Chest";
import { Door } from "../entities/Door/Door";
import { Hole } from "../entities/Hole/Hole";
import { ItemDrop } from "../entities/ItemDrop/ItemDrop";
import { Pickup } from "../entities/Pickup/Pickup";
import { Projectile } from "../entities/Projectile/Projectile";
import { Shooter } from "../entities/Shooter/Shooter";
import { Spikes } from "../entities/Spikes/Spikes";
import { Stairs } from "../entities/Stairs/Stairs";
import { Wall } from "../entities/Wall/Wall";
import { TrackerObject } from "./types";
import Floor from "../Floor";
import { Pot } from "../entities/Pot/Pot";
import { trackPosition } from "./methods/track-position";
import { getOverlappingCells } from "./methods/get-overlapping-cells";
import { removeFromTracker } from "./methods/remove-from-tracker";
import { addToCell } from "./methods/add-to-cell";
import { EMIT_TRACKER } from "../../../constants";

export class Tracker {
  emit = EMIT_TRACKER;
  floor: Floor;
  cells: Map<string, Set<TrackerObject>> = new Map();
  track: (object: TrackerObject, width?: number, height?: number) => void =
    trackPosition;
  addToCell: (object: TrackerObject, row: number, col: number) => void =
    addToCell;
  remove: (object: TrackerObject) => void = removeFromTracker;

  getOverlappingCells: (
    x: number,
    y: number,
    width?: number,
    height?: number
  ) => string[] = getOverlappingCells;
  constructor(floor: Floor) {
    this.floor = floor;
  }
  update() {
    for (const [key, set] of this.cells) {
      if (set.size === 0) {
        this.cells.delete(key);
      } else {
        if (this.emit) {
          this.floor.emissionData.tracker.push({
            key,
            amount: set.size,
          });
        }
      }
    }
  }
  static isDynamicObject(
    obj: TrackerObject
  ): obj is Player | Projectile | ItemDrop | Pot {
    return (
      obj instanceof Player ||
      obj instanceof Projectile ||
      obj instanceof ItemDrop ||
      obj instanceof Pot
    );
  }
  static isStaticObject(
    obj: TrackerObject
  ): obj is Wall | Pickup | Hole | Stairs | Spikes | Chest | Shooter | Sign {
    return (
      obj instanceof Wall ||
      obj instanceof Pickup ||
      obj instanceof Hole ||
      obj instanceof Stairs ||
      obj instanceof Spikes ||
      obj instanceof Chest ||
      obj instanceof Shooter ||
      obj instanceof Sign
    );
  }
}
