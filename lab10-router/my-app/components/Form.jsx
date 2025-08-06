import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

import dayjs from 'dayjs';

function FilmForm(props) {
  /*
   * Creating a state for each parameter of the film.
   * There are two possible cases: 
   * - if we are creating a new film, the form is initialized with the default values.
   * - if we are editing a film, the form is pre-filled with the previous values.
   */

  const [title, setTitle] = useState(props.filmToEdit ? props.filmToEdit.title : '');
  const [favorite, setFavorite] = useState(props.filmToEdit ? props.filmToEdit.favorite : false);
  const [watchDate, setWatchDate] = useState((props.filmToEdit && props.filmToEdit.watchDate) ? props.filmToEdit.watchDate.format('YYYY-MM-DD') : "");
  const [rating, setRating] = useState((props.filmToEdit && props.filmToEdit.rating) ? props.filmToEdit.rating : 0);

  const [errorMsg, setErrorMsg] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    // String.trim() method is used for removing leading and ending whitespaces from the title.
    const film = { "title": title.trim(), "favorite": favorite, "rating": rating }
    if (watchDate)  // adding watchDate only if it is defined
      film.watchDate = dayjs(watchDate);

    // Here some data validation can be inserted, if not yet forced with HTML5 attributes on form controls
    if (film.title.length == 0) {
      setErrorMsg('Title length cannot be 0');
    } else if (film.rating < 0 || film.rating > 5) {
      setErrorMsg('Invalid value for Rating');
    } else {
      // Proceed to update the data

      if (props.filmToEdit) {
        // Film was edited, not created from scratch
        film.id = props.filmToEdit.id;
        props.editFilm(film);
      } else {
        props.addFilm(film);
      }
    }
  }

  return (
    <>
      {errorMsg ? <Alert variant='danger' dismissible onClose={() => { setErrorMsg('') }} >{errorMsg}</Alert> : false}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          {/* required={true} forces the user to insert some characters, but if they are all spaces this is not checked */}
          <Form.Control type="text" required={true} value={title} onChange={event => setTitle(event.target.value)} />
        </Form.Group>

        {/* IMPORTANT */}
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="Favorite"
            name="favorite"
            checked={favorite} 
            onChange={(event) => { setFavorite(event.target.checked) }} />
        </Form.Group>

        {/* IMPORTANT */}
        <Form.Group className="mb-3">
          <Form.Label>Watch Date</Form.Label>
          <Form.Control 
            type="date" 
            name="watchDate" 
            value={watchDate} 
            onChange={(event) => { event.target.value ? setWatchDate(dayjs(event.target.value).format('YYYY-MM-DD')) : setWatchDate("") }} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Rating</Form.Label>
          <Form.Control type="number" min="0" max="5" name="rating" value={rating} onChange={(event) => { setRating(parseInt(event.target.value)) }} />
        </Form.Group>

        <Button className="mb-3 me-1" variant="primary" type="submit">Save</Button>
        {/* To check if arrow func works */}
        <Button className="mb-3" variant="danger" onClick={() => props.cancel()}>Cancel</Button>
      </Form>
    </>
  );
}

export { FilmForm };