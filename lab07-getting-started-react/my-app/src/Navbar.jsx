import'bootstrap/dist/css/bootstrap.min.css';
import{Col, Container, Button, Navbar, Link, Nav, Form} from'react-bootstrap';


function MyNavbar() {
  return (
    <Navbar className='navbar navbar-expand-md justify-content-between navbar-dark bg-primary'>
      <Link className="navbar-brand mx-2" href="#home">Film Library</Link>
      <Form className="d-flex">
        <Form.Control type="search" placeholder="Search" className="me-2" aria-label="Search" />
        <Button variant="outline-success">Search</Button>
      </Form>

    </Navbar>
  );
}

export default MyNavbar;