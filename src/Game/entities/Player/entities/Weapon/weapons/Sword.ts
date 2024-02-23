import { getAngleOffset } from "../../../../../../utilities/offset";
import { Player } from "../../../Player";
import { Projectile } from "../../../../../Floor/entities/Projectile/Projectile";
import { Weapon } from "../Weapon";

export class Sword extends Weapon {
  holdForce = { current: 0, multiplier: 0.75, max: 1 };
  speed = 500;
  attackCooldown = { current: 0, total: 0.2 };
  position: "left" | "right" = "right";
  constructor(player: Player, key: string, durability: number) {
    super(player, key, durability);
    this.setDurability(25);
    switch (key) {
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
  }
}
