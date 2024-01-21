import Game from "../../Game";
import { CELL_SIZE, MOVEMENT_SPEED, PLAYER_SIZE } from "../../../constants";
import { Weapon } from "../Weapon/Weapon";

import { Wall } from "../Wall/Wall";
import { Direction } from "../../../types";
import { createNewWeapon } from "../Weapon/create-weapon";
import { Arrow } from "../Weapon/Projectile/projectile-types/Arrow";
import Floor from "../../Floor/Floor";
import onWeaponChange from "./events/on-weapon-change";

import { changeWeapon } from "./controllers/change-weapon";
import { Socket } from "socket.io";
import onMovement from "./events/on-movement";
import { updateCursors } from "./controllers/update-cursors";

import { updatePointerDown } from "./controllers/update-pointer";
import { onPointerDown, onPointerMove } from "./events/on-pointer";
import { updateAngle } from "./controllers/update-angle";

import { action } from "./controllers/action";
import onActionPress from "./events/on-action-press";
import { Stairs } from "../Stairs/Stairs";
import { rectanglesAreColliding } from "../../../utilities";
import { Spikes } from "../Spikes/Spikes";
import { Pot } from "../Pot/Pot";

export class Player {
  game: Game;
  socket: Socket;
  floor: Floor;
  didDie: boolean = false;
  wasHit: boolean = false;
  id: string;
  name: string;
  health: number;
  color: number;
  y: number;
  x: number;
  secondsAlive: number = 0;
  boundingBox: {
    top: number;
    left: number;
    right: number;
    bottom: number;
    centerX: number;
    centerY: number;
  } = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    centerX: 0,
    centerY: 0,
  };
  width = PLAYER_SIZE;
  height = PLAYER_SIZE;
  radius = PLAYER_SIZE;
  angle: number;
  pointerAngle: number;
  weaponry: Weapon[];
  weaponIndex: number;
  cursors: Direction[] = [];
  direction = "";
  isPointerDown = { left: false, right: false };
  isPointerJustDown = { left: false, right: false };
  force = 0;
  touchedCells: string[] = [];
  shift: boolean = false;
  projectiles = {
    arrows: 25,
  };
  speedFactor = 1;
  arrowsAttached = new Set<Arrow>();

  //Events
  onMovement: (socket: Socket) => void = onMovement;
  onPointerDown: (socket: Socket) => void = onPointerDown;
  onPointerMove: (socket: Socket) => void = onPointerMove;
  onWeaponChange: (socket: Socket) => void = onWeaponChange;
  onActionPress: (socket: Socket) => void = onActionPress;

  //Controllers
  changeWeapon: (index: number) => void = changeWeapon;
  updateCursors: (key: Direction, isDown: boolean) => void = updateCursors;
  updatePointerDown: (button: "left" | "right", isDown: boolean) => void =
    updatePointerDown;
  updateAngle: (angle: number) => void = updateAngle;
  action: () => void = action;

  constructor(
    socket: Socket,
    game: Game,
    floor: Floor,
    id: string,
    name: string,
    color: number
  ) {
    this.id = id;
    this.game = game;
    this.floor = floor;
    this.socket = socket;
    this.name = name;
    this.color = color;
    this.health = 100;
    this.y = 0;
    this.x = 0;
    this.pointerAngle = 0;
    this.weaponIndex = 0;
    this.angle = 0;
    this.weaponry = [
      createNewWeapon(this, { type: "Bow", tier: "Composite Bow" }),
    ];
    this.floor.addPlayer(this);

    //Enable events
    this.onMovement(socket);
    this.onPointerDown(socket);
    this.onPointerMove(socket);
    this.onWeaponChange(socket);
    this.onActionPress(socket);
  }

  update(delta: number, counter: number) {
    this.wasHit = false;
    if (this.health <= 0) {
      this.health = 0;
      this.didDie = true;
    }
    if (this.didDie) return;

    if (counter % 6 === 0) {
      for (const pos of this.touchedCells) {
        const cell = this.floor.tracker.get(pos);
        if (!cell) continue;
        for (const obj of cell) {
          if (obj instanceof Spikes && obj.state === "on") {
            if (
              rectanglesAreColliding(
                {
                  x: this.x,
                  y: this.y,
                  width: this.width * 0.5,
                  height: this.height * 0.5,
                },
                {
                  x: obj.col * CELL_SIZE,
                  y: obj.row * CELL_SIZE,
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                }
              )
            ) {
              this.hurt(5);
            }
          }
        }
      }
    }

    if (this.cursors.length > 0) {
      this.move(delta);
    }

    this.weaponry[this.weaponIndex]?.update();

    //Always reverts to false
    this.isPointerJustDown.left = false;
    this.isPointerJustDown.right = false;
  }

  hurt(value: number) {
    this.health -= value;
    this.wasHit = true;
  }
  moveToCell(row: number, col: number) {
    if (!this.game) return;
    this.x = col * CELL_SIZE + CELL_SIZE / 2;
    this.y = row * CELL_SIZE + CELL_SIZE / 2;
    this.floor.trackPosition(this);
  }

  move(delta: number) {
    let x = this.x;
    let y = this.y;
    const movementSpeed = MOVEMENT_SPEED * this.speedFactor;
    const diagonalSpeed = movementSpeed * Math.sqrt(2); // Calculate diagonal speed using Pythagorean theorem (a^2 + b^2 = c^2)

    let xSpeed = 0;
    let ySpeed = 0;

    for (const key of this.cursors) {
      switch (key) {
        case "up":
          ySpeed -= diagonalSpeed;
          break;
        case "down":
          ySpeed += diagonalSpeed;
          break;
        case "left":
          xSpeed -= diagonalSpeed;
          break;
        case "right":
          xSpeed += diagonalSpeed;
          break;
      }
    }

    // Normalize the movement vector
    const magnitude = Math.sqrt(xSpeed * xSpeed + ySpeed * ySpeed);
    if (magnitude > diagonalSpeed) {
      xSpeed = (xSpeed / magnitude) * diagonalSpeed;
      ySpeed = (ySpeed / magnitude) * diagonalSpeed;
    }

    // Update the position using the normalized speeds
    x = Math.round(x + xSpeed * delta);
    y = Math.round(y + ySpeed * delta);

    const boundingBox = {
      top: y - this.height / 2,
      bottom: y + this.height / 2,
      left: x - this.width / 2,
      right: x + this.width / 2,
      centerX: x,
      centerY: y,
    };

    const direction = getDirection(xSpeed, ySpeed);
    let movingTiles = false;

    //Tile movement
    for (const pos of this.touchedCells) {
      const cell = this.floor.tracker.get(pos);
      if (!cell) continue;
      for (const obj of cell) {
        if (obj instanceof Wall) {
          const wall = obj;
          const collidesAt = wall.getCollisionSide(boundingBox);
          if (collidesAt !== "none") {
            //Does not return, so it can check multiple collisions
            if (collidesAt === "top") {
              y = wall.boundingBox.top - this.height / 2;
            } else if (collidesAt === "bottom") {
              y = wall.boundingBox.bottom + this.height / 2;
            } else if (collidesAt === "left") {
              x = wall.boundingBox.left - this.width / 2;
            } else if (collidesAt === "right") {
              x = wall.boundingBox.right + this.width / 2;
            }

            this.direction = direction;
            this.floor.trackPosition(this, this.width + 8, this.height + 8);
          }
        }
      }
    }

    // if (!movingTiles) {
    //   this.speedFactor = 1;
    // }

    //Update player position

    for (const arrow of this.arrowsAttached) {
      arrow.x += xSpeed * delta;
      arrow.y += ySpeed * delta;
      arrow.emit = true;
    }

    this.x = x;
    this.y = y;
    this.direction = direction;
    this.boundingBox = boundingBox;

    this.floor.trackPosition(this, this.width + 8, this.height + 8);
  }
  doesCollide(x: number, y: number) {
    return !(
      x < this.x - PLAYER_SIZE / 2 ||
      x > this.x - PLAYER_SIZE / 2 + PLAYER_SIZE ||
      y < this.y - PLAYER_SIZE / 2 ||
      y > this.y - PLAYER_SIZE / 2 + PLAYER_SIZE
    );
  }
  setBoundingBox() {
    this.boundingBox = {
      top: this.y - this.height / 2,
      bottom: this.y + this.height / 2,
      left: this.x - this.width / 2,
      right: this.x + this.width / 2,
      centerX: this.x,
      centerY: this.y,
    };
  }
}

