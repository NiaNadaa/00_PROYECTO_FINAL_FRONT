import { Row, Col } from 'react-bootstrap';
import { Table, Receipt, PersonBadge } from 'react-bootstrap-icons';
import './Card.css'

const dynamicListIcons = { 
  'table': Table, 
  'receipt': Receipt, 
  'person-badge': PersonBadge
};

const iconColor = (iconColor) => {
  return iconColor ? iconColor : iconColor = 'icon-gray'
}

export const Card = (props) => {
  const DynamicIcon = dynamicListIcons[props.icon || 'table'];

  return (
    <div className="card-container mb-2 mt-4">
      <div className="card-body">
        <Row>
          <Col>
            <div className={`icon-container ${iconColor(props.iconColor)} `}>
              <DynamicIcon className="icon" />
            </div>
            <span className="info">
              {props.title}
            </span>
            <hr className="divider"></hr>
            <span className="quantity">
              {props.quantity}
            </span>
          </Col>
        </Row>
      </div>
    </div>
  )
}