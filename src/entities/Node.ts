import Phaser from "phaser";
import { Color, toHexColor } from "../utils/Color.js";
import { Config } from "../utils/Config.js";

export default class Node extends Phaser.Geom.Circle {
  private scene!: Phaser.Scene;
  private graphics!: Phaser.GameObjects.Graphics;
  private is_hovered: boolean = false;
  private tooltip!: Phaser.GameObjects.Text;
  private owner: string = "";
  private productionRate!: number;
  private troops!: number;
  private troopCount!: Phaser.GameObjects.Text;

  private fillColor: number = Color.GAME_WINDOW;

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
        backgroundColor: toHexColor(Color.TOOLTIP_BACKGROUND),
        color: toHexColor(Color.TEXT_DEFAULT),
        padding: { x: Config.PADDING_TEXT, y: Config.PADDING_TEXT },
        fontFamily: "CaskaydiaMono",
      }
    );
    this.tooltip.setDepth(1);
    this.tooltip.setAlpha(0.8);
    this.tooltip.setVisible(false);
    this.troopCount = this.scene.add.text(
      this.x,
      this.y,
      this.troops.toString()
    );
    this.troopCount.setOrigin(0.5, 0.5);
  }

  public setOwner(newOwner: string): void {
    this.owner = newOwner;
    this.fillColor = Color.DEFAULT_PLAYER_COLOR;
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
      this.troops.toFixed(0) +
      "\nOwner: " +
      (this.owner === "" ? "None" : this.owner);
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
      pointerCoords.y -
      (2 * Config.PADDING_TEXT +
        tooltipRows * Config.SPACING_TEXT +
        tooltipRows * 14); // Offset by 2 * padding + 3 * row spacing + 3 * font height

    this.troops = this.troops + this.productionRate * (dt / 1000);
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
      this.graphics.lineStyle(4, Color.ORANGE, 1.0);
      this.tooltip.setVisible(true);
    } else {
      this.graphics.lineStyle(4, Color.GRAY, 0.5);
      this.tooltip.setVisible(false);
    }
    this.graphics.fillStyle(this.fillColor);
    this.graphics.fillCircleShape(this);
    this.graphics.strokeCircleShape(this);
  }

  public destroyChildren(): void {
    this.tooltip.destroy();
    this.troopCount.destroy();
  }
}
