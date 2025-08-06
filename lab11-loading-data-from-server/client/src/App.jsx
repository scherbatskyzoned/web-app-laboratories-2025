        
/*
 * Web Applications
 */

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import dayjs from 'dayjs';

import { React, useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Outlet, Link, useParams, Navigate } from 'react-router';

import { GenericLayout, NotFoundLayout, TableLayout, AddLayout, EditLayout } from './components/Layout';

import API from './API.js';


function App() {

  const [filmList, setFilmList] = useState([]);

  const filters = {
    'all': { label: 'All', url: '/' },
    'favorite': { label: 'Favorites', url: '/filter/favorite'},
    'best': { label: 'Best Rated', url: '/filter/best' },
    'lastmonth': { label: 'Seen Last Month', url: '/filter/lastmonth'},
    'unseen': { label: 'Unseen', url: '/filter/unseen'}
  };

  const filtersToArray = Object.entries(filters);
  const filterArray = filtersToArray.map(([filterName, obj ]) =>
    ({ filterName: filterName, ...obj }));

  useEffect( () => {
    API.getFilms()
    .then(f => setFilmList(f));
  }, []);


  function deleteFilm(filmId) {
    // changes the state by passing a callback that will compute, from the old Array,
    // a new Array where the filmId is not present anymore
    setFilmList(filmList => filmList.filter(e => e.id!==filmId));
  }

  function editFilm(film) {
    setFilmList( (films) => films.map( e=> {
      if (e.id === film.id)
        return Object.assign({}, film);  // Alternative:  return {...film}
      else
        return e;
    }))
  }

  function addFilm(film) {
    setFilmList( (films) => {
      // In the complete application, the newFilmId value should come from the backend server.
      // NB: This is NOT to be used in a real application: the new id MUST NOT be generated on the client.
      // However, we need it now to make everything work smoothly
      const newFilmId = Math.max( ...(films.map(e => e.id)))+1;
      return [...films, {"id": newFilmId, ...film}];
      });
  }

  return (
      <Container fluid>
        <Routes>
          <Route path="/" element={<GenericLayout filterArray={filterArray} />} >
            <Route index element={<TableLayout 
                 filmList={filmList} setFilmList={setFilmList} filters={filters} 
                 deleteFilm={deleteFilm} editFilm={editFilm} />} />
            <Route path="add" element={<AddLayout addFilm={addFilm} />} />
            <Route path="edit/:filmId" element={<EditLayout films={filmList} editFilm={editFilm} />} />
            <Route path="filter/:filterId" element={<TableLayout 
                 filmList={filmList} setFilmList={setFilmList} filters={filters} 
                 deleteFilm={deleteFilm} editFilm={editFilm} />} />
            <Route path="*" element={<NotFoundLayout />} />
          </Route>
        </Routes>
      </Container>
  );
}

export default App;