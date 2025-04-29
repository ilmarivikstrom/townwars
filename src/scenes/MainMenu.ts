import Phaser from "phaser";
import { Color, toHexColor } from "../utils/Color.js";
import { Config, Layers } from "../utils/Config.js";

export default class MainMenu extends Phaser.Scene {
  private startGameButton!: Phaser.GameObjects.Text;
  private mapEditorButton!: Phaser.GameObjects.Text;
  private quitButton!: Phaser.GameObjects.Text;

  constructor() {
    super("MainMenu");
  }

  preload() {}

  create() {
    this.startGameButton = this.createButton("start game", 0);
    this.startGameButton.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.button === 0) {
        console.log("Clicked start game button");
        this.scene.switch("GameScene");
      }
    });
    this.add.existing(this.startGameButton);

    this.mapEditorButton = this.createButton("map editor", 50);
    this.mapEditorButton.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.button === 0) {
        console.log("Clicked map editor button");
      }
    });
    this.add.existing(this.mapEditorButton);

    this.quitButton = this.createButton("quit", 100);
    this.quitButton.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.button === 0) {
        console.log("Clicked quit button");
      }
    });
    this.add.existing(this.quitButton);
  }

  private createButton(text: string, yOffset: number): Phaser.GameObjects.Text {
    const button = new Phaser.GameObjects.Text(
      this,
      Config.WINDOW_WIDTH / 2,
      Config.WINDOW_HEIGHT / 2 + yOffset,
      text,
      {
        backgroundColor: toHexColor(Color.TOOLTIP_BACKGROUND),
        color: toHexColor(Color.TEXT_DEFAULT),
        padding: { x: Config.PADDING_TEXT, y: Config.PADDING_TEXT },
        fontFamily: "CaskaydiaMono",
      }
    );

    button.setOrigin(0.5, 0.5);
    button.setDepth(Layers.UI);

    button.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(0, 0, button.width, button.height),
      // eslint-disable-next-line @typescript-eslint/unbound-method
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
    });

    button.on("pointerover", (pointer: Phaser.Input.Pointer) => {
      button.setBackgroundColor(toHexColor(Color.DEFAULT_PLAYER_COLOR));
    });

    button.on("pointerout", (pointer: Phaser.Input.Pointer) => {
      button.setBackgroundColor(toHexColor(Color.TOOLTIP_BACKGROUND));
    });

    return button;
  }
}
