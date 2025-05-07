import { PlayerColor, PlayerColorValue } from "./Color.js";

interface GameSettings {
  playerColor: PlayerColorValue;
}

const DEFAULT_SETTINGS: GameSettings = {
  playerColor: PlayerColor.DEFAULT,
};

function isPlayerColorValue(value: unknown): value is PlayerColorValue {
  return Object.values(PlayerColor).includes(value as PlayerColorValue);
}

class SettingsManager {
  private static _instance: SettingsManager;
  private settings: GameSettings;

  private constructor() {
    this.settings = this.loadSettings();
    this.saveSettings();
  }

  public static get instance(): SettingsManager {
    if (!SettingsManager._instance) {
      SettingsManager._instance = new SettingsManager();
    }
    return SettingsManager._instance;
  }

  private loadSettings(): GameSettings {
    try {
      const raw = localStorage.getItem("settings");
      const parsed = raw ? JSON.parse(raw) : {};
      return this.validateSettings(parsed);
    } catch (e) {
      console.warn("Invalid settings in localStorage, using defaults.", e);
      return { ...DEFAULT_SETTINGS };
    }
  }

  private validateSettings(data: unknown): GameSettings {
    const validated: GameSettings = { ...DEFAULT_SETTINGS };

    if (typeof data === "object" && data !== null && "playerColor" in data) {
      const maybeColor = (data as Record<string, unknown>).playerColor;
      if (isPlayerColorValue(maybeColor)) {
        validated.playerColor = maybeColor;
      }
    }

    return validated;
  }

  private saveSettings(): void {
    localStorage.setItem("settings", JSON.stringify(this.settings));
  }

  public get<K extends keyof GameSettings>(key: K): GameSettings[K] {
    return this.settings[key];
  }

  public set<K extends keyof GameSettings>(
    key: K,
    value: GameSettings[K]
  ): void {
    if (key in DEFAULT_SETTINGS) {
      this.settings[key] = value;
      this.saveSettings();
    } else {
      console.warn(`Attempted to set invalid key: ${String(key)}`);
    }
  }

  public getAll(): GameSettings {
    return { ...this.settings };
  }
}

export default SettingsManager.instance;
