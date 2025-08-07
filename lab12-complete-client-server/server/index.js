'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const {check, validationResult} = require('express-validator'); // validation middleware
const dao = require('./dao'); // module for accessing the DB.  NB: use ./ syntax for files in the same dir
const cors = require('cors');

// init express
const app = express();
const port = 3001;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json()); // To automatically decode incoming json
app.use(cors());

const maxTitleLength = 160;

// This function is used to format express-validator errors as strings
const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return `${location}[${param}]: ${msg}`;
};

/*** APIs ***/

// 1. Retrieve the list of all the available films.
// GET /api/films
// This route also handles "filter=?" (optional) query parameter, accessed via  req.query.filter
app.get('/api/films', (req, res) => {
  dao.listFilms(req.query.filter)
    .then(films => setTimeout(() => res.json(films), 1000) )
    .catch((err) => {
      console.log(err);
      res.status(503).json({error: 'Database error'});
    });
});

// 1bis. OPTIONAL: Retrieve the list of films where the title contains a given string.
// GET /api/searchFilms?titleSubstring=...
// This API could be merged with the previous one, if the same route name is desired
app.get('/api/searchFilms', 
  (req, res) => {
    // get films that match optional filter in the query
    dao.searchFilms(req.query.titleSubstring)
      .then(films => res.json(films))
      .catch((err) => {
          console.log(err);  // Logging errors is expecially useful while developing, to catch SQL errors etc.
          res.status(503).json({ error: 'Database error' });
        }); // always return a json and an error message
  }
);


// 2. Retrieve a film, given its “id”.
// GET /api/films/<id>
// Given a film id, this route returns the associated film from the library.
app.get('/api/films/:id',
  [ check('id').isInt({min: 1}) ],    // check: is the id an integer, and is it a positive integer?
  async (req, res) => {
    // Is there any validation error?
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json( errors.errors ); // error message is sent back as a json with the error info
    }
    try {
      const result = await dao.getFilm(req.params.id);
      if (result.error)   // If not found, the function returns a resolved promise with an object where the "error" field is set
        res.status(404).json(result);
      else
        res.json(result);
    } catch (err) {
      console.log(err);  // Logging errors is expecially useful while developing, to catch SQL errors etc.
      res.status(500).end();
    }
  }
);


// 3. Create a new film, by providing all relevant information.
// POST /api/films
// This route adds a new film to film library.
app.post('/api/films', 
  [check('title').isLength({min: 1, max: maxTitleLength}), 
   check('favorite').isBoolean(),
   check('watchDate').isLength({min: 10, max:10}).isISO8601({strict:true}).optional({checkFalsy: true}),
   check('rating').isInt({min:0, max:5})
  ],
  async (req, res) => {
   
    console.log(req.body.rating);
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json( errors.errors ); // error message is sent back as a json with the error info
    }

    const film = {
      title: req.body.title,
      favorite: req.body.favorite,
      watchDate: req.body.watchDate,
      rating: req.body.rating
    }; 
    
    try {
      const result = dao.addFilm(film);
      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(503).json({error: 'Database error'});
    }

})


// 4. Update an existing film, by providing all the relevant information
// PUT /api/films/<id>
// This route allows to modify a film, specifiying its id and the necessary data.
app.put('/api/films/:id',
  [
    check('id').isInt({min: 1}),    // check: is the id an integer, and is it a positive integer?
    check('title').isLength({min: 1, max: maxTitleLength}).optional(),
    check('favorite').isBoolean().optional(),
    // only date (first ten chars) and valid ISO 
    check('watchDate').isLength({min: 10, max: 10}).isISO8601({strict: true}).optional({checkFalsy: true}),
    check('rating').isInt({min: 1, max: 5}).optional({ nullable: true })
    //oneOf([check('rating').isInt({min: 1, max: 5}), check('rating').isEmpty()] )
  ],
  async (req, res) => {
    // Is there any validation error?
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json( errors.errors ); // error message is sent back as a json with the error info
    }

    const filmId = Number(req.params.id);
    // Is the id in the body present? If yes, is it equal to the id in the url?
    if (req.body.id && req.body.id !== filmId) {
      return res.status(422).json({ error: 'URL and body id mismatch' });
    }


    try {
      const film = await dao.getFilm(filmId);
      if (film.error)   // If not found, the function returns a resolved promise with an object where the "error" field is set
        return res.status(404).json(film);
      const newFilm = {
        title: req.body.title || film.title,
        favorite: req.body.hasOwnProperty('favorite') ? req.body.favorite : film.favorite,  // Careful. 0 value will always use the right part with || operator
        watchDate: req.body.watchDate || film.watchDate,
        rating: req.body.rating || film.rating,
      };
      const result = await dao.updateFilm(film.id, newFilm);
      if (result.error)
        res.status(404).json(result);
      else
        res.json(result); 
    } catch (err) {
      console.log(err);  // Logging errors is expecially useful while developing, to catch SQL errors etc.
      res.status(503).json({ error: 'Database error' });
    }
  }
);

