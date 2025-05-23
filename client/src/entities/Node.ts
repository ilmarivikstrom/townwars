import Phaser from "phaser";
import { Color, toHexColor } from "../utils/Color.js";
import { Config, Layers } from "../utils/Config.js";
import { integerToRoman } from "../utils/Math.js";
import SettingsManager from "../utils/SettingsManager.js";

const BASE_RADIUS = 32;

export default class Node extends Phaser.GameObjects.Arc {
  private tooltip!: Phaser.GameObjects.Text;
  private baseProductionRate!: number;
  private baseProductionRateRoman!: string;
  private productionRateIndicator!: Phaser.GameObjects.Text;
  private troopCount!: number;
  private troopCountText!: Phaser.GameObjects.Text;
  private pointLight!: Phaser.GameObjects.PointLight;
  public selected: boolean = false;
  public owner: string = "";
  private attritionRate!: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    productionRate: number,
    owner: string = ""
  ) {
    super(scene, x, y, BASE_RADIUS);
    scene.add.existing(this);

    this.setOwnerAndColor(owner);
    this.presetTroops();
    this.setRadius(Math.sqrt((this.troopCount * 4) / Math.PI) + BASE_RADIUS);

    this.baseProductionRate = productionRate;
    this.baseProductionRateRoman = integerToRoman(this.baseProductionRate);

    const strokeWidth = 3;

    this.setStrokeStyle(strokeWidth, Color.OUTSIDE, 1.0);

    this.productionRateIndicator = new Phaser.GameObjects.Text(
      scene,
      this.x,
      this.y + this.radius / 3,
      this.baseProductionRateRoman,
      {
        color: toHexColor(Color.TEXT_DEFAULT),
        fontSize: 14,
        fontFamily: "CaskaydiaMono",
      }
    );
    this.productionRateIndicator.setOrigin(0.5, 0.5);
    this.productionRateIndicator.setDepth(Layers.UI);
    scene.add.existing(this.productionRateIndicator);

    this.setDepth(Layers.NODE_BASE);
    this.setInteractive({
      hitArea: new Phaser.Geom.Circle(
        this.width / 2,
        this.height / 2,
        this.radius
      ),
      hitAreaCallback: Phaser.Geom.Circle.Contains,
      draggable: true,
    });

    this.on("pointerover", () => {
      this.tooltip.setVisible(true);
    });

    this.on("pointerout", () => {
      this.tooltip.setVisible(false);
    });

    this.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.button === 0) {
        this.scene.events.emit("nodeSelect", this);
      } else if (pointer.button === 2) {
        this.scene.events.emit("nodeDelete", this);
      }
    });

    this.on("drag", (pointer: Phaser.Input.Pointer) => {
      this.scene.events.emit("nodeDrag", this, pointer);
    });

    this.on("dragend", (pointer: Phaser.Input.Pointer) => {
      this.scene.events.emit("nodeDragEnd", this, pointer);
    });

    this.createTooltip(scene);
    this.createTroopCountText(scene);
    this.createPointLight(scene);
  }

  public isOwnedByUser(userId: string): boolean {
    return this.owner == userId;
  }

  private updateAttritionRate(dt: number): void {
    this.attritionRate =
      -1 * this.baseProductionRate * (this.troopCount / 100) * (dt / 1000);
  }

  private createTooltip(scene: Phaser.Scene): void {
    this.tooltip = scene.add.text(
      this.x,
      this.y,
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
      this.x,
      this.y - this.radius / 4,
      this.troopCount.toString(),
      {
        color: toHexColor(Color.TEXT_DEFAULT),
        fontSize: 20,
        fontStyle: "bold",
      }
    );
    this.troopCountText.setOrigin(0.5, 0.5);
    this.troopCountText.setDepth(Layers.NODE_CONTENT);
  }

  private createPointLight(scene: Phaser.Scene): void {
    this.pointLight = scene.add.pointlight(
      this.x,
      this.y,
      SettingsManager.get("playerColor"),
      this.radius * 5,
      0.2,
      0.05
    );
    this.pointLight.setDepth(Layers.NODE_LIGHT);
  }

  public setSelected(selected: boolean): void {
    this.selected = selected;
  }

  public setOwnerAndColor(newOwner: string): void {
    this.owner = newOwner;
    if (this.owner !== "") {
      this.setFillStyle(SettingsManager.get("playerColor"));
    } else {
      this.setFillStyle(Color.NODE_DEFAULT);
    }
  }

  public setPointLightColor() {
    const playerColor = SettingsManager.get("playerColor");
    this.pointLight.color = Phaser.Display.Color.IntegerToColor(playerColor);
  }

  private parseUpdatedTooltipText(): string {
    const tooltipText =
      "Base production: " +
      this.baseProductionRate.toString() +
      "/s" +
      "\n" +
      "Troops: " +
      this.troopCount.toFixed(0);
    return tooltipText;
  }

  public update(timestep: number, dt: number): void {
    const newTooltipText = this.parseUpdatedTooltipText();
    const tooltipRows = newTooltipText.split("\n").length;

    this.updateAttritionRate(dt);

    this.tooltip.y =
      this.y -
      (2 * Config.PADDING_TEXT +
        tooltipRows * Config.SPACING_TEXT +
        tooltipRows * 14); // Offset by 2 * padding + 3 * row spacing + 3 * font height

    if (this.owner !== "") {
      this.troopCount =
        this.troopCount +
        this.baseProductionRate * (dt / 1000) +
        this.attritionRate;
    }

    if (this.input) {
      const newRadius =
        Math.sqrt((this.troopCount * 4) / Math.PI) + BASE_RADIUS;
      this.setRadius(newRadius);
      const hitArea = this.input.hitArea as Phaser.Geom.Circle;
      hitArea.setTo(this.width / 2, this.height / 2, newRadius);
    } else {
      throw new Error("Node `input` is null. Exiting...");
    }

    this.updatePointLight();

    if (this.owner == "") {
      this.pointLight.setVisible(false);
    } else {
      this.pointLight.setVisible(true);
    }

    this.troopCountText.setText(this.troopCount.toFixed(0));
    this.tooltip.setText(newTooltipText);
  }

  public getTroops(): number {
    return this.troopCount;
  }

  private updatePointLight(): void {
    this.pointLight.radius = this.radius * 5;
  }

  public setTroops(newTroopCount: number): void {
    this.troopCount = newTroopCount;
  }

  public getProductionRate(): number {
    return this.baseProductionRate;
  }

  public destroyChildren(): void {
    this.tooltip.destroy();
    this.troopCountText.destroy();
    this.pointLight.destroy();
    this.productionRateIndicator.destroy();
  }
}
