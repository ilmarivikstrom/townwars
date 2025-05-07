import Phaser from "phaser";
import { Color, toHexColor } from "../utils/Color.js";
import { Config, Layers } from "../utils/Config.js";
import { integerToRoman } from "../utils/Math.js";
import SettingsManager from "../utils/SettingsManager.js";
const BASE_RADIUS = 32;
export default class Node extends Phaser.GameObjects.Arc {
    constructor(scene, x, y, productionRate, owner = "") {
        super(scene, x, y, BASE_RADIUS);
        this.selected = false;
        this.owner = "";
        scene.add.existing(this);
        this.setOwnerAndColor(owner);
        this.presetTroops();
        this.setRadius(Math.sqrt((this.troopCount * 4) / Math.PI) + BASE_RADIUS);
        this.baseProductionRate = productionRate;
        this.baseProductionRateRoman = integerToRoman(this.baseProductionRate);
        const strokeWidth = 3;
        this.setStrokeStyle(strokeWidth, Color.OUTSIDE, 1.0);
        this.productionRateIndicator = new Phaser.GameObjects.Text(scene, this.x, this.y + this.radius / 3, this.baseProductionRateRoman, {
            color: toHexColor(Color.TEXT_DEFAULT),
            fontSize: 14,
            fontFamily: "CaskaydiaMono",
        });
        this.productionRateIndicator.setOrigin(0.5, 0.5);
        this.productionRateIndicator.setDepth(Layers.UI);
        scene.add.existing(this.productionRateIndicator);
        this.setDepth(Layers.NODE_BASE);
        this.setInteractive({
            hitArea: new Phaser.Geom.Circle(this.width / 2, this.height / 2, this.radius),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            hitAreaCallback: Phaser.Geom.Circle.Contains,
            draggable: true,
        });
        this.on("pointerover", () => {
            this.tooltip.setVisible(true);
        });
        this.on("pointerout", () => {
            this.tooltip.setVisible(false);
        });
        this.on("pointerdown", (pointer) => {
            if (pointer.button === 0) {
                this.scene.events.emit("nodeSelect", this);
            }
            else if (pointer.button === 2) {
                this.scene.events.emit("nodeDelete", this);
            }
        });
        this.on("drag", (pointer) => {
            this.scene.events.emit("nodeDrag", this, pointer);
        });
        this.on("dragend", (pointer) => {
            this.scene.events.emit("nodeDragEnd", this, pointer);
        });
        this.createTooltip(scene);
        this.createTroopCountText(scene);
        this.createPointLight(scene);
    }
    isOwnedByUser(userId) {
        return this.owner == userId;
    }
    updateAttritionRate(dt) {
        this.attritionRate =
            -1 * this.baseProductionRate * (this.troopCount / 100) * (dt / 1000);
    }
    createTooltip(scene) {
        this.tooltip = scene.add.text(this.x, this.y, this.parseUpdatedTooltipText(), {
            backgroundColor: toHexColor(Color.TOOLTIP_BACKGROUND),
            color: toHexColor(Color.TEXT_DEFAULT),
            padding: { x: Config.PADDING_TEXT, y: Config.PADDING_TEXT },
            fontFamily: "CaskaydiaMono",
        });
        this.tooltip.setDepth(Layers.NODE_TOOLTIP);
        this.tooltip.setAlpha(0.8);
        this.tooltip.setVisible(false);
    }
    presetTroops() {
        if (this.owner === "") {
            this.troopCount = Math.floor(Math.random() * 15 + 15);
        }
        else {
            this.troopCount = 0;
        }
    }
    createTroopCountText(scene) {
        this.troopCountText = scene.add.text(this.x, this.y - this.radius / 4, this.troopCount.toString(), {
            color: toHexColor(Color.TEXT_DEFAULT),
            fontSize: 20,
            fontStyle: "bold",
        });
        this.troopCountText.setOrigin(0.5, 0.5);
        this.troopCountText.setDepth(Layers.NODE_CONTENT);
    }
    createPointLight(scene) {
        this.pointLight = scene.add.pointlight(this.x, this.y, SettingsManager.get("playerColor"), this.radius * 5, 0.2, 0.05);
        this.pointLight.setDepth(Layers.NODE_LIGHT);
    }
    setSelected(selected) {
        this.selected = selected;
    }
    setOwnerAndColor(newOwner) {
        this.owner = newOwner;
        if (this.owner !== "") {
            this.setFillStyle(SettingsManager.get("playerColor"));
        }
        else {
            this.setFillStyle(Color.NODE_DEFAULT);
        }
    }
    setPointLightColor() {
        const playerColor = SettingsManager.get("playerColor");
        this.pointLight.color = Phaser.Display.Color.IntegerToColor(playerColor);
    }
    parseUpdatedTooltipText() {
        const tooltipText = "Base production: " +
            this.baseProductionRate.toString() +
            "/s" +
            "\n" +
            "Troops: " +
            this.troopCount.toFixed(0);
        return tooltipText;
    }
    update(timestep, dt) {
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
            const newRadius = Math.sqrt((this.troopCount * 4) / Math.PI) + BASE_RADIUS;
            this.setRadius(newRadius);
            const hitArea = this.input.hitArea;
            hitArea.setTo(this.width / 2, this.height / 2, newRadius);
        }
        else {
            throw new Error("Node `input` is null. Exiting...");
        }
        this.updatePointLight();
        if (this.owner == "") {
            this.pointLight.setVisible(false);
        }
        else {
            this.pointLight.setVisible(true);
        }
        this.troopCountText.setText(this.troopCount.toFixed(0));
        this.tooltip.setText(newTooltipText);
    }
    getTroops() {
        return this.troopCount;
    }
    updatePointLight() {
        this.pointLight.radius = this.radius * 5;
    }
    setTroops(newTroopCount) {
        this.troopCount = newTroopCount;
    }
    getProductionRate() {
        return this.baseProductionRate;
    }
    destroyChildren() {
        this.tooltip.destroy();
        this.troopCountText.destroy();
        this.pointLight.destroy();
        this.productionRateIndicator.destroy();
    }
}
//# sourceMappingURL=Node.js.map