// 5. Mark an existing film as favorite/unfavorite
// PUT /api/films/<id>/favorite 
// This route changes only the favorite value, and it is idempotent. It could also be a PATCH method.
app.put('/api/films/:id/favorite',
  [
    check('id').isInt({min: 1}),    // check: is the id an integer, and is it a positive integer?
    check('favorite').isBoolean(),
  ],
  async (req, res) => {
    // Is there any validation error?
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json( errors.errors ); // error message is sent back as a json with the error info
    }

    const filmId = Number(req.params.id);
    // Is the id in the body present? If yes, is it equal to the id in the url?
    if (req.body.id && req.body.id !== filmId) {
      return res.status(422).json({ error: 'URL and body id mismatch' });
    }

    try {
      const film = await dao.getFilm(filmId);
      if (film.error)   // If not found, the function returns a resolved promise with an object where the "error" field is set
        return res.status(404).json(film);
      film.favorite = req.body.favorite;  // update favorite property
      const result = await dao.updateFilm(film.id, film);
      return res.json(result); 
    } catch (err) {
      console.log(err);  // Logging errors is expecially useful while developing, to catch SQL errors etc.
      res.status(503).json({ error: 'Database error' });
    }
  }
);

// 6. Change the rating of a specific film
// POST /api/films/<id>/change-rating 
// This route changes the rating value. Note that it must be a POST, not a PUT, because it is NOT idempotent.
app.post('/api/films/change-rating',
  [ // These checks will apply to the req.body part
    check('id').isInt({min: 1}),
    check('deltaRating').isInt({ min: -4, max: 4 }),
  ],
  async (req, res) => {
    // Is there any validation error?
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json( errors.errors ); // error message is sent back as a json with the error info
    }

    try {
      /* IMPORTANT NOTE: Only for the purpose of this class, DB operations done in the SAME API
      (such as the following ones) are assumed to be performed without interference from other requests to the DB.
      In a real case a DB transaction/locking mechanisms should be used. Sqlite does not help in this regard.
      Thus querying DB with transactions can be avoided for the purpose of this class. */
      
      // NOTE: Check if the film exists and the result is a valid rating, before performing the operation
      const film = await dao.getFilm(req.body.id);
      if (film.error)
        return res.status(404).json(film);
      if (!film.rating)
        return res.status(422).json({error: `Modification of rating not allowed because rating is not set`});
      const deltaRating = req.body.deltaRating;
      if (film.rating + deltaRating > 5 || film.rating + deltaRating < 1)
        return res.status(422).json({error: `Modification of rating would yield a value out of valid range`});
      const result = await dao.updateFilmRating(film.id, deltaRating);
      return res.json(result); 
    } catch (err) {
      console.log(err);  // Logging errors is expecially useful while developing, to catch SQL errors etc.
      res.status(503).json({ error: 'Database error' });
    }
  }
);


// 7. Delete an existing film, given its "id"
// DELETE /api/films/<id>
// Given a film id, this route deletes the associated film from the library.
app.delete('/api/films/:id',
  [ check('id').isInt({min: 1}) ],
  async (req, res) => {
    try {
      // NOTE: if there is no film with the specified id, the delete operation is considered successful.
      const numChanges = await dao.deleteFilm(req.params.id);
      //res.status(200).end();
      res.status(200).json(numChanges);
    } catch (err) {
      console.log(err);  // Logging errors is expecially useful while developing, to catch SQL errors etc.
      res.status(503).json({ error: 'Database error' });
    }
  }
);




/*** Other express-related instructions ***/

// Activate the server
app.listen(port, (err) => {
  if (err)
    console.log(err);
  else
    console.log(`qa-server listening at http://localhost:${port}`);
});
