import { v4 as uuid } from "uuid";
import Phaser from "phaser";
import { ATTACK_STRENGTHS, Config, Keys, } from "../utils/Config.js";
import DebugUI from "../ui/DebugUI.js";
import DragIndicator from "../entities/DragIndicator.js";
import Node from "../entities/Node.js";
import StatisticsUI from "../ui/StatisticsUI.js";
import { Color } from "../utils/Color.js";
import { findNodeAtPoint } from "../utils/Math.js";
import SettingsManager from "../utils/SettingsManager.js";
import Grid from "../ui/Grid.js";
import StrengthUI from "../ui/StrengthUI.js";
import NotificationManager from "../ui/NotificationManager.js";
import { NotificationType } from "../ui/Notification.js";
export default class GameScene extends Phaser.Scene {
    constructor() {
        super("GameScene");
        this.nodes = [];
        this.edges = [];
        this.currentUserId = uuid();
        this.vacantNodeButtonDown = false;
        this.ownNodeButtonDown = false;
        this.currentStrength = ATTACK_STRENGTHS[1];
    }
    preload() {
        this.load.spritesheet("keys", "../../assets/sprites/keyboard.png", {
            frameWidth: 35,
            frameHeight: 39,
        });
    }
    create() {
        this.notificationManager = new NotificationManager(this);
        this.grid = new Grid(this);
        this.dragIndicator = new DragIndicator(this, 0, 0, 0, 0);
        this.debugUI = new DebugUI(this);
        this.statisticsUI = new StatisticsUI(this);
        this.strengthUI = new StrengthUI(this, Config.WINDOW_WIDTH / 2, Config.PADDING_ELEMENTS, this.currentStrength);
        this.input.on("pointerdown", (pointer) => {
            if (pointer.button === 0) {
                if (this.vacantNodeButtonDown) {
                    this.tryCreateNewNode(pointer.x, pointer.y, "");
                    this.updateEdges();
                }
                else if (this.ownNodeButtonDown) {
                    this.tryCreateNewNode(pointer.x, pointer.y, this.currentUserId);
                    this.updateEdges();
                }
            }
        });
        this.events.on("nodeSelect", (targetNode) => {
            this.selectOnly(targetNode);
        });
        this.events.on("nodeDelete", (targetNode) => {
            targetNode.destroyChildren();
            targetNode.destroy();
            this.nodes = this.nodes.filter((candidateNode) => candidateNode !== targetNode);
            this.updateEdges();
        });
        this.events.on("nodeDrag", (node, pointer) => {
            this.dragIndicator.destroy();
            if (!node.isOwnedByUser(this.currentUserId)) {
                return;
            }
            this.dragIndicator = new DragIndicator(this, node.x, node.y, pointer.x, pointer.y);
            this.dragIndicator.setVisible(true);
        });
        this.events.on("nodeDragEnd", (dragNode, pointer) => {
            const targetNode = findNodeAtPoint(this.nodes, pointer.x, pointer.y);
            if (targetNode === null) {
                this.dragIndicator.destroy();
                return;
            }
            const currentTroops = dragNode.getTroops();
            const newTroopCount = currentTroops * (1.0 - this.currentStrength);
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
            }
            else {
                dragNode.setTroops(newTroopCount);
                targetNode.setTroops(targetNode.getTroops() + difference);
            }
            this.dragIndicator.destroy();
            this.updateEdges();
        });
        this.events.on("strengthSelected", (strength) => {
            this.strengthUI.updateStrengthIndicator(strength);
            this.currentStrength = strength;
        });
        this.game.events.on("playerColorChanged", () => {
            for (const node of this.nodes) {
                node.setOwnerAndColor(node.owner);
                node.setPointLightColor();
            }
            this.updateEdges();
        });
        this.input.keyboard?.on(`keydown-${Keys.CLEAR}`, () => {
            this.deleteNodes();
        });
        this.input.keyboard?.on(`keydown-${Keys.DEBUG_UI_TOGGLE}`, () => {
            this.debugUI.toggleVisibility();
        });
        this.input.keyboard?.on(`keydown-${Keys.VACANT_NODE_MODIFIER}`, () => {
            this.vacantNodeButtonDown = true;
        });
        this.input.keyboard?.on(`keyup-${Keys.VACANT_NODE_MODIFIER}`, () => {
            this.vacantNodeButtonDown = false;
        });
        this.input.keyboard?.on(`keydown-${Keys.VACANT_NODE_MODIFIER_MAC}`, () => {
            this.vacantNodeButtonDown = true;
        });
        this.input.keyboard?.on(`keydown-${Keys.VACANT_NODE_MODIFIER_MAC}`, () => {
            this.vacantNodeButtonDown = false;
        });
        this.input.keyboard?.on(`keydown-${Keys.OWN_NODE_MODIFIER}`, () => {
            this.ownNodeButtonDown = true;
        });
        this.input.keyboard?.on(`keyup-${Keys.OWN_NODE_MODIFIER}`, () => {
            this.ownNodeButtonDown = false;
        });
        this.input.keyboard?.on(`keydown-${Keys.QUIT}`, () => {
            this.scene.switch("MainMenu");
        });
        this.input.keyboard?.on(`keydown-${Keys.STRENGTH_0}`, () => {
            this.strengthUI.updateStrengthIndicator(ATTACK_STRENGTHS[0]);
            this.currentStrength = ATTACK_STRENGTHS[0];
        });
        this.input.keyboard?.on(`keydown-${Keys.STRENGTH_1}`, () => {
            this.strengthUI.updateStrengthIndicator(ATTACK_STRENGTHS[1]);
            this.currentStrength = ATTACK_STRENGTHS[1];
        });
        this.input.keyboard?.on(`keydown-${Keys.STRENGTH_2}`, () => {
            this.strengthUI.updateStrengthIndicator(ATTACK_STRENGTHS[2]);
            this.currentStrength = ATTACK_STRENGTHS[2];
        });
        this.input.keyboard?.on(`keydown-${Keys.STRENGTH_3}`, () => {
            this.strengthUI.updateStrengthIndicator(ATTACK_STRENGTHS[3]);
            this.currentStrength = ATTACK_STRENGTHS[3];
        });
    }
    selectOnly(nodeToSelect) {
        for (const node of this.nodes) {
            if (node === nodeToSelect) {
                node.setSelected(true);
            }
            else {
                node.setSelected(false);
            }
        }
    }
    tryCreateNewNode(x, y, owner) {
        const productionRate = Math.floor(Math.random() * 5) + 1;
        const testCircle = new Phaser.Geom.Circle(x, y, 100); // Try placing with default margin.
        for (const node of this.nodes) {
            if (Phaser.Geom.Intersects.CircleToRectangle(testCircle, node.getBounds())) {
                this.notificationManager.showNotification("Node not created", `Not enough space`, NotificationType.WARNING);
                return;
            }
        }
        const newNode = new Node(this, x, y, productionRate, owner);
        this.notificationManager.showNotification("Node Created", `Production rate ${productionRate}.`, NotificationType.INFO);
        this.nodes.push(newNode);
    }
    deleteNodes() {
        for (const node of this.nodes) {
            node.destroyChildren();
            node.destroy();
        }
        this.nodes = [];
        for (const edge of this.edges) {
            edge.destroy();
        }
        this.edges = [];
        this.notificationManager.showNotification("Nodes cleared", `Enjoy the blank canvas`, NotificationType.INFO);
    }
    updateEdges() {
        for (const edge of this.edges) {
            edge.destroy();
        }
        this.edges = [];
        const newEdges = [];
        for (const node of this.nodes) {
            const closestNodes = this.getClosestNodes(node, 2);
            for (const targetNode of closestNodes) {
                const edgeColor = node.owner !== "" && targetNode.owner !== ""
                    ? SettingsManager.get("playerColor")
                    : Color.EDGE_DARK;
                const edge = new Phaser.GameObjects.Line(this, 0, 0, node.x, node.y, targetNode.x, targetNode.y, edgeColor, 1.0);
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
    removeDuplicateEdges(newEdges) {
        const seen = new Set();
        return newEdges.filter((edge) => {
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
    getClosestNodes(sourceNode, maxConnections) {
        const distances = [];
        for (const node of this.nodes) {
            const distance = Phaser.Math.Distance.Between(sourceNode.x, sourceNode.y, node.x, node.y);
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
    update(timestep, dt) {
        this.debugUI.update(timestep, dt, this.nodes.length, this.edges.length, this.currentUserId);
        this.statisticsUI.update(timestep, dt, this.nodes, this.currentUserId);
        for (const node of this.nodes) {
            node.update(timestep, dt);
        }
    }
}
//# sourceMappingURL=GameScene.js.map