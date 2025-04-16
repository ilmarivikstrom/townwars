import Phaser from "phaser";
import DebugDisplaySystem from "../systems/DebugDisplaySystem.js";

export default class GameScene extends Phaser.Scene {
  private nodes: Phaser.Geom.Circle[] = [];
  private graphics!: Phaser.GameObjects.Graphics;
  private pointerCoords: Phaser.Geom.Point = new Phaser.Geom.Point(-1, -1);
  private debugDisplaySystem!: DebugDisplaySystem;

  public constructor() {
    super("GameScene");
  }

  public preload(): void {}

  public create(): void {
    this.input.mouse?.disableContextMenu();
    this.graphics = this.add.graphics();

    this.debugDisplaySystem = new DebugDisplaySystem(this);

    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.button === 0) {
        const nodeSize = Math.floor(Math.random() * (32 - 16 + 1)) + 16;
        const newNode = new Phaser.Geom.Circle(pointer.x, pointer.y, nodeSize);
        this.nodes.push(newNode);
        this.drawNodeGraph();
        console.log("Length of nodes: " + this.nodes.length.toString());
      }
    });

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      this.pointerCoords.x = pointer.x;
      this.pointerCoords.y = pointer.y;
    });

    this.input.keyboard?.on("keydown-C", () => {
      this.deleteNodes();
    });
  }

  private deleteNodes(): void {
    console.log(
      "Clearing " + this.nodes.length.toString() + " nodes from the canvas."
    );
    this.nodes = [];
    this.drawNodeGraph();
  }

  private drawNodeGraph(): void {
    this.graphics.clear();

    for (const node of this.nodes) {
      this.graphics.lineStyle(8, 0x666666);
      this.graphics.strokeCircleShape(node);
    }

    // FIXME: Ensure no overlapping edges are ever created.
    this.graphics.lineStyle(4, 0xff9900, 0.4);
    for (const node of this.nodes) {
      const closestNodes = this.getClosestNodes(node, 2);
      for (const targetNode of closestNodes) {
        this.graphics.lineBetween(node.x, node.y, targetNode.x, targetNode.y);
      }
    }
  }

  private getClosestNodes(
    sourceNode: Phaser.Geom.Circle,
    maxConnections: number
  ): Phaser.Geom.Circle[] {
    const distances: { node: Phaser.Geom.Circle; distance: number }[] = [];
    for (const node of this.nodes) {
      if (node === sourceNode) continue; // Skip self
      const distance = Phaser.Math.Distance.Between(
        sourceNode.x,
        sourceNode.y,
        node.x,
        node.y
      );
      distances.push({ node, distance });
    }

    distances.sort((a, b) => a.distance - b.distance);
    return distances
      .slice(0, Math.min(maxConnections, distances.length))
      .map((entry) => entry.node);
  }

  public update(timestep: number, dt: number): void {
    this.debugDisplaySystem.update(timestep, dt, this.pointerCoords);
  }
}
