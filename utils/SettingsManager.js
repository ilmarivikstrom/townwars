import { PlayerColor } from "./Color.js";
const DEFAULT_SETTINGS = {
    playerColor: PlayerColor.DEFAULT,
};
function isPlayerColorValue(value) {
    return Object.values(PlayerColor).includes(value);
}
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
        if (typeof data === "object" && data !== null && "playerColor" in data) {
            const maybeColor = data.playerColor;
            if (isPlayerColorValue(maybeColor)) {
                validated.playerColor = maybeColor;
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
        if (key in DEFAULT_SETTINGS) {
            this.settings[key] = value;
            this.saveSettings();
        }
        else {
            console.warn(`Attempted to set invalid key: ${String(key)}`);
        }
    }
    getAll() {
        return { ...this.settings };
    }
}
export default SettingsManager.instance;
//# sourceMappingURL=SettingsManager.js.map