import Phaser from "phaser";
import { Color, toHexColor } from "../utils/Color.js";
import { Config, Layers } from "../utils/Config.js";
import Grid from "../ui/Grid.js";
import { io } from "socket.io-client";
export default class MainMenu extends Phaser.Scene {
    constructor() {
        super("MainMenu");
        this.roundTripTime = 0;
    }
    preload() { }
    create() {
        this.grid = new Grid(this);
        this.serverIndicator = this.createServerIndicator();
        this.add.existing(this.serverIndicator);
        this.startGameButton = this.createButton("start game", 0);
        this.startGameButton.on("pointerdown", (pointer) => {
            if (pointer.button === 0) {
                console.log("Clicked start game button");
                this.scene.switch("GameScene");
            }
        });
        this.add.existing(this.startGameButton);
        this.mapEditorButton = this.createButton("map editor", 50);
        this.mapEditorButton.on("pointerdown", (pointer) => {
            if (pointer.button === 0) {
                console.log("Clicked map editor button");
            }
        });
        this.add.existing(this.mapEditorButton);
        this.settingsButton = this.createButton("settings", 100);
        this.settingsButton.on("pointerdown", (pointer) => {
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
            this.serverIndicator.setText(`🟢 Connected (${this.roundTripTime}ms)`);
        });
        this.sock.on("heartbeat", (serverTimestamp) => {
            this.serverIndicator.setText(`🟢 Connected (${this.roundTripTime}ms) ${serverTimestamp}`);
        });
        const timeInterval = setInterval(() => {
            this.sock.emit("ping", Date.now());
        }, 100);
        this.sock.on("pong", (pingTimestamp) => {
            const delta = Date.now() - pingTimestamp;
            this.roundTripTime = delta;
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
    createButton(text, yOffset) {
        const button = new Phaser.GameObjects.Text(this, Config.WINDOW_WIDTH / 2, Config.WINDOW_HEIGHT / 2 + yOffset, text, {
            backgroundColor: toHexColor(Color.TOOLTIP_BACKGROUND),
            color: toHexColor(Color.TEXT_DEFAULT),
            padding: { x: Config.PADDING_TEXT, y: Config.PADDING_TEXT },
            fontFamily: "CaskaydiaMono",
        });
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
    createServerIndicator() {
        const serverIndicator = new Phaser.GameObjects.Text(this, Config.PADDING_ELEMENTS, Config.PADDING_ELEMENTS, "🟡 Connecting...", {
            backgroundColor: toHexColor(Color.TOOLTIP_BACKGROUND),
            color: toHexColor(Color.TEXT_DEFAULT),
            padding: { x: Config.PADDING_TEXT, y: Config.PADDING_TEXT },
            fontFamily: "CaskaydiaMono",
        });
        return serverIndicator;
    }
    update() { }
}
//# sourceMappingURL=MainMenu.js.map