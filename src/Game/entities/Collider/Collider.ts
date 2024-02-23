export interface BoundingBox {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export class Collider {
  x: number;
  y: number;
  width: number;
  height: number;
  boundingBox!: BoundingBox;
  isObstructing: boolean;
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    obstructs: boolean
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isObstructing = obstructs;
    this.updateBoundingBox();
  }
  updateBoundingBox() {
    this.boundingBox = {
      top: this.y - this.height / 2,
      left: this.x - this.width / 2,
      right: this.x + this.width / 2,
      bottom: this.y + this.height / 2,
    };
  }
  overlapsWith(boundingBox: BoundingBox): boolean {
    return (
      this.boundingBox.left < boundingBox.right &&
      this.boundingBox.right > boundingBox.left &&
      this.boundingBox.top < boundingBox.bottom &&
      this.boundingBox.bottom > boundingBox.top
    );
  }
  completelyOverlapsWith(boundingBox: BoundingBox): boolean {
    return (
      this.boundingBox.left <= boundingBox.left &&
      this.boundingBox.right >= boundingBox.right &&
      this.boundingBox.top <= boundingBox.top &&
      this.boundingBox.bottom >= boundingBox.bottom
    );
  }
  getCollisionSide(
    boundingBox: BoundingBox,
    surroundings?: {
      top: boolean;
      bottom: boolean;
      right: boolean;
      left: boolean;
    }
  ): "top" | "bottom" | "left" | "right" | null {
    if (
      boundingBox.bottom < this.boundingBox.top ||
      boundingBox.top > this.boundingBox.bottom ||
      boundingBox.right < this.boundingBox.left ||
      boundingBox.left > this.boundingBox.right
    ) {
      return null;
    }

    const topCollision = Math.abs(boundingBox.bottom - this.boundingBox.top);
    const bottomCollision = Math.abs(boundingBox.top - this.boundingBox.bottom);
    const leftCollision = Math.abs(boundingBox.right - this.boundingBox.left);
    const rightCollision = Math.abs(boundingBox.left - this.boundingBox.right);

    // If no adjacentWalls conditions are met, use the original logic
    const minCollision = Math.min(
      topCollision,
      bottomCollision,
      leftCollision,
      rightCollision
    );

    if (surroundings) {
      if (surroundings.top) {
        if (minCollision === topCollision)
          if (boundingBox.right > this.boundingBox.right) {
            return "right";
          } else {
            return "left";
          }
      }

      if (surroundings.bottom) {
        if (minCollision === bottomCollision)
          if (boundingBox.right > this.boundingBox.right) {
            return "right";
          } else {
            return "left";
          }
      }

      if (surroundings.left) {
        if (minCollision === leftCollision)
          if (boundingBox.bottom > this.boundingBox.bottom) {
            return "bottom";
          } else {
            return "top";
          }
      }
      if (surroundings.right) {
        if (minCollision === rightCollision)
          if (boundingBox.bottom > this.boundingBox.bottom) {
            return "bottom";
          } else {
            return "top";
          }
      }
    }

    if (minCollision === topCollision) {
      return "top";
    } else if (minCollision === bottomCollision) {
      return "bottom";
    } else if (minCollision === leftCollision) {
      return "left";
    } else {
      return "right";
    }
  }

  angleBetweenVectors(vector: Vector2): number {
    const deltaX = vector.x - this.x;
    const deltaY = vector.y - this.y;

    // Use Math.atan2 to calculate the angle
    const angleRadians = Math.atan2(deltaY, deltaX);

    // Convert radians to degrees
    const angleDegrees = (angleRadians * 180) / Math.PI;

    return angleDegrees;
  }
}

export interface Vector2 {
  x: number;
  y: number;
}
