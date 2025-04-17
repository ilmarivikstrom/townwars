import Phaser from "phaser";
import { Color } from "../utils/Color.js";

export default class Node extends Phaser.Geom.Circle {
  private scene!: Phaser.Scene;
  private graphics!: Phaser.GameObjects.Graphics;
  private is_hovered: boolean = false;
  private tooltip!: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    radius: number
  ) {
    super(x, y, radius);
    this.scene = scene;
    this.graphics = graphics;
    this.tooltip = this.scene.add.text(
      this.x,
      this.y,
      "x: " +
        this.x.toFixed(0) +
        "\n" +
        "y: " +
        this.y.toFixed(0) +
        "\n" +
        "r: " +
        this.radius.toString(),
      {
        backgroundColor: Color.TOOLTIP_BACKGROUND.hexString,
        color: Color.TEXT_DEFAULT.hexString,
        padding: { x: 12, y: 12 },
        fontFamily: "CaskaydiaMono",
      }
    );
    this.tooltip.setDepth(1);
    this.tooltip.setAlpha(0.8);
    this.tooltip.setVisible(false);
  }

  public update(
    timestep: number,
    dt: number,
    pointerCoords: Phaser.Geom.Point
  ): void {
    if (this.contains(pointerCoords.x, pointerCoords.y)) {
      this.is_hovered = true;
    } else {
      this.is_hovered = false;
    }
    this.tooltip.x = pointerCoords.x;
    this.tooltip.y = pointerCoords.y - (2 * 12 + 3 * 6 + 3 * 12); // Offset by 2 * padding + 3 * row spacing + 3 * font height
  }

  public draw(): void {
    if (this.is_hovered) {
      this.graphics.lineStyle(4, Color.ORANGE.hexNumber, 1.0);
      this.tooltip.setVisible(true);
    } else {
      this.graphics.lineStyle(4, Color.GRAY.hexNumber, 0.5);
      this.tooltip.setVisible(false);
    }
    this.graphics.strokeCircleShape(this);
  }

  public destroyTooltip(): void {
    this.tooltip.destroy();
  }
}
