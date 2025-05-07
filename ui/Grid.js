import Phaser from "phaser";
import { Config, Layers } from "../utils/Config.js";
import { Color } from "../utils/Color.js";
export default class Grid extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene, 0, 0);
        this.minorGrid = new Phaser.GameObjects.Grid(this.scene, Config.WINDOW_WIDTH / 2, Config.WINDOW_HEIGHT / 2, Config.WINDOW_WIDTH, Config.WINDOW_HEIGHT, 10, 10, 0x000000, 0.0, Color.GRID_MINOR_COLOR, 0.06);
        this.minorGrid.setDepth(Layers.BACKGROUND);
        this.scene.add.existing(this.minorGrid);
        this.majorGrid = new Phaser.GameObjects.Grid(this.scene, Config.WINDOW_WIDTH / 2, Config.WINDOW_HEIGHT / 2, Config.WINDOW_WIDTH, Config.WINDOW_HEIGHT, 80, 80, 0x000000, 0.0, Color.GRID_MAJOR_COLOR, 0.06);
        this.majorGrid.setDepth(Layers.BACKGROUND);
        this.scene.add.existing(this.majorGrid);
    }
}
//# sourceMappingURL=Grid.js.map