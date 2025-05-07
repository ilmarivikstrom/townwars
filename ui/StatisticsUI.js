import { Color, toHexColor } from "../utils/Color.js";
import { Config, Layers } from "../utils/Config.js";
import { formatCompactNumber } from "../utils/Math.js";
export default class StatisticsUI {
    constructor(scene) {
        this.scene = scene;
        this.text = this.scene.add.text(Config.WINDOW_WIDTH - Config.PADDING_ELEMENTS, Config.PADDING_ELEMENTS, "", {
            backgroundColor: toHexColor(Color.TOOLTIP_BACKGROUND),
            color: toHexColor(Color.TEXT_DEFAULT),
            padding: { x: Config.PADDING_TEXT, y: Config.PADDING_TEXT },
            fontFamily: "CaskaydiaMono",
        });
        this.text.setOrigin(1, 0);
        this.text.setAlign("right");
        this.text.setDepth(Layers.UI);
        this.text.setAlpha(1.0);
    }
    toggleVisibility() {
        this.text.setVisible(!this.text.visible);
    }
    update(timestep, dt, nodes, currentUserId) {
        let totalTroops = 0;
        let productionRate = 0;
        for (const node of nodes) {
            if (node.owner === currentUserId) {
                totalTroops += node.getTroops();
                productionRate += node.getProductionRate();
            }
        }
        const totalTroopsCompact = formatCompactNumber(totalTroops);
        this.text.setText("Total troops: " +
            totalTroopsCompact +
            "\nTotal rate: " +
            productionRate.toString() +
            "/s");
    }
    destroy() {
        this.text.destroy();
    }
}
//# sourceMappingURL=StatisticsUI.js.map