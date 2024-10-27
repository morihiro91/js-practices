import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

// テーブルを作成する
db.run(
  `CREATE TABLE books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL UNIQUE
  )`,
  function () {
    console.log("Table created");

    // レコードを追加し、自動採番された ID を標準出力に出力する
    db.run("INSERT INTO books (title) VALUES (?)", ["タイトル1"], function () {
      console.log(`Inserted`);
      db.get("SELECT * FROM books WHERE id = last_insert_rowid()", (_, row) => {
        console.log(row.id);

        // レコードを取得し、それを標準出力に出力する
        db.all("SELECT * FROM books", (_, row) => {
          console.table(row);

          // テーブルを削除する
          db.run("DROP TABLE books", () => {
            console.log("Table dropped");
            db.close();
          });
        });
      });
    });
  },
);
