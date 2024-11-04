import sqlite3 from "sqlite3";

export class MemoDatabase {
  constructor() {
    this.db = new sqlite3.Database("./memos.db");
  }

  create() {
    this.db.run(`
      CREATE TABLE IF NOT EXISTS memos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        UNIQUE(id)
      )
    `);
  }

  add(content, callback) {
    this.db.run("INSERT INTO memos (content) VALUES (?)", content, callback);
  }

  get(id, callback) {
    this.db.get("SELECT * FROM memos WHERE id = ?", id, callback);
  }

  all(callback) {
    this.db.all("SELECT id, content FROM memos", callback);
  }

  delete(id, callback) {
    this.db.run("DELETE FROM memos WHERE id = ?", id, callback);
  }
}
