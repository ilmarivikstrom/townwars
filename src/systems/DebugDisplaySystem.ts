import Phaser from "phaser";

export default class DebugDisplaySystem {
  private scene: Phaser.Scene;
  private debugText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;

    this.debugText = scene.add.text(24, 24, "", {
      backgroundColor: "#222222",
      color: "#ffffff",
      padding: { x: 12, y: 12 },
      lineSpacing: 6,
    });
    this.debugText.setDepth(1);
  }

  public update(
    timestep: number,
    dt: number,
    pointerCoords: Phaser.Geom.Point
  ): void {
    this.debugText.setText(
      "time: " +
        (timestep / 1000).toFixed(2) +
        "s\n" +
        "dt: " +
        dt.toFixed(2) +
        "ms\n" +
        "mouse: (" +
        pointerCoords.x.toFixed(0) +
        ", " +
        pointerCoords.y.toFixed(0) +
        ")"
    );
  }

  public destroy(): void {
    this.debugText.destroy();
  }
}
