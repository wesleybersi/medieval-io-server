import Game from "../../../../Game";
import { Player } from "../../Player";
import { createNewWeapon } from "../Weapon/create-weapon";
import { Bow } from "../Weapon/weapons/Bow";
import { Crossbow } from "../Weapon/weapons/Crossbow";

import { InventoryItem } from "../../../../data/types";
import { useItem } from "./methods/use-item";
import { getRandomInt } from "../../../../../utilities";
import { bows, crossbows } from "../../../../data/weapons";

export class Inventory {
  player: Player;
  game: Game;
  rows: number;
  cols: number;
  itemSlots: (InventoryItem | null)[][];
  hotkeys: (InventoryItem | null)[] = [
    // { type: "weapon", key: bows[getRandomInt(bows.length)], durability: 100 },
    { type: "weapon", key: "bow-normal", durability: 100 },
    { type: "weapon", key: "spear-wooden", durability: 100 },
    { type: "weapon", key: "sword-two-handed", durability: 100 },
    { type: "weapon", key: "boomerang", durability: 100 },
    null,
    null,
  ];
  hotkeyIndex: number = -1;
  selectedSlot: { row: number; col: number } | null = null;
  useItem: (row: number, col: number) => void = useItem;
  constructor(player: Player, rows: number, cols: number) {
    this.player = player;
    this.game = player.game;
    this.rows = rows;
    this.cols = cols;
    this.itemSlots = new Array(rows);
    for (let i = 0; i < rows; i++) {
      this.itemSlots[i] = new Array(cols).fill(null);
    }
    const ARROW_AMOUNT = 21;
    for (let i = 0; i < ARROW_AMOUNT; i++) this.pushItem("arrow");
  }

  getItem(row: number, col: number): InventoryItem | null {
    return this.itemSlots[row][col];
  }

  setItem(row: number, col: number, key: string): void {
    const item = this.game.itemMap.get(key);
    if (item) this.itemSlots[row][col] = item;
  }
  useHotkey() {
    const item = this.hotkeys[this.hotkeyIndex];
    if (!item) return;
  }
  moveItem(row: number, col: number): void {
    if (!this.selectedSlot) return;

    const fromSlot =
      this.itemSlots[this.selectedSlot.row][this.selectedSlot.col];
    const toSlot = this.itemSlots[row][col];

    if (fromSlot !== null && toSlot === null) {
      this.itemSlots[row][col] = fromSlot;
      this.itemSlots[this.selectedSlot.row][this.selectedSlot.col] = null;
    } else if (fromSlot !== null && toSlot !== null) {
      if (
        fromSlot.key === toSlot.key &&
        fromSlot.stacks &&
        toSlot.stacks &&
        fromSlot.amount &&
        toSlot.amount
      ) {
        if (toSlot.amount + fromSlot.amount <= fromSlot.stacks) {
          toSlot.amount += fromSlot.amount;
          this.itemSlots[this.selectedSlot.row][this.selectedSlot.col] = null;
        }
      } else {
        this.itemSlots[row][col] = fromSlot;
        this.itemSlots[this.selectedSlot.row][this.selectedSlot.col] = toSlot;
      }
    }

    this.selectedSlot = { row, col };
  }

  pushItem(key: string): void {
    const item = this.game.itemMap.get(key);
    if (!item) return;
    if (item.stacks) {
      //First looks for an item that hasn't been filled yet
      const stackTarget = this.itemSlots.flat().find((slot) => {
        if (
          slot &&
          slot?.key === item.key &&
          slot.amount !== undefined &&
          slot.stacks !== undefined &&
          slot.amount < slot.stacks
        )
          return slot;
      });

      if (stackTarget && stackTarget.amount) {
        stackTarget.amount++;
        return;
      }
    }

    for (let y = 0; y < this.itemSlots.length; y++) {
      const row = this.itemSlots[y];
      for (let x = 0; x < row.length; x++) {
        const slot = row[x];
        if (!slot) {
          this.itemSlots[y][x] = { ...item };
          //Empty slot gets filled with a copy of the item
          return;
        }
      }
    }
    console.log("Inventory full");
  }
  selectItem(row: number, col: number) {
    if (
      this.selectedSlot &&
      this.selectedSlot.row === row &&
      this.selectedSlot.col === col
    ) {
      this.selectedSlot = null;
      return;
    }
    this.selectedSlot = { row, col };
  }

  selectHotKey(index: number) {
    //If hotkey is empty, return
    if (!this.hotkeys[index - 1]) return;

    if (index - 1 === this.hotkeyIndex) {
      this.deselectHotKey();
      return;
    }
    this.deselectHotKey();
    //If hotkey is selected, deselect hotkey and unload weapons
    if (this.hotkeyIndex !== index - 1) {
      //If hotkey has item and is not selected, select item
      this.hotkeyIndex = index - 1;
      const item = this.hotkeys[this.hotkeyIndex];
      if (!item) {
        this.hotkeyIndex = -1;
        return;
      }
      if (item.type === "weapon") {
        //If item is weapon, create it
        this.player.activeWeapon = createNewWeapon(
          this.player,
          item.key,
          item.durability ?? 100
        );
      }
    }
  }
  deselectHotKey() {
    if (this.player.activeWeapon instanceof Crossbow) {
      this.player.activeWeapon.unload();
    } else if (this.player.activeWeapon instanceof Bow) {
      if (this.player.activeWeapon.heldProjectile) {
        this.player.activeWeapon.heldProjectile.state = "removed";
        this.player.activeWeapon.heldProjectile = null;
        // this.player.projectiles.arrows++;
        //TODO
      }
    }
    const key = this.hotkeys[this.hotkeyIndex];
    if (key && this.player.activeWeapon) {
      key.durability = this.player.activeWeapon?.durability.current;
    }
    this.hotkeyIndex = -1;
    this.player.activeWeapon = null;
    return;
  }
  updateDurability(durability: number) {
    const keyItem = this.hotkeys[this.hotkeyIndex];
    if (keyItem) {
      keyItem.durability = durability;
    }
  }
  newItemToHotKey(key: string, index: number): void {
    const item = this.game.itemMap.get(key);
    if (!item) return;
    this.hotkeys[index - 1] = item;
    this.hotkeyIndex = index - 1;
    if (item.type === "weapon") {
      //If item is weapon, create it
      this.player.activeWeapon = createNewWeapon(
        this.player,
        item.key,
        item.durability ?? 100
      );
    }
  }
}
