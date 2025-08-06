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


/*** APIs ***/

// GET /api/films
app.get('/api/films', (req, res) => {
  dao.listFilms(req.query.filter)
    .then(films => setTimeout(() => res.json(films), 1000) )
    .catch(() => res.status(500).end());
});


/*** Other express-related instructions ***/

// Activate the server
app.listen(port, (err) => {
  if (err)
    console.log(err);
  else
    console.log(`qa-server listening at http://localhost:${port}`);
});
