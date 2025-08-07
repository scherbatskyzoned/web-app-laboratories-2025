'use strict';
/* Data Access Object (DAO) module for accessing films data */

const sqlite = require('sqlite3');
const dayjs = require('dayjs');

// open the database
const db = new sqlite.Database('films.db', (err) => {
  if (err) throw err;
});


const convertFilmFromDbRecord = (dbRecord) => {
  const film = {};
  film.id = dbRecord.id;
  film.title = dbRecord.title;
  film.favorite = dbRecord.favorite;
  //film.watchDate = dbRecord.watchdate ? dayjs(dbRecord.watchdate) : "";
  film.watchDate = dbRecord.watchDate;
  film.rating = dbRecord.rating;

  /* // ALTERNATIVE:
  // WARNING: the column names in the database are all lowercases. JSON object requires camelCase as per the API specifications we defined.
  // We convert "watchdate" to the camelCase version ("watchDate").
  // Object.assign will copy all fields returned by the DB (i.e., all columns if SQL SELECT did not specify otherwise)
  const film = Object.assign({}, e, { watchDate: e.watchdate? dayjs(e.watchdate) : "" });  // adding camelcase "watchDate"
  delete film.watchdate;  // removing lowercase "watchdate"
  */
  return film;
}


// get all films w/ filter option
exports.listFilms = (filter='all') => {
  return new Promise((resolve, reject) => {
    let sql;
    
    switch (filter.toLowerCase()) {
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
    console.log("sql query:", sql)

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
}


exports.searchFilms = (searchString) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM films WHERE title LIKE ?';
    // NOTE: DO NOT construct SQL string directly as ... 'title LIKE %'+searchString+'%'; // NO!!!
    const sqlSearchString = '%'+searchString+'%';
    db.all(sql, [ sqlSearchString ], (err, rows) => {
      if (err) { reject(err); }

      const films = rows.map((e) => {
        const film = convertFilmFromDbRecord(e);
        delete film.watchdate;  // removing lowercase "watchdate"
        return film;
      });
      resolve(films);
    });
  });

}


// Retrieves a film given its id
exports.getFilm = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM films WHERE id=?";
    db.get(sql, [id], (err, row) => {
      if (err)
        reject(err);
      if (row == undefined) 
        resolve({error: 'Film not found.'});
      else {
        const film = { id: row.id, title: row.title, favorite: row.favorite, watchDate: row.watchDate ? dayjs(row.watchDate) : "", rating: row.rating ? row.rating : 0 }
        resolve(film);
      }
    })
  });
}


// add a film to the films table
exports.addFilm = (film) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO films (title, favorite, watchDate, rating) VALUES (?, ?, ?, ?)';
  
    db.run(sql, 
      [film.title, film.favorite, film.watchDate ? film.watchDate : null, film.rating ? film.rating : 0], 
      function(err) {
        if (err) 
          reject(err);
        // Returning the newly created object with the DB additional properties (i.e., unique id) to the client.
        resolve(exports.getFilm(this.lastID));
      });
  });
}

exports.updateFilm = (id, film) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE films SET title = ?, favorite = ?, watchDate = ?, rating = ? WHERE id = ?";
    db.run(sql, [film.title, film.favorite, film.watchDate, film.rating, id], function(err) {
      if (err)
        reject(err);
      if (this.changes !== 1)
        resolve({error: 'Film not found.'});
      resolve(exports.getFilm(id));        
    })
  })
}

exports.updateFilmRating = (id, deltaRating) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE films SET rating=rating+? WHERE id=?";
    db.run(sql, [deltaRating, id], function(err) {
      if (err)
        reject(err);
      if (this.changes !== 1)
        resolve({error: 'Film not found.'});
      resolve(exports.getFilm(id));
    })
  })
}


exports.deleteFilm = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM films WHERE id = ?";

    db.run(sql, [id], function (err) {
      if (err) 
        reject(err);
      resolve(this.changes);
    });
  });
}