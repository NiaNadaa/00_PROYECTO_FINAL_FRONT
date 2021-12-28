import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import { Container, Row, Col, ListGroup } from 'react-bootstrap';
import { ScreenSpinner } from '../ScreenSpinner/ScreenSpinner';
import { getPatientsFetch } from '../../services/GlobalServices';
import { AuthContext } from '../../auth/authContext';
import { VerticalModal } from '../VerticalModal/VerticalModal';

export const ConsultListAppointment = () => {

  const [ modalTitle, setModalTitle] = useState('');
  const [ modalText, setModalText] = useState('');
  const [ modalShow, setModalShow] = useState(false);
  const [ showSpinner, setShowSpinner ] = useState(false);
  const [ listPatientAppointments, setListPatientAppointments ] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    getPatients();
  }, []);

  const getPatients = () => {
    setShowSpinner(true);
    getPatientsFetch(0, 0).then(resp => {
        if (resp.ok) {
            const listPatientsAssigned = resp.patients.filter((patient) => patient.medicAssigned === user.uid);
            if (listPatientsAssigned.length) {
              const listPatientsWithAppointment = listPatientsAssigned.filter((patient) => patient.appointment.date);
              setListPatientAppointments(listPatientsWithAppointment);
            }
            setShowSpinner(false);
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

  return(
    <>
      <Container fluid>
        {
          listPatientAppointments.length ? 
           <Row>
             <h3 className="mt-4 mb-4">Consultas activas</h3>
            <Col>
              <Container fluid className="col-md-6 mt-5">
                  <h3 className="mb-4">Ficha de paciente</h3>
                  <hr />
                    {
                      listPatientAppointments.map((patient, i) => {
                        return <ListGroup className="mt-4 mb-4" key = { i }>
                                <ListGroup.Item> Nombre { patient.name }</ListGroup.Item>
                                <ListGroup.Item> Fecha: { patient.appointment.date }</ListGroup.Item>
                                <ListGroup.Item> Descripción{ patient.appointment.info }</ListGroup.Item>
                              </ListGroup>
                      })
                    }
                  <hr />
              </Container>
            </Col>
        </Row>
        :
        <Row>
            <Col>
              <h2>No tiene citas asignadas</h2>
            </Col>
        </Row>
        }
        
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