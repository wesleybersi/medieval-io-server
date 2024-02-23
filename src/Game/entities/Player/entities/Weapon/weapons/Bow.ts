import { clamp } from "../../../../../../utilities";
import { getAngleOffset } from "../../../../../../utilities/offset";
import { Player } from "../../../Player";
import { Projectile } from "../../../../../Floor/entities/Projectile/Projectile";

import { Weapon } from "../Weapon";

export class Bow extends Weapon {
  heldProjectile: Projectile | null = null;
  // force: number = 0;
  // maxForce = 3000;
  maxSpeed = 0;
  forceIncrement = 50;
  spread = 0; //times maxSpread
  maxSpread = 6;

  force = { current: 0, multiplier: 1, target: 1 };
  amountPerShot = 1;
  isLoaded = false;
  constructor(player: Player, key: string, durability: number) {
    super(player, key, durability);
    switch (key) {
      case "bow-normal":
        const maxValue = 4;

        let drawSpeedMultiplier = player.bowCustomization.drawSpeed / maxValue;
        let velocityMultiplier = player.bowCustomization.velocity / maxValue;
        let accuracyMultiplier = player.bowCustomization.accuracy / maxValue;

        drawSpeedMultiplier = 0.3 + drawSpeedMultiplier * 0.7;
        velocityMultiplier = 0.5 + velocityMultiplier * 0.5;
        accuracyMultiplier = 0.25 + accuracyMultiplier * 0.75;

        const topSpeed = 4500;
        this.maxSpeed = topSpeed * velocityMultiplier;

        const fastestDraw = 1.3;
        this.force.multiplier = fastestDraw * drawSpeedMultiplier;

        this.spread = (1 - accuracyMultiplier) * this.maxSpread;

        this.amountPerShot = 1;
        break;
      case "bow-wooden":
        this.force.multiplier = 0.6;
        this.maxSpeed = 2250;
        this.amountPerShot = 1;
        this.setDurability(12);
        break;
      case "bow-composite":
        this.force.multiplier = 0.75;
        this.maxSpeed = 3000;
        this.amountPerShot = 1;
        this.setDurability(18);
        break;
      case "bow-reinforced":
        this.force.multiplier = 1;
        this.maxSpeed = 3250;
        this.amountPerShot = 1;
        this.setDurability(18);
        break;
      case "bow-long":
        this.force.multiplier = 0.5;
        this.maxSpeed = 4500;
        this.amountPerShot = 1;
        this.setDurability(25);
        break;
      case "bow-short":
        this.force.multiplier = 2.5;
        this.maxSpeed = 1750;
        this.amountPerShot = 1;
        this.setDurability(30);
        break;
      case "bow-legendary":
        this.force.multiplier = 1.5;
        this.maxSpeed = 5000;
        this.amountPerShot = 1;
        this.setDurability(40);
        break;
      case "bow-enchanted":
        this.force.multiplier = 0.75;
        this.maxSpeed = 3000;
        this.amountPerShot = 1;
        this.setDurability(40);
        break;
      case "bow-divine":
        this.force.multiplier = 0.75;
        this.maxSpeed = 2500;
        this.amountPerShot = 3;
        this.setDurability(25);
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
      console.log("New projectile");
      this.heldProjectile = new Projectile(player.floor, "arrow", {
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
      console.log("Projectile in place");
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

    new Projectile(player.floor, "arrow", {
      x,
      y,
      angle: player.angle,
      shooter: player,
      speed: this.force.current * this.maxSpeed,
      damage: 25,
      followPointer: this.key === "bow-enchanted",
      spread: this.spread * this.maxSpread,
    });

    if (this.amountPerShot === 3) {
      new Projectile(player.floor, "arrow", {
        x,
        y,
        angle: player.angle - 5,
        shooter: player,
        speed: this.force.current * this.maxSpeed,
        damage: 25,
      });

      new Projectile(player.floor, "arrow", {
        x,
        y,
        angle: player.angle + 5,
        shooter: player,
        speed: this.force.current * this.maxSpeed,
        damage: 25,
      });
    }

    if (this.heldProjectile) {
      this.heldProjectile.state = "removed";
      this.heldProjectile.emit();
      this.heldProjectile = null;
    }

    this.durability.current -= this.durability.margin;
  }
}
