import React, { useState } from 'react';
import { Container, Form, Row, Col, Button, Stack } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../auth/authContext';
import { types } from '../../types/types';
import { VerticalModal } from '../VerticalModal/VerticalModal';
import { ScreenSpinner } from '../ScreenSpinner/ScreenSpinner';
import { accessMedicFetch, accessPatientFetch } from '../../services/GlobalServices';
import './LoginPage.css';

export const LoginPage = () => {

    const navigate = useNavigate();
    const [ modalTitle, setModalTitle] = React.useState('');
    const [ modalText, setModalText] = React.useState('');
    const [ modalShow, setModalShow] = React.useState(false);
    const { dispatch } = useContext(AuthContext);
    const [showSpinner, setShowSpinner ] = React.useState(false);
    const [ form, setForm ] = useState({});
    const [ errors, setErrors ] = useState({});
    const [ role_selector, setType] = useState('ADMIN');

    //si encuentra una propiedad(!!errors) dentro de errors, si se activa, entonces devuelve true, entonces setea errors con la propiedad a null. resetea cuando escribes otra vez y lo vacía para no ver el error.usabilidad, estética.
    const setField = (field, value) => {
        setForm( { ...form, [field]: value });
        if ( !!errors[field] ) setErrors({ ...errors, [field]: null });
    }
    // e.prevent, cualquier cosa q haga, no lo hagas, solo hace lo q yo quiero
    //varible new error, devuelve lo que tenga l funcion dinfFromErrors.
    //el regex es un estandar sacado de la web, es global, lo he copiado. w3schools
    //la funcion .test es para validar lo que tienes escrito en regex, puede ser true o false. esta expresión regular comprueba, si no es true salta error porque NO SE ESTÁ CUMPLIENDO.
    //cada vez q le des al botón de acceder te hace la cmprobación
    // es una función de control de errores


    //object.keys(newerrors) lo que hace es coger el objeto newerrors y devuelve un array con las propiedades, en este caso queremos ver si hay o no hay, y al hacer un length entonces al ser mayor, o sea, que hay errores, te resetea el valor de setErrors con el texto que haya en email en pass o en ambos.€sto lo vamos a usar en linea 117, si es valido o invalido. sistema de feedback al usuario. transforma en bolean el valor de errors. si existe (!!) hay error ye ntonces es true y muestra el valor del campo. si es false entonces no muestra nada.
    //setShowSpinnr. tenemos un componente importando screenSpinner
    const onFormSubmit = (e) => {
        e.preventDefault();
        const newErrors = findFormErrors();
        if ( Object.keys(newErrors).length > 0 ) {
            setErrors(newErrors);
        } else {
            setShowSpinner(true);
            let typeOfLoginUserFetch;
            if (role_selector === 'ADMIN') {
                typeOfLoginUserFetch = accessMedicFetch;
            } else {
                typeOfLoginUserFetch = accessPatientFetch;
            }
// aqui el payload es lo q te devuelve al servicio, o sea lo de autenticar, el user con sus cosas. después te gener el dispatch y como está en el contexto, te cambia el estado a través del reducer. así cuangdo tengas acceso a la propiedad user, que puede ser true o false, y además que tiene el token el name etc etc etc.
//const lastPath, para guardar la sesión. y ver la última ruta que hemos visitado.
//rediriges a dashboard y quitas el spinner.
//el replace es para que no puedas volver atrás. es una función d react, no la defines tu. cuando haces eso flahsea las rutas y las borra, solo recuerda lo q has guardado.
//ahora pasa a private router /*, o sea a dashboard, te mira si estás logado y ya te vas a DASHBOARDrouter.
            typeOfLoginUserFetch(form.email, form.password).then(resp => {
                if (resp.ok) {
                    const action = {
                        type: types.login,
                        payload: resp
                    }
                    
                    dispatch(action);

                    const lastPath = sessionStorage.getItem('lastPath') || '/dashboard';

                    setShowSpinner(false);
                    navigate( lastPath, {
                        replace: true
                    });
                } else {
                    setShowSpinner(false);
                    printModal({title: 'Error inesperado', text: resp.msg});
                }
            });
        }
    }

    const findFormErrors = () => {
        const { email, password } = form;
        const newErrors = {};
        const validateEmail = RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if ( !email || email === '' ) newErrors.email = 'Introduzca un correo electrónico';
        if ( !validateEmail.test(email)) newErrors.email = 'Introduzca un email válido';
        if ( !password || password === '' ) newErrors.password = 'Introduzca una contraseña';
        return newErrors;
    }

    const registerPageRedirect = () => {
        navigate('/registro', {
            replace: true
        });
    }

    const printModal = ({title, text}) => {
        setModalTitle(title);
        setModalText(text);
        setModalShow(true);
    }

    return (
        <Container fluid className="login-container background-access-container">
            <Form className="form"  onSubmit={ onFormSubmit }>
                <Stack gap={1} className="col-md-4 mx-auto login-form">

                    <Row className="mb-2">
                        <h1 className="mx-left">Acceso</h1>
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

                    <Row className="mb-2">
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
                    </Row>

                    <Row className="mb-4">
                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control onChange={ e => setField('password', e.target.value) } 
                                          type="password" 
                                          placeholder="Contraseña" 
                                          isInvalid={ !!errors.password } />

                            <Form.Control.Feedback type='invalid'>
                                { errors.password }
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Button className="mx-auto button-login" 
                            variant="primary" 
                            type="submit">
                        Acceder
                    </Button>

                    <Row className="mt-4">
                        <div className="my-auto button-register">
                            ¿No tienes cuenta? 
                            <Button variant="link" 
                                    onClick= { registerPageRedirect }> REGISTRARSE 
                            </Button>
                        </div>
                    </Row>
    
                </Stack>
            </Form>

            <VerticalModal 
                show = { modalShow } 
                title = { modalTitle } 
                text = { modalText }
                onHide = { () => setModalShow(false) } 
            />

            <ScreenSpinner show = {showSpinner}></ScreenSpinner>

        </Container>
    )
}
