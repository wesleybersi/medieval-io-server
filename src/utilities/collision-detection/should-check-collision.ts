interface BoundingBox {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export function shouldCheckCollision(
  player: BoundingBox,
  tile: BoundingBox,
  xSpeed: number,
  ySpeed: number
): boolean {
  const grace = 0;
  // Check vertical overlap
  if (
    (player.bottom < tile.top + grace && ySpeed < 0) ||
    (player.top > tile.bottom - grace && ySpeed > 0)
  ) {
    return false; // No vertical overlap
  }

  // Check horizontal overlap
  if (
    (player.right < tile.left + grace && xSpeed < 0) ||
    (player.left > tile.right - grace && xSpeed > 0)
  ) {
    return false; // No horizontal overlap
  }

  // Check diagonal overlap
  if (
    (player.bottom < tile.top + grace &&
      ySpeed < 0 &&
      player.right < tile.left + grace &&
      xSpeed < 0) ||
    (player.bottom < tile.top + grace &&
      ySpeed < 0 &&
      player.left > tile.right - grace &&
      xSpeed > 0) ||
    (player.top > tile.bottom - grace &&
      ySpeed > 0 &&
      player.right < tile.left + grace &&
      xSpeed < 0) ||
    (player.top > tile.bottom - grace &&
      ySpeed > 0 &&
      player.left > tile.right - grace &&
      xSpeed > 0)
  ) {
    console.log("NO DIAGONAL OVERLAP");
    return false; // No diagonal overlap
  }

  // There is overlap in both horizontal and vertical directions, so check for collision
  return true;
}
