interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}

export type SocketServer =
  | ClientToServerEvents
  | ServerToClientEvents
  | InterServerEvents
  | SocketData;

export type Cardinal = "top" | "bottom" | "left" | "right";
export type Direction = "up" | "down" | "left" | "right";
