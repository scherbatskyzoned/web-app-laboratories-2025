/**
 * All the API calls
 */

import dayjs from "dayjs";

const SERVER_URL = 'http://localhost:3001/api';


/**
 * A utility function for parsing the HTTP response.
 */
function getJson(httpResponsePromise) {
  // server API always return JSON, in case of error the format is the following { error: <message> } 
  return new Promise((resolve, reject) => {
    httpResponsePromise
      .then((response) => {
        if (response.ok) {

         // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
         response.json()
            .then( json => resolve(json) )
            .catch( err => reject({ error: "Cannot parse server response" }))

        } else {
          // analyzing the cause of error
          response.json()
            .then(obj => 
              reject(obj)
              ) // error msg in the response body
            .catch(err => reject({ error: "Cannot parse server response" })) // something else
        }
      })
      .catch(err => 
        reject({ error: "Cannot communicate"  })
      ) // connection error
  });
}



/**
 * Getting from the server side and returning the list of films.
 * The list of films could be filtered in the server-side through the optional parameter: filter.
 */
// async function getFilms(filter) {
//   const filmList = [];

//   const filmsJson = await getJson(filter ? await fetch(SERVER_URL + `/films?filter=${filter}`) : await fetch(SERVER_URL + `/films`));

//   for (const e of filmsJson) // watchDate optional: "" if null, rating optional: 0 if null
//     filmList.push({ id: e.id, title: e.title, favorite: e.favorite, watchDate: e.watchDate ? dayjs(e.watchDate) : "", rating: e.rating ? e.rating : 0 });
  
//   return filmList;
  
// }
const getFilms = async (filter) => {
  // film.watchDate could be null or a string in the format YYYY-MM-DD
  return getJson(
    filter 
      ? fetch(SERVER_URL + '/films?filter=' + filter)
      : fetch(SERVER_URL + '/films')
  ).then( json => {
    return json.map((film) => {
      const clientFilm = {
        id: film.id,
        title: film.title,
        favorite: film.favorite,
        watchDate: film.watchDate ? dayjs(film.watchDate) : "",
        rating: film.rating ? film.rating : 0,
        user: film.user
      }
      return clientFilm;
    })
  })
}


/**
 * This function wants a film object as parameter. If the filmId exists, it updates the film in the server side.
 */
function updateFilm(film) {
  // the date must be transformed into a string for the JSON.stringify method
  if (film && film.watchDate && (film.watchDate instanceof dayjs))
    film.watchDate = film.watchDate.format("YYYY-MM-DD");
  return getJson(
    fetch(SERVER_URL + `/films/${film.id}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(film)
    })
  );
}


/**
 * This function adds a new film in the back-end library.
 */
async function addFilm(film) {
  if (film && film.watchDate && (film.watchDate instanceof dayjs))
    film.watchDate = film.watchDate.format("YYYY-MM-DD");
  return getJson(
    fetch(SERVER_URL + `/films`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(film)
    })
  );

}


/**
 * This function deletes a film from the backend library.
 */
function deleteFilm(filmId) {
  return getJson(
    fetch(SERVER_URL + `/films/${filmId}`, {
      method: "DELETE",
    })
  );
}

const API = { getFilms, updateFilm, addFilm, deleteFilm };

export default API;