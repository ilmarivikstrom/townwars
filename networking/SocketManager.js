import { io } from "socket.io-client";
import EventEmitter from "eventemitter3";
export class SocketManager extends EventEmitter {
    constructor(url) {
        super();
        this.roundTripTime = 0;
        this.pingInterval = null;
        this.sock = io(url, { autoConnect: true });
        this.setupSocketEvents();
        this.startPing();
    }
    setupSocketEvents() {
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
        this.sock.on("pong", (pingTimestamp) => {
            this.roundTripTime = Date.now() - pingTimestamp;
            this.emit("pong", this.roundTripTime);
        });
    }
    startPing() {
        this.pingInterval = setInterval(() => {
            this.sock.emit("ping", Date.now());
        }, 100);
    }
    getSocket() {
        return this.sock;
    }
    getRoundTripTime() {
        return this.roundTripTime;
    }
    isConnected() {
        return this.sock.connected;
    }
    disconnect() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
        this.sock.disconnect();
    }
}
//# sourceMappingURL=SocketManager.js.map