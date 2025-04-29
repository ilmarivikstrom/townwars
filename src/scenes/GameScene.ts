import { v4 as uuid } from "uuid";
import Phaser from "phaser";
import DebugUI from "../ui/DebugUI.js";
import DragIndicator from "../entities/DragIndicator.js";
import Node from "../entities/Node.js";
import StatisticsUI from "../ui/StatisticsUI.js";
import { Color } from "../utils/Color.js";
import { findNodeAtPoint } from "../utils/Math.js";

export default class GameScene extends Phaser.Scene {
  private nodes: Node[] = [];
  private edges: Phaser.GameObjects.Line[] = [];
  private dragIndicator!: DragIndicator;
  private pointerCoords: Phaser.Geom.Point = new Phaser.Geom.Point(-1, -1);
  private debugUI!: DebugUI;
  private statisticsUI!: StatisticsUI;
  private currentUserId: string = uuid();
  private ctrlButtonDown: boolean = false;
  private shiftButtonDown: boolean = false;

  public constructor() {
    super("GameScene");
  }

  public preload(): void {}

  public create(): void {
    this.dragIndicator = new DragIndicator(this, 0, 0, 0, 0);

    this.debugUI = new DebugUI(this);
    this.statisticsUI = new StatisticsUI(this);

    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.button === 0) {
        if (this.ctrlButtonDown) {
          this.tryCreateNewNode(pointer.x, pointer.y, "");
          this.updateEdges();
        } else if (this.shiftButtonDown) {
          this.tryCreateNewNode(pointer.x, pointer.y, this.currentUserId);
          this.updateEdges();
        }
      }
    });

    this.events.on("nodeSelect", (targetNode: Node) => {
      this.selectOnly(targetNode);
    });

    this.events.on("nodeDelete", (targetNode: Node) => {
      targetNode.destroyChildren();
      targetNode.destroy();
      this.nodes = this.nodes.filter(
        (candidateNode) => candidateNode !== targetNode
      );
      this.updateEdges();
    });

    this.events.on("nodeDrag", (node: Node, pointer: Phaser.Input.Pointer) => {
      this.dragIndicator.destroy();
      if (!node.isOwnedByUser(this.currentUserId)) {
        return;
      }
      this.dragIndicator = new DragIndicator(
        this,
        node.x,
        node.y,
        pointer.x,
        pointer.y
      );
      this.dragIndicator.setVisible(true);
    });

    this.events.on(
      "nodeDragEnd",
      (dragNode: Node, pointer: Phaser.Input.Pointer) => {
        const targetNode = findNodeAtPoint(this.nodes, pointer.x, pointer.y);
        if (targetNode === null) {
          this.dragIndicator.destroy();
          return;
        }
        const currentTroops = dragNode.getTroops();
        const newTroopCount = currentTroops * 0.5;
        const difference = currentTroops - newTroopCount;

        // Attack a non-friendly node
        if (dragNode.owner !== targetNode.owner) {
          dragNode.setTroops(newTroopCount);
          targetNode.setTroops(targetNode.getTroops() - difference);
          // Conquer the node
          if (targetNode.getTroops() < 0) {
            targetNode.setOwnerAndColor(this.currentUserId);
            targetNode.setTroops(targetNode.getTroops() * -1);
          }
          // Move troops among friendly nodes
        } else {
          dragNode.setTroops(newTroopCount);
          targetNode.setTroops(targetNode.getTroops() + difference);
        }
        this.dragIndicator.destroy();
        this.updateEdges();
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
    const testCircle = new Phaser.Geom.Circle(x, y, 50); // Try placing with default margin.
    for (const node of this.nodes) {
      if (
        Phaser.Geom.Intersects.CircleToRectangle(testCircle, node.getBounds())
      ) {
        return;
      }
    }
    const newNode = new Node(this, x, y, productionRate, owner);
    this.nodes.push(newNode);
  }

  private deleteNodes(): void {
    for (const node of this.nodes) {
      node.destroyChildren();
      node.destroy();
    }
    this.nodes = [];
    for (const edge of this.edges) {
      edge.destroy();
    }
    this.edges = [];
  }

  private updateEdges(): void {
    for (const edge of this.edges) {
      edge.destroy();
    }
    this.edges = [];

    const newEdges: Phaser.GameObjects.Line[] = [];
    for (const node of this.nodes) {
      const closestNodes = this.getClosestNodes(node, 2);
      for (const targetNode of closestNodes) {
        const edgeColor =
          node.owner !== "" && targetNode.owner !== ""
            ? Color.DEFAULT_PLAYER_COLOR
            : Color.OUTSIDE;
        const edge = new Phaser.GameObjects.Line(
          this,
          0,
          0,
          node.x,
          node.y,
          targetNode.x,
          targetNode.y,
          edgeColor,
          1.0
        );
        edge.setLineWidth(4);
        edge.setOrigin(0, 0);
        newEdges.push(edge);
      }
    }

    const uniqueEdges = this.removeDuplicateEdges(newEdges);

    for (const uniqueEdge of uniqueEdges) {
      this.add.existing(uniqueEdge);
      this.edges.push(uniqueEdge);
    }
  }

  private removeDuplicateEdges(
    newEdges: Phaser.GameObjects.Line[]
  ): Phaser.GameObjects.Line[] {
    const seen = new Set<string>();
    return newEdges.filter((edge) => {
      console.log(
        `${edge.getCenter().x.toFixed()},${edge.getCenter().y.toFixed(0)}`
      );
      const key = `${edge.getCenter().x.toFixed()},${edge
        .getCenter()
        .y.toFixed(0)}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  private getClosestNodes(sourceNode: Node, maxConnections: number): Node[] {
    const distances: { circle: Node; distance: number }[] = [];
    for (const node of this.nodes) {
      const distance = Phaser.Math.Distance.Between(
        sourceNode.x,
        sourceNode.y,
        node.x,
        node.y
      );
      if (distance == 0) {
        continue;
      }
      distances.push({ circle: node, distance });
    }

    distances.sort((a, b) => a.distance - b.distance);
    return distances
      .slice(0, Math.min(maxConnections, distances.length))
      .map((entry) => entry.circle);
  }

  public update(timestep: number, dt: number): void {
    this.debugUI.update(
      timestep,
      dt,
      this.pointerCoords,
      this.nodes.length,
      this.edges.length,
      this.currentUserId
    );
    this.statisticsUI.update(timestep, dt, this.nodes, this.currentUserId);
    for (const node of this.nodes) {
      node.update(timestep, dt);
    }
  }
}
