import Phaser from "phaser";
import { Layers } from "../utils/Config.js";
import SettingsManager from "../utils/SettingsManager.js";
export default class DragIndicator extends Phaser.GameObjects.Line {
    constructor(scene, x0, y0, x1, y1) {
        super(scene, 0, 0, x0, y0, x1, y1, Phaser.Display.Color.IntegerToColor(SettingsManager.get("playerColor")).brighten(40).color, 1.0);
        this.setLineWidth(4, 4);
        this.setOrigin(0, 0);
        this.setDepth(Layers.DRAG_LINE);
        scene.add.existing(this);
    }
}
//# sourceMappingURL=DragIndicator.js.map