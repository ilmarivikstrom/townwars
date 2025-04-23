import Phaser from "phaser";
import { GameConfig } from "./GameConfig.js";
import GameScene from "./scenes/GameScene.js";
import MainMenu from "./scenes/MainMenu.js";

const townwars = new Phaser.Game({
  ...GameConfig,
  scene: [MainMenu, GameScene],
});

export default townwars;
