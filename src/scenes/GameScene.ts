import { v4 as uuid } from "uuid";
import Phaser from "phaser";
import DebugUI from "../ui/DebugUI.js";
import DragIndicator from "../entities/DragIndicator.js";
import Node from "../entities/Node.js";
import StatisticsUI from "../ui/StatisticsUI.js";
import { Color } from "../utils/Color.js";

export default class GameScene extends Phaser.Scene {
  private nodes: Node[] = [];
  private dragIndicator!: DragIndicator;
  private graphics!: Phaser.GameObjects.Graphics;
  private pointerCoords: Phaser.Geom.Point = new Phaser.Geom.Point(-1, -1);
  private debugUI!: DebugUI;
  private statisticsUI!: StatisticsUI;
  private numEdges: integer = 0;
  private currentUserId: string = uuid();
  private ctrlButtonDown: boolean = false;
  private shiftButtonDown: boolean = false;

  public constructor() {
    super("GameScene");
  }

  public preload(): void {}

  public create(): void {
    this.graphics = this.add.graphics();

    this.dragIndicator = new DragIndicator(this, 0, 0, 0, 0);

    this.debugUI = new DebugUI(this);
    this.statisticsUI = new StatisticsUI(this);

    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.button === 0) {
        if (this.ctrlButtonDown) {
          this.tryCreateNewNode(pointer.x, pointer.y, "");
        } else if (this.shiftButtonDown) {
          this.tryCreateNewNode(pointer.x, pointer.y, this.currentUserId);
        }
      }
    });

    this.events.on("nodeSelect", (targetNode: Node) => {
      this.selectOnly(targetNode);
    });

    this.events.on("nodeDelete", (targetNode: Node) => {
      targetNode.destroyChildren();
      this.nodes = this.nodes.filter(
        (candidateNode) => candidateNode !== targetNode
      );
    });

    this.events.on("nodeDrag", (node: Node, pointer: Phaser.Input.Pointer) => {
      this.dragIndicator.destroyChildren();
      this.dragIndicator.destroy();
      if (!node.isOwnedByUser(this.currentUserId)) {
        return;
      }
      this.dragIndicator = new DragIndicator(
        this,
        node.geomCircle.x,
        node.geomCircle.y,
        pointer.x,
        pointer.y
      );
      this.dragIndicator.setVisible(true);

      this.dragIndicator.line.setFillStyle(Color.GRAY_LIGHT);

      for (const candidateNode of this.nodes) {
        if (candidateNode === node) {
          continue;
        }
        if (candidateNode.geomCircle.contains(pointer.x, pointer.y)) {
          console.log("Set the fill style to...");
        }
      }
    });

    this.events.on(
      "nodeDragEnd",
      (dragNode: Node, pointer: Phaser.Input.Pointer) => {
        for (const node of this.nodes) {
          if (!node.geomCircle.contains(pointer.x, pointer.y)) {
            continue;
          }
          if (dragNode.getOwner() !== node.getOwner()) {
            console.log("Attempting to attack");
            const currentTroops = dragNode.getTroops();
            const newTroopCount = currentTroops * 0.5;
            const difference = currentTroops - newTroopCount;
            dragNode.setTroops(newTroopCount);
            node.setTroops(node.getTroops() - difference);
            break;
          } else {
            console.log("Attempting to move troops.");
            const currentTroops = dragNode.getTroops();
            const newTroopCount = currentTroops * 0.5;
            const difference = currentTroops - newTroopCount;
            dragNode.setTroops(newTroopCount);
            node.setTroops(node.getTroops() + difference);
          }
        }
        this.dragIndicator.destroyChildren();
        this.dragIndicator.destroy();
      }
    );

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
      this.ctrlButtonDown = true;
    });

    this.input.keyboard?.on("keyup-CTRL", () => {
      this.ctrlButtonDown = false;
    });

    this.input.keyboard?.on("keydown-SHIFT", () => {
      this.shiftButtonDown = true;
    });

    this.input.keyboard?.on("keyup-SHIFT", () => {
      this.shiftButtonDown = false;
    });
  }

  private selectOnly(nodeToSelect: Node): void {
    for (const node of this.nodes) {
      if (node === nodeToSelect) {
        node.setSelected(true);
      } else {
        node.setSelected(false);
      }
    }
  }

  private tryCreateNewNode(x: number, y: number, owner: string): void {
    const productionRate = Math.floor(Math.random() * 5) + 1;
    const testCircle = new Phaser.Geom.Circle(x, y, 4 * productionRate + 15);

    for (const node of this.nodes) {
      if (Phaser.Geom.Intersects.CircleToCircle(node.geomCircle, testCircle)) {
        return;
      }
    }

    const newNode = new Node(this, x, y, productionRate, owner);
    this.nodes.push(newNode);
    this.selectOnly(newNode);
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
      if (
        node.geomCircle.contains(this.pointerCoords.x, this.pointerCoords.y)
      ) {
        this.graphics.lineStyle(4, Color.RED, 1.0);
      } else {
        this.graphics.lineStyle(4, Color.GREEN, 0.4);
      }
      const closestNodes = this.getClosestNodes(node, 2);
      for (const targetNode of closestNodes) {
        this.graphics.lineBetween(
          node.geomCircle.x,
          node.geomCircle.y,
          targetNode.x,
          targetNode.y
        );
        this.numEdges += 1;
      }
    }

    for (const node of this.nodes) {
      node.draw();
    }
  }

  private getClosestNodes(
    sourceNode: Node,
    maxConnections: number
  ): Phaser.Geom.Circle[] {
    const distances: { geomCircle: Phaser.Geom.Circle; distance: number }[] =
      [];
    for (const node of this.nodes) {
      if (node.geomCircle === sourceNode.geomCircle) continue;
      const distance = Phaser.Math.Distance.Between(
        sourceNode.geomCircle.x,
        sourceNode.geomCircle.y,
        node.geomCircle.x,
        node.geomCircle.y
      );
      distances.push({ geomCircle: node.geomCircle, distance });
    }

    distances.sort((a, b) => a.distance - b.distance);
    return distances
      .slice(0, Math.min(maxConnections, distances.length))
      .map((entry) => entry.geomCircle);
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
  }
}
