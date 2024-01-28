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

import { rectanglesAreColliding } from "../../../utilities";
import { Spikes } from "../../Floor/entities/Spikes/Spikes";
import { Pot } from "../../Floor/entities/Pot/Pot";
import { Chest } from "../../Floor/entities/Chest/Chest";
import { Door } from "../../Floor/entities/Door/Door";
import { Hole } from "../../Floor/entities/Hole/Hole";
import onReload from "./events/on-reload";
import { reload } from "./controllers/reload";
import {
  getRandomWeaponTier,
  getRandomWeaponType,
} from "../../Floor/entities/Pickup/random-weapon";
import { Shooter } from "../../Floor/entities/Shooter/Shooter";
import { inventory } from "./controllers/inventory";
import onInventory from "./events/on-inventory";
import { InventoryItem } from "./entities/InventoryItem";
import { createNewWeapon } from "./entities/Weapon/create-weapon";

export interface Dialog {
  name: string;
  pages: { text: string }[];
}

export class Player {
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
  inventory: InventoryItem[] = [];
  didDie: boolean = false;
  wasHit: boolean = false;
  id: string;
  name: string;
  health: number;
  color: number;
  y: number;
  x: number;
  xSpeed = 0;
  ySpeed = 0;
  maxSpeed = 130;
  acceleration = 32;
  deceleration = 0.0001;

  rotationSpeed = 375;
  secondsAlive: number = 0;
  finalSecondsAlive: number = 0;
  gold: number = 0;
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
  dialog?: { name: string; text: string[] } = {
    name: "???",
    text: [
      "Unwelcome intruder, behold the wretched abyss in which you find yourself. This forsaken ground hungers for souls, and your fate is but a pawn in its malevolent game.",
      "In the shadows, unseen companions, both ally and foe, tread alongside you, as you hear the distant cries of other cursed wanderers, their destinies intertwined with yours.",
    ],
  };

  inputAngle = { target: 0, current: 0 };
  width = PLAYER_SIZE;
  height = PLAYER_SIZE;
  radius = PLAYER_SIZE;
  carriedItem: Pot | null = null;
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
    arrows: 10,
  };
  speedFactor = 1;
  // arrowsAttached = new Set<Arrow>();

  //Events
  onMovement: (socket: Socket) => void = onMovement;
  onPointerDown: (socket: Socket) => void = onPointerDown;
  onPointerMove: (socket: Socket) => void = onPointerMove;
  onWeaponChange: (socket: Socket) => void = onWeaponChange;
  onActionPress: (socket: Socket) => void = onActionPress;
  onReload: (socket: Socket) => void = onReload;
  onInventory: (socket: Socket) => void = onInventory;

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
    this.weaponIndex = -1; // -1 = no weapon selected
    this.angle = 0;

    // const type = getRandomWeaponType();

    // this.weaponry = [
    //   createNewWeapon(this, {
    //     type: type,
    //     tier: getRandomWeaponTier(type),
    //   }),
    // ];

    // this.weaponry = [createNewWeapon(this, { type: "Sword", tier: "Sword" })];
    this.weaponry = [];

    this.floor.addPlayer(this);

    //Enable events
    this.onMovement(socket);
    this.onPointerDown(socket);
    this.onPointerMove(socket);
    this.onWeaponChange(socket);
    this.onActionPress(socket);
    this.onReload(socket);
    this.onInventory(socket);
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
        this.carriedItem.update(this.x, this.y - CELL_SIZE * 0.75);
      }
    }

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

    this.updateAngle(delta);
    this.handleInput();
    this.applyMovement(delta);

    if (this.xSpeed > 0 && this.xSpeed < 2) {
      this.xSpeed = 0;
    }
    if (this.xSpeed < 0 && this.xSpeed > -2) {
      this.xSpeed = 0;
    }
    if (this.ySpeed > 0 && this.ySpeed < 2) {
      this.ySpeed = 0;
    }
    if (this.ySpeed < 0 && this.ySpeed > -2) {
      this.ySpeed = 0;
    }

    if (this.weaponIndex >= 0) {
      this.weaponry[this.weaponIndex]?.update(delta);
      if (this.weaponry[this.weaponIndex]?.durability.current <= 0) {
        this.weaponry.splice(this.weaponIndex, 1);
        this.weaponIndex = -1;
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

    this.xSpeed += horizontalInput * this.acceleration * diagonalFactor;
    this.ySpeed += verticalInput * this.acceleration * diagonalFactor;
  }

  applyMovement(delta: number) {
    if (this.state === "falling") return;
    // Apply deceleration
    this.xSpeed *= Math.pow(this.deceleration, delta);
    this.ySpeed *= Math.pow(this.deceleration, delta);

    // Limit speed
    const speed = Math.sqrt(this.xSpeed ** 2 + this.ySpeed ** 2);
    if (speed > this.maxSpeed) {
      const ratio = this.maxSpeed / speed;
      this.xSpeed *= ratio;
      this.ySpeed *= ratio;
    }

    let x = this.x + this.xSpeed * delta;
    let y = this.y + this.ySpeed * delta;

    const direction = getDirection(this.xSpeed, this.ySpeed);
    const boundingBox = {
      top: y - this.height / 2,
      bottom: y + this.height / 2,
      left: x - this.width / 2,
      right: x + this.width / 2,
      centerX: x,
      centerY: y,
    };
    for (const pos of this.touchedCells) {
      const cell = this.floor.tracker.get(pos);
      if (!cell) continue;
      for (const obj of cell) {
        if (
          obj instanceof Wall ||
          obj instanceof Pot ||
          obj instanceof Chest ||
          (obj instanceof Door && !obj.isOpen)
        ) {
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
        } else if (obj instanceof Hole) {
          if (
            obj.isRectCompletelyOverlapping(
              this.x,
              this.y,
              this.width,
              this.height
            )
          ) {
            this.state = "falling";
          }
        } else if (obj instanceof Shooter) {
          if (obj.isRectOverlapping(this.x, this.y, this.width, this.height)) {
            obj.shoot();
          }
        }
      }
    }

    this.x = x;
    this.y = y;
    this.direction = direction;
    this.boundingBox = boundingBox;

    this.floor.trackPosition(this, this.width + 8, this.height + 8);
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
