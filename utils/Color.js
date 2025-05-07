export function toHexColor(color) {
    return `#${(color & 0xffffff).toString(16).padStart(6, "0")}`;
}
export const Color = {
    MENU_BLUE: 0x3d59a1,
    GRID_MINOR_COLOR: 0x3d59a1,
    GRID_MAJOR_COLOR: 0xa9b1d6,
    OUTSIDE: 0x1f2335,
    GAME_WINDOW: 0x1a1b26,
    TEXT_DEFAULT: 0xa9b1d6,
    TOOLTIP_BACKGROUND: 0x15161f,
    GRAY_LIGHT: 0x999999,
    NODE_DEFAULT: 0x333333,
    GREEN: 0x9ece6a,
    PURPLE: 0xbb9af7,
    RED: 0xf7768e,
    YELLOW: 0xe0af68,
    BRONZE: 0xb4815b,
    SILVER: 0x8d989b,
    GOLD: 0xd6bf77,
    PLATINUM: 0x7bd1d8,
    DIAMOND: 0xa588f4,
    EDGE_DARK: 0x333344,
    BLACK: 0x000000,
};
export const PlayerColor = {
    DEFAULT: 0x3d59a1,
    ORANGE: 0xff9e64,
    RED: 0xf7768e,
};
//# sourceMappingURL=Color.js.map