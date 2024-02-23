import { Pot } from "../entities/Pot/Pot";
import { Projectile } from "../entities/Projectile/Projectile";
import Floor from "../Floor";

export function update(this: Floor, delta: number, counter: number) {
  this.emissionData = {
    players: [],
    updaters: [],
    pickups: [],
    tracker: [],
  };

  this.updatePlayers(delta, counter);

  for (const updater of this.updaters) {
    updater.update(delta);
  }

  for (const emission of this.emissions) {
    this.emissionData.updaters.push(emission);
    if (emission.id) {
      this.lastEmissions.set(emission.id, emission);
    }
  }

  this.emissions = [];

  this.tracker.update();
}
