import Phaser from "phaser";
import Notification, { NotificationType } from "../ui/Notification.js";
import { Config } from "../utils/Config.js";

export default class NotificationManager {
  private scene: Phaser.Scene;
  private notifications: Notification[];
  private spacing: number;
  private notificationHeight: number;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.notifications = [];
    this.spacing = 10;
    this.notificationHeight = 50;
  }

  showNotification(
    title: string,
    message: string,
    type = NotificationType.INFO
  ) {
    const x = Config.WINDOW_WIDTH - 150;
    const y = Config.WINDOW_HEIGHT - 50;
    const notification = new Notification(
      this.scene,
      x,
      y,
      title,
      message,
      type
    );

    this.notifications.push(notification);

    this.updatePositions();

    notification.once("destroy", () => {
      this.notifications = this.notifications.filter((n) => n !== notification);
      this.updatePositions();
    });
  }

  updatePositions() {
    this.notifications.forEach((notification, index) => {
      const targetY =
        Config.WINDOW_HEIGHT -
        50 -
        (this.notificationHeight + this.spacing) * index;
      this.scene.tweens.add({
        targets: notification,
        y: targetY,
        duration: 300,
        ease: "Power2",
      });
    });
  }
}
