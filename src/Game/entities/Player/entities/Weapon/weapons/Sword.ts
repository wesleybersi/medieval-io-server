import { getAngleOffset } from "../../../../../../utilities/offset";
import { Player } from "../../../Player";
import { Projectile } from "../../../../Projectile/Projectile";
import { Weapon } from "../Weapon";
import { WeaponConfig } from "../types";

export class Sword extends Weapon {
  holdForce = { current: 0, multiplier: 0.75, max: 1 };
  speed = 500;
  attackCooldown = { current: 0, total: 0.2 };
  position: "left" | "right" = "right";
  constructor(player: Player, config: WeaponConfig) {
    super(player, config);
    this.setDurability(25);
    switch (config.tier) {
    }
  }
  attack() {}
  update(delta: number) {
    this.isAttack = false;
    if (this.attackCooldown.current > 0) {
      this.attackCooldown.current += delta;
      if (this.attackCooldown.current > this.attackCooldown.total) {
        this.attackCooldown.current = 0;
      }
    }

    if (this.player.isPointerJustDown.left) {
      if (this.attackCooldown.current > 0) return;
      //Durability should only decrease if direct hit
      this.isAttack = true;
      this.position = this.position === "right" ? "left" : "right";
      this.attackCooldown.current += delta;

      const { x, y } = getAngleOffset(
        this.player.x,
        this.player.y,
        this.player.angle,
        0
      );
      new Projectile(this.player.floor, "sword-collider", {
        shooter: this.player,
        x,
        y,
        angle: this.player.angle,
        speed: 200,
        damage: 20,
        decceleration: 4,
        iterations: 12,
      });
      return;
    }

    if (this.player.isPointerDown.right) {
      return;
      this.holdForce.current += delta * this.holdForce.multiplier;

      console.log(this.holdForce.current);
      if (this.holdForce.current >= this.holdForce.max) {
        this.holdForce.current = this.holdForce.max;
      }
    } else {
      return;
      if (this.holdForce.current === 0) return;
      //Throw Spear projectile
      this.player.weaponry.splice(this.player.weaponIndex, 1);
      this.player.weaponIndex = -1;

      new Projectile(this.player.floor, "spear", {
        x: this.player.x,
        y: this.player.y,
        angle: this.player.angle,
        shooter: this.player,
        speed: this.speed * this.holdForce.current,
        damage: 25,
        decceleration: 4,
        delayedImpact: 1000,
        durability: this.durability.current - this.durability.margin * 2,
      });

      this.holdForce.current = 0;
    }
  }
}