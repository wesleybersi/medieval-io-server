import { getAngleOffset } from "../../../../utilities/offset";
import { Player } from "../../Player/Player";
import { Projectile } from "../Projectile/Projectile";
import { Arrow } from "../Projectile/projectile-types/Arrow";
import { Weapon } from "../Weapon";
import { WeaponConfig } from "../types";

export class Crossbow extends Weapon {
  isLoaded = false;
  constructor(player: Player, config: WeaponConfig) {
    super(player, config);
  }
  update() {
    if (this.player.isPointerJustDown.left) {
      if (this.isLoaded) {
        this.shoot();
      }
    }

    if (this.player.isPointerJustDown.right) {
      {
        if (this.player.projectiles.arrows <= 0) return;
        this.isLoaded = true;
        this.player.projectiles.arrows--;
      }
    }
  }
  shoot() {
    const { player } = this;
    const { x, y } = getAngleOffset(
      player.x,
      player.y,
      player.angle,
      player.width * 1.5
    );
    new Arrow(player.floor, {
      x,
      y,
      angle: player.angle,
      shotBy: player,
      speed: 3000,
      damage: 25,
      decceleration: 50,
      delayedImpact: 1000,
      spread: 12,
    });
    this.isLoaded = false;
  }
}
