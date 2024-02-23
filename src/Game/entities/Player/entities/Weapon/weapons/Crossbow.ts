import { getAngleOffset } from "../../../../../../utilities/offset";
import { Player } from "../../../Player";
import { Projectile } from "../../../../../Floor/entities/Projectile/Projectile";

import { Weapon } from "../Weapon";

export class Crossbow extends Weapon {
  loading = { current: 0, multiplier: 2, total: 1 };
  isLoading = false;
  loadAmount = { current: 0, total: 1 };
  isAutomatic = false;
  isShootingAutomatic = false;
  automaticInterval = { current: 0, total: 0.25 };
  arrowsAtOnce = 1;
  amountLoaded = 1;
  speed = 500;
  damage = 25;
  playerDidReload = false;
  constructor(player: Player, key: string, durability: number) {
    super(player, key, durability);
    switch (key) {
      case "crossbow-simple":
        this.setDurability(15);
        this.speed = 1750;
        this.damage = 15;
        this.loading.multiplier = 0.75;
        //Manual reload. One shot at a time.
        break;
      case "crossbow-steel":
        this.setDurability(20);
        this.damage = 25;
        this.speed = 2000;
        this.loading.multiplier = 1;
        break;
      case "crossbow-repeating":
        this.setDurability(20);
        this.damage = 25;
        this.speed = 2000;
        this.loading.multiplier = 0.5;
        this.loadAmount.total = 3;
        break;
      case "crossbow-compound":
        this.setDurability(35);
        this.damage = 35;
        this.speed = 2500;
        this.loading.multiplier = 2;
        this.loadAmount.total = 1;
        break;
      case "crossbow-light":
        this.setDurability(25);
        this.damage = 20;
        this.speed = 1500;
        this.loading.multiplier = 10;
        this.loadAmount.total = 1;
        break;
      case "crossbow-heavy":
        this.setDurability(35);
        this.damage = 50;
        this.speed = 4000;
        this.loading.multiplier = 0.5;
        this.loadAmount.total = 1;
        break;
      case "crossbow-enchanted":
        this.setDurability(50);
        this.damage = 30;
        this.speed = 2500;
        this.loading.multiplier = 1;
        this.loadAmount.total = 1;
        break;
      case "crossbow-semi-auto":
        this.setDurability(30);
        this.isAutomatic = true;
        this.damage = 23;
        this.speed = 2500;
        this.loading.multiplier = 1.5;
        this.loadAmount.total = 3;
        break;
      case "crossbow-divine":
        this.setDurability(15);
        this.damage = 25;
        this.speed = 2500;
        this.loading.multiplier = 2;
        this.loadAmount.total = 3;
        this.arrowsAtOnce = 3;
        break;
    }
  }
  update(delta: number) {
    if (this.isBroken || this.durability.current <= 0) {
      return;
    }

    if (this.isShootingAutomatic) {
      this.automaticInterval.current += delta;
      if (this.automaticInterval.current >= this.automaticInterval.total) {
        this.shoot();
        this.automaticInterval.current = 0;
      }
      return;
    }

    if (this.isLoading) {
      this.loading.current += delta * this.loading.multiplier;
      if (this.loading.current >= this.loading.total) {
        this.isLoading = false;
        this.loading.current = 0;

        this.loadAmount.current = Math.min(
          this.loadAmount.total,
          this.player.projectiles.arrows
        );
        this.player.projectiles.arrows -= Math.min(
          this.loadAmount.total,
          this.player.projectiles.arrows
        );
      }
    } else {
      if (this.player.isPointerJustDown.left) {
        if (this.loadAmount.current > 0) {
          this.shoot();
        }
      }
      if (this.playerDidReload && this.loadAmount.current === 0) {
        this.playerDidReload = false;
        this.isLoading = true;
      }
    }
  }
  unload() {
    this.player.projectiles.arrows += this.loadAmount.current;
    this.loadAmount.current = 0;
  }
  shoot() {
    const { player } = this;
    const { x, y } = getAngleOffset(
      player.x,
      player.y,
      player.angle,
      player.width * 1.5
    );
    new Projectile(player.floor, "arrow", {
      x,
      y,
      angle: player.angle,
      shooter: player,
      speed: this.speed,
      damage: this.damage,
    });
    if (this.arrowsAtOnce === 3) {
      if (this.loadAmount.current >= 2) {
        new Projectile(player.floor, "arrow", {
          x,
          y,
          angle: player.angle - 5,
          shooter: player,
          speed: this.speed,
          damage: this.damage,
        });
        if (this.loadAmount.current === 3) {
          new Projectile(player.floor, "arrow", {
            x,
            y,
            angle: player.angle + 5,
            shooter: player,
            speed: this.speed,
            damage: this.damage,
          });
        }
      }
    }

    this.loadAmount.current -= this.arrowsAtOnce;

    if (this.isAutomatic) {
      if (this.loadAmount.current > 0) {
        this.isShootingAutomatic = true;
      } else if (this.loadAmount.current === 0) {
        this.isShootingAutomatic = false;
      }
    }

    this.durability.current -= this.durability.margin;
  }
}
