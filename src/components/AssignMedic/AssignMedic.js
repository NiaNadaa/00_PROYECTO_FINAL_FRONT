import React, { useState, useContext } from 'react';
import { useEffect } from 'react';
import { ScreenSpinner } from '../ScreenSpinner/ScreenSpinner';
import { Container, Row, Form, Button } from 'react-bootstrap';
import { VerticalModal } from '../VerticalModal/VerticalModal';
import { getMedicsFetch } from '../../services/GlobalServices';
import { AuthContext } from '../../auth/authContext';
import { types } from '../../types/types';
import { updatePatient } from '../../services/GlobalServices';

export const AssignMedic = () => {

  const { user } = useContext(AuthContext);
  const [ showSpinner, setShowSpinner ] = useState(false);
  const [ modalTitle, setModalTitle] = useState('');
  const [ modalText, setModalText] = useState('');
  const [ modalShow, setModalShow] = useState(false);
  const [ listMedics, setListMedics] = useState([]);
  const [ medics_selector, setMedicSelector] = useState('');
  const { dispatch } = useContext(AuthContext);

  useEffect(() => {
    getMedics();
}, []);

  const printModal = ({title, text}) => {
    setModalTitle(title);
    setModalText(text);
    setModalShow(true);
  }

  const getMedics = () => {
    setShowSpinner(true);
    getMedicsFetch(0, 0).then(resp => {
        if (resp.ok) {
          setListMedics(resp.medics);

          setTimeout(() => {
            let hasMedicAssigned = null;
            hasMedicAssigned = resp.medics.find((medic) => medic.uid === user.medicAssigned);
            if (hasMedicAssigned) {
              document.querySelector('#medicSelect').value = hasMedicAssigned.uid;
            }
          });
          setShowSpinner(false);
        } else {
            setShowSpinner(false);
            printModal({title: 'Error inesperado', text: resp.msg});
        }
    });
  }

  const onFormSubmit = e => {
    e.preventDefault();
    if (!medics_selector || medics_selector === '-- Seleccione un médico --') {
      return;
    }

    setShowSpinner(true);
    updatePatient({
        name: user.name, 
        email: user.email, 
        address: user.address, 
        province: user.province, 
        surname: user.surname, 
        gender: user.gender, 
        uid: user.uid, 
        medicAssigned: medics_selector, 
        appointment: 
        user.appointment
      }).then(resp => {
      if (resp.ok) {

          const action = {
            type: types.login,
            payload: user
          }

          action.payload.medicAssigned = medics_selector;
          dispatch(action);

          setShowSpinner(false);
          printModal({title: 'Médico asignado', text: 'Su médico ha sido actualizado'});
      } else {
          setShowSpinner(false);
          printModal({title: 'Error inesperado', text: resp.msg});
      }
    });
  }

  return(
    <Container>
      <Row className="col-md-6 mx-left">
        <Form className="form" onSubmit={ onFormSubmit }>
          <Row className="mb-2">
              <h3 className="mx-left">Asignar médico</h3>

              <Row className="mb-2">
                  <Form.Label>Seleccionar Perfil</Form.Label>
                  <Form.Group controlId="medicSelect">
                      <Form.Control as="select"
                                    value={medics_selector}
                                    onChange={e => { setMedicSelector(e.target.value) }}>
                                    <option defaultValue> -- Seleccione un médico -- </option>
                                    {
                                      listMedics.map((medic, i) => {
                                        return <option key = { i }  value = { medic.uid }>{medic.name}</option>
                                      })
                                    }
                      </Form.Control>
                  </Form.Group>
                  <Button style = { { maxWidth: '12.5rem', marginLeft: '1rem' } } className="mx-left mt-4" variant="primary" type="submit">
                        Asignar
                    </Button>
              </Row>
          </Row>
        </Form>
      </Row>
      <VerticalModal show = { modalShow } 
                    title = { modalTitle } 
                    text = { modalText }
                    onHide = { () => setModalShow(false) } />
      <ScreenSpinner show = {showSpinner}></ScreenSpinner>
    </Container>
  )
}