import Phaser from "phaser";
import { Color } from "../utils/Color.js";
import { Config, Layers } from "../utils/Config.js";

export default class MainMenu extends Phaser.Scene {
    private graphics!: Phaser.GameObjects.Graphics;
    private optionItems: { text: Phaser.GameObjects.Text, action: string }[] = [];
    private options: { text: string, action: string }[] = [
        { "text": "Start game", "action": "GameScene" },
        { "text": "Map editor", "action": "EditScene" },
        { "text": "Quit", "action": "QuitScene" }
    ];
    private MARGINS = {
        STARTING_OFFSET: 0.5,
        HEIGTH: 100,
        WIDTH: 200,
        SPACING: 80
    };

    constructor ()
    {
        super('MainMenu');
    }

    preload () {}

    create ()
    {
        this.graphics = this.add.graphics();
        for (const [index, [text, action]] of Object.entries(this.options).entries()) {
            const textBox = this.add.text(
                Math.floor(
                    Config.WINDOW_WIDTH / 2
                ),
                Math.floor(
                    Config.WINDOW_HEIGHT * this.MARGINS.STARTING_OFFSET
                    + index * this.MARGINS.SPACING
                ),
                text).setOrigin(0.5, 0.5);
            textBox.setOrigin(0.5, 0.5);
            textBox.setDepth(Layers.UI
            );
            this.optionItems.push({text: textBox, action: action.action});
        }

        //this.input.on('menuobjectclick', (pointer, menuObject) => this.clickCoin(menuObject));

        this.input.once('pointerdown', function () {
            for (const [text, action] of Object.entries(this.optionItems)) {
                console.log(text.getBounds().x);
                if (text.getBounds()) {
                    this.scene.start(action);
                }
            }

        }, this);

    }

}
