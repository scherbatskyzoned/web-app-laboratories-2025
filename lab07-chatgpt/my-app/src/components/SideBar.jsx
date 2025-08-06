import { ListGroup } from 'react-bootstrap';

function SideBar() {
  return (
    <ListGroup defaultActiveKey="#All">
      <ListGroup.Item active><i className="bi bi-collection-play me-2"></i>All</ListGroup.Item>
      <ListGroup.Item><i className="bi bi-heart-fill me-2"></i>Favorite</ListGroup.Item>
      <ListGroup.Item><i className="bi bi-star-fill me-2"></i>Best Rated</ListGroup.Item>
      <ListGroup.Item><i className="bi bi-clock-history me-2"></i>Seen Last Month</ListGroup.Item>
      <ListGroup.Item><i className="bi bi-eye-slash me-2"></i>Unseen</ListGroup.Item>
    </ListGroup>
  );
}

export default SideBar;
