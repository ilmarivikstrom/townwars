import Phaser from "phaser";
import { GameConfig } from "./GameConfig.js";
import GameScene from "./scenes/GameScene.js";
import MainMenu from "./scenes/MainMenu.js";
import SettingsScene from "./scenes/SettingsScene.js";
import { SocketManager } from "./networking/SocketManager.js";

const townwars = new Phaser.Game({
  ...GameConfig,
  scene: [MainMenu, GameScene, SettingsScene],
});

const socketManager = new SocketManager("http://localhost:3000");
townwars.registry.set("socketManager", socketManager);

townwars.events.on("destroy", () => {
  socketManager.disconnect();
  townwars.registry.remove("socketManager");
});

export default townwars;
