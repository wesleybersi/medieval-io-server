import { CELL_SIZE } from "../../../../../constants";
import { clamp, rectanglesAreColliding } from "../../../../../utilities";
import { Tile } from "../../../Tile/Tile";
import { Wall } from "../../../Wall/Wall";
import { Player } from "../../../Player/Player";
import { Projectile } from "../Projectile";
import { ProjectileConfig } from "../types";
import Floor from "../../../../Floor/Floor";
import { Pot } from "../../../Pot/Pot";

export class Arrow extends Projectile {
  constructor(floor: Floor, config: ProjectileConfig) {
    super(floor, "Arrow", config);
  }
  update(delta: number) {
    const delta_x = Math.cos(this.angle * (Math.PI / 180));
    const delta_y = Math.sin(this.angle * (Math.PI / 180));
    let x = this.x + delta_x * this.velocity * delta;
    let y = this.y + delta_y * this.velocity * delta;

    for (const pos of this.touchedCells) {
      if (this.isHold) break;
      const cell = this.floor.tracker.get(pos);
      if (cell) {
        for (const object of cell) {
          if (object instanceof Wall) {
            const wall = object;
            const collidesAt = wall.getCollisionSide({
              top: this.y - 6,
              left: this.x - 6,
              right: this.x + 6,
              bottom: this.y + 6,
            });
            if (collidesAt === "none") continue;
            this.velocity = 0;
            this.state = "HitWall";
            this.updateTracker();
            return;
          } else if (object instanceof Player) {
            if (this.shotBy === object) continue;
            if (this.velocity < 200) continue;
            const player = object;
            const { x, y, width, height } = player;
            if (
              rectanglesAreColliding(
                {
                  x: x - width / 2,
                  y: y - height / 2,
                  width,
                  height,
                },
                { x: this.x - 6, y: this.y - 6, width: 3, height: 3 }
              )
            ) {
              player.hurt(this.damage);
              player.arrowsAttached.add(this);
              if (player.health <= 0) {
                //Kill++
              }
              this.velocity = 0;
              this.state = "HitTarget";
              this.updateTracker();
              return;
            }
          } else if (object instanceof Tile) {
            const tile = object;
            const { x, y, width, height } = tile;
            if (
              rectanglesAreColliding(
                {
                  x: x - width / 2,
                  y: y - height / 2,
                  width,
                  height,
                },
                { x: this.x - 6, y: this.y - 6, width: 3, height: 3 }
              )
            ) {
              tile.hit(this.damage);
              tile.arrowsAttached.add(this);

              this.velocity = 0;
              this.state = "HitTile";
              this.updateTracker();
              return;
            }
          } else if (object instanceof Pot) {
            const pot = object;
            const { x, y, width, height } = pot;
            if (
              rectanglesAreColliding(
                {
                  x: x - width / 2,
                  y: y - height / 2,
                  width,
                  height,
                },
                { x: this.x - 6, y: this.y - 6, width: 3, height: 3 }
              )
            ) {
              pot.hit();

              this.velocity = 0;
              this.state = "OnGround";
              this.updateTracker();
              return;
            }
          }
        }
      }
    }

    this.velocity = clamp(
      this.velocity + this.acceleration,
      this.velocity,
      this.maxSpeed
    );
    this.velocity -= this.decceleration;
    if (
      this.state !== "Holding" &&
      this.state !== "HitTarget" &&
      this.velocity <= 0
    ) {
      this.velocity = 0;
      this.state = "OnGround";
    }

    this.x = x;
    this.y = y;
    this.updateTracker();
  }
  get(player: Player) {
    player.projectiles.arrows++;
    this.state = "Inactive";
    this.emit = true;
    for (const pos of this.touchedCells) {
      const cell = this.floor.tracker.get(pos);
      if (!cell) continue;
      for (const obj of cell) {
        if (obj instanceof Tile) {
          obj.arrowsAttached.delete(this);
        }
      }
    }
  }
  updateTracker() {
    if (this.state !== "Active" && this.state !== "Holding") {
      this.floor.trackPosition(this, CELL_SIZE * 1.25, CELL_SIZE * 1.25);
    } else {
      this.floor.trackPosition(this, 16, 16);
    }
  }
}
