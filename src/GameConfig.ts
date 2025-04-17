import Phaser from "phaser";
import { Color } from "./utils/Color.js";

const gameCanvas = document.getElementById("gameCanvas") as HTMLCanvasElement;

export const GameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  width: 1280,
  height: 720,
  roundPixels: true,
  canvas: gameCanvas,
  backgroundColor: Color.GAME_WINDOW.hexString,
  disableContextMenu: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: false,
    },
  },
  scene: [],
};
