import express, { Express } from "express";
import http from "http";
import { DisconnectReason, Server, Socket } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import { SQLiteService, initDB } from "./db/sqlite.js";

import { config } from "./config.js";

const app: Express = express();
const httpServer = http.createServer(app);
const ioServer = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
const port: number = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

const db = initDB(config.dbFile);

function checkUser(userID: string) {
  console.log("Checking user...");
  let user = db.get("SELECT * FROM users WHERE id = ?", [userID]);
  console.log("User found: ", user);
}

ioServer.on("connection", (socket: Socket) => {
  console.log("a user with socket id " + socket.id + " connected!!");
  checkUser(socket.id);
  socket.emit("heartbeat", { time: Date.now() });

  const timeInterval = setInterval(() => {
    socket.emit("heartbeat", { time: Date.now() });
  }, 1000);

  socket.on("disconnect", (reason: DisconnectReason) => {
    console.log("user with socket disconnected, reason: " + reason);
    clearInterval(timeInterval);
  });

  socket.on("error", (error: Error) => {
    console.error("WebSocket error:", error);
  });
});

httpServer.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
