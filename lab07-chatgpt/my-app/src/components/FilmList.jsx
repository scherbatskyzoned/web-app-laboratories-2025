import Table from 'react-bootstrap/Table';
import FilmRow from './FilmRow';

function FilmList({ films }) {
  return (
    <>
      <h2 className="mt-3">All</h2>
      <Table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Favorite</th>
            <th>Last seen</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {films.map(film => (
            <FilmRow key={film.id} film={film} />
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default FilmList;
