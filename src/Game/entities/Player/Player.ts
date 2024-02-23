import { allWeapons } from "../../data/weapons";
import Game from "../../Game";
import { CELL_SIZE, PLAYER_SIZE } from "../../../constants";
import { Weapon } from "./entities/Weapon/Weapon";

import { Wall } from "../../Floor/entities/Wall/Wall";
import { Direction } from "../../../types";

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

import { randomNum } from "../../../utilities";
import { Spikes } from "../../Floor/entities/Spikes/Spikes";
import { Pot } from "../../Floor/entities/Pot/Pot";
import { Hole } from "../../Floor/entities/Hole/Hole";
import onReload from "./events/on-reload";
import { reload } from "./controllers/reload";
import { Shooter } from "../../Floor/entities/Shooter/Shooter";
import { inventory } from "./controllers/inventory";
import { onInventory } from "./events/on-inventory";
import { Collider } from "../Collider/Collider";
import { Inventory } from "./entities/Inventory/Inventory";
import { onCustomizeBow } from "./events/on-customize";
import { Projectile } from "../../Floor/entities/Projectile/Projectile";

export interface Dialog {
  name: string;
  pages: { text: string }[];
}

export class Player extends Collider {
  game: Game;
  socket: Socket;
  floor: Floor;
  state:
    | "moving"
    | "falling"
    | "attacking"
    | "swimming"
    | "in-dialog"
    | "in-inventory"
    | "dead"
    | "chatting" = "moving";

  inventory: Inventory;
  activeWeapon: Weapon | null = null;

  didDie: boolean = false;
  wasHit: boolean = false;
  id: string;
  name: string;
  health: number;
  color: number;
  velocityX = 0;
  velocityY = 0;
  // maxSpeed = 130;
  // acceleration = 32;
  initialMaxSpeed = 1200;
  initialAcceleration = 185;
  initialDeceleration = 0.0006;

  maxSpeed = 1200;
  acceleration = 185;
  deceleration = 0.0006;
  secondsAlive: number = 0;
  finalSecondsAlive: number = 0;
  gold: number = 0;
  dialog?: { name: string; text: string[] } = {
    name: "???",
    text: [
      "Unwelcome intruder, behold the wretched abyss in which you find yourself. This forsaken ground hungers for souls, and your fate is but a pawn in its malevolent game.",
      "In the shadows, unseen companions, both ally and foe, tread alongside you, as you hear the distant cries of other cursed wanderers, their destinies intertwined with yours.",
    ],
  };

  rotationSpeed = 400;
  targetAngle = 0; //Angle will always lerp towards targetAngle
  angle: number;

  bowCustomization = {
    drawSpeed: 2, //0,1,2,3,4
    velocity: 2,
    accuracy: 2,
  };

  carriedItem: Pot | null = null;
  cursors: Direction[] = [];
  direction = "";
  isPointerDown = { left: false, right: false };
  isPointerJustDown = { left: false, right: false };
  attachedProjectiles: Map<[number, number], Projectile> = new Map(); //xOffset,yOffset,Projectile
  force = 0;
  touchedCells: string[] = [];
  shift: boolean = false;
  projectiles = {
    arrows: 100,
  };
  //Events
  onMovement: (socket: Socket) => void = onMovement;
  onPointerDown: (socket: Socket) => void = onPointerDown;
  onPointerMove: (socket: Socket) => void = onPointerMove;
  onWeaponChange: (socket: Socket) => void = onWeaponChange;
  onActionPress: (socket: Socket) => void = onActionPress;
  onReload: (socket: Socket) => void = onReload;
  onInventory: (socket: Socket) => void = onInventory;
  onCustomizeBow: (socket: Socket) => void = onCustomizeBow;

  //Controllers
  changeWeapon: (index: number) => void = changeWeapon;
  updateCursors: (key: Direction, isDown: boolean) => void = updateCursors;
  updatePointerDown: (button: "left" | "right", isDown: boolean) => void =
    updatePointerDown;
  updateAngle: (delta: number) => void = updateAngle;
  action: () => void = action;
  reload: () => void = reload;
  toggleInventory: () => void = inventory;

  constructor(
    socket: Socket,
    game: Game,
    floor: Floor,
    id: string,
    name: string,
    color: number
  ) {
    super(0, 0, PLAYER_SIZE, PLAYER_SIZE, true);
    this.id = id;
    this.game = game;
    this.floor = floor;
    this.socket = socket;
    this.name = name;
    this.color = color;
    this.health = 100;
    this.angle = 0;
    this.inventory = new Inventory(this, 3, 3);
    this.floor.addPlayer(this);

    //Enable events
    this.onMovement(socket);
    this.onPointerDown(socket);
    this.onPointerMove(socket);
    this.onWeaponChange(socket);
    this.onActionPress(socket);
    this.onReload(socket);
    this.onInventory(socket);
    this.onCustomizeBow(socket);
  }

  resetMovementValues() {
    this.maxSpeed = this.initialMaxSpeed;
    this.acceleration = this.initialAcceleration;
    this.deceleration = this.initialDeceleration;
  }

