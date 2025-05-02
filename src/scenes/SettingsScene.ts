import Phaser from "phaser";
import {
  Color,
  PlayerColor,
  PlayerColorValue,
  toHexColor,
} from "../utils/Color.js";
import { Config, Layers } from "../utils/Config.js";
import SettingsManager from "../utils/SettingsManager.js";

export default class SettingsScene extends Phaser.Scene {
  private playerColorIndicator!: Phaser.GameObjects.Text;
  private colorButtons: Phaser.GameObjects.Text[] = [];
  private minorGrid!: Phaser.GameObjects.Grid;
  private majorGrid!: Phaser.GameObjects.Grid;
  private colorOptions: PlayerColorValue[] = [
    PlayerColor.DEFAULT,
    PlayerColor.RED,
    PlayerColor.ORANGE,
  ];

  constructor() {
    super("SettingsScene");
  }

  public preload() {}

  public create() {
    this.minorGrid = new Phaser.GameObjects.Grid(
      this,
      Config.WINDOW_WIDTH / 2,
      Config.WINDOW_HEIGHT / 2,
      Config.WINDOW_WIDTH,
      Config.WINDOW_HEIGHT,
      10,
      10,
      0x000000,
      0.0,
      Color.GRID_MINOR_COLOR,
      0.06
    );
    this.add.existing(this.minorGrid);

    this.majorGrid = new Phaser.GameObjects.Grid(
      this,
      Config.WINDOW_WIDTH / 2,
      Config.WINDOW_HEIGHT / 2,
      Config.WINDOW_WIDTH,
      Config.WINDOW_HEIGHT,
      80,
      80,
      0x000000,
      0.0,
      Color.GRID_MAJOR_COLOR,
      0.06
    );
    this.add.existing(this.majorGrid);

    this.playerColorIndicator = this.createPlayerColorIndicator("player color");
    this.add.existing(this.playerColorIndicator);

    const playerColor = SettingsManager.get("playerColor");

    for (const [index, color] of this.colorOptions.entries()) {
      const colorButton = this.createColorOptionButton(
        color,
        Config.WINDOW_WIDTH / 2 + index * 50 + 100,
        Config.WINDOW_HEIGHT / 2
      );
      if (color == playerColor) {
        colorButton.setAlpha(1.0);
      } else {
        colorButton.setAlpha(0.4);
      }
      this.add.existing(colorButton);
      this.colorButtons.push(colorButton);
    }

    this.input.keyboard?.on("keydown-ESC", () => {
      this.scene.switch("MainMenu");
    });

    this.events.on(
      "colorSelected",
      (colorOptionButton: Phaser.GameObjects.Text, color: PlayerColorValue) => {
        for (const colorButton of this.colorButtons) {
          colorButton.setAlpha(0.4);
        }
        colorOptionButton.setAlpha(1.0);
        SettingsManager.set("playerColor", color);
        this.game.events.emit("playerColorChanged");
      }
    );
  }

  private createPlayerColorIndicator(text: string): Phaser.GameObjects.Text {
    const colorIndicator = new Phaser.GameObjects.Text(
      this,
      Config.WINDOW_WIDTH / 2,
      Config.WINDOW_HEIGHT / 2,
      text,
      {
        backgroundColor: toHexColor(Color.TOOLTIP_BACKGROUND),
        color: toHexColor(Color.TEXT_DEFAULT),
        padding: { x: Config.PADDING_TEXT, y: Config.PADDING_TEXT },
        fontFamily: "CaskaydiaMono",
      }
    );
    colorIndicator.setOrigin(0.5, 0.5);
    colorIndicator.setDepth(Layers.UI);
    return colorIndicator;
  }

  private createColorOptionButton(
    color: number,
    x: number,
    y: number
  ): Phaser.GameObjects.Text {
    const colorOptionButton = new Phaser.GameObjects.Text(
      this,
      x,
      y,
      "\u2588\u2588",
      {
        backgroundColor: toHexColor(Color.TOOLTIP_BACKGROUND),
        color: toHexColor(color),
        padding: { x: Config.PADDING_TEXT, y: Config.PADDING_TEXT },
        fontFamily: "CaskaydiaMono",
      }
    );
    colorOptionButton.setOrigin(0.5, 0.5);
    colorOptionButton.setDepth(Layers.UI);
    colorOptionButton.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(
        0,
        0,
        colorOptionButton.width,
        colorOptionButton.height
      ),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
    });

    colorOptionButton.on("pointerdown", () => {
      this.events.emit("colorSelected", colorOptionButton, color);
    });
    return colorOptionButton;
  }

  public update(): void {}
}
