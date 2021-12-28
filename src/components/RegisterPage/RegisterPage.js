import React, { useState } from 'react';
import { Container, Form, Row, Col, Button, Stack } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { VerticalModal } from '../VerticalModal/VerticalModal';
import { registerMedicFetch, registerPatientFetch } from '../../services/GlobalServices';
import { ScreenSpinner } from '../ScreenSpinner/ScreenSpinner';
import './RegisterPage.css';

export const RegisterPage = () => {

    const navigate = useNavigate();
    const [ modalTitle, setModalTitle] = React.useState('');
    const [ modalText, setModalText] = React.useState('');
    const [ modalShow, setModalShow] = React.useState(false);
    const [ role_selector, setType] = useState('ADMIN');
    const [ form, setForm ] = useState({});
    const [ showSpinner, setShowSpinner ] = React.useState(false);
    const [ errors, setErrors ] = useState({});

    const setField = (field, value) => {
        setForm( { ...form, [field]: value });
        if ( !!errors[field] ) setErrors({ ...errors, [field]: null });
    }

    const onFormSubmit = e => {
        e.preventDefault();
        const newErrors = findFormErrors();
        if ( Object.keys(newErrors).length > 0 ) {
            setErrors(newErrors);
        } else {
            setShowSpinner(true);
            let typeOfregisterUserFetch;
            if (role_selector === 'ADMIN') {
                typeOfregisterUserFetch = registerMedicFetch;
            } else {
                typeOfregisterUserFetch = registerPatientFetch;
            }

            typeOfregisterUserFetch(form.name, form.email, form.password, role_selector).then( (resp) => {
                const typeOfUser = role_selector === 'ADMIN' ? 'medic' : 'patient';
                if (resp.ok) {
                    setShowSpinner(false);
                    printModal(
                        {   title: `${typeOfUser === 'medic' ? 'Médico' : 'Paciente' } registrado`, 
                            text: `El ${typeOfUser === 'medic' ? 'médico' : 'paciente' } ${resp[typeOfUser].name} con email ${resp[typeOfUser].email} se ha registrado con éxito. \n \n Por favor diríjase a la sección de acceso para acceder al sistema.`
                    });
                } else {
                    setShowSpinner(false);
                    printModal({title: 'Error inesperado', text: resp.msg});
                }
            });
        }
    }

    const findFormErrors = () => {
        const { name, email, password, confirmPassword, termsAndConditions } = form;
        const newErrors = {}
        const validateEmail = RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if ( !name || name === '' ) newErrors.name = 'Introduzca un nombre';
        if ( !email || email === '' ) newErrors.email = 'Introduzca un correo electrónico';
        if ( !validateEmail.test(email)) newErrors.email = 'Introduzca un email válido';
        if ( !password || password === '' ) newErrors.password = 'Introduzca una contraseña';
        if ( !confirmPassword || confirmPassword === '' ) newErrors.confirmPassword = 'Confirme una contraseña';
        if ( confirmPassword !== password ) newErrors.confirmPassword = 'Las contraseñas deben coincidir';
        if ( !termsAndConditions ) newErrors.termsAndConditions = 'Debes aceptar los términos y condiciones';
        return newErrors;
    }

    const registerPageRedirect = () => {
        navigate('/login', {
            replace: true
        });
    }

    const printModal = ({title, text}) => {
        setModalTitle(title);
        setModalText(text);
        setModalShow(true);
    }

    return (
        <Container fluid className="register-container background-access-container">
            <Form className="form" onSubmit={ onFormSubmit }>
                <Stack gap={2} className="col-md-5 col-xl-4 mx-auto my-auto register-form">

                    <Row className="mb-2">
                        <h1 className="mx-left mt-4">Página de registro</h1>
                    </Row>

                    <Row className="mb-2">
                        <Form.Label>Seleccionar Perfil</Form.Label>
                        <Form.Group controlId="roleSelect">
                            <Form.Control
                                as="select"
                                value={role_selector}
                                onChange={e => { setType(e.target.value) }}>
                                <option value="ADMIN">Médico</option>
                                <option value="USER">Paciente</option>
                            </Form.Control>
                        </Form.Group>
                    </Row>

                    <hr></hr>

                    <p>Por favor, rellene todos los campos</p>

                    <Row className="mb-2">
                        <Form.Group as={Col} controlId="formGridName">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control   onChange={ e => setField('name', e.target.value) } 
                                            type="text" 
                                            placeholder="Nombre" 
                                            isInvalid={ !!errors.name } />
                            <Form.Control.Feedback type='invalid'>
                                { errors.name }
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row className="mb-2">
                        <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>Correo electrónico</Form.Label>
                            <Form.Control   onChange={ e => setField('email', e.target.value) } 
                                            type="email" 
                                            placeholder="Email" 
                                            isInvalid={ !!errors.email } />
                            <Form.Control.Feedback type='invalid'>
                                { errors.email }
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row className="mb-2">
                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control onChange={ e => setField('password', e.target.value) } 
                                            type="password" 
                                            placeholder="Introduce una contraseña" 
                                            isInvalid={ !!errors.password } />
                            <Form.Control.Feedback type='invalid'>
                                { errors.password }
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row className="mb-2">
                        <Form.Group as={Col} controlId="formGridConfirmPassword">
                            <Form.Label>Confirmar contraseña</Form.Label>
                            <Form.Control   onChange={ e => setField('confirmPassword', e.target.value) } 
                                            type="password" 
                                            placeholder="Confirmar contraseña" 
                                            isInvalid={ !!errors.confirmPassword } />
                            <Form.Control.Feedback type='invalid'>
                                { errors.confirmPassword }
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row className="mb-2">
                        <Form.Group className="mb-2" id="formGridCheckbox">
                            <Form.Check onChange={ e => setField('termsAndConditions', e.target.checked) } 
                                        type="checkbox" 
                                        label="Acepto los términos y condiciones"
                                        isInvalid={ !!errors.termsAndConditions } />
                        </Form.Group>
                    </Row>

                    <Button className="mx-auto button-register" variant="primary" type="submit">
                        Registrarse
                    </Button>

                    <Row className="mt-4 mb-4 mx-left">
                        <div className="my-auto button-login">
                            ¿Ya tienes cuenta? 
                            <Button variant="link" 
                                    style={{ maxWidth: '50%', padding: '0.2rem' }} 
                                    onClick= { registerPageRedirect }> ACCEDER
                            </Button>
                        </div>
                    </Row>

                </Stack>
            </Form>

            <VerticalModal 
                show   = { modalShow } 
                title  = { modalTitle } 
                text   = { modalText }
                onHide = { () => setModalShow(false) } 
            />

            <ScreenSpinner show = {showSpinner}></ScreenSpinner>

        </Container>
    )
}
