import Phaser from "phaser";
import { Color, PlayerColor, toHexColor } from "../utils/Color.js";
import { Config, Layers } from "../utils/Config.js";
import Grid from "../ui/Grid.js";
import { io, Socket } from "socket.io-client";

type TimeResponse = {
  time: number;
};

export default class MainMenu extends Phaser.Scene {
  private serverIndicator!: Phaser.GameObjects.Text;
  private startGameButton!: Phaser.GameObjects.Text;
  private mapEditorButton!: Phaser.GameObjects.Text;
  private settingsButton!: Phaser.GameObjects.Text;
  private grid!: Grid;
  private sock!: Socket;

  constructor() {
    super("MainMenu");
  }

  public preload() {}

  public create() {
    this.grid = new Grid(this);

    this.serverIndicator = this.createServerIndicator();
    this.add.existing(this.serverIndicator);

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

    this.sock = io("http://localhost:3000/");
    console.log("Socket established:", this.sock);

    this.sock.on("connect", () => {
      console.log("Connected to server with ID:", this.sock.id);
      this.serverIndicator.setText("🟢 Connected");
    });

    this.sock.on("heartbeat", (msg: TimeResponse) => {
      this.serverIndicator.setText(
        `🟢 Connected - Server time: ${msg.time}, ${new Date(
          msg.time
        ).toString()}`
      );
    });

    this.sock.on("disconnect", () => {
      console.log("Disconnected from server");
      this.serverIndicator.setText("🔴 Offline");
    });

    this.sock.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
      this.serverIndicator.setText("🔴 Offline");
    });
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

    button.on("pointerover", () => {
      button.setBackgroundColor(toHexColor(Color.MENU_BLUE));
    });

    button.on("pointerout", () => {
      button.setBackgroundColor(toHexColor(Color.TOOLTIP_BACKGROUND));
    });

    return button;
  }

  private createServerIndicator(): Phaser.GameObjects.Text {
    const serverIndicator = new Phaser.GameObjects.Text(
      this,
      Config.PADDING_ELEMENTS,
      Config.PADDING_ELEMENTS,
      "🟡 Connecting...",
      {
        backgroundColor: toHexColor(Color.TOOLTIP_BACKGROUND),
        color: toHexColor(Color.TEXT_DEFAULT),
        padding: { x: Config.PADDING_TEXT, y: Config.PADDING_TEXT },
        fontFamily: "CaskaydiaMono",
      }
    );
    return serverIndicator;
  }

  public update(): void {}
}
