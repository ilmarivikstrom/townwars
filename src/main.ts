import Phaser from 'phaser';


class MainScene extends Phaser.Scene {

  public constructor() {
    super('MainScene');
  }

  public preload(): void {
  }


  public create(): void {
  }


  public update(timestep: number, dt: number): void {
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
