import sqlite3 from "sqlite3";
const db = new sqlite3.Database(":memory:");

/**
 * runをPromiseでラップした関数
 * @param {String} query SQL
 * @param {*} params パラメータ
 * @returns promise
 */
function runQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
}

/**
 * allをPromiseでラップした関数
 * @param {String} query SQL
 * @param {*} params パラメータ
 * @returns promise
 */
function allQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

// クエリを順に実行
runQuery(`CREATE TABLE books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL UNIQUE
)`)
  .then(() => {
    console.log("Table created");
    return runQuery("INSERT INTO books (title) VALUES (?)", []).catch((err) => {
      console.error(err.message);
    });
  })
  .then(() => {
    console.log("Inserted");
    return allQuery("SELECT * FROM AAAA").catch((err) => {
      console.error(err.message);
    });
  })
  .then(() => {
    return runQuery("DROP TABLE books");
  })
  .then(() => {
    console.log("Table dropped");
    db.close();
  });
