import { Module, Global } from '@nestjs/common';
import Database from 'better-sqlite3';
import * as path from 'path';

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../task-manager.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id          TEXT PRIMARY KEY,
    title       TEXT NOT NULL,
    description TEXT,
    status      TEXT NOT NULL DEFAULT 'not_started',
    priority    TEXT NOT NULL DEFAULT 'medium',
    estimate    REAL,
    parent_id   TEXT REFERENCES tasks(id) ON DELETE CASCADE,
    created_at  TEXT NOT NULL,
    updated_at  TEXT NOT NULL
  )
`);

export const DATABASE_TOKEN = 'DATABASE';

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_TOKEN,
      useValue: db,
    },
  ],
  exports: [DATABASE_TOKEN],
})
export class DatabaseModule {}