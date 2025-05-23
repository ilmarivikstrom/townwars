import Phaser from "phaser";
import { Color, toHexColor } from "../utils/Color.js";
import { ATTACK_STRENGTHS, Layers } from "../utils/Config.js";

const BUTTON_WIDTH = 60;
const BUTTON_HEIGHT = 40;
const TEXT_PADDING = 10;
const FONT_FAMILY = "CaskaydiaMono, monospace";

export default class StrengthUI {
  private texts: Phaser.GameObjects.Text[] = [];
  private title!: Phaser.GameObjects.Text;
  private scene: Phaser.Scene;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    initialStrength: number,
    config: {
      buttonWidth?: number;
      buttonHeight?: number;
      padding?: number;
      fontFamily?: string;
      depth?: number;
    } = {}
  ) {
    this.scene = scene;
    const {
      buttonWidth = BUTTON_WIDTH,
      buttonHeight = BUTTON_HEIGHT,
      padding = TEXT_PADDING,
      fontFamily = FONT_FAMILY,
    } = config;

    ATTACK_STRENGTHS.forEach((strength, index) => {
      const text = scene.add.text(0, 0, `${(strength * 100).toFixed(0)}%`, {
        backgroundColor: toHexColor(Color.TOOLTIP_BACKGROUND),
        color: toHexColor(Color.TEXT_DEFAULT),
        padding: { x: padding, y: padding },
        fontFamily,
        align: "center",
        fixedWidth: buttonWidth,
        fixedHeight: buttonHeight,
      });
      text.setDepth(Layers.UI);

      const totalWidth = ATTACK_STRENGTHS.length * buttonWidth;
      const startX = x - totalWidth / 2;
      text.setPosition(startX + index * buttonWidth, y);

      text.setInteractive({
        hitArea: new Phaser.Geom.Rectangle(0, 0, text.width, text.height),
        hitAreaCallback: Phaser.Geom.Rectangle.Contains,
        draggable: true,
      });

      text.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
        this.scene.events.emit("strengthSelected", strength);
      });

      this.texts.push(text);
    });

    this.title = scene.add.text(x, y + 55, "Move strength", {
      color: toHexColor(Color.TEXT_DEFAULT),
    });
    this.title.setOrigin(0.5, 0.5);

    this.updateStrengthIndicator(initialStrength);
  }

  public updateStrengthIndicator(strength: number): void {
    if (!ATTACK_STRENGTHS.includes(strength)) {
      console.warn(
        `Invalid strength value: ${strength}. Expected one of ${ATTACK_STRENGTHS.join(
          ", "
        )}. Defaulting to the lowest...`
      );
      strength = ATTACK_STRENGTHS[0];
    }

    this.texts.forEach((text) => {
      text.setBackgroundColor(toHexColor(Color.TOOLTIP_BACKGROUND));
    });

    const index = ATTACK_STRENGTHS.indexOf(strength);
    this.texts[index].setBackgroundColor(toHexColor(Color.MENU_BLUE));
  }

  public destroy(): void {
    this.texts.forEach((text) => text.destroy());
    this.texts = [];
  }
}
