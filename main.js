import Phaser from "phaser";
import { GameConfig } from "./GameConfig.js";
import GameScene from "./scenes/GameScene.js";
import MainMenu from "./scenes/MainMenu.js";
import SettingsScene from "./scenes/SettingsScene.js";
const townwars = new Phaser.Game({
    ...GameConfig,
    scene: [MainMenu, GameScene, SettingsScene],
});
export default townwars;
//# sourceMappingURL=main.js.map