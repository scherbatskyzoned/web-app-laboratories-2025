import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

import dayjs from 'dayjs';

import { useState } from 'react';
import { Container } from 'react-bootstrap';
import { Routes, Route, useNavigate } from 'react-router';

import { GenericLayout, NotFoundLayout, TableLayout, AddLayout, EditLayout } from './components/Layout';
import API from './API.js';


function App() {
  const navigate = useNavigate();

  const [filmList, setFilmList] = useState([]);
  const [dirty, setDirty] = useState(true);
  const [message, setMessage] = useState('');

  // If an error occurs, the error message will be shown using a state.
  const handleErrors = (err) => {
    //console.log('DEBUG: err: '+JSON.stringify(err));
    let msg = '';
    if (err.error)
      msg = err.error;
    else if (err.errors) {
      if (err.errors[0].msg)
        msg = err.errors[0].msg + " : " + err.errors[0].path;
    } else if (Array.isArray(err))
      msg = err[0].msg + " : " + err[0].path;
    else if (typeof err === "string") msg = String(err);
    else msg = "Unknown Error";
    setMessage(msg); // WARNING: a more complex application requires a queue of messages. In this example only the last error is shown.
    console.log(err);

    setTimeout(() => setDirty(true), 2000);
  }

  const filters = {
    'all': { label: 'All', url: '/' },
    'favorite': { label: 'Favorites', url: '/filter/favorite' },
    'best': { label: 'Best Rated', url: '/filter/best' },
    'lastmonth': { label: 'Seen Last Month', url: '/filter/lastmonth' },
    'unseen': { label: 'Unseen', url: '/filter/unseen' }
  };

  const filtersToArray = Object.entries(filters);
  const filterArray = filtersToArray.map(([filterName, obj]) =>
    ({ filterName: filterName, ...obj }));

  


  function deleteFilm(filmId) {
    API.deleteFilm(filmId)
       .then(() => setDirty(true))
       .catch(err=>handleErrors(err));
  }

  function editFilm(film) {
    API.updateFilm(film)
       .then(()=>{setDirty(true); navigate('/');})
       .catch(err=>handleErrors(err));
  }

  function addFilm(film) {
    API.addFilm(film)
      .then(() => { setDirty(true); navigate('/'); })
      .catch(err => handleErrors(err));

  }

  return (
    <Container fluid>
      <Routes>
        <Route path="/" element={<GenericLayout filterArray={filterArray} message={message} setMessage={setMessage} />} >
          <Route index element={<TableLayout
            filmList={filmList} setFilmList={setFilmList} filters={filters}
            deleteFilm={deleteFilm} editFilm={editFilm}
            handleErrors={handleErrors} dirty={dirty} setDirty={setDirty} />} />
          <Route path="add" element={<AddLayout addFilm={addFilm} />} />
          <Route path="edit/:filmId" element={<EditLayout films={filmList} editFilm={editFilm} />} />
          <Route path="filter/:filterId" element={<TableLayout
            filmList={filmList} setFilmList={setFilmList} filters={filters}
            deleteFilm={deleteFilm} editFilm={editFilm}
            handleErrors={handleErrors} dirty={dirty} setDirty={setDirty} />} />
          <Route path="*" element={<NotFoundLayout />} />
        </Route>
      </Routes>
    </Container>
  );
}

export default App;