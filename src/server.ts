import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import { SocketServer } from "./types";

import Game from "./Game/Game";
import { disconnectSocket } from "./controllers/disconnect";
import { connectSocket } from "./controllers/connect";

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
  instances: {
    amount: 1,
  },
});

io.on("connection", (socket: Socket) => {
  socket.on("connect", () => connectSocket(socket));
  socket.on("disconnect", () => disconnectSocket(socket));
  game.onJoinGame(socket);
});

server.listen(port, () => {
  console.log("Server live on port:", port);
});
