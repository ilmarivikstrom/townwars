import Phaser from "phaser";
import {
  Color,
  PlayerColor,
  PlayerColorValue,
  toHexColor,
} from "../utils/Color.js";
import { Config, Keys, Layers } from "../utils/Config.js";
import SettingsManager from "../utils/SettingsManager.js";
import Grid from "../ui/Grid.js";

interface ButtonConfig {
  text: string;
  x: number;
  y: number;
  style: Phaser.Types.GameObjects.Text.TextStyle;
  interactive?: boolean;
}

interface SettingOption<T> {
  key: string;
  label: string;
  values: T[];
  defaultValue: T;
  renderValue: (value: T) => string;
}

class UIFactory {
  static createButton(
    scene: Phaser.Scene,
    config: ButtonConfig
  ): Phaser.GameObjects.Text {
    const button = new Phaser.GameObjects.Text(
      scene,
      config.x,
      config.y,
      config.text,
      config.style
    );
    button.setOrigin(0.5, 0.5);
    button.setDepth(Layers.UI);

    if (config.interactive) {
      button.setInteractive({
        hitArea: new Phaser.Geom.Rectangle(0, 0, button.width, button.height),
        hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      });
    }
    return button;
  }
}

export default class SettingsScene extends Phaser.Scene {
  private grid!: Grid;
  private settingsOptions: SettingOption<any>[] = [];
  private uiElements: Map<string, Phaser.GameObjects.Text[]> = new Map();

  constructor() {
    super("SettingsScene");
    this.initializeSettingsOptions();
  }

  private initializeSettingsOptions() {
    this.settingsOptions.push({
      key: "playerColor",
      label: "Player Color",
      values: [PlayerColor.DEFAULT, PlayerColor.RED, PlayerColor.ORANGE],
      defaultValue: PlayerColor.DEFAULT,
      renderValue: (value: PlayerColorValue) => "\u2588\u2588",
    });
  }

  public preload() {}

  public create() {
    this.grid = new Grid(this);
    this.setupKeyboardInput();
    this.createSettingsUI();
  }

  private setupKeyboardInput() {
    this.input.keyboard?.on(`keydown-${Keys.QUIT}`, () => {
      this.scene.switch("MainMenu");
    });
  }

  private createSettingsUI() {
    let yOffset = Config.WINDOW_HEIGHT / 4;

    for (const option of this.settingsOptions) {
      const label = UIFactory.createButton(this, {
        text: option.label,
        x: Config.WINDOW_WIDTH / 2,
        y: yOffset,
        style: {
          backgroundColor: toHexColor(Color.TOOLTIP_BACKGROUND),
          color: toHexColor(Color.TEXT_DEFAULT),
          padding: { x: Config.PADDING_TEXT, y: Config.PADDING_TEXT },
          fontFamily: "CaskaydiaMono",
        },
      });
      this.add.existing(label);

      const buttons: Phaser.GameObjects.Text[] = [];
      const currentValue =
        SettingsManager.get(option.key) || option.defaultValue;
      const xBase = Config.WINDOW_WIDTH / 2 - (option.values.length - 1) * 25;

      option.values.forEach((value, index) => {
        const button = UIFactory.createButton(this, {
          text: option.renderValue(value),
          x: xBase + index * 50,
          y: yOffset + 50,
          style: {
            backgroundColor: toHexColor(Color.TOOLTIP_BACKGROUND),
            color: toHexColor(value),
            padding: { x: Config.PADDING_TEXT, y: Config.PADDING_TEXT },
            fontFamily: "CaskaydiaMono",
          },
          interactive: true,
        });

        button.setAlpha(value === currentValue ? 1.0 : 0.4);
        button.on("pointerdown", () =>
          this.handleOptionSelect(option.key, value, button, buttons)
        );
        this.add.existing(button);
        buttons.push(button);
      });

      this.uiElements.set(option.key, buttons);
      yOffset += 100;
    }
  }

  private handleOptionSelect(
    key: string,
    value: any,
    selectedButton: Phaser.GameObjects.Text,
    buttons: Phaser.GameObjects.Text[]
  ) {
    buttons.forEach((button) => button.setAlpha(0.4));
    selectedButton.setAlpha(1.0);
    SettingsManager.set(key, value);
    this.game.events.emit(`${key}Changed`, value);
  }

  public update(): void {}
}
