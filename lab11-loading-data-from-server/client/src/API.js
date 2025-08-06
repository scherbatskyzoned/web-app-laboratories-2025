/**
 * All the API calls
 */

import dayjs from "dayjs";

const URL = 'http://localhost:3001/api';

async function getFilms(filter) {
  const filmList = [];
  // call  /api/films

  const response = filter ? await fetch(URL + `/films?filter=${filter}`) : await fetch(URL + `/films`);
  const films = await response.json();

  if (response.ok) {
    for (const e of films) // watchDate optional: "" if null, rating optional: 0 if null
      filmList.push({ id: e.id, title: e.title, favorite: e.favorite, watchDate: e.watchDate ? dayjs(e.watchDate) : "", rating: e.rating ? e.rating : 0 });
    return filmList;
  } else {
    throw films;  // expected to be a json object (coming from the server) with info about the error
  }
}

const API = { getFilms };

export default API;