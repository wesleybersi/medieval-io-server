import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { SocketServer } from "./types";

import onConnect from "./events/on-connect";
import onDisconnect from "./events/on-disconnect";

import Game from "./Game/Game";
import { randomNum } from "./utilities";
import { onJoinGame } from "./Game/events/on-player-joins";

const port = 2142;
const app = express();
const server = http.createServer(app);
export const io: Server = new Server<SocketServer>(server, {
  cors: { origin: "http://localhost:5173" },
});

app.get("/", (req, res) => {
  res.send("<h1>Server status: Live</h1>");
});

export const sockets = new Set<Socket>();

const game = new Game({
  name: "Unnamed Server",
  type: "Free For All",
  timer: 100,
  floors: {
    amount: 25,
  },
});

io.on("connection", (socket: Socket) => {
  //General server events
  onConnect(socket);
  onDisconnect(socket);
  game.onJoinGame(socket);
});

server.listen(port, () => {
  console.log("Server live on port:", port);
});
