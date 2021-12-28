import React, { useState, useContext } from 'react';
import { VerticalModal } from '../VerticalModal/VerticalModal';
import { Container, Form, Row, Col, Button } from 'react-bootstrap';
import { ScreenSpinner } from '../ScreenSpinner/ScreenSpinner';
import { updatePatient } from '../../services/GlobalServices';
import Calendar from 'react-calendar';
import { types } from '../../types/types';
import { AuthContext } from '../../auth/authContext';
import 'react-calendar/dist/Calendar.css';
import './PatientAppointment.css'

export const PatientAppointment = () => {

  const [ modalTitle, setModalTitle] = React.useState('');
  const [ modalText, setModalText] = React.useState('');
  const [ modalShow, setModalShow] = React.useState(false);
  const [ showSpinner, setShowSpinner ] = React.useState(false);
  const [ calendarDate, onChangeDate] = useState(new Date());
  const [ description, onChangeDescription] = useState('');
  const { user } = useContext(AuthContext);
  const { dispatch } = useContext(AuthContext);

  const onFormSubmit = e => {
    e.preventDefault();
    setShowSpinner(true);
    const appointmentDate = calendarDate.toLocaleDateString();
    const appointmentDescription = description.target.value;

    updatePatient({
      name: user.name, 
      email: user.email, 
      address: user.address, 
      province: user.province, 
      surname: user.surname, 
      gender: user.gender, 
      uid: user.uid, 
      medicAssigned: user.medicAssigned, 
      appointment: {
        date: appointmentDate,
        info: appointmentDescription
      }
    }).then(resp => {
      if (resp.ok) {

          const action = {
            type: types.login,
            payload: user
          }

          action.payload.appointment = {
            date: appointmentDate,
            info: appointmentDescription
          };

          dispatch(action);

          setShowSpinner(false);
          printModal({title: 'Cita generada', text: `Ha generado una cita para el día ${resp.patient.appointment.date}`});
      } else {
          setShowSpinner(false);
          printModal({title: 'Error inesperado', text: resp.msg});
      }
    });
  }

  const printModal = ({title, text}) => {
    setModalTitle(title);
    setModalText(text);
    setModalShow(true);
  }

  return (
    <>
      <Container fluid>
        <Row>
            <h3 className="center mt-4 mb-4">Solicitar cita</h3>
        </Row>

        <Row>
          <Col className="center">
            <Calendar onChange = { onChangeDate } value={calendarDate}/>
          </Col>
        </Row>
  
        <Row>
          <Col className="center">
            <Form className="mt-4 form-appointment" onSubmit={ onFormSubmit }>
              <Form.Group className="mb-3" controlId="Form.TextAreaDescription">
                <Form.Label>Descripción: </Form.Label>
                <Form.Control onChange={onChangeDescription} as="textarea" rows={3} />
              </Form.Group>
              <Row>
                <Button className="button-request mt-4" variant="primary" type="submit">
                    Solicitar
                </Button>
              </Row>
            </Form>
          </Col>

        </Row>
        
      </Container>

      <VerticalModal 
          show   = { modalShow } 
          title  = { modalTitle } 
          text   = { modalText }
          onHide = { () => setModalShow(false) } 
      />
      
      <ScreenSpinner show = {showSpinner}></ScreenSpinner>
    </>
  )
}