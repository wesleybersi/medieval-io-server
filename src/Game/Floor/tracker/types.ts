import { Sign } from "../entities/Sign/Sign";
import { Chest } from "../entities/Chest/Chest";
import { Door } from "../entities/Door/Door";
import { Hole } from "../entities/Hole/Hole";
import { Pickup } from "../entities/Pickup/Pickup";
import { Pot } from "../entities/Pot/Pot";
import { Shooter } from "../entities/Shooter/Shooter";
import { Spikes } from "../entities/Spikes/Spikes";
import { Stairs } from "../entities/Stairs/Stairs";
import { Wall } from "../entities/Wall/Wall";
import { Player } from "../../entities/Player/Player";
import { Projectile } from "../entities/Projectile/Projectile";
import { ItemDrop } from "../entities/ItemDrop/ItemDrop";

export type TrackerObject =
  | Wall
  | Pickup
  | Hole
  | Stairs
  | Spikes
  | Pot
  | Chest
  | Door
  | Shooter
  | Sign
  | Player
  | Projectile
  | ItemDrop;
