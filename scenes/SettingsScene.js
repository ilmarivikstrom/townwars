import Phaser from "phaser";
import { Color, PlayerColor, toHexColor, } from "../utils/Color.js";
import { Config, Layers } from "../utils/Config.js";
import SettingsManager from "../utils/SettingsManager.js";
import Grid from "../ui/Grid.js";
export default class SettingsScene extends Phaser.Scene {
    constructor() {
        super("SettingsScene");
        this.colorButtons = [];
        this.colorOptions = [
            PlayerColor.DEFAULT,
            PlayerColor.RED,
            PlayerColor.ORANGE,
        ];
    }
    preload() { }
    create() {
        this.grid = new Grid(this);
        this.playerColorIndicator = this.createPlayerColorIndicator("player color");
        this.add.existing(this.playerColorIndicator);
        const playerColor = SettingsManager.get("playerColor");
        for (const [index, color] of this.colorOptions.entries()) {
            const colorButton = this.createColorOptionButton(color, Config.WINDOW_WIDTH / 2 + index * 50 + 100, Config.WINDOW_HEIGHT / 2);
            if (color == playerColor) {
                colorButton.setAlpha(1.0);
            }
            else {
                colorButton.setAlpha(0.4);
            }
            this.add.existing(colorButton);
            this.colorButtons.push(colorButton);
        }
        this.input.keyboard?.on("keydown-ESC", () => {
            this.scene.switch("MainMenu");
        });
        this.events.on("colorSelected", (colorOptionButton, color) => {
            for (const colorButton of this.colorButtons) {
                colorButton.setAlpha(0.4);
            }
            colorOptionButton.setAlpha(1.0);
            SettingsManager.set("playerColor", color);
            this.game.events.emit("playerColorChanged");
        });
    }
    createPlayerColorIndicator(text) {
        const colorIndicator = new Phaser.GameObjects.Text(this, Config.WINDOW_WIDTH / 2, Config.WINDOW_HEIGHT / 2, text, {
            backgroundColor: toHexColor(Color.TOOLTIP_BACKGROUND),
            color: toHexColor(Color.TEXT_DEFAULT),
            padding: { x: Config.PADDING_TEXT, y: Config.PADDING_TEXT },
            fontFamily: "CaskaydiaMono",
        });
        colorIndicator.setOrigin(0.5, 0.5);
        colorIndicator.setDepth(Layers.UI);
        return colorIndicator;
    }
    createColorOptionButton(color, x, y) {
        const colorOptionButton = new Phaser.GameObjects.Text(this, x, y, "\u2588\u2588", {
            backgroundColor: toHexColor(Color.TOOLTIP_BACKGROUND),
            color: toHexColor(color),
            padding: { x: Config.PADDING_TEXT, y: Config.PADDING_TEXT },
            fontFamily: "CaskaydiaMono",
        });
        colorOptionButton.setOrigin(0.5, 0.5);
        colorOptionButton.setDepth(Layers.UI);
        colorOptionButton.setInteractive({
            hitArea: new Phaser.Geom.Rectangle(0, 0, colorOptionButton.width, colorOptionButton.height),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            hitAreaCallback: Phaser.Geom.Rectangle.Contains,
        });
        colorOptionButton.on("pointerdown", () => {
            this.events.emit("colorSelected", colorOptionButton, color);
        });
        return colorOptionButton;
    }
    update() { }
}
//# sourceMappingURL=SettingsScene.js.map