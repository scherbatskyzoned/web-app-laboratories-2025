import 'dayjs';
import { Table, Form, Button } from 'react-bootstrap';


function Rating(props) {
  // Create an array with props.maxStars elements, then run map to create the JSX elements for the array 
  return [...Array(props.maxStars)].map((el, index) =>
    <i key={index} className={(index < props.rating) ? "bi bi-star-fill" : "bi bi-star"} />
  )
}


const FilmRow = (props) => {

  const formatWatchDate = (dayJsDate, format) => {
    return dayJsDate ? dayJsDate.format(format) : '';
  }


  return (
    <tr>
      <td>
        <p className={props.filmData.favorite ? "favorite" : ""} >
          {props.filmData.title}
        </p>
      </td>
      {/* checkbox 4 favorite */}
      <td className="text-center">
        <Form.Check type="checkbox" defaultChecked={props.filmData.favorite ? true : false} />
      </td>
      {/* Last seen */}
      <td>
        <small>{formatWatchDate(props.filmData.watchDate, 'MMMM D, YYYY')}</small>
      </td>      
      {/* Rating */}
      <td>
        <Rating rating={props.filmData.rating} maxStars={5} />
      </td>
       <td>
        <Button variant="danger" onClick={()=>props.delete(props.filmData.id)}>
          <i className="bi bi-trash"></i>
        </Button>
      </td>
    </tr>
  );
}


const FilmTable = (props) => {
  const { films } = props;

  return (
  <Table>
      <thead>
        <tr>
          <th>Title</th>
          <th className="text-center">Favorite</th>
          <th>Last seen</th>
          <th>Rating</th>
        </tr>
      </thead>
      <tbody>
      {
        films.map((film) => 
          <FilmRow key = {film.id} filmData = {film} delete={props.delete} />)
      }
      </tbody>
    </Table>

  );
}

export { FilmTable };