import { PlayerColor, PlayerColorValue } from "./Color.js";

interface KnownSettings {
  playerColor: PlayerColorValue;
}

const DEFAULT_SETTINGS: KnownSettings = {
  playerColor: PlayerColor.DEFAULT,
};

type Settings = KnownSettings & Record<string, unknown>;

function isPlayerColorValue(value: unknown): value is PlayerColorValue {
  return Object.values(PlayerColor).includes(value as PlayerColorValue);
}

const validators: Partial<
  Record<keyof KnownSettings, (value: unknown) => boolean>
> = {
  playerColor: isPlayerColorValue,
};

class SettingsManager {
  private static _instance: SettingsManager;
  private settings: Settings;

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

  private loadSettings(): Settings {
    try {
      const raw = localStorage.getItem("settings");
      const parsed = raw ? JSON.parse(raw) : {};
      return this.validateSettings(parsed);
    } catch (e) {
      console.warn("Invalid settings in localStorage, using defaults.", e);
      return { ...DEFAULT_SETTINGS };
    }
  }

  private validateSettings(data: unknown): Settings {
    const validated: Settings = { ...DEFAULT_SETTINGS };

    if (typeof data === "object" && data !== null) {
      for (const [key, value] of Object.entries(data)) {
        if (
          key in validators &&
          validators[key as keyof KnownSettings]?.(value)
        ) {
          validated[key] = value;
        } else if (!(key in DEFAULT_SETTINGS)) {
          validated[key] = value;
        }
      }
    }

    return validated;
  }

  private saveSettings(): void {
    localStorage.setItem("settings", JSON.stringify(this.settings));
  }

  public get<K extends keyof KnownSettings>(key: K): KnownSettings[K];
  public get<T = unknown>(key: string): T | undefined;
  public get(key: string): unknown {
    return this.settings[key];
  }

  public set<K extends keyof KnownSettings>(
    key: K,
    value: KnownSettings[K]
  ): void;
  public set<T = unknown>(key: string, value: T): void;
  public set(key: string, value: unknown): void {
    if (key in validators && !validators[key as keyof KnownSettings]?.(value)) {
      console.warn(`Invalid value for key: ${key}`);
      return;
    }
    this.settings[key] = value;
    this.saveSettings();
  }

  public getAll(): Settings {
    return { ...this.settings };
  }

  public resetToDefaults(): void {
    this.settings = { ...DEFAULT_SETTINGS };
    this.saveSettings();
  }
}

export default SettingsManager.instance;
