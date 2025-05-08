import Database, { Database as SQLiteDatabase, Statement } from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class SQLiteService {
  private db: SQLiteDatabase;

  constructor(dbFileName: string = 'database.sqlite') {
    const dbPath = path.resolve(__dirname, '..', '..', dbFileName);
    this.db = new Database(dbPath);
  }

  run(sql: string, params: any[] = []): void {
    const stmt = this.db.prepare(sql);
    stmt.run(...params);
  }

  get(sql: string, params: any[] = []): any | undefined {
    const stmt = this.db.prepare(sql);
    return stmt.get(...params);
  }

  all(sql: string, params: any[] = []): any[] {
    const stmt = this.db.prepare(sql);
    return stmt.all(...params);
  }

  transaction(fn: () => void): void {
    const trx = this.db.transaction(fn);
    trx();
  }

  close(): void {
    this.db.close();
  }
}

export function initDB(datafile: string): SQLiteService {
    const db = new SQLiteService(datafile);

    db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )
    `);

    return db;
} 
