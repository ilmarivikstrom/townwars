import Phaser from "phaser";
import { Color } from "../utils/Color.js";
import { Config } from "../utils/Config.js";
import Node from "../entities/Node.js";

export default class StatisticsUI {
  private scene: Phaser.Scene;
  private text: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.text = this.scene.add.text(
      Config.WINDOW_WIDTH - Config.PADDING_ELEMENTS,
      Config.PADDING_ELEMENTS,
      "",
      {
        backgroundColor: Color.TOOLTIP_BACKGROUND.hexString,
        color: Color.TEXT_DEFAULT.hexString,
        padding: { x: Config.PADDING_TEXT, y: Config.PADDING_TEXT },
        fontFamily: "CaskaydiaMono",
      }
    );
    this.text.setOrigin(1, 0);
    this.text.setAlign("right");
    this.text.setDepth(1);
    this.text.setAlpha(1.0);
  }

  public toggleVisibility(): void {
    this.text.setVisible(!this.text.visible);
  }

  public update(timestep: number, dt: number, nodes: Node[]): void {
    let totalTroops = 0;
    let productionRate = 0;
    for (const node of nodes) {
      totalTroops += node.getTroops();
      productionRate += node.getProductionRate();
    }
    this.text.setText(
      "Total troops: " +
        totalTroops.toFixed(0) +
        "\nTotal rate: " +
        productionRate.toString() +
        "/s"
    );
  }

  public destroy(): void {
    this.text.destroy();
  }
}
