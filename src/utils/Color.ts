type ColorEntry = {
  hexString: string;
  hexNumber: number;
};

export const Color: Record<string, ColorEntry> = {
  OUTSIDE: {
    hexString: "#1f2335",
    hexNumber: 0x1f2335,
  },
  GAME_WINDOW: {
    hexString: "#1a1b26",
    hexNumber: 0x1a1b26,
  },
  TEXT_DEFAULT: {
    hexString: "#a9b1d6",
    hexNumber: 0xa9b1d6,
  },
  TOOLTIP_BACKGROUND: {
    hexString: "#15161f",
    hexNumber: 0x15161f,
  },
  GRAY: {
    hexString: "#999999",
    hexNumber: 0x999999,
  },
  GREEN: {
    hexString: "#9ece6a",
    hexNumber: 0x9ece6a,
  },
  ORANGE: {
    hexString: "#ff9e64",
    hexNumber: 0xff9e64,
  },
  PURPLE: {
    hexString: "#bb9af7",
    hexNumber: 0xbb9af7,
  },
  RED: {
    hexString: "#f7768e",
    hexNumber: 0xf7768e,
  },
  YELLOW: {
    hexString: "#e0af68",
    hexNumber: 0xe0af68,
  },
};
