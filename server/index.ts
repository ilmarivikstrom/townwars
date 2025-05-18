import { DisconnectReason, Server, Socket } from "socket.io";
import { initDB } from "./db/sqlite.js";
import { GameLogic } from "game-logic";
import { Config } from "./config.js";

const port = 3000;

const ioServer = new Server(port, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const db = initDB(Config.dbFile);

function checkUser(userID: string) {
  console.log("Checking user...");
  let user = db.get("SELECT * FROM users WHERE id = ?", [userID]);
  if (user === undefined) {
    console.log("User not found!");
  } else {
    console.log("User found: ", user);
  }
}

ioServer.on("connection", (socket: Socket) => {
  console.log("a user with socket id " + socket.id + " connected!!");
  checkUser(socket.id);

  socket.on("disconnect", (reason: DisconnectReason) => {
    console.log("user with socket disconnected, reason: " + reason);
  });

  socket.on("ping", (pingTimestamp: number) => {
    socket.emit("pong", pingTimestamp);
  });

  socket.on("error", (error: Error) => {
    console.error("WebSocket error:", error);
  });
});

console.log(`Server running at http://localhost:${port}`);
const logic = new GameLogic();
console.log(logic.dummy());
