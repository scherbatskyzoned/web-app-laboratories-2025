import { Form } from 'react-bootstrap';

function FilmRow({ film }) {
  const stars = '★★★★★☆☆☆☆☆'.slice(5 - film.rating, 10 - film.rating);
  return (
    <tr>
      <td style={{ color: film.favorite ? 'red' : 'black' }}>{film.title}</td>
      <td><Form.Check checked={film.favorite} disabled /></td>
      <td>{film.date || ''}</td>
      <td>{stars}</td>
    </tr>
  );
}

export default FilmRow;
