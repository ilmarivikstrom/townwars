import Phaser from "phaser";
import { Color } from "../utils/Color.js";

export default class Node extends Phaser.Geom.Circle {
  private scene!: Phaser.Scene;
  private graphics!: Phaser.GameObjects.Graphics;
  private is_hovered: boolean = false;
  private tooltip!: Phaser.GameObjects.Text;
  private productionRate!: number;
  private troops!: number;
  private troopCount!: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    productionRate: number
  ) {
    super(x, y, 4 * productionRate + 15);
    this.productionRate = productionRate;
    this.troops = 0;
    this.scene = scene;
    this.graphics = graphics;
    this.tooltip = this.scene.add.text(
      this.x,
      this.y,
      this.getUpdatedTooltipText(),
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
    this.troopCount = this.scene.add.text(
      this.x,
      this.y - 6,
      this.troops.toString()
    );
  }

  private getUpdatedTooltipText(): string {
    const tooltipText =
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
      this.productionRate.toString() +
      "/s" +
      "\n" +
      "Troops: " +
      this.troops.toFixed(0);
    return tooltipText;
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

    const newTooltipText = this.getUpdatedTooltipText();
    const tooltipRows = newTooltipText.split("\n").length;

    this.tooltip.x = pointerCoords.x;
    this.tooltip.y =
      pointerCoords.y - (2 * 12 + tooltipRows * 6 + tooltipRows * 14); // Offset by 2 * padding + 3 * row spacing + 3 * font height

    this.troops = this.troops + this.productionRate * (dt / 1000);
    const troopTextOffset = this.troops.toFixed(0).length * 4; // Offset to accommodate for extra character, e.g., 9 -> 10
    this.troopCount.setX(this.x - troopTextOffset);
    this.troopCount.setText(this.troops.toFixed(0));
    this.tooltip.setText(newTooltipText);
  }

  public getTroops(): number {
    return this.troops;
  }

  public getProductionRate(): number {
    return this.productionRate;
  }

  public draw(): void {
    if (this.is_hovered) {
      this.graphics.lineStyle(4, Color.ORANGE.hexNumber, 1.0);
      this.tooltip.setVisible(true);
    } else {
      this.graphics.lineStyle(4, Color.GRAY.hexNumber, 0.5);
      this.tooltip.setVisible(false);
    }
    this.graphics.fillStyle(Color.GAME_WINDOW.hexNumber);
    this.graphics.fillCircleShape(this);
    this.graphics.strokeCircleShape(this);
  }

  public destroyTooltip(): void {
    this.tooltip.destroy();
  }
}
