import { CELL_SIZE } from "../../../../constants";
import { oneIn } from "../../../../utilities";
import Floor from "../../Floor";
import { ItemDrop } from "../ItemDrop/ItemDrop";
import { Player } from "../../../entities/Player/Player";
import { Projectile } from "../Projectile/Projectile";
import { Collider } from "../../../entities/Collider/Collider";
import { Direction } from "../../../../types";
import { Wall } from "../Wall/Wall";
import { Emission, EmissionType, GridSpriteType } from "../../types";

export class Pot extends Collider {
  floor: Floor;
  isBeingCarried: boolean = false;
  id: string;
  touchedCells: string[] = [];
  type:
    | "crate-small"
    | "crate-big"
    | "crate-small-explosive"
    | "crate-big-explosive";
  hp: number;
  movementFactor: number;
  attachedProjectiles: Map<[number, number], Projectile> = new Map(); //xOffset,yOffset,Projectile

  maxSpeed = 0;
  acceleration = 25;
  deceleration = 0.0000001;
  velocityX = 0;
  velocityY = 0;
  currentDirection: Direction | null = null;
  isExplosive?: boolean;
  didExplode?: boolean;
  constructor(floor: Floor, col: number, row: number, isBig?: boolean) {
    super(
      isBig ? col * CELL_SIZE + CELL_SIZE : col * CELL_SIZE + CELL_SIZE / 2,
      isBig ? row * CELL_SIZE + CELL_SIZE : row * CELL_SIZE + CELL_SIZE / 2,
      isBig ? CELL_SIZE * 2 - 1 : CELL_SIZE - 4 - 1,
      isBig ? CELL_SIZE * 2 - 1 : CELL_SIZE - 4 - 1,
      true
    );
    this.floor = floor;
    if (oneIn(20)) this.isExplosive = true;
    this.id = `${new Date().getTime()}_${Math.floor(Math.random() * 1000)}`;
    this.type = isBig ? "crate-big" : "crate-small";
    if (this.isExplosive) {
      this.type += "-explosive";
    }
    this.floor.tracker.track(this);

    if (isBig) {
      // this.hp = this.isExplosive ? 3 : 6;
      this.hp = 6;
      this.maxSpeed = 350;
      this.movementFactor = 0.2;
      this.floor.spriteGridMatrix.set(
        `${row},${col}`,
        this.type as GridSpriteType
      );
      this.floor.spriteGridMatrix.set(
        `${row},${col + 1}`,
        this.type as GridSpriteType
      );
      this.floor.spriteGridMatrix.set(
        `${row + 1},${col}`,
        this.type as GridSpriteType
      );
      this.floor.spriteGridMatrix.set(
        `${row + 1},${col + 1}`,
        this.type as GridSpriteType
      );
    } else {
      this.maxSpeed = 500;
      this.floor.spriteGridMatrix.set(
        `${row},${col}`,
        this.type as GridSpriteType
      );
      // this.hp = this.isExplosive ? 1 : 3;
      this.hp = 3;
      this.movementFactor = 0.6;
    }

    this.floor.lastEmissions.set(this.id, {
      type: this.type as EmissionType,
      x: this.x,
      y: this.y,
    });
  }

  applyMovement(delta: number, direction: Direction) {
    const horizontalInput =
      direction === "right" ? 1 : direction === "left" ? -1 : 0;
    const verticalInput =
      direction === "down" ? 1 : direction === "up" ? -1 : 0;

    if (direction === "left" || direction === "right") {
      this.velocityX += horizontalInput * this.acceleration;
      this.velocityX *= Math.pow(this.deceleration, delta);

      // Limit speed
      if (this.velocityX > this.maxSpeed) this.velocityX = this.maxSpeed;
      let x = this.x + this.velocityX * delta;

      if (!this.isColliding(delta, x, this.y)) {
        this.x = x;
      } else return;
    } else if (direction === "up" || direction === "down") {
      this.velocityY += verticalInput * this.acceleration;
      this.velocityY *= Math.pow(this.deceleration, delta);

      if (this.velocityY > this.maxSpeed) this.velocityY = this.maxSpeed;

      let y = this.y + this.velocityY * delta;

      if (!this.isColliding(delta, this.x, y)) {
        this.y = y;
      } else return;
    }

    // const boundingBox = {
    //   top: y - this.height / 2,
    //   bottom: y + this.height / 2,
    //   left: x - this.width / 2,
    //   right: x + this.width / 2,
    // };

    this.update(delta);
  }

