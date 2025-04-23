export function toHexColor(color: number): string {
  return `#${(color & 0xffffff).toString(16).padStart(6, "0")}`;
}

export const Color: Record<string, number> = {
  DEFAULT_PLAYER_COLOR: 0x3d59a1,
  OUTSIDE: 0x1f2335,
  GAME_WINDOW: 0x1a1b26,
  TEXT_DEFAULT: 0xa9b1d6,
  TOOLTIP_BACKGROUND: 0x15161f,
  GRAY_LIGHT: 0x999999,
  GRAY_DARK: 0x444444,
  GREEN: 0x9ece6a,
  ORANGE: 0xff9e64,
  PURPLE: 0xbb9af7,
  RED: 0xf7768e,
  YELLOW: 0xe0af68,
};
