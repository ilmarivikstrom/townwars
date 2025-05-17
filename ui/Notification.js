import Phaser from "phaser";
import { Color, toHexColor } from "../utils/Color.js";
import { Layers } from "../utils/Config.js";
export const NotificationType = {
    INFO: "info",
    WARNING: "warning",
    ERROR: "error",
};
const NotificationColors = {
    [NotificationType.INFO]: Color.INFO,
    [NotificationType.WARNING]: Color.WARNING,
    [NotificationType.ERROR]: Color.ERROR,
};
export default class Notification extends Phaser.GameObjects.Container {
    constructor(scene, x, y, title, message, type = NotificationType.INFO) {
        super(scene, x, y);
        const width = 200;
        const height = 50;
        const padding = 10;
        const background = scene.add.rectangle(0, 0, width, height, 0x000000, 0.75);
        background.setOrigin(0.5, 0.5);
        background.setStrokeStyle(2, NotificationColors[type], 1);
        const titleText = scene.add.text(0, -height / 5, title, {
            fontSize: "12px",
            color: toHexColor(NotificationColors[type]),
            fontStyle: "bold",
        });
        titleText.setOrigin(0.5, 0.5);
        const messageText = scene.add.text(0, height / 5, message, {
            fontSize: "12px",
            color: toHexColor(Color.WHITE),
            wordWrap: { width: width - padding * 2 },
            align: "center",
        });
        messageText.setOrigin(0.5, 0.5);
        this.add([background, titleText, messageText]);
        this.setDepth(Layers.UI);
        scene.add.existing(this);
        scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 200,
            delay: 5000,
            onComplete: () => {
                this.destroy();
            },
        });
    }
}
//# sourceMappingURL=Notification.js.map