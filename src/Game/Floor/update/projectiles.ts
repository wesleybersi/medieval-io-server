import Game from "../../Game";
import Floor from "../Floor";

export function updateProjectiles(this: Floor, delta: number) {
  for (const projectile of this.projectiles) {
    if (!projectile.emit) continue;
    const { id, type, state, x, y, z, angle, velocity } = projectile;
    const emit = () => {
      this.emissionData.projectiles.push({
        id,
        type,
        state,
        x,
        y,
        z,
        angle,
        velocity,
      });
    };
    switch (state) {
      case "Active":
      case "Holding":
        //Active projectile updating and emitting
        projectile.update(delta);
        emit();
        break;

      case "OnGround":
      case "HitWall":
      case "HitTile":
      case "HitTarget":
        //Projectile is emits once and then stops emitting until state changes
        emit();
        projectile.emit = false;
        break;
      case "Inactive":
      case "Destroyed":
        //Projectile emits and is immediately removed
        emit();
        projectile.remove();
        break;
    }
  }
}
