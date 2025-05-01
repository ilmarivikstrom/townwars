import Phaser from "phaser";
import { Color, toHexColor } from "../utils/Color.js";
import { Config, Layers } from "../utils/Config.js";

type TimeApiResponse = {
  message: number;
};

export default class MainMenu extends Phaser.Scene {
  private serverIndicator!: Phaser.GameObjects.Text;
  private startGameButton!: Phaser.GameObjects.Text;
  private mapEditorButton!: Phaser.GameObjects.Text;
  private settingsButton!: Phaser.GameObjects.Text;
  private innerGrid!: Phaser.GameObjects.Grid;
  private outerGrid!: Phaser.GameObjects.Grid;

  constructor() {
    super("MainMenu");
  }

  public preload() {}

  public create() {
    this.innerGrid = new Phaser.GameObjects.Grid(
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
    this.add.existing(this.innerGrid);

    this.outerGrid = new Phaser.GameObjects.Grid(
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
    this.add.existing(this.outerGrid);

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

    this.time.addEvent({
      delay: 1000,
      // eslint-disable-next-line @typescript-eslint/unbound-method
      callback: this.updateServerIndicator,
      callbackScope: this,
      loop: true,
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
      "Offline",
      {
        backgroundColor: toHexColor(Color.TOOLTIP_BACKGROUND),
        color: toHexColor(Color.RED),
        padding: { x: Config.PADDING_TEXT, y: Config.PADDING_TEXT },
        fontFamily: "CaskaydiaMono",
      }
    );
    return serverIndicator;
  }

  private async updateServerIndicator(): Promise<void> {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const response = await fetch("/api/time", {
        method: "GET",
        headers: myHeaders,
      });

      if (!response.ok) {
        throw new Error(
          "Time API status code is " + response.status.toString()
        );
      }

      const data: TimeApiResponse = await response.json();
      console.log("Data received: ", data);
      const datetimePretty = new Date(0);
      datetimePretty.setUTCMilliseconds(data.message);
      this.serverIndicator.setText("Online: " + datetimePretty.toString());
      this.serverIndicator.setColor(toHexColor(Color.GREEN));
    } catch (error: unknown) {
      console.error("Error fetching data:", error);
      this.serverIndicator.setText("Offline");
      this.serverIndicator.setColor(toHexColor(Color.RED));
    }
  }

  public update(): void {}
}
