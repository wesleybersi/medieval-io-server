import { Direction } from "../../../../types";
import { Player } from "../Player";

export function updateCursors(this: Player, key: Direction, isDown: boolean) {
  if (this.didDie) return;
  const { cursors } = this;
  if (isDown) {
    if (!cursors.includes(key)) cursors.unshift(key);
  } else {
    this.cursors = cursors.filter((cursorKey) => cursorKey !== key);
  }
}
