export interface GameIntervalData {
  timeRemaining: number;
  leaderboard: {
    name: string;
    color: number;
    floor: number;
    score: number;
    secondsAlive: number;
  }[];
}
