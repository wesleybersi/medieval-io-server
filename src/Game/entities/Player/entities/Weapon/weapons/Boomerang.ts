import { clamp } from "../../../../../../utilities";
import { getAngleOffset } from "../../../../../../utilities/offset";
import { Player } from "../../../Player";
import { Projectile } from "../../../../../Floor/entities/Projectile/Projectile";

import { Weapon } from "../Weapon";

export class Boomerang extends Weapon {
  heldProjectile: Projectile | null = null;

  maxSpeed = 0;
  forceIncrement = 50;
  spread = 0; //times maxSpread
  maxSpread = 6;

  responsiveness = 150;

  force = { current: 0, multiplier: 1, target: 1 };
  amountPerShot = 1;
  isLoaded = false;
  constructor(player: Player, key: string, durability: number) {
    super(player, key, durability);
    switch (key) {
      case "boomerang":
        this.maxSpeed = 2750;
        this.responsiveness = 150;
        this.force.multiplier = 1;
        this.amountPerShot = 1;
        break;
    }
  }
  update(delta: number) {
    this.player.force = this.force.current;
    if (this.isBroken || this.durability.current <= 0) {
      this.isBroken = true;
      return;
    }
    if (this.player.isPointerDown.left) {
      if (!this.heldProjectile && this.player.projectiles.arrows <= 0) return;

      this.hold(delta);
    } else {
      if (this.heldProjectile) {
        this.release();
      }
      this.force.current = 0;
    }
  }
  hold(delta: number) {
    const { player } = this;

    this.force.current += delta * this.force.multiplier;
    if (this.force.current >= 1) this.force.current = 1;

    // this.force = clamp(this.force + this.forceIncrement, 0, this.maxForce);

    const offset = 32;
    const { x, y } = getAngleOffset(player.x, player.y, player.angle, offset);

    if (player.isPointerJustDown.left) {
      this.player.projectiles.arrows -= this.amountPerShot;
    }
    //   let arrowsLeft = this.amountPerShot;
    //   for (const row of this.player.inventory.itemSlots) {
    //     for (const slot of row) {
    //       if (slot) {
    //         if (slot.key === "arrow" && slot.amount) {
    //           for (let i = 0; i < this.amountPerShot; i++) {
    //             if (slot.amount > 1) {
    //               slot.amount--;
    //               arrowsLeft--;
    //             } else if (slot.amount === 1) {
    //               arrowsLeft--;
    //               const y = this.player.inventory.itemSlots.indexOf(row);
    //               const x = this.player.inventory.itemSlots[y].indexOf(slot);
    //               if (y !== -1 && x !== -1) {
    //                 this.player.inventory.itemSlots[y][x] = null;
    //               }
    //               continue;
    //             }
    //           }
    //         }
    //       }
    //       if (arrowsLeft === 0) {
    //         break;
    //       }
    //     }
    //   }
    //   //TODO Choose lowest number, or just autosort everytime

    //   if (arrowsLeft === this.amountPerShot) return;
    // }
    // this.player.projectiles.arrows -= this.amountPerShot;
    // if (this.heldProjectile) {
    //   this.heldProjectile.state = "on-ground";
    // } //Just in case
    if (!this.heldProjectile) {
      this.heldProjectile = new Projectile(player.floor, "boomerang", {
        x,
        y,
        initialState: "holding",
        angle: player.angle,
        shooter: player,
        speed: 0,
        damage: 0,
        hold: true,
      });
    } else {
      this.heldProjectile.holdForce = this.force.current;
    }
  }
  release() {
    const { player } = this;
    const offset = 200 - this.force.current * 70;
    const { x, y } = getAngleOffset(player.x, player.y, player.angle, offset);

    if (this.force.current < 0.2) {
      if (this.heldProjectile) {
        this.heldProjectile.state = "removed";
        this.heldProjectile.emit();
        this.heldProjectile = null;
        return;
      }
    }

    console.log("FIRING:", this.force.current * this.maxSpeed);
    new Projectile(player.floor, "boomerang", {
      x,
      y,
      angle: player.angle,
      shooter: player,
      speed: this.force.current * this.maxSpeed,
      damage: 25,
      spread: this.spread * this.maxSpread,
      responsiveness: this.responsiveness,
    });

    if (this.heldProjectile) {
      this.heldProjectile.state = "removed";
      this.heldProjectile.emit();
      this.heldProjectile = null;
    }

    this.durability.current -= this.durability.margin;

    this.player.inventory.hotkeys[this.player.inventory.hotkeyIndex] = null;
    this.player.activeWeapon = null;
    this.player.inventory.deselectHotKey();
  }
}
