import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavigationBar from './components/NavigationBar';
import SideBar from './components/SideBar';
import FilmList from './components/FilmList';
import films from './data/films';

function App() {
  return (
    <>
      <NavigationBar />
      <Container fluid>
        <Row>
          <Col xs={3} className = "mt-3">
            <SideBar />
          </Col>
          <Col>
            <FilmList films={films} />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
