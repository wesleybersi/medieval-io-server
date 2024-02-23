import { Room } from "../../../Floor/entities/Room/Room";
import { DungeonGenerator } from "../DungeonGenerator";

export function defineRooms(this: DungeonGenerator) {
  const exploreRoom = (
    row: number,
    col: number,
    visited: Set<string>,
    currentRoom: Set<string>
  ): void => {
    if (
      !this.floor.isValidCell(row, col) ||
      visited.has(`${row}-${col}`) ||
      this.floor.objectMatrix[row][col].includes("wall") ||
      this.floor.spriteGridMatrix.get(`${row},${col}`)?.includes("door")
    ) {
      return;
    }

    visited.add(`${row}-${col}`);
    currentRoom.add(`${row}-${col}`);

    exploreRoom(row + 1, col, visited, currentRoom);
    exploreRoom(row - 1, col, visited, currentRoom);
    exploreRoom(row, col + 1, visited, currentRoom);
    exploreRoom(row, col - 1, visited, currentRoom);
  };

  const findRooms = (): Set<string>[] => {
    const visited: Set<string> = new Set();
    const rooms: Set<string>[] = [];

    for (let row = 0; row < this.floor.objectMatrix.length; row++) {
      for (let col = 0; col < this.floor.objectMatrix[row].length; col++) {
        if (
          this.floor.objectMatrix[row][col].includes("floor") &&
          !visited.has(`${row}-${col}`)
        ) {
          const currentRoom: Set<string> = new Set();
          exploreRoom(row, col, visited, currentRoom);
          if (currentRoom.size > 0) {
            rooms.push(currentRoom);
          }
        }
      }
    }

    return rooms;
  };

  const rooms = findRooms();
  for (const room of rooms) {
    const cells = [];
    for (const cell of room) {
      const [row, col] = cell.split("-");
      cells.push({
        row: Number(row),
        col: Number(col),
        type: this.floor.objectMatrix[Number(row)][Number(col)],
      });
    }
    this.floor.rooms.add(new Room(this.floor, cells));
  }
}
