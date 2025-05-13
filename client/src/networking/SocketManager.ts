import { io, Socket } from "socket.io-client";
import EventEmitter from "eventemitter3";

export interface SocketEvents {
  connect: () => void;
  disconnect: () => void;
  connect_error: (error: Error) => void;
  pong: (roundTripTime: number) => void;
}

export class SocketManager extends EventEmitter<SocketEvents> {
  private sock: Socket;
  private roundTripTime: number = 0;
  private pingInterval: NodeJS.Timeout | null = null;

  constructor(url: string) {
    super();
    this.sock = io(url, { autoConnect: true });
    this.setupSocketEvents();
    this.startPing();
  }

  private setupSocketEvents(): void {
    this.sock.on("connect", () => {
      console.log("Connected to server with ID:", this.sock.id);
      this.emit("connect");
    });

    this.sock.on("disconnect", () => {
      console.log("Disconnected from server");
      this.emit("disconnect");
    });

    this.sock.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
      this.emit("connect_error", error);
    });

    this.sock.on("pong", (pingTimestamp: number) => {
      this.roundTripTime = Date.now() - pingTimestamp;
      this.emit("pong", this.roundTripTime);
    });
  }

  private startPing(): void {
    this.pingInterval = setInterval(() => {
      this.sock.emit("ping", Date.now());
    }, 100);
  }

  public getSocket(): Socket {
    return this.sock;
  }

  public getRoundTripTime(): number {
    return this.roundTripTime;
  }

  public isConnected(): boolean {
    return this.sock.connected;
  }

  public disconnect(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    this.sock.disconnect();
  }
}
