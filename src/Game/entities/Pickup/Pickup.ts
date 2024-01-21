import { CELL_SIZE } from "../../../constants";
import { clamp } from "../../../utilities";
import Floor from "../../Floor/Floor";
import { Player } from "../Player/Player";
import { createNewWeapon } from "../Weapon/create-weapon";
import { WeaponTier, WeaponType } from "../Weapon/types";
import { Bow } from "../Weapon/weapons/Bow";
import { Crossbow } from "../Weapon/weapons/Crossbow";
import { PickupWeaponConfig } from "./types";

export class Pickup {
  grid: Floor;
  row: number;
  col: number;
  x: number;
  y: number;
  width = CELL_SIZE / 2;
  height = CELL_SIZE / 2;
  didEmit: boolean = false;
  timeRemaining = clamp(Math.floor(Math.random() * 60), 20, 60);
  canBeRemoved = false;
  constructor(grid: Floor, row: number, col: number) {
    this.grid = grid;
    this.row = row;
    this.col = col;
    this.x = col * CELL_SIZE + CELL_SIZE / 2;
    this.y = row * CELL_SIZE + CELL_SIZE / 2;
    grid.pickups.set(`${row},${col}`, this);
    grid.addToTrackerCell(this);
  }
  remove() {
    this.grid.pickups.delete(`${this.row},${this.col}`);
    const tracker = this.grid.tracker.get(`${this.row},${this.col}`);
    tracker?.delete(this);
  }
}

export class WeaponPickup extends Pickup {
  weaponType: WeaponType;
  weaponTier: WeaponTier;
  constructor(
    grid: Floor,
    row: number,
    col: number,
    config: PickupWeaponConfig
  ) {
    super(grid, row, col);
    this.weaponType = config.type;
    this.weaponTier = config.tier;
  }
  get(player: Player) {
    const activeWeapon = player.weaponry[player.weaponIndex];
    if (activeWeapon instanceof Bow) {
      if (activeWeapon.heldProjectile) {
        activeWeapon.heldProjectile.state = "OnGround";
        activeWeapon.heldProjectile = null;
      }
    } else if (activeWeapon instanceof Crossbow) {
      if (activeWeapon.isLoaded) {
        activeWeapon.isLoaded = false;
        player.projectiles.arrows++;
      }
    }

    if (player.weaponry.length < 2) {
      player.weaponry.push(
        createNewWeapon(player, {
          type: this.weaponType,
          tier: this.weaponTier,
        })
      );
      player.weaponIndex = player.weaponry.length - 1;
      this.canBeRemoved = true;
    } else {
      const swappedWeapon = player.weaponry.splice(
        player.weaponIndex,
        1,
        createNewWeapon(player, {
          type: this.weaponType,
          tier: this.weaponTier,
        })
      )[0];

      if (swappedWeapon) {
        this.weaponTier = swappedWeapon.tier;
        this.weaponType = swappedWeapon.type;
        this.didEmit = false;
      }
    }
  }
}
