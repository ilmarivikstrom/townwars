import Phaser from "phaser";
import { Color, toHexColor } from "../utils/Color.js";
import { Config, Layers } from "../utils/Config.js";

export default class Node extends Phaser.GameObjects.Container {
  public drawableCircle!: Phaser.GameObjects.Arc;
  public geomCircle!: Phaser.Geom.Circle;
  private tooltip!: Phaser.GameObjects.Text;
  private productionRate!: number;
  private troopCount!: number;
  private troopCountText!: Phaser.GameObjects.Text;
  private pointLight!: Phaser.GameObjects.PointLight;
  private selected: boolean = false;
  private hovered: boolean = false;
  private owner: string = "";

  private fillColor!: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    productionRate: number,
    owner: string = ""
  ) {
    super(scene);
    this.setOwnerAndColor(owner);
    this.drawableCircle = scene.add.circle(
      x,
      y,
      4 * productionRate + 15,
      this.fillColor
    );
    this.drawableCircle.setStrokeStyle(4, Color.OUTSIDE);
    this.drawableCircle.setDepth(Layers.NODE_BASE);
    this.drawableCircle.setInteractive({ draggable: true });

    this.drawableCircle.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.button === 0) {
        this.scene.events.emit("nodeSelect", this);
      } else if (pointer.button === 2) {
        this.scene.events.emit("nodeDelete", this);
      }
    });

    this.drawableCircle.on("drag", (pointer: Phaser.Input.Pointer) => {
      this.scene.events.emit("nodeDrag", this, pointer);
    });

    this.drawableCircle.on("dragend", (pointer: Phaser.Input.Pointer) => {
      this.scene.events.emit("nodeDragEnd", this, pointer);
    });

    this.geomCircle = new Phaser.Geom.Circle(x, y, 4 * productionRate + 15);

    this.productionRate = productionRate;

    this.presetTroops();
    this.createTooltip(scene);
    this.createTroopCountText(scene);
    this.createPointLight(scene);
  }

  public isOwnedByUser(userId: string): boolean {
    return this.owner == userId;
  }

  private createTooltip(scene: Phaser.Scene): void {
    this.tooltip = scene.add.text(
      this.drawableCircle.x,
      this.drawableCircle.y,
      this.parseUpdatedTooltipText(),
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
  }

  private presetTroops(): void {
    if (this.owner === "") {
      this.troopCount = Math.floor(Math.random() * 15 + 15);
    } else {
      this.troopCount = 0;
    }
  }

  private createTroopCountText(scene: Phaser.Scene): void {
    this.troopCountText = scene.add.text(
      this.drawableCircle.x,
      this.drawableCircle.y,
      this.troopCount.toString()
    );
    this.troopCountText.setOrigin(0.5, 0.5);
    this.troopCountText.setDepth(Layers.NODE_CONTENT);
  }

  private createPointLight(scene: Phaser.Scene): void {
    this.pointLight = scene.add.pointlight(
      this.geomCircle.x,
      this.geomCircle.y,
      Color.ORANGE,
      this.geomCircle.radius * 3,
      0.2,
      0.05
    );
    this.pointLight.setDepth(Layers.NODE_LIGHT);
  }

  public setSelected(selected: boolean): void {
    this.selected = selected;
  }

  public getOwner(): string {
    return this.owner;
  }

  public getSelected(): boolean {
    return this.selected;
  }

  public setOwnerAndColor(newOwner: string): void {
    this.owner = newOwner;
    if (this.owner !== "") {
      this.fillColor = Color.DEFAULT_PLAYER_COLOR;
    } else {
      this.fillColor = Color.GRAY_DARK;
    }
  }

  private parseUpdatedTooltipText(): string {
    const tooltipText =
      "Production: " +
      this.productionRate.toString() +
      "/s" +
      "\n" +
      "Troops: " +
      this.troopCount.toFixed(0) +
      "\nOwner: " +
      (this.owner === "" ? "None" : this.owner);
    return tooltipText;
  }

  public update(
    timestep: number,
    dt: number,
    pointerCoords: Phaser.Geom.Point
  ): void {
    if (this.geomCircle.contains(pointerCoords.x, pointerCoords.y)) {
      this.hovered = true;
    } else {
      this.hovered = false;
    }

    const newTooltipText = this.parseUpdatedTooltipText();
    const tooltipRows = newTooltipText.split("\n").length;

    this.tooltip.y =
      this.geomCircle.y -
      (2 * Config.PADDING_TEXT +
        tooltipRows * Config.SPACING_TEXT +
        tooltipRows * 14); // Offset by 2 * padding + 3 * row spacing + 3 * font height

    if (this.owner !== "") {
      this.troopCount = this.troopCount + this.productionRate * (dt / 1000);
    }
    this.troopCountText.setText(this.troopCount.toFixed(0));
    this.tooltip.setText(newTooltipText);
  }

  public getTroops(): number {
    return this.troopCount;
  }

  public setTroops(newTroopCount: number): void {
    this.troopCount = newTroopCount;
  }

  public getProductionRate(): number {
    return this.productionRate;
  }

  public draw(): void {
    if ((this.hovered && this.selected) || this.selected) {
      this.pointLight.setVisible(true);
      this.tooltip.setVisible(true);
    } else if (this.hovered) {
      this.tooltip.setVisible(true);
    } else {
      this.pointLight.setVisible(false);
      this.tooltip.setVisible(false);
    }
  }

  public destroyChildren(): void {
    this.drawableCircle.destroy();
    this.tooltip.destroy();
    this.troopCountText.destroy();
    this.pointLight.destroy();
  }
}
