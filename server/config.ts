import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawConfig = fs.readFileSync(
  path.resolve(__dirname, "settings.json"),
  "utf-8"
);
const settings = JSON.parse(rawConfig);

const dbFile = path.resolve(__dirname, "datadir", settings.database.file);

console.log(__dirname);

if (settings.database.ensureDir) {
  const dir = path.dirname(dbFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export const config = {
  dbFile,
};