declare module "socket.io" {
  interface Socket {
    player: Player;
  }
}

function getDirection(xSpeed: number, ySpeed: number) {
  if (xSpeed === 0 && ySpeed === 0) {
    return "stationary";
  }

  let direction = "";

  if (ySpeed < 0) {
    direction += "up";
  } else if (ySpeed > 0) {
    direction += "down";
  }

  if (xSpeed < 0) {
    direction += "left";
  } else if (xSpeed > 0) {
    direction += "right";
  }

  return direction;
}

function getRelativeObjectPosition(
  playerX: number,
  playerY: number,
  objectAX: number,
  objectAY: number
) {
  const horizontalDistance = objectAX - playerX;
  const verticalDistance = objectAY - playerY;

  if (horizontalDistance > 0) {
    if (verticalDistance > 0) {
      return "downright";
    } else if (verticalDistance < 0) {
      return "upright";
    } else {
      return "right";
    }
  } else if (horizontalDistance < 0) {
    if (verticalDistance > 0) {
      return "downleft";
    } else if (verticalDistance < 0) {
      return "upleft";
    } else {
      return "left";
    }
  } else {
    if (verticalDistance > 0) {
      return "down";
    } else if (verticalDistance < 0) {
      return "up";
    } else {
      return "same position";
    }
  }
}
