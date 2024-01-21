import Floor from "../Floor";

export function updateTiles(this: Floor) {
  for (const [, tile] of this.tiles) {
    if (!tile.didUpdate) continue;
    const { id, type, x, y, hp } = tile;
    this.emissionData.tiles.push({
      id,
      type,
      x,
      y,
      hp: hp === Infinity ? 1_000_000 : hp,
    });
    tile.didUpdate = false;
    if (tile.hp <= 0) {
      console.log("Removing tile");
      tile.remove();
    }
  }
}
