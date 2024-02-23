import Game from "../Game";
import { allItems } from "./items";
import { allWeapons } from "./weapons";

export function populateItemMap(this: Game) {
  for (const weapon of allWeapons) {
    this.itemMap.set(weapon.key, weapon);
  }

  for (const item of allItems) {
    this.itemMap.set(item.key, item);
  }
}
