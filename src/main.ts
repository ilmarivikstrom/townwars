import Phaser from "phaser";


class MainScene extends Phaser.Scene {
  private timeDisplay!: Phaser.GameObjects.Text;
  private nodes: Phaser.Geom.Circle[] = [];
  private graphics!: Phaser.GameObjects.Graphics;


  public constructor() {
    super("MainScene");
  }


  public preload(): void {
  }


  public create(): void {
    this.timeDisplay = this.add.text(24, 24, "", { backgroundColor: "#222222" });
    this.timeDisplay.setDepth(3);

    this.graphics = this.add.graphics();

    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      const newNode = new Phaser.Geom.Circle(pointer.x, pointer.y, 32);
      this.nodes.push(newNode);
      this.drawNodes();
    });
  }

  private drawNodes(): void {
    this.graphics.clear();
    this.graphics.fillStyle(0xffffff, 1);
    for (const node of this.nodes) {
      this.graphics.fillCircle(node.x, node.y, node.radius);
    }
  }


  public update(timestep: number, dt: number): void {
    this.timeDisplay.setText("Time: " + (timestep / 1000).toFixed(2) + "s, " + "dt: " + (dt).toFixed(2) + "ms");
    console.log("Length of nodes: " + this.nodes.length.toString());
    this.drawNodes();
  }
}

const config = {
  type: Phaser.WEBGL,
  width: 1280,
  height: 720,
  backgroundColor: "#00001C",
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: false,
    }
  },
  scene: MainScene,
};

const game = new Phaser.Game(config);

export default game;
