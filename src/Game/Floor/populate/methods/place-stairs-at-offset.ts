import { Stairs } from "../../entities/Stairs/Stairs";
import Floor from "../../Floor";

export function placeStairsAtOffset(this: Floor) {
  //Method that places stairs at earlier defined floor offset
  if (this.index === this.game.floors.length - 1) return;
  const nextFloor = this.game.floors[this.index + 1];

  const maxAttempts = 25;
  let attempts = 0;
  const getNewConnection = () => {
    if (attempts > maxAttempts) {
      return;
    }
    const down = this.getRandomEmptyCell();

    const linkedPos = {
      row: down.row - this.nextFloorOffset.rows,
      col: down.col - this.nextFloorOffset.cols,
    };

    if (
      nextFloor.objectMatrix[linkedPos.row] &&
      nextFloor.objectMatrix[linkedPos.row][linkedPos.col] &&
      nextFloor.objectMatrix[linkedPos.row][linkedPos.col].includes("floor")
    ) {
      return { down, up: linkedPos };
    } else {
      attempts++;
      getNewConnection();
    }
  };

  const positions = getNewConnection();
  if (!positions) return;

  const stairsDown = new Stairs(
    this,
    "down",
    positions.down.row,
    positions.down.col
  );
  const stairsUp = new Stairs(
    nextFloor,
    "up",
    positions.up.row,
    positions.up.col
  );

  stairsDown.link(stairsUp);
  stairsUp.link(stairsDown);
}
