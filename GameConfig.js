import Phaser from "phaser";
import { Color } from "./utils/Color.js";
import { Config } from "./utils/Config.js";
const gameCanvas = document.getElementById("gameCanvas");
export const GameConfig = {
    type: Phaser.WEBGL,
    width: Config.WINDOW_WIDTH,
    height: Config.WINDOW_HEIGHT,
    roundPixels: true,
    canvas: gameCanvas,
    backgroundColor: Color.GAME_WINDOW,
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
//# sourceMappingURL=GameConfig.js.map