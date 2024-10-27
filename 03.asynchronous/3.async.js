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

// クエリを順に実行するasync関数
async function executeQueries() {
  try {
    await runQuery(`CREATE TABLE books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL UNIQUE
    )`);
    console.log("Table created");

    await runQuery("INSERT INTO books (title) VALUES (?)", ["タイトル1"]);
    console.log("Inserted");

    const row = await getQuery(
      "SELECT * FROM books WHERE id = last_insert_rowid()",
    );
    console.log(row.id);

    const rows = await allQuery("SELECT * FROM books");
    console.table(rows);

    await runQuery("DROP TABLE books");
    console.log("Table dropped");
  } finally {
    db.close();
  }
}

executeQueries();
