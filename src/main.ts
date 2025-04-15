import Phaser from 'phaser';


class MainScene extends Phaser.Scene {
  private timeDisplay: Phaser.GameObjects.Text;

  public constructor() {
    super('MainScene');
  }

  public preload(): void {
  }


  public create(): void {
    this.timeDisplay = this.add.text(24, 24, "", { backgroundColor: "#222222" });
    this.timeDisplay.setDepth(3);
  }


  public update(timestep: number, dt: number): void {
    this.timeDisplay.setText("Time: " + (timestep / 1000).toFixed(2) + "s, " + "dt: " + (dt).toFixed(2) + "ms");
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