  update(delta: number, counter: number) {
    if (this.state === "in-inventory" || this.state === "in-dialog") return;
    this.wasHit = false;

    if ((!this.didDie && this.health <= 0) || this.state === "falling") {
      setTimeout(() => {
        this.state = "dead";
      }, 1500);
      this.health = 0;
      this.finalSecondsAlive = this.secondsAlive;
      this.secondsAlive = 0;
      this.didDie = true;
    } else if (this.didDie) {
      if (this.carriedItem) {
        this.carriedItem.fall(this);
        this.carriedItem = null;
      }
      return;
    }

    if (this.carriedItem) {
      if (this.isPointerJustDown.left) {
        this.carriedItem.throw(this, this.angle);
      } else {
        this.carriedItem.x = this.x;
        this.carriedItem.y = this.y;
        this.carriedItem.update(delta);
      }
    }

    this.handleFloor(counter);
    this.updateAngle(delta);
    this.handleInput();
    this.applyMovement(delta);

    if (this.velocityX > 0 && this.velocityX < 2) {
      this.velocityX = 0;
    }
    if (this.velocityX < 0 && this.velocityX > -2) {
      this.velocityX = 0;
    }
    if (this.velocityY > 0 && this.velocityY < 2) {
      this.velocityY = 0;
    }
    if (this.velocityY < 0 && this.velocityY > -2) {
      this.velocityY = 0;
    }

    if (this.activeWeapon) {
      this.inventory.updateDurability(this.activeWeapon?.durability?.current);
      this.activeWeapon?.update(delta);
      if (this.activeWeapon?.durability?.current <= 0) {
        this.activeWeapon = null;
        this.inventory.hotkeys[this.inventory.hotkeyIndex] = null;
        this.inventory.hotkeyIndex = -1;
      }
    }

    //Always reverts to false
    this.isPointerJustDown.left = false;
    this.isPointerJustDown.right = false;
  }

  handleInput() {
    // Assuming you have some way to detect input (e.g., key presses)
    const horizontalInput =
      (this.cursors.includes("right") ? 1 : 0) -
      (this.cursors.includes("left") ? 1 : 0);
    const verticalInput =
      (this.cursors.includes("down") ? 1 : 0) -
      (this.cursors.includes("up") ? 1 : 0);

    // Diagonal movement should be equally as fast as horizontal/vertical movement
    const diagonalFactor = Math.sqrt(2) / 2;

    this.velocityX += horizontalInput * this.acceleration * diagonalFactor;
    this.velocityY += verticalInput * this.acceleration * diagonalFactor;
  }

  applyMovement(delta: number) {
    if (this.state === "falling") return;
    // Apply deceleration
    this.velocityX *= Math.pow(this.deceleration, delta);
    this.velocityY *= Math.pow(this.deceleration, delta);

    // Limit speed
    const speed = Math.sqrt(this.velocityX ** 2 + this.velocityY ** 2);
    if (speed > this.maxSpeed) {
      const ratio = this.maxSpeed / speed;
      this.velocityX *= ratio;
      this.velocityY *= ratio;
    }

    let x = this.x + this.velocityX * delta;
    let y = this.y + this.velocityY * delta;

    const direction = getDirection(this.velocityX, this.velocityY);
    const boundingBox = {
      top: y - this.height / 2,
      bottom: y + this.height / 2,
      left: x - this.width / 2,
      right: x + this.width / 2,
    };

    let collideWithCrate = false;
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
              if (obj instanceof Pot) {
                collideWithCrate = true;
                // Limit this.maxSpeed to obj.maxSpeed
                this.maxSpeed = obj.maxSpeed;
                // Adjust velocities proportionally to the new maxSpeed
                const ratio = obj.maxSpeed / this.maxSpeed;
                this.velocityX *= ratio;
                this.velocityY *= ratio;
              }
              if (collidesAt === "top") {
                y = obj.boundingBox.top - this.height / 2;
                if (obj instanceof Pot) obj.applyMovement(delta, "down");
              } else if (collidesAt === "bottom") {
                y = obj.boundingBox.bottom + this.height / 2;
                if (obj instanceof Pot) obj.applyMovement(delta, "up");
              } else if (collidesAt === "left") {
                x = obj.boundingBox.left - this.width / 2;
                if (obj instanceof Pot) obj.applyMovement(delta, "right");
              } else if (collidesAt === "right") {
                x = obj.boundingBox.right + this.width / 2;
                if (obj instanceof Pot) obj.applyMovement(delta, "left");
              }

              this.direction = direction;
            }
          } else {
            if (obj instanceof Hole) {
              if (obj.completelyOverlapsWith(boundingBox)) {
                this.state = "falling";
              }
            } else if (obj instanceof Shooter) {
              if (obj.overlapsWith(boundingBox)) obj.shoot();
            }
          }
        }
      }
    }

    this.x = x;
    this.y = y;
    this.direction = direction;
    this.updateBoundingBox();

    if (!collideWithCrate) this.resetMovementValues();

    this.floor.tracker.track(this);
  }
  handleFloor(counter: number) {
    if (counter % 6 === 0) {
      for (const pos of this.touchedCells) {
        const cell = this.floor.tracker.cells.get(pos);
        if (!cell) continue;
        for (const obj of cell) {
          if (obj instanceof Collider) {
            if (!obj.isObstructing) {
              if (obj.overlapsWith(this.boundingBox)) {
                if (obj instanceof Spikes && obj.state === "on") {
                  this.hurt(5);
                }
              }
            }
          }
        }
      }
    }
  }

  hurt(value: number) {
    this.health -= value;
    this.wasHit = true;
  }
  moveToCell(row: number, col: number) {
    if (!this.game) return;
    this.x = col * CELL_SIZE + CELL_SIZE / 2;
    this.y = row * CELL_SIZE + CELL_SIZE / 2;
    this.floor.tracker.track(this);
  }

  doesCollide(x: number, y: number) {
    return !(
      x < this.x - PLAYER_SIZE / 2 ||
      x > this.x - PLAYER_SIZE / 2 + PLAYER_SIZE ||
      y < this.y - PLAYER_SIZE / 2 ||
      y > this.y - PLAYER_SIZE / 2 + PLAYER_SIZE
    );
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
