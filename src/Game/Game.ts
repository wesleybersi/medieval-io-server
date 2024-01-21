import { Player } from "./entities/Player/Player";
import Floor from "./Floor/Floor";
import { io } from "../server";
import { UPDATE_INTERVAL } from "../constants";

import { GameIntervalData } from "./types";

import { Socket } from "socket.io";
import { JoinGameRequest, onJoinGame } from "./events/on-player-joins";
import { addPlayer } from "./controllers/add-player";
import { removePlayer } from "./controllers/remove-player";

interface GameConfig {
  name: string;
  type: "Free For All";
  timer: number;
  floors: {
    amount: number;
  };
}

export default class Game {
  config: GameConfig;
  floors: Floor[] = [];
  players: Map<string, Player>;
  hasLoaded = false;
  emitTracker = true;
  timeRemaining: number;
  intervalID?: NodeJS.Timeout;
  frameCount: number = 0;

  //Socket events
  onJoinGame: (socket: Socket) => void = onJoinGame;

  //Controllers
  addPlayer: (socket: Socket, config: JoinGameRequest) => void = addPlayer;
  removePlayer: (socket: Socket) => void = removePlayer;

  constructor(config: GameConfig) {
    console.log(`Setting up new ${config.type} game.`);
    this.config = config;
    this.players = new Map();

    const { amount } = config.floors;

    for (let i = 0; i < amount; i++) {
      this.floors.push(new Floor(this, i));
    }

    for (const floor of this.floors) {
      floor.populate();
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

      for (const floor of this.floors) {
        if (floor.players.size === 0) continue;
        floor.update(delta, this.frameCount);
        floor.emit();
      }

      if (this.frameCount % 60 === 0) {
        this.timeRemaining--;
        this.emitIntervalData();
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
      player.secondsAlive++;
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
