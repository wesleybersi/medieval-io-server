import Floor, { MatrixCellType } from "../../Floor/Floor";
import { Player } from "../Player/Player";

interface StairConnection {
  floor: Floor;
  row: number;
  col: number;
  direction: "up" | "down";
}

export class Stairs {
  a: StairConnection;
  b: StairConnection;
  constructor(a: StairConnection, b: StairConnection) {
    this.a = a;
    this.b = b;

    this.a.floor.stairsDown.push(this);
    this.b.floor.stairsUp.push(this);

    this.a.floor.objects.set(`${a.row},${a.col}`, this);

    this.a.floor.matrix[a.row][a.col] = "stairs-down" as MatrixCellType;

    this.a.floor.addToTrackerCell(this);
    this.b.floor.addToTrackerCell(this);
  }
  enter(player: Player) {
    const target = player.floor === this.a.floor ? this.b : this.a;

    player.floor.removePlayer(player);
    target.floor.addPlayer(player, { row: target.row, col: target.col });
  }
}
