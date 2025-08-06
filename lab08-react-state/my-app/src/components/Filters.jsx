import {ListGroup} from 'react-bootstrap';

/**
 * This components requires:
 * - the list of filters labels to show, 
 * - the filter that is currenctly selected 
 */ 
const Filters = (props) => {
  // const {items, selected, onSelect} = props; in ordine rispetto a come vengono passati

  return (
    <ListGroup as="ul" className="my-2">
        {
          props.items.map( e => {
            return (
                <ListGroup.Item as="li" key={e.filterName} href={'#'} 
                  action active={props.selected === e.filterName ? true : false} onClick={()=>props.setSelected(e.filterName)} >
                    {e.label}
                </ListGroup.Item>
            );
          })
        }
    </ListGroup>
  )
}

export { Filters };