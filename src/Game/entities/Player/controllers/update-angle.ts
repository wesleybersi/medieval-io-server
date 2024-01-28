import { Player } from "../Player";

export function updateAngle(this: Player, delta: number) {
  if (this.didDie) return;
  // Calculate the angular distance between current angle and target angle
  const adjustAngle = (currentAngle: number, targetAngle: number) => {
    // Calculate the angular distance in the range [-180, 180]
    let angularDistance = ((targetAngle - currentAngle + 180) % 360) - 180;

    // Adjust the angle based on the shortest path
    if (angularDistance > 180) {
      currentAngle +=
        angularDistance - 360 < delta * this.rotationSpeed
          ? angularDistance - 360
          : delta * this.rotationSpeed;
    } else if (angularDistance < -180) {
      currentAngle +=
        angularDistance + 360 > -delta * this.rotationSpeed
          ? angularDistance + 360
          : -delta * this.rotationSpeed;
    } else {
      currentAngle +=
        Math.abs(angularDistance) < delta * this.rotationSpeed
          ? angularDistance
          : angularDistance > 0
          ? delta * this.rotationSpeed
          : -delta * this.rotationSpeed;
    }

    // Ensure the angle stays within [-360, 360)
    if (currentAngle < -180) {
      currentAngle += 360;
    }
    if (currentAngle > 180) {
      currentAngle -= 360;
    }

    return currentAngle;
  };

  // Usage example:
  this.angle = adjustAngle(this.angle, this.inputAngle.target);

  // this.angle = this.inputAngle.target;

  console.log(this.angle);
  // Update function
}
