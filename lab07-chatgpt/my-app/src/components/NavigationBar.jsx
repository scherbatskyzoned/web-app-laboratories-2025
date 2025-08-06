import { Navbar, Container, Form, FormControl, Button } from 'react-bootstrap';

function NavigationBar() {
  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="#"><i className="bi bi-camera-reels-fill me-2"></i>Film Library</Navbar.Brand>
        <Form className="d-flex ms-auto">
          <FormControl type="search" placeholder="Search" className="me-2" />
        </Form>
        <Button variant="outline-light">
          <i className="bi bi-plus-lg"></i>
        </Button>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
