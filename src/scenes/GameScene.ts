import { v4 as uuid } from "uuid";
import Phaser from "phaser";
import DebugUI from "../ui/DebugUI.js";
import Node from "../entities/Node.js";
import StatisticsUI from "../ui/StatisticsUI.js";
import { Color } from "../utils/Color.js";

export default class GameScene extends Phaser.Scene {
  private nodes: Node[] = [];
  private graphics!: Phaser.GameObjects.Graphics;
  private pointerCoords: Phaser.Geom.Point = new Phaser.Geom.Point(-1, -1);
  private debugUI!: DebugUI;
  private statisticsUI!: StatisticsUI;
  private numEdges: integer = 0;
  private currentUserId: string = uuid();
  private controlButton: boolean = false;

  public constructor() {
    super("GameScene");
  }

  public preload(): void {}

  private tryCreateNewNode(x: number, y: number): void {
    const productionRate = Math.floor(Math.random() * 5) + 1;
    const testCircle = new Phaser.Geom.Circle(
      x,
      y,
      4 * productionRate + 15
    );

    for (const node of this.nodes) {
      if (Phaser.Geom.Intersects.CircleToCircle(node, testCircle)) {
        return;
      }
    }
    const nodeOwner = this.controlButton ? this.currentUserId : "";
    const newNode = new Node(
      this,
      this.graphics,
      x,
      y,
      productionRate,
      nodeOwner,
    );
    this.nodes.push(newNode);
  }

  public create(): void {
    this.graphics = this.add.graphics();

    this.debugUI = new DebugUI(this);
    this.statisticsUI = new StatisticsUI(this);

    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.button === 0) {
        for (const node of this.nodes) {
          if (node.contains(pointer.x, pointer.y)) {
            node.setSelected(true);
          } else {
            node.setSelected(false);
          }
        }
        this.tryCreateNewNode(pointer.x, pointer.y);
      } else if (pointer.button === 2) {
        for (const [index, node] of this.nodes.entries()) {
          if (node.contains(pointer.x, pointer.y)) {
            node.destroyChildren();
            this.nodes.splice(index, 1);
            return;
          }
        }
      }
    });

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      this.pointerCoords.x = pointer.x;
      this.pointerCoords.y = pointer.y;
    });

    this.input.keyboard?.on("keydown-C", () => {
      this.deleteNodes();
    });

    this.input.keyboard?.on("keydown-D", () => {
      this.debugUI.toggleVisibility();
    });

    this.input.keyboard?.on("keydown-CTRL", () => {
      this.controlButton = true;
    });

    this.input.keyboard?.on("keyup-CTRL", () => {
      this.controlButton = false;
    });
  }

  private deleteNodes(): void {
    for (const node of this.nodes) {
      node.destroyChildren();
    }
    this.nodes = [];
  }

  private drawNodeGraph(): void {
    this.numEdges = 0;
    this.graphics.clear();

    // FIXME: Ensure no overlapping edges are ever created.
    for (const node of this.nodes) {
      if (node.contains(this.pointerCoords.x, this.pointerCoords.y)) {
        this.graphics.lineStyle(4, Color.RED, 1.0);
      } else {
        this.graphics.lineStyle(4, Color.GREEN, 0.4);
      }
      const closestNodes = this.getClosestNodes(node, 2);
      for (const targetNode of closestNodes) {
        this.graphics.lineBetween(node.x, node.y, targetNode.x, targetNode.y);
        this.numEdges += 1;
      }
    }

    for (const node of this.nodes) {
      node.draw();
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
    this.debugUI.update(
      timestep,
      dt,
      this.pointerCoords,
      this.nodes.length,
      this.numEdges,
      this.currentUserId
    );
    this.statisticsUI.update(timestep, dt, this.nodes);
    for (const node of this.nodes) {
      node.update(timestep, dt, this.pointerCoords);
    }
    this.drawNodeGraph();
    console.log("Control: " + this.controlButton.toString());
  }
}
