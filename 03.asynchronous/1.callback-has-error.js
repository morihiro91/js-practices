import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

// テーブルを作成する
db.run(
  `CREATE TABLE books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL UNIQUE
  )`,
  function (err) {
    if (err) {
      console.error(err.message);
    }

    // レコードを追加し、自動採番された ID を標準出力に出力する
    db.run("INSERT INTO books (title) VALUES (?)", [], function (err) {
      if (err) {
        console.error(err.message);
      }

      // レコードを取得し、それを標準出力に出力する
      db.all("SELECT * FROM AAAA", (err) => {
        if (err) {
          console.error(err.message);
        }

        // テーブルを削除する
        db.run("DROP TABLE books", (err) => {
          if (err) {
            console.error(err.message);
          }
          db.close();
        });
      });
    });
  },
);
