import { Socket } from "socket.io";
import { Player } from "../Player";
import { Bow } from "../entities/Weapon/weapons/Bow";

export function onCustomizeBow(this: Player, socket: Socket) {
  socket.on(
    "Customize Bow",
    (title: "Draw Speed" | "Velocity" | "Accuracy", index: number) => {
      if (index > 4 || index < 0) return;
      const customization = { ...this.bowCustomization };

      switch (title) {
        case "Draw Speed":
          customization.drawSpeed = index;
          break;
        case "Velocity":
          customization.velocity = index;
          break;
        case "Accuracy":
          customization.accuracy = index;
          break;
      }

      const totalSlots = Object.values(customization).reduce(
        (prev, current) => current + prev,
        0
      );
      if (totalSlots > 6) return;

      this.bowCustomization = customization;

      if (this.activeWeapon) {
        if (this.activeWeapon instanceof Bow) {
          const maxValue = 4;

          let drawSpeedMultiplier = this.bowCustomization.drawSpeed / maxValue;
          let velocityMultiplier = this.bowCustomization.velocity / maxValue;
          let accuracyMultiplier = this.bowCustomization.accuracy / maxValue;

          drawSpeedMultiplier = 0.3 + drawSpeedMultiplier * 0.7;
          velocityMultiplier = 0.5 + velocityMultiplier * 0.5;
          accuracyMultiplier = 0.5 + accuracyMultiplier * 0.5;

          const topSpeed = 4500;
          this.activeWeapon.maxSpeed = topSpeed * velocityMultiplier;

          const fastestDraw = 1.3;
          this.activeWeapon.force.multiplier =
            fastestDraw * drawSpeedMultiplier;
          console.log(this.activeWeapon.force.multiplier);

          this.activeWeapon.spread =
            (1 - accuracyMultiplier) * this.activeWeapon.maxSpread;
        }
      }
    }
  );
}
