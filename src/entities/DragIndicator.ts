import Phaser from "phaser";
import { Layers } from "../utils/Config.js";
import { Color } from "../utils/Color.js";

export default class DragIndicator extends Phaser.GameObjects.Line {
  public line!: Phaser.GameObjects.Line;

  constructor(
    scene: Phaser.Scene,
    x0: number,
    y0: number,
    x1: number,
    y1: number
  ) {
    super(
      scene,
      0,
      0,
      x0,
      y0,
      x1,
      y1,
      Phaser.Display.Color.IntegerToColor(Color.DEFAULT_PLAYER_COLOR).brighten(
        40
      ).color,
      1.0
    );
    this.setLineWidth(4, 4);
    this.setOrigin(0, 0);
    this.setDepth(Layers.DRAG_LINE);

    scene.add.existing(this);
  }
}
