'use strict';


function Film(id, title, isFavorite, watchDate, rating = 0) {
  this.id = id;
  this.title = title;
  this.isFavorite = isFavorite;
  this.rating = rating;

  // saved as dayjs object only if watchDate is truthy
  this.watchDate = watchDate && dayjs(watchDate);

  // Filters
  this.isFavorite =   () => { return this.favorite; }
  this.isBestRated =  () => { return this.rating === 5; }


  this.formatWatchDate = (format) => {
        return this.watchDate ? this.watchDate.format(format) : '<not defined>';
    }


}


function FilmLibrary() {
  this.list = [];

  this.add = (film) => {
    this.list = [...this.list, film];

  }
}


// --- Functions Definitions --- //
/**
 * Function to create a single film enclosed in a <tr> tag.
 * @param {*} film the film object.
 */
function createFilmNode(film) {
  const tr = document.createElement("tr");
  const titleP = document.createElement("p");
  if (film.isFavorite()) 
    titleP.className = "favorite";
  titleP.innerText = film.title;

  const td1 = document.createElement("td");
  td1.appendChild(titleP);
  tr.appendChild(td1);


  // creating the checkbox 
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = "check-f" + film.id;
  checkbox.className = "custom-control-input";
  checkbox.checked = film.isFavorite();

  const td2 = document.createElement("td");
  td2.className = "text-center";
  td2.appendChild(checkbox);
  tr.appendChild(td2);

  // creating a <small> element for the watch date
  const dateText = document.createElement("small");
  dateText.innerText = film.formatWatchDate("MMMM D, YYYY");

  const td3 = document.createElement("td");
  td3.appendChild(dateText);
  tr.appendChild(td3);

  // creating a <span> element for the rating
  const ratingSpan = document.createElement("span");
  ratingSpan.className = "empty-star";
  for (let i = 0; i < 5; i++) {
    const star = document.createElement("i");
    star.classList.add("bi");
    if (i < film.rating) 
      star.classList.add("bi-star-fill");
    else 
      star.classList.add("bi-star");
    ratingSpan.appendChild(star);
  }
  
  const td4 = document.createElement("td");
  td4.appendChild(ratingSpan);
  tr.appendChild(td4);

  return tr;
}

/**
 * Function to create the list of films.
 */
function createListFilms(films) {
  const listFilms = document.getElementById("list-films");

  // create table header
  const tr = document.createElement("tr");

  // Be careful using innerHTML for XSS, however with constant strings this is safe
  tr.innerHTML = '<th>Title</th> \
        <th class="text-center">Favorite</th> \
        <th>Last seen</th> \
        <th>Rating</th>';

  for (const film of films) {
    const filmNode = createFilmNode(film);
    listFilms.appendChild(filmNode);
  }
}


/**
 * Function to destroy the list of films.
 */





// ----- Main ------ //
const filmLibrary = new FilmLibrary();
FILMS.forEach(f => { filmLibrary.add(new Film(...f)); });