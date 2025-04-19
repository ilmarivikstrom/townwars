import Phaser from "phaser";
import { Color } from "../utils/Color.js";

export default class Node extends Phaser.Geom.Circle {
  private scene!: Phaser.Scene;
  private graphics!: Phaser.GameObjects.Graphics;
  private is_hovered: boolean = false;
  private tooltip!: Phaser.GameObjects.Text;
  private production!: number;
  private troops!: number;
  private troopcount!: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    production: number
  ) {
    super(x, y, 4 * production + 15);
    this.production = production;
    this.troops = 0;
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
        this.radius.toString() +
        "\n\n" +
        "Production: " +
        this.production.toString() +
        "\n" +
        "Troops: " +
        this.troops.toString(),
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
    this.troopcount = this.scene.add.text(
      this.x-4,
      this.y+4,
      this.troops.toString()
    );
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

    this.troops = this.troops + this.production;
    this.troopcount.setText(this.troops.toString()
    );
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
