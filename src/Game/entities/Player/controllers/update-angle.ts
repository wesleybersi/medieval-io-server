import { Player } from "../Player";

export function updateAngle(this: Player, angle: number) {
  if (this.didDie) return;
  this.angle = angle;
}
