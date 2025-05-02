import Phaser from "phaser";
import { Color, toHexColor } from "../utils/Color.js";
import { Config, Layers } from "../utils/Config.js";

export default class StrengthUI {
  private oneQuarterText!: Phaser.GameObjects.Text;
  private twoQuartersText!: Phaser.GameObjects.Text;
  private threeQuartersText!: Phaser.GameObjects.Text;
  private fourQuartersText!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, strength: number) {
    this.oneQuarterText = scene.add.text(
      Config.WINDOW_WIDTH / 2,
      Config.PADDING_ELEMENTS,
      (0.25 * 100).toFixed(0) + "%",
      {
        backgroundColor: toHexColor(Color.TOOLTIP_BACKGROUND),
        color: toHexColor(Color.TEXT_DEFAULT),
        padding: { x: Config.PADDING_TEXT, y: Config.PADDING_TEXT },
        fontFamily: "CaskaydiaMono",
      }
    );
    this.oneQuarterText.setDepth(Layers.UI);
    this.oneQuarterText.setFixedSize(75, 46);
    this.oneQuarterText.setAlign("center");
    this.oneQuarterText.setX(
      this.oneQuarterText.x - this.oneQuarterText.width * 2
    );
    this.oneQuarterText.setAlpha(1.0);

    this.twoQuartersText = scene.add.text(
      Config.WINDOW_WIDTH / 2,
      Config.PADDING_ELEMENTS,
      (0.5 * 100).toFixed(0) + "%",
      {
        backgroundColor: toHexColor(Color.TOOLTIP_BACKGROUND),
        color: toHexColor(Color.TEXT_DEFAULT),
        padding: { x: Config.PADDING_TEXT, y: Config.PADDING_TEXT },
        fontFamily: "CaskaydiaMono",
      }
    );
    this.twoQuartersText.setDepth(Layers.UI);
    this.twoQuartersText.setFixedSize(75, 46);
    this.twoQuartersText.setAlign("center");
    this.twoQuartersText.setX(
      this.twoQuartersText.x - this.twoQuartersText.width * 1
    );
    this.twoQuartersText.setAlpha(1.0);

    this.threeQuartersText = scene.add.text(
      Config.WINDOW_WIDTH / 2,
      Config.PADDING_ELEMENTS,
      (0.75 * 100).toFixed(0) + "%",
      {
        backgroundColor: toHexColor(Color.TOOLTIP_BACKGROUND),
        color: toHexColor(Color.TEXT_DEFAULT),
        padding: { x: Config.PADDING_TEXT, y: Config.PADDING_TEXT },
        fontFamily: "CaskaydiaMono",
      }
    );
    this.threeQuartersText.setDepth(Layers.UI);
    this.threeQuartersText.setFixedSize(75, 46);
    this.threeQuartersText.setAlign("center");
    this.threeQuartersText.setX(
      this.threeQuartersText.x - this.threeQuartersText.width * 0
    );
    this.threeQuartersText.setAlpha(1.0);

    this.fourQuartersText = scene.add.text(
      Config.WINDOW_WIDTH / 2,
      Config.PADDING_ELEMENTS,
      (1.0 * 100).toFixed(0) + "%",
      {
        backgroundColor: toHexColor(Color.TOOLTIP_BACKGROUND),
        color: toHexColor(Color.TEXT_DEFAULT),
        padding: { x: Config.PADDING_TEXT, y: Config.PADDING_TEXT },
        fontFamily: "CaskaydiaMono",
      }
    );
    this.fourQuartersText.setDepth(Layers.UI);
    this.fourQuartersText.setFixedSize(75, 46);
    this.fourQuartersText.setAlign("center");
    this.fourQuartersText.setX(
      this.fourQuartersText.x + this.fourQuartersText.width * 1
    );
    this.fourQuartersText.setAlpha(1.0);

    this.updateStrengthIndicator(strength);
  }

  public updateStrengthIndicator(strength: number) {
    this.oneQuarterText.setBackgroundColor(
      toHexColor(Color.TOOLTIP_BACKGROUND)
    );
    this.twoQuartersText.setBackgroundColor(
      toHexColor(Color.TOOLTIP_BACKGROUND)
    );
    this.threeQuartersText.setBackgroundColor(
      toHexColor(Color.TOOLTIP_BACKGROUND)
    );
    this.fourQuartersText.setBackgroundColor(
      toHexColor(Color.TOOLTIP_BACKGROUND)
    );
    if (strength == 0.25) {
      this.oneQuarterText.setBackgroundColor(toHexColor(Color.MENU_BLUE));
    } else if (strength == 0.5) {
      this.twoQuartersText.setBackgroundColor(toHexColor(Color.MENU_BLUE));
    } else if (strength == 0.75) {
      this.threeQuartersText.setBackgroundColor(toHexColor(Color.MENU_BLUE));
    } else if (strength == 1.0) {
      this.fourQuartersText.setBackgroundColor(toHexColor(Color.MENU_BLUE));
    }
  }
}
