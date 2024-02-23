import { Player } from "./entities/Player/Player";
import Floor from "./Floor/Floor";
import { io } from "../server";
import { MAX_ITERATIONS, MIN_ITERATIONS, UPDATE_INTERVAL } from "../constants";

import { GameIntervalData } from "./types";

import { Socket } from "socket.io";
import { JoinGameRequest, onJoinGame } from "./events/on-player-joins";
import { addPlayer } from "./controllers/add-player";
import { removePlayer } from "./controllers/remove-player";
import { randomNum } from "../utilities";

import { populateItemMap } from "./data/populate-item-map";
import { InventoryItem } from "./data/types";

interface GameConfig {
  name: string;
  type: "Free For All";
  timer: number;
  instances: {
    amount: number;
  };
}

export default class Game {
  config: GameConfig;
  floors: Floor[] = [];
  players: Map<string, Player>;
  hasLoaded = false;
  timeRemaining: number;
  intervalID?: NodeJS.Timeout;
  frameCount: number = 0;
  itemMap = new Map<string, InventoryItem>();

  globalTimers: {
    [key: number]: number;
  } = {
    1: 0, //Interval in seconds : Time Passed
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
  };

  //Import Data
  populateItemMap: () => void = populateItemMap;

  //Socket events
  onJoinGame: (socket: Socket) => void = onJoinGame;

  //Controllers
  addPlayer: (socket: Socket, config: JoinGameRequest) => void = addPlayer;
  removePlayer: (socket: Socket) => void = removePlayer;

  constructor(config: GameConfig) {
    console.log(`Setting up new ${config.type} game.`);
    this.config = config;
    this.players = new Map();
    this.populateItemMap();

    const { amount } = config.instances;

    for (let i = 0; i < amount; i++) {
      this.floors.push(new Floor(this, i));
    }

    //Populate floors
    for (const floor of this.floors) {
      floor.populate({
        iterations: Math.max(randomNum(MAX_ITERATIONS), MIN_ITERATIONS),
        roomChance: Math.max(randomNum(75), 32),
        roomDepth: randomNum(3),
      });
    }

    //Link floors with stairs
    for (const floor of this.floors) {
      floor.placeStairsToNextLevel();

      //TODO based on size
      // const additionalStairs = randomNum(
      //   Math.floor((floor.rows * floor.cols) / 2000)
      // );
      // console.log(additionalStairs);
      // for (let i = 0; i < additionalStairs; i++) {
      //   if (oneIn(2)) floor.placeStairsAtOffset();
      // }
    }

    this.timeRemaining = config.timer * 60;
    this.start();
  }
  start() {
    let lastUpdateTime = 0;

    const currentFrame = () => {
      const currentTime = Date.now();
      const delta = (currentTime - lastUpdateTime) / 1000; // Convert to seconds
      lastUpdateTime = currentTime;

      this.frameCount++;
      if (this.frameCount > 1_000_000) {
        this.frameCount = 0;
      }

      //Update global timers
      for (const [timer, timePassed] of Object.entries(this.globalTimers)) {
        const interval = parseInt(timer);
        this.globalTimers[interval] += delta;

        if (timePassed >= interval) {
          //Add all objects tied to global timers within floor to updater method within floor
          for (const floor of this.floors) {
            if (floor.players.size === 0) continue;
            for (const updater of floor.globalTimedUpdaters[interval]) {
              floor.updaters.add(updater);
            }
          }

          if (interval === 1) {
            this.timeRemaining--;
            this.emitIntervalData();
          }
          //Reset timer
          this.globalTimers[interval] = 0;
        }
      }

      //Update all floors
      for (const floor of this.floors) {
        if (floor.players.size === 0) continue;
        floor.update(delta, this.frameCount);
        floor.emit();
      }
    };

    setInterval(currentFrame, UPDATE_INTERVAL);
  }

  emitIntervalData() {
    const intervalData: GameIntervalData = {
      timeRemaining: this.timeRemaining,
      leaderboard: [],
    };

    const data = [];
    for (const [, player] of this.players) {
      if (!player.didDie) {
        player.secondsAlive++;
      }
      data.push({
        name: player.name,
        color: player.color,
        floor: player.floor.index,
        score: 0,
        secondsAlive: player.secondsAlive,
      });
    }
    intervalData.leaderboard = data
      .sort((a, b) => b.secondsAlive - a.secondsAlive)
      .slice(0, 10);

    for (const [, player] of this.players) {
      io.to(player.socket.id).emit("Game Interval Update", intervalData);
    }
  }

  stop() {
    if (this.intervalID) {
      clearInterval(this.intervalID);
      for (const [, player] of this.players) {
        io.to(player.id).emit("Game Over");
      }
    }
  }
  emitLog(log: string) {
    for (const [, player] of this.players) {
      io.to(player.id).emit("Server Log", log);
    }
  }
}
