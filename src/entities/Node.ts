import Phaser from "phaser";
import { Color, toHexColor } from "../utils/Color.js";
import { Config, Layers } from "../utils/Config.js";

export default class Node extends Phaser.Geom.Circle {
  private scene!: Phaser.Scene;
  private graphics!: Phaser.GameObjects.Graphics;
  private tooltip!: Phaser.GameObjects.Text;
  private productionRate!: number;
  private troops!: number;
  private troopCountText!: Phaser.GameObjects.Text;
  private pointLight!: Phaser.GameObjects.PointLight;
  private selected: boolean = false;
  private isHovered: boolean = false;
  private owner: string = "";

  private fillColor: number = Color.GAME_WINDOW;

  constructor(
    scene: Phaser.Scene,
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    productionRate: number,
    owner: string = "",
  ) {
    super(x, y, 4 * productionRate + 15);
    this.productionRate = productionRate;
    this.troops = 0;
    this.scene = scene;
    this.graphics = graphics;

    this.setOwner(owner);

    this.graphics.setDepth(Layers.NODE_BASE);
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
    this.tooltip.setDepth(Layers.NODE_TOOLTIP);
    this.tooltip.setAlpha(0.8);
    this.tooltip.setVisible(false);

    if (this.owner === "") {
      this.troops = Math.floor(Math.random() * 15 + 15);
    }

    this.troopCountText = this.scene.add.text(
      this.x,
      this.y,
      this.troops.toString()
    );
    this.troopCountText.setOrigin(0.5, 0.5);
    this.troopCountText.setDepth(Layers.NODE_CONTENT);

    this.pointLight = this.scene.add.pointlight(
      this.x,
      this.y,
      Color.ORANGE,
      this.radius * 3,
      0.2,
      0.05
    );
    this.pointLight.setDepth(Layers.NODE_LIGHT);
  }

  public setSelected(selected: boolean): void {
    this.selected = selected;
  }

  public getSelected(): boolean {
    return this.selected;
  }

  public setOwner(newOwner: string): void {
    this.owner = newOwner;
    if (this.owner !== "") {
      this.fillColor = Color.DEFAULT_PLAYER_COLOR;
    }
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
      this.isHovered = true;
    } else {
      this.isHovered = false;
    }

    const newTooltipText = this.getUpdatedTooltipText();
    const tooltipRows = newTooltipText.split("\n").length;

    this.tooltip.x = pointerCoords.x;
    this.tooltip.y =
      pointerCoords.y -
      (2 * Config.PADDING_TEXT +
        tooltipRows * Config.SPACING_TEXT +
        tooltipRows * 14); // Offset by 2 * padding + 3 * row spacing + 3 * font height

    if (this.owner !== "") {
      this.troops = this.troops + this.productionRate * (dt / 1000);
    }
    this.troopCountText.setText(this.troops.toFixed(0));
    this.tooltip.setText(newTooltipText);
  }

  public getTroops(): number {
    return this.troops;
  }

  public getProductionRate(): number {
    return this.productionRate;
  }

  public draw(): void {
    if (this.selected) {
      this.pointLight.setVisible(true);
      this.graphics.lineStyle(4, Color.ORANGE, 1.0);
    } else {
      this.pointLight.setVisible(false);
      this.graphics.lineStyle(4, Color.GRAY, 0.5);
    }
    if (this.isHovered) {
      this.tooltip.setVisible(true);
    } else {
      this.tooltip.setVisible(false);
    }
    this.graphics.fillStyle(this.fillColor);
    this.graphics.fillCircleShape(this);
    this.graphics.strokeCircleShape(this);
  }

  public destroyChildren(): void {
    this.tooltip.destroy();
    this.troopCountText.destroy();
    this.pointLight.destroy();
  }
}