  hit(amount: number) {
    this.hp -= amount;
    if (this.hp <= 0) {
      for (const [[], projectile] of this.attachedProjectiles) {
        if (this.isExplosive) {
          projectile.state = "destroyed";
        } else {
          projectile.state = "on-ground";
        }
      }

      if (this.isExplosive) {
        this.didExplode = true;

        for (const pos of this.touchedCells) {
          const cell = this.floor.tracker.cells.get(pos);
          if (!cell) continue;
          for (const obj of cell) {
            if (obj === this) continue;
            if (obj instanceof Pot) {
              if (!obj.didExplode) obj.hit(Infinity);
            } else if (obj instanceof Player) {
              obj.hurt(50);
            } else if (obj instanceof Projectile) {
              obj.state === "destroyed";
              obj.emit();
            }
          }
        }
      }

      this.floor.emissions.push({
        type: this.type,
        id: this.id,
        y: this.y,
        x: this.x,
        hit: true,
      });

      // if (oneIn(4)) {
      //   if (oneIn(2)) new ItemDrop(this.floor, "coin", this.y, this.x);
      //   else {
      //     new ItemDrop(this.floor, "random", this.y, this.x);
      //   }
      // }

      this.remove();
    }
  }

  drop(x: number, y: number) {
    return;
    this.x = x;
    this.y = y;
    this.updateBoundingBox();
    this.floor.tracker.track(this);
    this.floor.emissions.push({
      type: this.type,
      id: this.id,
      x,
      y,
    });
    // this.floor.spriteIDMatrix.set(this.id, { type: "pot", x, y });
  }
  fall(player: Player) {
    return;
    new Projectile(player.floor, "pot", {
      x: player.x,
      y: player.y,
      z: 16,
      angle: 180,
      shooter: player,
      speed: 24,
      damage: 25,
      decceleration: 2,
      acceleration: 0,
      spread: 3,
    });

    this.remove();
  }
  carry(player: Player) {
    return;
    player.carriedItem = this;
    this.floor.tracker.remove(this);
  }

  isColliding(delta: number, x: number, y: number): boolean {
    const boundingBox = {
      top: y - this.height / 2,
      bottom: y + this.height / 2,
      left: x - this.width / 2,
      right: x + this.width / 2,
    };
    for (const pos of this.touchedCells) {
      const cell = this.floor.tracker.cells.get(pos);
      if (!cell) continue;
      for (const obj of cell) {
        if (obj === this) continue;
        if (obj instanceof Collider) {
          if (obj.isObstructing) {
            const collidesAt = obj.getCollisionSide(
              boundingBox,
              obj instanceof Wall ? obj.adjacentWalls : undefined
            );
            if (collidesAt) {
              if (collidesAt === "top") {
                if (obj instanceof Pot) obj.applyMovement(delta, "down");
              } else if (collidesAt === "bottom") {
                if (obj instanceof Pot) obj.applyMovement(delta, "up");
              } else if (collidesAt === "left") {
                if (obj instanceof Pot) obj.applyMovement(delta, "right");
              } else if (collidesAt === "right") {
                if (obj instanceof Pot) obj.applyMovement(delta, "left");
              }
              return true;
            }
          }
        }
      }
    }
    return false;
  }
  update(delta: number) {
    for (const [[xOffset, yOffset], projectile] of this.attachedProjectiles) {
      if (projectile && projectile.state === "on-object") {
        projectile.x = this.x + xOffset;
        projectile.y = this.y + yOffset;
        projectile.update(delta);
      }
    }

    this.updateBoundingBox();
    this.floor.tracker.track(this);
    this.floor.emissions.push({
      type: this.type,
      id: this.id,
      x: this.x,
      y: this.y,
    });
  }
  throw(player: Player, angle: number) {
    return;
    //TODO Hold to throw
    new Projectile(player.floor, "pot", {
      x: player.x,
      y: player.y,
      z: 16,
      angle: player.angle,
      shooter: player,
      speed: 400,
      damage: 25,
      decceleration: 20,
      acceleration: 0,
      spread: 3,
    });
    player.carriedItem = null;
    this.remove();
  }

  remove() {
    this.floor.lastEmissions.delete(this.id);

    for (const [[xOffset, yOffset], projectile] of this.attachedProjectiles) {
      if (projectile && projectile.state === "on-object") {
        projectile.state = "on-ground";
      }
    }

    this.floor.tracker.remove(this);
    this.floor.emissions.push({
      type: this.type,
      id: this.id,
      remove: true,
    });
  }
}
