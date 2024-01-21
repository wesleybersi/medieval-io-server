import { Crossbow } from "../../entities/Weapon/weapons/Crossbow";
import Floor from "../Floor";

export function updatePlayers(this: Floor, delta: number, counter: number) {
  for (const [, player] of this.players) {
    player.update(delta, counter);
    const { id, color, x, y, angle, weaponry, weaponIndex, didDie, wasHit } =
      player;
    const activeWeapon = weaponry[weaponIndex];
    const playerData = {
      id,
      color,
      x,
      y,
      angle,
      weapon: {
        type: activeWeapon?.type,
        tier: activeWeapon.tier,
        isLoaded: true,
      },
      isDead: didDie ? true : undefined,
      wasHit: wasHit ? true : undefined,
    };
    if (activeWeapon instanceof Crossbow) {
      playerData.weapon.isLoaded = activeWeapon.isLoaded;
    }

    this.emissionData.players.push(playerData);
  }
}
