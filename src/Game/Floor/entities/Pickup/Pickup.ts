import { Inventory } from "./../../../entities/Player/entities/Inventory/Inventory";
import { CELL_SIZE } from "../../../../constants";
import { clamp, randomNum } from "../../../../utilities";
import Floor from "../../Floor";
import { Player } from "../../../entities/Player/Player";
import { createNewWeapon } from "../../../entities/Player/entities/Weapon/create-weapon";
import {
  WeaponTier,
  WeaponType,
} from "../../../entities/Player/entities/Weapon/types";
import { Bow } from "../../../entities/Player/entities/Weapon/weapons/Bow";
import { Crossbow } from "../../../entities/Player/entities/Weapon/weapons/Crossbow";
import { PickupWeaponConfig } from "./types";
import { allWeapons } from "../../../data/weapons";

export class Pickup {
  floor: Floor;
  row: number;
  col: number;
  x: number;
  y: number;
  width = CELL_SIZE / 2;
  height = CELL_SIZE / 2;
  didEmit: boolean = false;
  timeRemaining = clamp(Math.floor(Math.random() * 60), 20, 60);
  canBeRemoved = false;
  constructor(floor: Floor, row: number, col: number) {
    this.floor = floor;
    this.row = row;
    this.col = col;
    this.x = col * CELL_SIZE + CELL_SIZE / 2;
    this.y = row * CELL_SIZE + CELL_SIZE / 2;
    floor.pickups.set(`${row},${col}`, this);
    floor.tracker.addToCell(this, row, col);
  }
  remove() {
    this.floor.pickups.delete(`${this.row},${this.col}`);
    this.floor.tracker.remove(this);
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

    //TODO emission
  }
  update(delta: number) {
    if (!this.canBeRemoved) return;
  }

  get(player: Player) {
    // const activeWeapon = player.weaponry[player.weaponIndex];
    // if (activeWeapon instanceof Bow) {
    //   if (activeWeapon.heldProjectile) {
    //     activeWeapon.heldProjectile.state = "OnGround";
    //     activeWeapon.heldProjectile = null;
    //   }
    // } else if (activeWeapon instanceof Crossbow) {
    //   if (activeWeapon.isLoaded) {
    //     activeWeapon.isLoaded = false;
    //     player.projectiles.arrows++;
    //   }
    // }

    if (player.inventory.hotkeys.some((key) => !key)) {
      player.inventory.deselectHotKey();

      const weapon = allWeapons[randomNum(allWeapons.length)].key;

      let itemWasAdded = false;
      player.inventory.hotkeys.forEach((key, index) => {
        if (!key && !itemWasAdded) {
          player.inventory.hotkeyIndex = index;
          player.inventory.newItemToHotKey(weapon, index + 1);
          itemWasAdded = true;
        }
      });
      this.remove();

      // this.floor.emissions.push({type:"weapon-pickup",})
    } else {
      // const swappedWeapon = player.weaponry.splice(
      //   player.weaponIndex,
      //   1,
      //   createNewWeapon(player, {
      //     type: this.weaponType,
      //     tier: this.weaponTier,
      //   })
      // )[0];
      // if (swappedWeapon) {
      //   this.weaponTier = swappedWeapon.tier;
      //   this.weaponType = swappedWeapon.type;
      //   this.didEmit = false;
      // }
    }
  }
}
