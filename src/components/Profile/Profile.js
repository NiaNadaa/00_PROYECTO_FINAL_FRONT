import React, { useState, useContext } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Row, Col, Button } from 'react-bootstrap';
import { VerticalModal } from '../VerticalModal/VerticalModal';
import { ScreenSpinner } from '../ScreenSpinner/ScreenSpinner';
import { AuthContext } from '../../auth/authContext';
import { types } from '../../types/types';
import { getMedicsFetch, updateMedic, getPatientsFetch, updatePatient, deleteMedic, deletePatient } from '../../services/GlobalServices';
import './Profile.css';
export const Profile = () => {

    const [ modalTitle, setModalTitle ] = React.useState('');
    const [ modalText, setModalText ] = React.useState('');
    const [ modalShow, setModalShow ] = React.useState(false);
    const [ showSpinner, setShowSpinner ] = React.useState(false);
    const [ form, setForm ] = useState({});
    const [ errors, setErrors ] = useState({});
    const [ gender_selector, setGenderValue] = useState('MALE');
    const { user } = useContext(AuthContext);
    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user.role === 'ADMIN') {
            getMedics();
        } else {
            getPatients();
        }
    }, []);

    const setField = (field, value) => {
        setForm( { ...form, [field]: value });
        if ( !!errors[field] ) setErrors({ ...errors, [field]: null });
    }

    const onFormSubmitUpdateProfile = (e) => {
        e.preventDefault();
        const newErrors = findFormErrors();
        if ( Object.keys(newErrors).length > 0 ) {
            setErrors(newErrors);
        } else {
            setShowSpinner(true);

            if (user.role === 'ADMIN') {

                updateMedic({
                    name: form.name, 
                    email: form.email, 
                    address: form.address, 
                    province: form.province, 
                    surname: form.surname, 
                    gender: gender_selector, 
                    uid: user.uid
                }).then(resp => {

                    if (resp.ok) {    
                        const action = {
                            type: types.login,
                            payload: user
                        }

                        action.payload.name = resp.medic.name;
                        action.payload.email = resp.medic.email;
                        
                        dispatch(action);
                        setShowSpinner(false);
                        printModal( { title: 'Perfil actualizado', text: 'Su perfil ha sido actualizado correctamente' } );
                    } else {
                        setShowSpinner(false);
                        printModal( { title: 'Error inesperado', text: resp.msg } );
                    }
                });
            } else {

                updatePatient({
                    name: form.name, 
                    email: form.email, 
                    address: form.address, 
                    province: form.province, 
                    surname: form.surname, 
                    gender: gender_selector, 
                    uid: user.uid, 
                    medicAssigned: user.medicAssigned, 
                    appointment: user.appointment 
                }).then((resp) => {

                    if (resp.ok) {
                        const action = {
                            type: types.login,
                            payload: user
                        }

                        action.payload.name = resp.patient.name;
                        action.payload.email = resp.patient.email;
                        
                        dispatch(action);

                        setShowSpinner(false);

                        printModal( {title: 'Perfil actualizado', text: 'Su perfil ha sido actualizado correctamente'} );
                    } else {
                        setShowSpinner(false);
                        printModal( {title: 'Error inesperado', text: resp.msg} );
                    }
                });
            }     
        }
    }

    const findFormErrors = () => {
        const { email, name } = form;
        const newErrors = {};
        const validateEmail = RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if ( !email || email === '' ) newErrors.email = 'Introduzca un correo electrónico';
        if ( !validateEmail.test(email)) newErrors.email = 'Introduzca un email válido';
        if ( !name || name === '' ) newErrors.name = 'Introduzca un nombre';
        return newErrors;
    }

    const printModal = ({title, text}) => {
        setModalTitle(title);
        setModalText(text);
        setModalShow(true);
    }

    const getMedics = () => {
        setShowSpinner(true);
        getMedicsFetch(0, 0).then(resp => {
            if (resp.ok) {
                const medics = resp.medics;
                const dataProfile = medics.find((profile => profile.uid === user.uid));
                if (dataProfile) {
                    form.name = dataProfile.name;
                    form.email = dataProfile.email;
                    document.querySelector('#formGridName').value = dataProfile.name;
                    document.querySelector('#formGridEmail').value = dataProfile.email;
                    document.querySelector('#formGridSurname').value = dataProfile.surname;
                    document.querySelector('#formGridAddress').value = dataProfile.address;
                    document.querySelector('#formGridProvince').value = dataProfile.province;
                    setGenderValue(dataProfile.gender);
                }
                setShowSpinner(false);
            } else {
                setShowSpinner(false);
                printModal({title: 'Error inesperado', text: resp.msg});
            }
        });
    }

    const getPatients = () => {
        setShowSpinner(true);
        getPatientsFetch(0, 0).then(resp => {
            if (resp.ok) {
                const patients = resp.patients;
                const dataProfile = patients.find((profile => profile.uid === user.uid));
                if (dataProfile) {
                    form.name = dataProfile.name;
                    form.email = dataProfile.email;
                    document.querySelector('#formGridName').value = dataProfile.name;
                    document.querySelector('#formGridEmail').value = dataProfile.email;
                    document.querySelector('#formGridSurname').value = dataProfile.surname;
                    document.querySelector('#formGridAddress').value = dataProfile.address;
                    document.querySelector('#formGridProvince').value = dataProfile.province;
                    setGenderValue(dataProfile.gender);
                }
                setShowSpinner(false);
            } else {
                setShowSpinner(false);
                printModal({title: 'Error inesperado', text: resp.msg});
            }
        });
    }

    const deleteProfile = () => {
        if (window.confirm("¿Seguro que quieres eliminar tu cuenta?") === true) {
            if (user.role === 'ADMIN') {
                deleteMedic(user.uid).then(resp => {
                    if (resp.ok) {
                        disconnectSession();
                    } else {
                        setShowSpinner(false);
                        printModal({title: 'Error inesperado', text: resp.msg});
                    }
                });
            } else {
                deletePatient(user.uid).then(resp => {
                    if (resp.ok) {
                        disconnectSession();
                    } else {
                        setShowSpinner(false);
                        printModal({title: 'Error inesperado', text: resp.msg});
                    }
                });
            }
        } else {
            return;
        }
    }

    const disconnectSession = () => {
        const action = { type: types.logout }
        dispatch(action);

        setTimeout(() => {
            sessionStorage.clear();
            navigate( '/login', {
                replace: true
            });
        });
    }

    return (
        <Container fluid className="col-md-8 mt-5">

            <Form className="form-profile" onSubmit={ onFormSubmitUpdateProfile }>
                <Row className="mb-4">
                    <Col>
                        <h1>Perfil de {user.name}</h1>
                    </Col>
                    <Col className="mx-right">
                        <Button className="delete-profile-button" 
                                variant="danger" 
                                type="button"
                                onClick= { deleteProfile } >
                            Eliminar cuenta
                        </Button>
                    </Col>
                </Row>
                <Row className="mb-4">
                    <Col className="mb-2" md={12} lg={6}>
                        <Form.Group as={Col} controlId="formGridName">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control onChange={ e => setField('name', e.target.value) } 
                                          type="text"
                                          placeholder="Nombre"
                                          isInvalid={ !!errors.name } />

                            <Form.Control.Feedback type='invalid'>
                                { errors.name }
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>

                    <Col className="mb-2" md={12} lg={6}>
                        <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>Correo electrónico</Form.Label>
                            <Form.Control onChange={ e => setField('email', e.target.value) } 
                                          type="email"
                                          placeholder="Email"
                                          isInvalid={ !!errors.email } />

                            <Form.Control.Feedback type='invalid'>
                                { errors.email }
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Col>

                </Row>

                <Row className="mb-4">

                    <Col md={12} lg={6}>
                        <Form.Group as={Col} controlId="formGridSurname">
                            <Form.Label>Apellidos</Form.Label>
                            <Form.Control onChange={ e => setField('surname', e.target.value) } 
                                          type="text"
                                          placeholder="Apellidos" />
                        </Form.Group>
                    </Col>  
                    
                    <Col md={12} lg={6}>
                        <Form.Label>Género</Form.Label>
                        <Form.Group controlId="roleSelect">
                            <Form.Control
                                as="select"
                                value={gender_selector}
                                onChange={e => { setGenderValue(e.target.value) }}>
                                <option value="MALE">Varón</option>
                                <option value="FEMALE">Mujer</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                </Row>  

                <Row className="mb-4">
                    <Col className="mb-2" md={12} lg={6}>
                        <Form.Group as={Col} controlId="formGridAddress">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control onChange={ e => setField('address', e.target.value) } 
                                          type="text"
                                          placeholder="Dirección" />
                        </Form.Group>
                    </Col> 

                    <Col md={12} lg={6}>
                        <Form.Group as={Col} controlId="formGridProvince">
                            <Form.Label>Provincia</Form.Label>
                            <Form.Control onChange={ e => setField('province', e.target.value) } 
                                          type="text"
                                          placeholder="Provincia" />
                        </Form.Group>
                    </Col>
                </Row>
                
                <Row>
                    <Button className="mt-4 button" 
                            variant="primary" 
                            type="submit">
                        Enviar
                    </Button>
                </Row>

            </Form>

            <VerticalModal 
                show = { modalShow } 
                title = { modalTitle } 
                text = { modalText }
                onHide = { () => setModalShow(false) } />

            <ScreenSpinner show = {showSpinner}></ScreenSpinner>

        </Container>
    )

}