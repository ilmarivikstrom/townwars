import Phaser from "phaser";
import { GameConfig } from "./config.js";
import GameScene from "./scenes/GameScene.js";

const townwars = new Phaser.Game({
  ...GameConfig,
  scene: [GameScene],
});

export default townwars;
