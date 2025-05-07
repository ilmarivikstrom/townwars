import { Color, toHexColor } from "../utils/Color.js";
import { Layers } from "../utils/Config.js";
export default class DebugUI {
    constructor(scene) {
        this.scene = scene;
        this.text = this.scene.add.text(24, 24, "", {
            backgroundColor: toHexColor(Color.TOOLTIP_BACKGROUND),
            color: toHexColor(Color.TEXT_DEFAULT),
            padding: { x: 12, y: 12 },
            fontFamily: "CaskaydiaMono",
        });
        this.text.setDepth(Layers.UI);
        this.text.setAlpha(1.0);
    }
    toggleVisibility() {
        this.text.setVisible(!this.text.visible);
    }
    update(timestep, dt, numNodes, numEdges, userId) {
        this.text.setText("time: " +
            (timestep / 1000).toFixed(2) +
            "s\n" +
            "dt: " +
            dt.toFixed(2) +
            "ms\n" +
            "nodes: " +
            numNodes.toString() +
            "\n" +
            "edges: " +
            numEdges.toString() +
            "\nPlayer ID: " +
            userId +
            "\n\nCTRL + LMB to place a vacant node" +
            "\nSHIFT + LMB to place your node" +
            "\nRMB to delete a node" +
            "\n'C' to clear graph" +
            "\n\n'D' to toggle this UI");
    }
    destroy() {
        this.text.destroy();
    }
}
//# sourceMappingURL=DebugUI.js.map