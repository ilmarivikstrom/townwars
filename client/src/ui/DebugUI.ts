import Phaser from "phaser";
import { Color, toHexColor } from "../utils/Color.js";
import { Layers } from "../utils/Config.js";

export default class DebugUI {
  private scene: Phaser.Scene;
  private text: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.text = this.scene.add.text(24, 24, "", {
      backgroundColor: toHexColor(Color.TOOLTIP_BACKGROUND),
      color: toHexColor(Color.TEXT_DEFAULT),
      padding: { x: 12, y: 12 },
      fontFamily: "CaskaydiaMono",
    });
    this.text.setDepth(Layers.UI);
    this.text.setAlpha(1.0);
  }

  public toggleVisibility(): void {
    this.text.setVisible(!this.text.visible);
  }

  public update(
    timestep: number,
    dt: number,
    numNodes: integer,
    numEdges: integer,
    userId: string
  ): void {
    this.text.setText(
      "time: " +
        (timestep / 1000).toFixed(2) +
        "s\n" +
        "dt: " +
        dt.toFixed(2) +
        "ms\n" +
        "nodes: " +
        numNodes.toString() +
        "\n" +
        "edges: " +
        numEdges.toString() +
        "\nPlayer ID: " +
        userId +
        "\n\nCTRL + LMB to place a vacant node" +
        "\nSHIFT + LMB to place your node" +
        "\nRMB to delete a node" +
        "\n'C' to clear graph" +
        "\n\n'D' to toggle this UI"
    );
  }

  public destroy(): void {
    this.text.destroy();
  }
}
