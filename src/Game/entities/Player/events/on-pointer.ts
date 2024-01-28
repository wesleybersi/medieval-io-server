import { Socket } from "socket.io";
import { Player } from "../Player";

export function onPointerDown(this: Player, socket: Socket) {
  socket.on("Player Pointer Down", (button: "left" | "right") =>
    this.updatePointerDown(button, true)
  );
  socket.on("Player Pointer Up", (button: "left" | "right") =>
    this.updatePointerDown(button, false)
  );
}

export function onPointerMove(this: Player, socket: Socket) {
  socket.on("Player Angle", (angle: number) => {
    this.inputAngle.target = angle;
  });
}
