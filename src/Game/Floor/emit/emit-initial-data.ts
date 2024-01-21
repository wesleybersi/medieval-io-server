import Floor, { MatrixCellType } from "../Floor";
import { WeaponType } from "../../entities/Weapon/types";
import { WeaponPickup } from "../../entities/Pickup/Pickup";
import { Socket } from "socket.io";

export function emitInitialData(this: Floor, socket: Socket) {
  const players = [];
  for (const [, player] of this.players) {
    players.push({
      id: player.id,
      name: player.name,
      color: player.color,
      x: player.x,
      y: player.y,
      weapon: {
        type: player.weaponry[player.weaponIndex].type,
        tier: player.weaponry[player.weaponIndex].tier,
      },
      angle: player.angle,
      height: player.height,
      width: player.width,
    });
  }
  const tiles = [];
  for (const [, tile] of this.tiles) {
    const { id, x, y, type } = tile;
    tiles.push({ id, x, y, type });
  }

  const pickups = [];
  for (const [, pickup] of this.pickups) {
    if (pickup instanceof WeaponPickup) {
      const { row, col, weaponType } = pickup;
      pickups.push({
        type: weaponType,
        row,
        col,
      });
    }
  }

  const initialData: InitialFloorData = {
    id: socket.id,
    players,
    tiles,
    pickups,
    matrix: this.matrix,
    size: {
      rows: this.rows,
      cols: this.cols,
    },
  };
  socket.emit("Initial Floor Data", initialData);
}

export interface InitialFloorData {
  id: string;
  size: {
    rows: number;
    cols: number;
  };
  players: {
    id: string;
    name: string;
    color: number;
    angle: number;
    x: number;
    y: number;
    height: number;
    width: number;
  }[];
  matrix: MatrixCellType[][];
  tiles: {
    id: number;
    type: "Crate";
    x: number;
    y: number;
  }[];
  pickups: {
    type: WeaponType;
    row: number;
    col: number;
  }[];
}
