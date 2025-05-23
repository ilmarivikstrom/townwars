import Phaser from "phaser";
import { Color, toHexColor } from "../utils/Color.js";
import { Config, Layers } from "../utils/Config.js";
import Grid from "../ui/Grid.js";
import { SocketManager } from "../networking/SocketManager.js";
import { GameLogic } from "game-logic";
import SocketUI from "../ui/SocketUI.js";
import TitleText from "../ui/TitleText.js";

export default class MainMenu extends Phaser.Scene {
  private socketManager!: SocketManager;
  private socketUI!: SocketUI;
  private titleText!: TitleText;
  private startGameButton!: Phaser.GameObjects.Text;
  private mapEditorButton!: Phaser.GameObjects.Text;
  private settingsButton!: Phaser.GameObjects.Text;
  private grid!: Grid;

  constructor() {
    super("MainMenu");
  }

  public preload() {}

  public create() {
    const logic = new GameLogic();
    console.log(logic.dummy());
    this.socketUI = new SocketUI(
      this,
      Config.PADDING_ELEMENTS,
      Config.PADDING_ELEMENTS,
      { x: Config.PADDING_TEXT, y: Config.PADDING_TEXT }
    );

    this.titleText = new TitleText(this);

    this.socketManager = this.registry.get("socketManager");

    this.socketManager.on("connect", () => {
      this.socketUI.update(
        this.socketManager.isConnected(),
        this.socketManager.getRoundTripTime()
      );
    });

    this.socketManager.on("disconnect", () => {
      this.socketUI.update(
        this.socketManager.isConnected(),
        this.socketManager.getRoundTripTime()
      );
    });

    this.socketManager.on("connect_error", () => {
      this.socketUI.update(
        this.socketManager.isConnected(),
        this.socketManager.getRoundTripTime()
      );
    });

    this.socketManager.on("pong", () => {
      this.socketUI.update(
        this.socketManager.isConnected(),
        this.socketManager.getRoundTripTime()
      );
    });

    this.grid = new Grid(this);

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

    this.settingsButton = this.createButton("settings", 100);
    this.settingsButton.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.button === 0) {
        console.log("Clicked settings button");
        this.scene.switch("SettingsScene");
      }
    });
    this.add.existing(this.settingsButton);
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
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
    });

    button.on("pointerover", () => {
      button.setBackgroundColor(toHexColor(Color.MENU_BLUE));
    });

    button.on("pointerout", () => {
      button.setBackgroundColor(toHexColor(Color.TOOLTIP_BACKGROUND));
    });

    return button;
  }

  public update(): void {}
}
