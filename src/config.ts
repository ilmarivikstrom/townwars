import Phaser from "phaser";

const gameCanvas = document.getElementById("gameCanvas") as HTMLCanvasElement;

export const GameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  width: 1280,
  height: 720,
  canvas: gameCanvas,
  backgroundColor: "#00001C",
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
