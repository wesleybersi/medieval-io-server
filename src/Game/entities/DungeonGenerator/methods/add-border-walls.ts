import { DungeonGenerator } from "./../DungeonGenerator";
export function addBorderWalls(this: DungeonGenerator, amount: number) {
  const expand = () => {
    this.floor.objectMatrix.unshift(
      Array.from({ length: this.floor.cols }).map(() => "wall")
    );
    this.floor.objectMatrix.push(
      Array.from({ length: this.floor.cols }).map(() => "wall")
    );
    this.floor.objectMatrix.forEach((row) => row.unshift("wall"));
    this.floor.objectMatrix.forEach((row) => row.push("wall"));

    this.floor.cols += 2;
    this.floor.rows += 2;
  };

  for (let i = 0; i < amount; i++) expand();
}
