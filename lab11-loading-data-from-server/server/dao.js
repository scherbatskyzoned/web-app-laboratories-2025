'use strict';
/* Data Access Object (DAO) module for accessing films data */

const sqlite = require('sqlite3');
const dayjs = require('dayjs');

// open the database
const db = new sqlite.Database('films.db', (err) => {
  if (err) throw err;
});


// get all films w/ filter option
exports.listFilms = (filter='all') => {
  return new Promise((resolve, reject) => {
    let sql;
    switch (filter) {
      case "favorite":
        sql = "SELECT * FROM films WHERE favorite=1";
        break;
      case "best":
        sql = "SELECT * FROM films WHERE rating=5";
        break;
      case "lastmonth":
        sql = "SELECT * FROM films WHERE watchDate IS NOT NULL AND watchDate >= DATE('now', '-1 month')";
        break;
      case "unseen":
        sql = "SELECT * FROM films WHERE watchDate IS NULL";
        break;
      default:
        sql = 'SELECT * FROM films';
    }

    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      // if watchDate is null: empty string
      // if rating is null: zero
      const films = rows.map((e) => ({ id: e.id, title: e.title, favorite: e.favorite, watchDate: e.watchDate ? dayjs(e.watchDate) : "", rating: e.rating ? e.rating : 0 }));
      
      resolve(films);
    });
  });
};