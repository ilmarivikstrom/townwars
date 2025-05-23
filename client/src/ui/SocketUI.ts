import Phaser from "phaser";
import { Color, toHexColor } from "../utils/Color.js";
import { Layers } from "../utils/Config.js";

export default class SocketUI {
  private text!: Phaser.GameObjects.Text;
  private scene: Phaser.Scene;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    padding: {
      x: number;
      y: number;
    }
  ) {
    this.scene = scene;

    const text = scene.add.text(x, y, "🟡 Connecting...", {
      backgroundColor: toHexColor(Color.TOOLTIP_BACKGROUND),
      color: toHexColor(Color.TEXT_DEFAULT),
      padding: { x: padding.x, y: padding.y },
      fontFamily: "CaskaydiaMono",
    });
    text.setDepth(Layers.UI);
    this.text = text;
  }

  public update(isConnected: boolean, roundTripTime: number): void {
    const text = isConnected
      ? `🟢 Connected (${roundTripTime}ms)`
      : "🔴 Offline";
    this.text.setText(text);
  }

  public destroy(): void {
    this.text.destroy();
  }
}
