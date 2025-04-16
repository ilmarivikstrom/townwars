import Phaser from "phaser";

export default class Node extends Phaser.Geom.Circle {
  private graphics!: Phaser.GameObjects.Graphics;
  private is_hovered: boolean = false;

  constructor(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    radius: number
  ) {
    super(x, y, radius);
    this.graphics = graphics;
  }

  public update(
    timestep: number,
    dt: number,
    pointerCoords: Phaser.Geom.Point
  ): void {
    if (this.contains(pointerCoords.x, pointerCoords.y)) {
      this.is_hovered = true;
    } else {
      this.is_hovered = false;
    }
  }

  public draw(): void {
    if (this.is_hovered) {
      this.graphics.lineStyle(6, 0xbbbbbb);
    } else {
      this.graphics.lineStyle(4, 0x666666);
    }
    this.graphics.strokeCircleShape(this);
  }
}
