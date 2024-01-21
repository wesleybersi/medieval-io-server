import { Player } from "../Player";

export function updatePointerDown(
  this: Player,
  button: "left" | "right",
  isDown: boolean
) {
  this.isPointerDown[button] = isDown;
  this.isPointerJustDown[button] = isDown;
}
