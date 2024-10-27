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
 * getをPromiseでラップした関数
 * @param {String} query SQL
 * @param {*} params パラメータ
 * @returns promise
 */
function getQuery(query, params = []) {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
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
    return runQuery("INSERT INTO books (title) VALUES (?)", ["タイトル1"]);
  })
  .then(() => {
    console.log("Inserted");
    return getQuery("SELECT * FROM books WHERE id = last_insert_rowid()");
  })
  .then((row) => {
    console.log(row.id);
    return allQuery("SELECT * FROM books");
  })
  .then((rows) => {
    console.table(rows);
    return runQuery("DROP TABLE books");
  })
  .then(() => {
    console.log("Table dropped");
    db.close();
  });
