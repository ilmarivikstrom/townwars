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
export var KeySpriteIndices;
(function (KeySpriteIndices) {
    KeySpriteIndices[KeySpriteIndices["A"] = 0] = "A";
    KeySpriteIndices[KeySpriteIndices["B"] = 1] = "B";
    KeySpriteIndices[KeySpriteIndices["C"] = 2] = "C";
    KeySpriteIndices[KeySpriteIndices["D"] = 3] = "D";
    KeySpriteIndices[KeySpriteIndices["E"] = 4] = "E";
    KeySpriteIndices[KeySpriteIndices["F"] = 5] = "F";
    KeySpriteIndices[KeySpriteIndices["G"] = 6] = "G";
    KeySpriteIndices[KeySpriteIndices["H"] = 7] = "H";
    KeySpriteIndices[KeySpriteIndices["I"] = 8] = "I";
    KeySpriteIndices[KeySpriteIndices["J"] = 9] = "J";
    KeySpriteIndices[KeySpriteIndices["K"] = 10] = "K";
    KeySpriteIndices[KeySpriteIndices["L"] = 11] = "L";
    KeySpriteIndices[KeySpriteIndices["M"] = 12] = "M";
    KeySpriteIndices[KeySpriteIndices["N"] = 13] = "N";
    KeySpriteIndices[KeySpriteIndices["O"] = 14] = "O";
    KeySpriteIndices[KeySpriteIndices["P"] = 15] = "P";
    KeySpriteIndices[KeySpriteIndices["Q"] = 16] = "Q";
    KeySpriteIndices[KeySpriteIndices["R"] = 17] = "R";
    KeySpriteIndices[KeySpriteIndices["S"] = 18] = "S";
    KeySpriteIndices[KeySpriteIndices["T"] = 19] = "T";
    KeySpriteIndices[KeySpriteIndices["U"] = 20] = "U";
    KeySpriteIndices[KeySpriteIndices["V"] = 21] = "V";
    KeySpriteIndices[KeySpriteIndices["W"] = 22] = "W";
    KeySpriteIndices[KeySpriteIndices["X"] = 23] = "X";
    KeySpriteIndices[KeySpriteIndices["Y"] = 24] = "Y";
    KeySpriteIndices[KeySpriteIndices["Z"] = 25] = "Z";
    KeySpriteIndices[KeySpriteIndices["ONE"] = 26] = "ONE";
    KeySpriteIndices[KeySpriteIndices["TWO"] = 27] = "TWO";
    KeySpriteIndices[KeySpriteIndices["THREE"] = 28] = "THREE";
    KeySpriteIndices[KeySpriteIndices["FOUR"] = 29] = "FOUR";
    KeySpriteIndices[KeySpriteIndices["FIVE"] = 30] = "FIVE";
    KeySpriteIndices[KeySpriteIndices["SIX"] = 31] = "SIX";
    KeySpriteIndices[KeySpriteIndices["SEVEN"] = 32] = "SEVEN";
    KeySpriteIndices[KeySpriteIndices["EIGHT"] = 33] = "EIGHT";
    KeySpriteIndices[KeySpriteIndices["NINE"] = 34] = "NINE";
    KeySpriteIndices[KeySpriteIndices["ZERO"] = 35] = "ZERO";
    KeySpriteIndices[KeySpriteIndices["BANG"] = 36] = "BANG";
    KeySpriteIndices[KeySpriteIndices["QUESTION"] = 37] = "QUESTION";
    KeySpriteIndices[KeySpriteIndices["COMMA"] = 38] = "COMMA";
    KeySpriteIndices[KeySpriteIndices["PERIOD"] = 39] = "PERIOD";
    KeySpriteIndices[KeySpriteIndices["SEMICOLON"] = 40] = "SEMICOLON";
    KeySpriteIndices[KeySpriteIndices["COLON"] = 41] = "COLON";
    KeySpriteIndices[KeySpriteIndices["UNDERSCORE"] = 42] = "UNDERSCORE";
    KeySpriteIndices[KeySpriteIndices["PLUS"] = 43] = "PLUS";
    KeySpriteIndices[KeySpriteIndices["MINUS"] = 44] = "MINUS";
    KeySpriteIndices[KeySpriteIndices["EQUALS"] = 45] = "EQUALS";
    KeySpriteIndices[KeySpriteIndices["ASTERISK"] = 46] = "ASTERISK";
    KeySpriteIndices[KeySpriteIndices["FLASH"] = 47] = "FLASH";
    KeySpriteIndices[KeySpriteIndices["HASHTAG"] = 48] = "HASHTAG";
    KeySpriteIndices[KeySpriteIndices["AT"] = 49] = "AT";
    KeySpriteIndices[KeySpriteIndices["PAREN_OPEN"] = 50] = "PAREN_OPEN";
    KeySpriteIndices[KeySpriteIndices["PAREN_CLOSE"] = 51] = "PAREN_CLOSE";
    KeySpriteIndices[KeySpriteIndices["BRACKET_OPEN"] = 52] = "BRACKET_OPEN";
    KeySpriteIndices[KeySpriteIndices["BRACKET_CLOSE"] = 53] = "BRACKET_CLOSE";
    KeySpriteIndices[KeySpriteIndices["AMPERSAND"] = 54] = "AMPERSAND";
    KeySpriteIndices[KeySpriteIndices["PERCENT"] = 55] = "PERCENT";
    KeySpriteIndices[KeySpriteIndices["DOLLAR"] = 56] = "DOLLAR";
    KeySpriteIndices[KeySpriteIndices["POUND"] = 57] = "POUND";
    KeySpriteIndices[KeySpriteIndices["CARET"] = 58] = "CARET";
    KeySpriteIndices[KeySpriteIndices["TICK"] = 59] = "TICK";
    KeySpriteIndices[KeySpriteIndices["LT"] = 60] = "LT";
    KeySpriteIndices[KeySpriteIndices["GT"] = 61] = "GT";
    KeySpriteIndices[KeySpriteIndices["ESC"] = 62] = "ESC";
    KeySpriteIndices[KeySpriteIndices["CTRL"] = 63] = "CTRL";
    KeySpriteIndices[KeySpriteIndices["ALT"] = 64] = "ALT";
})(KeySpriteIndices || (KeySpriteIndices = {}));
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