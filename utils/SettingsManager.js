import { PlayerColor } from "./Color.js";
const DEFAULT_SETTINGS = {
    playerColor: PlayerColor.DEFAULT,
};
function isPlayerColorValue(value) {
    return Object.values(PlayerColor).includes(value);
}
const validators = {
    playerColor: isPlayerColorValue,
};
class SettingsManager {
    constructor() {
        this.settings = this.loadSettings();
        this.saveSettings();
    }
    static get instance() {
        if (!SettingsManager._instance) {
            SettingsManager._instance = new SettingsManager();
        }
        return SettingsManager._instance;
    }
    loadSettings() {
        try {
            const raw = localStorage.getItem("settings");
            const parsed = raw ? JSON.parse(raw) : {};
            return this.validateSettings(parsed);
        }
        catch (e) {
            console.warn("Invalid settings in localStorage, using defaults.", e);
            return { ...DEFAULT_SETTINGS };
        }
    }
    validateSettings(data) {
        const validated = { ...DEFAULT_SETTINGS };
        if (typeof data === "object" && data !== null) {
            for (const [key, value] of Object.entries(data)) {
                if (key in validators &&
                    validators[key]?.(value)) {
                    validated[key] = value;
                }
                else if (!(key in DEFAULT_SETTINGS)) {
                    validated[key] = value;
                }
            }
        }
        return validated;
    }
    saveSettings() {
        localStorage.setItem("settings", JSON.stringify(this.settings));
    }
    get(key) {
        return this.settings[key];
    }
    set(key, value) {
        if (key in validators && !validators[key]?.(value)) {
            console.warn(`Invalid value for key: ${key}`);
            return;
        }
        this.settings[key] = value;
        this.saveSettings();
    }
    getAll() {
        return { ...this.settings };
    }
    resetToDefaults() {
        this.settings = { ...DEFAULT_SETTINGS };
        this.saveSettings();
    }
}
export default SettingsManager.instance;
//# sourceMappingURL=SettingsManager.js.map