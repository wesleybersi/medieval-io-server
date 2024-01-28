import { Crossbow } from "../../entities/Player/entities/Weapon/weapons/Crossbow";
import { Spear } from "../../entities/Player/entities/Weapon/weapons/Spear";
import { Sword } from "../../entities/Player/entities/Weapon/weapons/Sword";
import Floor from "../Floor";

export function updatePlayers(this: Floor, delta: number, counter: number) {
  for (const [, player] of this.players) {
    player.update(delta, counter);
    const {
      id,
      color,
      state,
      x,
      y,
      angle,
      weaponry,
      weaponIndex,
      didDie,
      wasHit,
    } = player;
    const activeWeapon = weaponry[weaponIndex];
    const playerData = {
      id,
      color,
      state,
      x,
      y,
      angle,
      weapon: {
        type: activeWeapon?.type,
        tier: activeWeapon?.tier,
        isLoaded: true,
        isAttack: activeWeapon?.isAttack,
        force: 0,
        position: "right",
      },
      isDead: didDie ? true : undefined,
      wasHit: wasHit ? true : undefined,
    };
    if (activeWeapon instanceof Crossbow) {
      playerData.weapon.isLoaded = activeWeapon.loadAmount.current > 0;
    }
    if (activeWeapon instanceof Spear) {
      playerData.weapon.force = activeWeapon.holdForce.current; // out of 1
    }
    if (activeWeapon instanceof Sword) {
      playerData.weapon.position = activeWeapon.position;
      console.log("POSITION");
    }

    this.emissionData.players.push(playerData);
  }
}
