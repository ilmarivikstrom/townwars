import Phaser from "phaser";
import { Color, toHexColor } from "../utils/Color.js";
import { Layers } from "../utils/Config.js";

const BUTTON_WIDTH = 60;
const BUTTON_HEIGHT = 40;
const TEXT_PADDING = 10;
const GAP_BETWEEN_TEXT = 0;
const FONT_FAMILY = "CaskaydiaMono, monospace";

const ALLOWED_STRENGTHS = [0.25, 0.5, 0.75, 1.0];

export default class StrengthUI {
  private texts: Phaser.GameObjects.Text[] = [];
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
      gap?: number;
      fontFamily?: string;
      depth?: number;
    } = {}
  ) {
    this.scene = scene;
    const {
      buttonWidth = BUTTON_WIDTH,
      buttonHeight = BUTTON_HEIGHT,
      padding = TEXT_PADDING,
      gap = GAP_BETWEEN_TEXT,
      fontFamily = FONT_FAMILY,
    } = config;

    ALLOWED_STRENGTHS.forEach((strength, index) => {
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

      const totalWidth =
        ALLOWED_STRENGTHS.length * buttonWidth +
        (ALLOWED_STRENGTHS.length - 1) * gap;
      const startX = x - totalWidth / 2 + buttonWidth / 2;
      text.setPosition(startX + index * (buttonWidth + gap), y);

      this.texts.push(text);
    });

    this.updateStrengthIndicator(initialStrength);
  }

  public updateStrengthIndicator(strength: number): void {
    if (!ALLOWED_STRENGTHS.includes(strength)) {
      console.warn(
        `Invalid strength value: ${strength}. Expected one of ${ALLOWED_STRENGTHS.join(
          ", "
        )}. Defaulting to the lowest...`
      );
      strength = ALLOWED_STRENGTHS[0];
    }

    this.texts.forEach((text) => {
      text.setBackgroundColor(toHexColor(Color.TOOLTIP_BACKGROUND));
    });

    const index = ALLOWED_STRENGTHS.indexOf(strength);
    this.texts[index].setBackgroundColor(toHexColor(Color.MENU_BLUE));
  }

  public destroy(): void {
    this.texts.forEach((text) => text.destroy());
    this.texts = [];
  }
}
