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

// クエリを順に実行するasync関数
async function executeQueries() {
  await runQuery(`CREATE TABLE books (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL UNIQUE
    )`);
  console.log("Table created");

  try {
    await runQuery("INSERT INTO books (title) VALUES (?)", []);
    console.log("Inserted");
  } catch (err) {
    console.error(err.message);
  }

  try {
    const rows = await allQuery("SELECT * FROM AAAA");
    console.table(rows);
  } catch (err) {
    console.error(err.message);
  }

  await runQuery("DROP TABLE books");
  console.log("Table dropped");

  db.close();
}

executeQueries();
