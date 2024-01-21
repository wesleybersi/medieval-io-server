import { clamp } from "../../../../utilities";
import { getAngleOffset } from "../../../../utilities/offset";
import { Player } from "../../Player/Player";
import { Projectile } from "../Projectile/Projectile";
import { Arrow } from "../Projectile/projectile-types/Arrow";
import { Weapon } from "../Weapon";
import { WeaponConfig } from "../types";

export class Bow extends Weapon {
  heldProjectile: Projectile | null = null;
  force: number = 0;
  maxForce = 3000;
  forceIncrement = 50;
  damage = 25; //TODO Projectile based
  amountPerShot = 1;
  isLoaded = false;
  constructor(player: Player, config: WeaponConfig) {
    super(player, config);
    switch (config.tier) {
      case "Wooden Bow":
        this.forceIncrement = 35;
        this.maxForce = 1850;
        this.amountPerShot = 1;
        break;
      case "Composite Bow":
        this.forceIncrement = 8;
        this.maxForce = 500;
        this.amountPerShot = 1;
        break;
      case "Longbow":
        this.forceIncrement = 25;
        this.maxForce = 4500;
        this.amountPerShot = 1;
        break;
      case "Shortbow":
        this.forceIncrement = 200;
        this.maxForce = 1750;
        this.amountPerShot = 1;
        break;
      case "Legendary Bow":
        this.forceIncrement = 100;
        this.maxForce = 3500;
        this.amountPerShot = 1;
        break;
      case "Divine Bow":
        this.forceIncrement = 50;
        this.maxForce = 2750;
        this.amountPerShot = 3;
        break;
    }
  }
  update() {
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
        this.heldProjectile.state = "OnGround";
      } //Just in case
      this.heldProjectile = new Arrow(player.floor, {
        x,
        y,
        initialState: "Holding",
        angle: player.angle,
        shotBy: player,
        speed: 0,
        damage: 0,
        hold: true,
      });
    } else {
      if (this.heldProjectile) {
        this.heldProjectile.angle = player.angle;
        this.heldProjectile.x = x;
        this.heldProjectile.y = y;
      }
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

    new Arrow(player.floor, {
      x,
      y,
      angle: player.angle,
      shotBy: player,
      speed: this.force,
      damage: 25,
      decceleration: 4,
      delayedImpact: 1000,
      spread: 3,
    });

    if (this.amountPerShot === 3) {
      new Arrow(player.floor, {
        x,
        y,
        angle: player.angle - 5,
        shotBy: player,
        speed: this.force,
        damage: 25,
        decceleration: 4,
        delayedImpact: 1000,
        spread: 3,
      });

      new Arrow(player.floor, {
        x,
        y,
        angle: player.angle + 5,
        shotBy: player,
        speed: this.force,
        damage: 25,
        decceleration: 4,
        delayedImpact: 1000,
        spread: 3,
      });
    }

    if (this.heldProjectile) {
      this.heldProjectile.state = "Inactive";
      this.heldProjectile = null;
    }

    this.force = 0;
  }
}
