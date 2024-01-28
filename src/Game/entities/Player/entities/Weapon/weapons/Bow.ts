import { clamp } from "../../../../../../utilities";
import { getAngleOffset } from "../../../../../../utilities/offset";
import { Player } from "../../../Player";
import { Projectile } from "../../../../Projectile/Projectile";

import { Weapon } from "../Weapon";
import { WeaponConfig } from "../types";

export class Bow extends Weapon {
  heldProjectile: Projectile | null = null;
  force: number = 0;
  maxForce = 3000;
  forceIncrement = 50;
  amountPerShot = 1;
  isLoaded = false;
  constructor(player: Player, config: WeaponConfig) {
    super(player, config);
    switch (config.tier) {
      case "Wooden Bow":
        this.forceIncrement = 5;
        this.maxForce = 375;
        this.amountPerShot = 1;
        this.setDurability(12);

        break;
      case "Composite Bow":
        this.forceIncrement = 8;
        this.maxForce = 500;
        this.amountPerShot = 1;
        this.setDurability(18);
        break;
      case "Longbow":
        this.forceIncrement = 4;
        this.maxForce = 650;
        this.amountPerShot = 1;
        this.setDurability(25);
        break;
      case "Shortbow":
        this.forceIncrement = 16;
        this.maxForce = 300;
        this.amountPerShot = 1;
        this.setDurability(30);
        break;
      case "Legendary Bow":
        this.forceIncrement = 23;
        this.maxForce = 550;
        this.amountPerShot = 1;
        this.setDurability(40);
        break;
      case "Divine Bow":
        this.forceIncrement = 8;
        this.maxForce = 450;
        this.amountPerShot = 3;
        this.setDurability(25);
        break;
    }
  }
  update() {
    if (this.isBroken || this.durability.current <= 0) {
      this.isBroken = true;
      return;
    }
    if (this.player.isPointerDown.left) {
      if (!this.heldProjectile && this.player.projectiles.arrows <= 0) return;
      this.hold();
    } else {
      if (this.heldProjectile) {
        this.release();
      } else {
        this.force = 0;
      }
    }
  }
  hold() {
    const { player } = this;
    this.force = clamp(this.force + this.forceIncrement, 0, this.maxForce);

    const { x, y } = getAngleOffset(
      player.x,
      player.y,
      player.angle,
      player.radius / 2
    );
    if (player.isPointerJustDown.left) {
      this.player.projectiles.arrows -= this.amountPerShot;
      if (this.heldProjectile) {
        this.heldProjectile.state = "on-ground";
      } //Just in case
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
    }
  }
  release() {
    const { player } = this;
    const { x, y } = getAngleOffset(
      player.x,
      player.y,
      player.angle,
      player.radius / 2
    );

    new Projectile(player.floor, "arrow", {
      x,
      y,
      angle: player.angle,
      shooter: player,
      speed: this.force,
      damage: 25,
    });

    if (this.amountPerShot === 3) {
      new Projectile(player.floor, "arrow", {
        x,
        y,
        angle: player.angle - 5,
        shooter: player,
        speed: this.force,
        damage: 25,
      });

      new Projectile(player.floor, "arrow", {
        x,
        y,
        angle: player.angle + 5,
        shooter: player,
        speed: this.force,
        damage: 25,
      });
    }

    if (this.heldProjectile) {
      this.heldProjectile.state = "removed";
      this.heldProjectile.emit();
      this.heldProjectile = null;
    }

    this.durability.current -= this.durability.margin;
    this.force = 0;
  }
}
