import Floor from "../Floor";

export function updateTracker(this: Floor, delta: number) {
  for (const [key, set] of this.tracker) {
    if (set.size === 0) {
      this.tracker.delete(key);
    } else {
      if (this.game.emitTracker) {
        this.emissionData.tracker.push({
          key,
          amount: set.size,
        });
      }
    }
  }
}
