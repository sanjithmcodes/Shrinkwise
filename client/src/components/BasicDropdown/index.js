import Dropdown from 'react-bootstrap/Dropdown';

function BasicDropdown(props) {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {props.toggle}
      </Dropdown.Toggle>

      <Dropdown.Menu>
         {props.select.map( e => {
          return <Dropdown.Item key={e.option} onClick={() => props.selectOption(e.option)}>{e.option}</Dropdown.Item>
          }) 
        }
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default BasicDropdown;