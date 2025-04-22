import Phaser from "phaser";
import { Color } from "../utils/Color.js";
import { Config } from "../utils/Config.js";

export default class MainMenu extends Phaser.Scene {
    private graphics!: Phaser.GameObjects.Graphics;

    private options: string[] = [
        "Start game",
        "Map editor",
        "Quit"
    ];
    private MARGINS = {
        STARTING_OFFSET: 0.5,
        HEIGTH: 40,
        WIDTH: 100,
        SPACING: 30
    };

    constructor ()
    {
        super('MainMenu');
    }

    preload () {}

    create ()
    {
        this.graphics = this.add.graphics();
        for (const [index, option] of this.options.entries()) {
            this.add.text(
                Math.floor(
                    Config.WINDOW_WIDTH / 2
                    - this.MARGINS.WIDTH / 2
                ),
                Math.floor(
                    Config.WINDOW_HEIGHT * this.MARGINS.STARTING_OFFSET
                    + index * this.MARGINS.SPACING
                ),
                option);
        }

        this.input.once('pointerdown', function ()
        {

            console.log('From MainMenu to GameScene');

            this.scene.start('GameScene');

        }, this);

    }

}
