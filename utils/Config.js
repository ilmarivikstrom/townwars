export const Config = {
    PADDING_ELEMENTS: 24,
    PADDING_TEXT: 12,
    SPACING_TEXT: 12,
    WINDOW_WIDTH: 1280,
    WINDOW_HEIGHT: 720,
};
export var Layers;
(function (Layers) {
    Layers[Layers["BACKGROUND"] = 0] = "BACKGROUND";
    Layers[Layers["EDGE"] = 1] = "EDGE";
    Layers[Layers["NODE_LIGHT"] = 2] = "NODE_LIGHT";
    Layers[Layers["DRAG_LINE"] = 3] = "DRAG_LINE";
    Layers[Layers["NODE_BASE"] = 4] = "NODE_BASE";
    Layers[Layers["NODE_CONTENT"] = 5] = "NODE_CONTENT";
    Layers[Layers["NODE_TOOLTIP"] = 6] = "NODE_TOOLTIP";
    Layers[Layers["UI"] = 7] = "UI";
})(Layers || (Layers = {}));
export const Keys = {
    CLEAR: "C",
    DEBUG_UI_TOGGLE: "D",
    VACANT_NODE_MODIFIER: "CTRL",
    VACANT_NODE_MODIFIER_MAC: "A",
    OWN_NODE_MODIFIER: "SHIFT",
    QUIT: "ESC",
    STRENGTH_0: "ONE",
    STRENGTH_1: "TWO",
    STRENGTH_2: "THREE",
    STRENGTH_3: "FOUR",
};
export const ATTACK_STRENGTHS = [0.25, 0.5, 0.75, 1.0];
//# sourceMappingURL=Config.js.map