import Phaser from "phaser";
import { Color, PlayerColor, toHexColor, } from "../utils/Color.js";
import { Config, Layers } from "../utils/Config.js";
import SettingsManager from "../utils/SettingsManager.js";
import Grid from "../ui/Grid.js";
class UIFactory {
    static createButton(scene, config) {
        const button = new Phaser.GameObjects.Text(scene, config.x, config.y, config.text, config.style);
        button.setOrigin(0.5, 0.5);
        button.setDepth(Layers.UI);
        if (config.interactive) {
            button.setInteractive({
                hitArea: new Phaser.Geom.Rectangle(0, 0, button.width, button.height),
                hitAreaCallback: Phaser.Geom.Rectangle.Contains,
            });
        }
        return button;
    }
}
export default class SettingsScene extends Phaser.Scene {
    constructor() {
        super("SettingsScene");
        this.settingsOptions = [];
        this.uiElements = new Map();
        this.initializeSettingsOptions();
    }
    initializeSettingsOptions() {
        this.settingsOptions.push({
            key: "playerColor",
            label: "Player Color",
            values: [PlayerColor.DEFAULT, PlayerColor.RED, PlayerColor.ORANGE],
            defaultValue: PlayerColor.DEFAULT,
            renderValue: (value) => "\u2588\u2588",
        });
    }
    preload() { }
    create() {
        this.grid = new Grid(this);
        this.setupKeyboardInput();
        this.createSettingsUI();
    }
    setupKeyboardInput() {
        this.input.keyboard?.on("keydown-ESC", () => {
            this.scene.switch("MainMenu");
        });
    }
    createSettingsUI() {
        let yOffset = Config.WINDOW_HEIGHT / 4;
        for (const option of this.settingsOptions) {
            const label = UIFactory.createButton(this, {
                text: option.label,
                x: Config.WINDOW_WIDTH / 2,
                y: yOffset,
                style: {
                    backgroundColor: toHexColor(Color.TOOLTIP_BACKGROUND),
                    color: toHexColor(Color.TEXT_DEFAULT),
                    padding: { x: Config.PADDING_TEXT, y: Config.PADDING_TEXT },
                    fontFamily: "CaskaydiaMono",
                },
            });
            this.add.existing(label);
            const buttons = [];
            const currentValue = SettingsManager.get(option.key) || option.defaultValue;
            const xBase = Config.WINDOW_WIDTH / 2 - (option.values.length - 1) * 25;
            option.values.forEach((value, index) => {
                const button = UIFactory.createButton(this, {
                    text: option.renderValue(value),
                    x: xBase + index * 50,
                    y: yOffset + 50,
                    style: {
                        backgroundColor: toHexColor(Color.TOOLTIP_BACKGROUND),
                        color: toHexColor(value),
                        padding: { x: Config.PADDING_TEXT, y: Config.PADDING_TEXT },
                        fontFamily: "CaskaydiaMono",
                    },
                    interactive: true,
                });
                button.setAlpha(value === currentValue ? 1.0 : 0.4);
                button.on("pointerdown", () => this.handleOptionSelect(option.key, value, button, buttons));
                this.add.existing(button);
                buttons.push(button);
            });
            this.uiElements.set(option.key, buttons);
            yOffset += 100;
        }
    }
    handleOptionSelect(key, value, selectedButton, buttons) {
        buttons.forEach((button) => button.setAlpha(0.4));
        selectedButton.setAlpha(1.0);
        SettingsManager.set(key, value);
        this.game.events.emit(`${key}Changed`, value);
    }
    update() { }
}
//# sourceMappingURL=SettingsScene.js.map